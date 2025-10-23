'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';

/**
 * 일기 삭제 훅
 *
 * @description
 * 일기 삭제 기능을 관리하는 커스텀 훅입니다.
 * - modal.provider를 통한 모달 관리
 * - 일기 삭제 로직 처리
 * - 삭제 후 페이지 이동
 *
 * @param {number} diaryId - 삭제할 일기의 ID
 * @returns {Object} 삭제 관련 함수
 */
export const useDiaryDelete = (diaryId: number) => {
  const router = useRouter();
  const { openModal, closeTop } = useModal();

  /**
   * 일기 삭제 실행
   *
   * @description
   * 로컬스토리지에서 해당 일기를 제거하고 /diaries로 이동합니다.
   */
  const deleteDiary = useCallback(() => {
    try {
      // 로컬스토리지에서 기존 일기 데이터 가져오기
      const existingData = localStorage.getItem('diaries');
      if (!existingData) {
        console.warn('삭제할 일기 데이터가 없습니다.');
        return;
      }

      const diaries = JSON.parse(existingData);

      // 해당 일기 ID와 일치하는 객체 제거
      const updatedDiaries = diaries.filter((diary: { id: number }) => diary.id !== diaryId);

      // 로컬스토리지에 업데이트된 데이터 저장
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));

      console.log(`일기 ID ${diaryId}가 성공적으로 삭제되었습니다.`);

      // 모달 닫기
      closeTop();

      // /diaries로 페이지 이동
      router.push('/diaries');
    } catch (error) {
      console.error('일기 삭제 중 오류가 발생했습니다:', error);
    }
  }, [diaryId, closeTop, router]);

  /**
   * 취소 버튼 핸들러
   */
  const handleModalCancel = useCallback(() => {
    console.log('[useDiaryDelete] Cancel button clicked, calling closeTop');
    closeTop();
    console.log('[useDiaryDelete] closeTop called');
  }, [closeTop]);

  /**
   * 삭제 모달 열기
   */
  const openDeleteModal = useCallback(() => {
    openModal(
      <Modal
        variant="danger"
        actions="dual"
        theme="light"
        title="일기 삭제"
        message="정말로 이 일기를 삭제하시겠어요?"
        isOpen={true}
        onClose={closeTop}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={deleteDiary}
        onCancel={handleModalCancel}
        data-testid="delete-modal"
      />
    );
  }, [openModal, closeTop, deleteDiary, handleModalCancel]);

  return {
    openDeleteModal,
  };
};
