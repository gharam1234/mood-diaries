"use client";

import { useEffect, useState, useRef, useCallback, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './auth.provider'
import { useModal } from '../modal/modal.provider'
import { Modal } from '@/commons/components/modal'
import { getPageAccess, PATHS } from '@/commons/constants/url'

// AuthGuard 컴포넌트 프롭스 타입
interface AuthGuardProps {
  children: ReactNode
}

/**
 * AuthGuard 컴포넌트
 * 
 * 페이지 접근 권한을 검증하는 가드 컴포넌트입니다.
 * - 페이지 로드 후 빈 화면을 노출하고 인가를 진행
 * - 인가 성공 시 children을 보여줌
 * - 인가 실패 시 빈 화면을 유지하고 로그인 모달 표시
 * - 테스트 환경과 실제 환경을 분리하여 구현
 */
export const AuthGuard = ({ children }: AuthGuardProps): JSX.Element => {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { openModal, closeAll } = useModal()

  // AuthProvider 초기화 완료 여부
  const [isAuthProviderInitialized, setIsAuthProviderInitialized] = useState(false)

  // 인가 검증 완료 여부
  const [isAuthVerified, setIsAuthVerified] = useState(false)

  // 로그인 모달이 이미 표시되었는지 추적 (한 번만 보여야 함)
  const loginModalShownRef = useRef(false)

  // 테스트 환경 여부
  const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test'

  // 현재 페이지의 접근 권한 확인
  const currentPageAccess = getPageAccess(pathname)
  const isPrivatePage = currentPageAccess === 'PRIVATE'

  /**
   * 로그인해주세요 모달 표시 함수
   * 모달이 이미 표시되었는지 확인하여 중복 표시를 방지합니다.
   */
  const showLoginRequiredModal = useCallback((): void => {
    // 이미 모달이 표시되었다면 중복 표시하지 않음
    if (loginModalShownRef.current) return

    loginModalShownRef.current = true

    openModal(
      <Modal
        variant="info"
        actions="single"
        title="로그인이 필요합니다"
        message="로그인해주세요"
        isOpen={true}
        onClose={() => {
          loginModalShownRef.current = false
        }}
        confirmText="확인"
        onConfirm={() => {
          // 모든 모달 닫기
          closeAll()
          // 로그인 페이지로 이동
          router.push(PATHS.AUTH.LOGIN)
        }}
      />,
      () => {
        // 모달이 닫힐 때 실행될 콜백
        loginModalShownRef.current = false
      }
    )
  }, [openModal, closeAll, router])

  /**
   * 인증 상태 검증 함수
   * AuthProvider 초기화 후 인증 상태를 확인합니다.
   */
  const verifyAuth = useCallback(async (): Promise<void> => {
    try {
      // AuthProvider 초기화 대기 (약간의 지연을 두어 초기화 완료 보장)
      await new Promise(resolve => setTimeout(resolve, 100))

      // 실제 환경: 비로그인 유저를 기본으로 설정
      // 테스트 환경: 로그인 유저를 기본으로 설정
      const effectiveIsLoggedIn = isTestEnv ? true : isLoggedIn

      // 비로그인 상태에서 PRIVATE 페이지 접근 시 모달 표시
      if (!effectiveIsLoggedIn && isPrivatePage && !loginModalShownRef.current) {
        showLoginRequiredModal()
      }

      setIsAuthVerified(true)
    } catch (error) {
      console.error('인증 검증 중 오류 발생:', error)
      setIsAuthVerified(true)
    }
  }, [isTestEnv, isLoggedIn, isPrivatePage, showLoginRequiredModal])

  /**
   * AuthProvider 초기화 완료 감지
   * AuthProvider의 useEffect에서 checkAuthStatus가 호출되는 것을 감지합니다.
   */
  useEffect(() => {
    setIsAuthProviderInitialized(true)
  }, [])

  /**
   * 페이지 변경 또는 AuthProvider 초기화 완료 시 인가 검증
   * - 페이지가 변경될 때마다 모달 표시 상태를 초기화
   * - AuthProvider 초기화 이후에 인가를 진행
   */
  useEffect(() => {
    // AuthProvider 초기화가 완료되어야 인가 검증을 진행
    if (!isAuthProviderInitialized) return

    // 페이지가 변경될 때마다 모달 표시 상태 초기화
    loginModalShownRef.current = false

    // 인가 검증 실행
    verifyAuth()
  }, [pathname, isAuthProviderInitialized, verifyAuth])

  /**
   * 렌더링 로직
   * 1. AuthProvider 초기화 전: 빈 화면
   * 2. 인가 검증 전: 빈 화면
   * 3. 인가 검증 완료 후:
   *    - 테스트 환경: 항상 children 표시
   *    - 실제 환경:
   *      - PUBLIC 페이지: children 표시
   *      - PRIVATE 페이지 + 로그인: children 표시
   *      - PRIVATE 페이지 + 비로그인: 빈 화면 유지 (모달은 별도로 표시)
   */

  // 1. AuthProvider 초기화 전: 빈 화면 노출
  if (!isAuthProviderInitialized) {
    return <div data-testid="auth-guard-loading" />
  }

  // 2. 인가 검증 전: 빈 화면 노출
  if (!isAuthVerified) {
    return <div data-testid="auth-guard-verifying" />
  }

  // 3. 테스트 환경: 항상 children 렌더링
  if (isTestEnv) {
    return <>{children}</>
  }

  // 4. 실제 환경: PRIVATE 페이지이고 비로그인 상태면 빈 화면 유지
  if (isPrivatePage && !isLoggedIn) {
    return <div data-testid="auth-guard-blocked" />
  }

  // 5. 인가 완료됨 또는 PUBLIC 페이지: children 렌더링
  return <>{children}</>
};

// 기본 export
export default AuthGuard
