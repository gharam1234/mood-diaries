"use client"

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth.provider'
import { useModal } from '../modal/modal.provider'
import { Modal } from '@/commons/components/modal'
import { PATHS } from '@/commons/constants/url'

/**
 * 인증 가드 훅
 * 
 * 회원 전용 기능에 대한 접근 권한을 검증하고,
 * 비로그인 사용자에게는 로그인 모달을 표시합니다.
 * 
 * 테스트 환경에서는 window.__TEST_BYPASS__ 플래그로 인증 검사를 우회할 수 있습니다.
 */
export const useAuthGuard = () => {
  const router = useRouter()
  const { checkAuthStatus } = useAuth()
  const { openModal, closeAll } = useModal()
  
  // 모달이 이미 표시되었는지 추적하는 ref
  const modalShownRef = useRef(false)

  /**
   * 로그인 모달 표시
   */
  const showLoginModal = useCallback(() => {
    // 이미 모달이 표시되었다면 중복 표시하지 않음
    if (modalShownRef.current) return
    
    modalShownRef.current = true

    const modalContent = (
      <Modal
        variant="info"
        actions="dual"
        title="로그인이 필요합니다"
        message="로그인하시겠습니까?"
        isOpen={true}
        onClose={() => {
          modalShownRef.current = false
        }}
        confirmText="로그인하러가기"
        cancelText="취소"
        onConfirm={() => {
          // 모든 모달 닫기
          closeAll()
          // 로그인 페이지로 이동
          router.push(PATHS.AUTH.LOGIN)
        }}
        onCancel={() => {
          // 모든 모달 닫기
          closeAll()
        }}
      />
    )

    openModal(modalContent, () => {
      modalShownRef.current = false
    })
  }, [router, openModal, closeAll])

  /**
   * 인증 상태 검증 및 가드 실행
   * @returns 인증 통과 여부
   */
  const guardAuth = useCallback(() => {
    // 테스트 환경 확인
    const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test'

    // 테스트 환경에서 우회 플래그가 설정된 경우 (기본값: true)
    if (isTestEnv && typeof window !== 'undefined') {
      // __TEST_BYPASS__가 명시적으로 false가 아닌 경우 통과
      if (window.__TEST_BYPASS__ !== false) {
        return true // 테스트 환경에서 로그인 검사 패스
      }
    }

    // 실제 환경에서는 항상 로그인 검사 수행
    const isAuthenticated = checkAuthStatus()

    if (!isAuthenticated) {
      // 비로그인 사용자에게 로그인 모달 표시
      showLoginModal()
      return false
    }

    return true
  }, [checkAuthStatus, showLoginModal])

  /**
   * 테스트 환경에서 비회원 가드 테스트를 위한 함수
   * window.__TEST_BYPASS__를 false로 설정하여 실제 로그인 검사를 수행
   */
  const guardAuthForTest = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.__TEST_BYPASS__ = false
    }
    return guardAuth()
  }, [guardAuth])

  return {
    guardAuth,
    guardAuthForTest,
    showLoginModal,
  }
}

// 전역 타입 선언 (window 객체 확장)
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean
  }
}
