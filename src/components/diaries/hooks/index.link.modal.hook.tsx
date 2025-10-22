'use client'

import React, { useCallback } from 'react'
import { useModal } from '../../../commons/providers/modal/modal.provider'
import { useAuthGuard } from '../../../commons/providers/auth/auth.guard.hook'
import DiariesNew from '../../diaries-new'

/**
 * 모달 링크 훅 반환 타입
 */
export interface ModalLinkHookReturn {
  /** 일기쓰기 모달을 엽니다 */
  openWriteDiaryModal: () => void;
  /** 모달을 닫습니다 */
  closeWriteDiaryModal: () => void;
  /** 모달 열림 상태 */
  isModalOpen: boolean;
}

/**
 * 모달 링크 훅
 * 
 * 일기쓰기 모달의 열기/닫기 기능을 제공합니다.
 * - DiariesNew 컴포넌트를 모달로 표시
 * - 기존 modal.provider 활용
 * - 모달 상태 관리 및 제어
 * - 권한검사 기능 통합 (액션GUARD)
 * 
 * @returns 모달 제어 함수들과 상태
 * @example
 * ```tsx
 * const { openWriteDiaryModal, closeWriteDiaryModal, isModalOpen } = useModalLink();
 * 
 * // 일기쓰기 버튼에서 사용
 * <Button onClick={openWriteDiaryModal}>일기쓰기</Button>
 * 
 * // 모달 상태 확인
 * {isModalOpen && <div>모달이 열려있습니다</div>}
 * ```
 */
export const useModalLink = (): ModalLinkHookReturn => {
  const { openModal, closeTop, isAnyOpen } = useModal()
  const { guardAuth } = useAuthGuard()

  /**
   * 일기쓰기 모달을 엽니다
   * 권한검사를 통과한 경우에만 모달을 표시합니다.
   * 비로그인 사용자에게는 로그인 요청 모달이 표시됩니다.
   * 
   * @example
   * ```tsx
   * <Button onClick={openWriteDiaryModal}>일기쓰기</Button>
   * ```
   */
  const openWriteDiaryModal = useCallback(() => {
    // 권한검사 실행
    const isAuthenticated = guardAuth()
    
    // 로그인된 사용자만 일기쓰기 모달 표시
    if (isAuthenticated) {
      openModal(<DiariesNew />)
    }
  }, [openModal, guardAuth])

  /**
   * 모달을 닫습니다
   * 
   * @example
   * ```tsx
   * <Button onClick={closeWriteDiaryModal}>닫기</Button>
   * ```
   */
  const closeWriteDiaryModal = useCallback(() => {
    closeTop()
  }, [closeTop])

  return {
    openWriteDiaryModal,
    closeWriteDiaryModal,
    isModalOpen: isAnyOpen
  }
}
