import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback } from 'react';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 수정 폼 데이터 타입 정의
 */
export interface DiaryUpdateFormData {
  title: string;
  content: string;
  emotion: EmotionType;
}

/**
 * 일기 데이터 타입 정의
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 수정 폼 스키마 정의 (zod)
 */
const diaryUpdateFormSchema = z.object({
  title: z.string()
    .min(1, '제목을 입력해주세요.')
    .max(100, '제목은 100자 이하로 입력해주세요.')
    .trim(),
  content: z.string()
    .min(1, '내용을 입력해주세요.')
    .max(1000, '내용은 1000자 이하로 입력해주세요.')
    .trim(),
  emotion: z.nativeEnum(EmotionType)
});

export type DiaryUpdateFormSchema = z.infer<typeof diaryUpdateFormSchema>;

/**
 * 일기 수정 폼 훅
 * 
 * 일기 수정 폼의 상태 관리와 제출 로직을 담당합니다.
 * - react-hook-form을 사용한 폼 상태 관리
 * - zod를 사용한 폼 검증
 * - 로컬스토리지에서 일기 데이터 조회 및 업데이트
 * - 수정 완료 후 콜백 함수 호출로 상태 업데이트
 */
export const useDiaryUpdateForm = (
  diaryId: number,
  onSuccess?: (updatedDiary: DiaryData) => void,
  onCancelCallback?: () => void
) => {
  const form = useForm<DiaryUpdateFormSchema>({
    resolver: zodResolver(diaryUpdateFormSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      content: '',
      emotion: EmotionType.HAPPY
    }
  });

  const { watch, reset, setValue, formState, trigger } = form;
  const watchedFields = watch();

  // 폼 유효성 검사 - 엄격한 검증
  const isFormValid = formState.isValid &&
                     !formState.isSubmitting &&
                     Boolean(watchedFields.title?.trim()) &&
                     Boolean(watchedFields.content?.trim()) &&
                     Boolean(watchedFields.emotion);

  // 로컬스토리지에서 일기 데이터를 가져옵니다
  function getDiaryFromStorage(diaryId: number): DiaryData | null {
    try {
      const data = localStorage.getItem('diaries');
      if (!data) return null;
      
      const diaries: DiaryData[] = JSON.parse(data);
      return diaries.find(diary => diary.id === diaryId) || null;
    } catch (error) {
      console.error('로컬스토리지에서 일기 데이터를 가져오는데 실패했습니다:', error);
      return null;
    }
  }

  // 로컬스토리지에서 모든 일기 데이터를 가져옵니다
  function getAllDiariesFromStorage(): DiaryData[] {
    try {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('로컬스토리지에서 일기 데이터를 가져오는데 실패했습니다:', error);
      return [];
    }
  }

  // 일기 데이터를 로컬스토리지에 업데이트합니다
  function updateDiaryInStorage(updatedDiary: DiaryData): void {
    try {
      const allDiaries = getAllDiariesFromStorage();
      const updatedDiaries = allDiaries.map(diary => 
        diary.id === updatedDiary.id ? updatedDiary : diary
      );
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
    } catch (error) {
      console.error('로컬스토리지에 일기 데이터를 업데이트하는데 실패했습니다:', error);
      throw new Error('일기 수정에 실패했습니다.');
    }
  }

  // 일기 데이터로 폼을 초기화합니다
  const initializeForm = useCallback(async (diaryData: DiaryData) => {
    setValue('title', diaryData.title);
    setValue('content', diaryData.content);
    setValue('emotion', diaryData.emotion);
    // 폼 상태를 즉시 업데이트하기 위해 trigger 호출
    await trigger(['title', 'content', 'emotion']);
  }, [setValue, trigger]);

  // 폼을 초기화합니다
  const resetForm = () => {
    reset();
  };

  // 일기 수정 폼 제출 핸들러
  const onSubmit = form.handleSubmit(
    async (data: DiaryUpdateFormSchema) => {
      console.log('[DiaryUpdateForm] Form submitted with data:', data);
      try {
        // 기존 일기 데이터 가져오기
        const existingDiary = getDiaryFromStorage(diaryId);
        if (!existingDiary) {
          throw new Error('수정할 일기를 찾을 수 없습니다.');
        }

        // 수정된 일기 데이터 생성
        const updatedDiary: DiaryData = {
          ...existingDiary,
          title: data.title.trim(),
          content: data.content.trim(),
          emotion: data.emotion
        };

        console.log('[DiaryUpdateForm] Updated diary:', updatedDiary);

        // 로컬스토리지에 업데이트
        updateDiaryInStorage(updatedDiary);

        console.log('[DiaryUpdateForm] Diary updated in storage');

        // 콜백 함수 호출로 상태 업데이트
        if (onSuccess) {
          console.log('[DiaryUpdateForm] Calling onSuccess callback');
          onSuccess(updatedDiary);
        }
      } catch (error) {
        console.error('[DiaryUpdateForm] Error during submission:', error);
        throw error;
      }
    },
    (errors) => {
      console.log('[DiaryUpdateForm] Form validation errors:', errors);
    }
  );

  // 수정 취소 핸들러
  const onCancel = () => {
    resetForm();
    if (onCancelCallback) {
      onCancelCallback();
    }
  };

  return {
    form,
    isFormValid,
    initializeForm,
    resetForm,
    onSubmit,
    onCancel
  };
};
