'use client';

import React, { useCallback, useState } from 'react';
import { useAuthGuard } from '@/commons/providers/auth/auth.guard.hook';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';

/**
 * 일기 삭제 관련 데이터 타입
 */
export interface DiaryDeleteData {
  id: number;
  title: string;
}

/**
 * 일기 삭제 훅
 * 
 * @description
 * 일기 삭제 기능을 제공하는 커스텀 훅입니다.
 * 권한 검사, 삭제 확인 모달 표시, 로컬스토리지에서 데이터 삭제 등의 기능을 포함합니다.
 * 
 * @returns {Object} 삭제 관련 함수들과 상태
 */
export const useDiaryDelete = () => {
  const { guardAuth } = useAuthGuard();
  const { openModal, closeAll } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * 로컬스토리지에서 일기 데이터 삭제
   * 
   * @param {number} diaryId - 삭제할 일기의 ID
   * @returns {boolean} 삭제 성공 여부
   */
  const deleteDiaryFromStorage = useCallback((diaryId: number): boolean => {
    try {
      // 로컬스토리지에서 기존 일기 데이터 가져오기
      const existingData = localStorage.getItem('diaries');
      if (!existingData) {
        console.warn('삭제할 일기 데이터가 없습니다.');
        return false;
      }

      const diaries = JSON.parse(existingData);
      
      // 삭제할 일기가 존재하는지 확인
      const diaryIndex = diaries.findIndex((diary: { id: number }) => diary.id === diaryId);
      if (diaryIndex === -1) {
        console.warn(`ID ${diaryId}에 해당하는 일기를 찾을 수 없습니다.`);
        return false;
      }

      // 해당 일기 삭제
      diaries.splice(diaryIndex, 1);
      
      // 로컬스토리지에 업데이트된 데이터 저장
      localStorage.setItem('diaries', JSON.stringify(diaries));
      
      console.log(`일기 ID ${diaryId}가 성공적으로 삭제되었습니다.`);
      return true;
    } catch (error) {
      console.error('일기 삭제 중 오류가 발생했습니다:', error);
      return false;
    }
  }, []);

  /**
   * 삭제 확인 후 실제 삭제 실행
   * 
   * @param {number} diaryId - 삭제할 일기의 ID
   */
  const handleDeleteConfirm = useCallback(async (diaryId: number) => {
    if (isDeleting) return; // 이미 삭제 중이면 중복 실행 방지

    setIsDeleting(true);
    
    try {
      // 로컬스토리지에서 일기 삭제
      const deleteSuccess = deleteDiaryFromStorage(diaryId);
      
      if (deleteSuccess) {
        // 모든 모달 닫기
        closeAll();
        
        // 페이지 새로고침
        window.location.reload();
      } else {
        console.error('일기 삭제에 실패했습니다.');
        // 실패 시에도 모달 닫기
        closeAll();
      }
    } catch (error) {
      console.error('일기 삭제 중 오류가 발생했습니다:', error);
      closeAll();
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, deleteDiaryFromStorage, closeAll]);

  /**
   * 삭제 확인 모달 표시
   * 
   * @param {DiaryDeleteData} diaryData - 삭제할 일기 데이터
   */
  const showDeleteConfirmModal = useCallback((diaryData: DiaryDeleteData) => {
    const modalContent = (
      <Modal
        variant="danger"
        actions="dual"
        title="일기 삭제"
        message={`"${diaryData.title}" 일기를 삭제하시겠습니까?`}
        isOpen={true}
        onClose={() => {
          // 모달 닫기
        }}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          // 삭제 실행
          handleDeleteConfirm(diaryData.id);
        }}
        onCancel={() => {
          // 취소 - 모달 닫기
          closeAll();
        }}
        data-testid="delete-modal"
      />
    );

    openModal(modalContent, () => {
      // 모달이 닫힐 때의 콜백
    });
  }, [openModal, closeAll, handleDeleteConfirm]);

  /**
   * 일기 삭제 요청 처리
   * 
   * @param {DiaryDeleteData} diaryData - 삭제할 일기 데이터
   */
  const requestDeleteDiary = useCallback((diaryData: DiaryDeleteData) => {
    // 권한 검사
    const hasPermission = guardAuth();
    
    if (!hasPermission) {
      // 권한이 없으면 로그인 모달이 자동으로 표시됨
      return;
    }

    // 권한이 있으면 삭제 확인 모달 표시
    showDeleteConfirmModal(diaryData);
  }, [guardAuth, showDeleteConfirmModal]);

  return {
    requestDeleteDiary,
    isDeleting,
  };
};
