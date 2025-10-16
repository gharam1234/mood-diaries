"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { EmotionType } from '../../../commons/constants/enum';
import { PATHS } from '../../../commons/constants/url';
import { useModal } from '../../../commons/providers/modal/modal.provider';
import { Modal } from '../../../commons/components/modal';

// 일기 데이터 타입 정의
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

// Zod 유효성 검사 스키마
const diaryFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  emotion: z.nativeEnum(EmotionType).refine((val) => val !== undefined, {
    message: '감정을 선택해주세요.'
  })
});

export type DiaryFormData = z.infer<typeof diaryFormSchema>;

/**
 * 일기 등록 폼 훅
 * react-hook-form과 zod를 사용하여 폼 상태 관리 및 유효성 검사를 처리합니다.
 */
export const useFormHook = () => {
  const router = useRouter();
  const { openModal, closeAll } = useModal();

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      emotion: undefined
    }
  });

  // 폼 필드 값 감시
  const watchedValues = watch();

  /**
   * 로컬스토리지에서 기존 일기 목록 가져오기
   */
  const getExistingDiaries = (): DiaryData[] => {
    try {
      const existingData = localStorage.getItem('diaries');
      return existingData ? JSON.parse(existingData) : [];
    } catch (error) {
      console.error('로컬스토리지 데이터 읽기 오류:', error);
      return [];
    }
  };

  /**
   * 새로운 ID 생성 (기존 최대 ID + 1)
   */
  const generateNewId = (existingDiaries: DiaryData[]): number => {
    if (existingDiaries.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingDiaries.map(diary => diary.id));
    return maxId + 1;
  };

  /**
   * 로컬스토리지에 일기 저장
   */
  const saveDiaryToLocalStorage = (diaryData: DiaryData): void => {
    try {
      const existingDiaries = getExistingDiaries();
      const updatedDiaries = [...existingDiaries, diaryData];
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
    } catch (error) {
      console.error('로컬스토리지 저장 오류:', error);
      throw new Error('일기 저장에 실패했습니다.');
    }
  };

  /**
   * 등록 완료 모달 표시
   */
  const showSuccessModal = (diaryId: number) => {
    const handleConfirm = () => {
      closeAll(); // 모든 모달 닫기
      router.push(PATHS.DIARIES.DETAIL(diaryId)); // 상세페이지로 이동
    };

    openModal(
      <Modal
        variant="info"
        actions="single"
        title="일기 등록 완료"
        message="등록이 완료 되었습니다."
        isOpen={true}
        onClose={handleConfirm}
        confirmText="확인"
        onConfirm={handleConfirm}
      />,
      handleConfirm // onClose 콜백 전달
    );
  };

  /**
   * 폼 제출 처리
   */
  const onSubmit = (data: DiaryFormData) => {
    try {
      const existingDiaries = getExistingDiaries();
      const newId = generateNewId(existingDiaries);
      
      const newDiary: DiaryData = {
        id: newId,
        title: data.title,
        content: data.content,
        emotion: data.emotion,
        createdAt: new Date().toISOString()
      };

      saveDiaryToLocalStorage(newDiary);
      showSuccessModal(newId);
      reset(); // 폼 초기화
    } catch (error) {
      console.error('일기 등록 오류:', error);
      // 에러 처리 로직 추가 가능
    }
  };

  /**
   * 감정 값 설정 (라디오 버튼용)
   */
  const setEmotion = (emotion: EmotionType) => {
    setValue('emotion', emotion, { shouldValidate: true });
  };

  return {
    // react-hook-form 메서드들
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    watchedValues,
    
    // 커스텀 메서드들
    setEmotion,
    reset,
    
    // 상태 정보
    isFormValid: isValid && watchedValues.title && watchedValues.content && watchedValues.emotion
  };
};
