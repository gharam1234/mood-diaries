'use client'

import React, { useCallback } from 'react'
import { useModal } from '@/commons/providers/modal/modal.provider'
import Modal from '@/commons/components/modal'

/**
 * 일기쓰기 닫기 흐름 전용 훅
 * - 부모(일기쓰기 폼 모달) 위에 등록취소 모달을 오버레이로 띄움
 * - 계속작성: 자식(등록취소)만 닫음
 * - 등록취소: 자식과 부모 모두 닫음
 */
export const useModalCloseLink = () => {
  const { openModal, closeTop, closeAll } = useModal()

  // 등록취소 모달 열기
  const openCancelConfirmModal = useCallback(() => {
    // 모달 내용 노드 구성
    const CancelConfirmNode = (
      <Modal
        variant="info"
        actions="dual"
        title="일기 등록 취소"
        message="작성 중인 내용을 취소하시겠어요?"
        isOpen={true}
        // 계속작성: 자식만 닫기
        onCancel={() => {
          // 자식(최상단)만 닫기
          closeTop()
        }}
        cancelText="계속 작성"
        // 등록취소: 부모와 자식 모두 닫기
        onConfirm={() => {
          // 스택 전체 닫기 (자식 + 부모)
          closeAll()
        }}
        confirmText="등록 취소"
        // Modal 컴포넌트 특성상 onClose는 내부 버튼 동작 후 호출됨
        onClose={() => {}}
      />
    )

    // 부모 위에 오버레이로 자식 모달 푸시
    openModal(CancelConfirmNode)
  }, [openModal, closeTop, closeAll])

  return {
    openCancelConfirmModal,
  }
}

export default useModalCloseLink


