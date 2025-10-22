import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

/**
 * 회고 데이터 타입 정의
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 폼 스키마 정의 (zod)
 */
const retrospectFormSchema = z.object({
  content: z.string()
    .min(1, '회고 내용을 입력해주세요.')
    .max(500, '회고 내용은 500자 이하로 입력해주세요.')
    .trim()
});

export type RetrospectFormData = z.infer<typeof retrospectFormSchema>;

/**
 * 회고 폼 훅
 * 
 * 회고 등록 폼의 상태 관리와 제출 로직을 담당합니다.
 * - react-hook-form을 사용한 폼 상태 관리
 * - zod를 사용한 폼 검증
 * - 로컬스토리지에 회고 데이터 저장
 * - 등록 완료 후 페이지 새로고침
 */
export const useRetrospectForm = (diaryId: number) => {
  const router = useRouter();
  
  const form = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    defaultValues: {
      content: ''
    },
    mode: 'onChange'
  });

  const { watch, reset } = form;
  const content = watch('content');
  
  // 입력 내용이 있을 때만 버튼 활성화
  const isSubmitEnabled = content && content.trim().length > 0;

  /**
   * 로컬스토리지에서 기존 회고 데이터를 가져옵니다.
   * 
   * @description
   * 로컬스토리지의 'retrospects' 키에서 기존 회고 데이터를 조회합니다.
   * 데이터가 없거나 파싱에 실패한 경우 빈 배열을 반환합니다.
   * 
   * @returns {RetrospectData[]} 기존 회고 데이터 배열
   * 
   * @example
   * ```typescript
   * const existingData = getExistingRetrospects();
   * console.log(existingData); // [{ id: 1, content: '...', diaryId: 1, createdAt: '...' }]
   * ```
   */
  function getExistingRetrospects(): RetrospectData[] {
    try {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('로컬스토리지에서 회고 데이터를 가져오는데 실패했습니다:', error);
      return [];
    }
  }

  /**
   * 새로운 회고 ID를 생성합니다.
   * 
   * @description
   * 기존 회고 데이터 중 가장 큰 ID에 1을 더한 값을 반환합니다.
   * 기존 데이터가 없는 경우 1을 반환합니다.
   * 
   * @param {RetrospectData[]} existingRetrospects - 기존 회고 데이터 배열
   * @returns {number} 새로운 회고 ID
   * 
   * @example
   * ```typescript
   * const newId = generateNewId([{ id: 1, ... }, { id: 3, ... }]);
   * console.log(newId); // 4
   * ```
   */
  function generateNewId(existingRetrospects: RetrospectData[]): number {
    if (existingRetrospects.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingRetrospects.map(r => r.id));
    return maxId + 1;
  }

  /**
   * 회고 데이터를 로컬스토리지에 저장합니다.
   * 
   * @description
   * 기존 회고 데이터에 새로운 회고를 추가하여 로컬스토리지에 저장합니다.
   * 저장에 실패한 경우 에러를 던집니다.
   * 
   * @param {RetrospectData} retrospect - 저장할 회고 데이터
   * @throws {Error} 로컬스토리지 저장 실패 시 에러 발생
   * 
   * @example
   * ```typescript
   * const newRetrospect = { id: 1, content: '...', diaryId: 1, createdAt: '...' };
   * saveRetrospectToStorage(newRetrospect);
   * ```
   */
  function saveRetrospectToStorage(retrospect: RetrospectData): void {
    try {
      const existingRetrospects = getExistingRetrospects();
      const updatedRetrospects = [...existingRetrospects, retrospect];
      localStorage.setItem('retrospects', JSON.stringify(updatedRetrospects));
    } catch (error) {
      console.error('로컬스토리지에 회고 데이터를 저장하는데 실패했습니다:', error);
      throw new Error('회고 저장에 실패했습니다.');
    }
  }

  /**
   * 회고 폼 제출 핸들러
   *
   * @description
   * 폼 데이터를 검증하고 로컬스토리지에 저장한 후 페이지를 새로고침합니다.
   * 저장된 회고는 현재 일기의 ID와 연결됩니다.
   *
   * @param {RetrospectFormData} data - 폼에서 제출된 데이터
   *
   * @example
   * ```typescript
   * onSubmit({ content: '오늘의 회고입니다.' });
   * ```
   */
  const onSubmit = form.handleSubmit(async (data: RetrospectFormData) => {
    try {
      // 기존 회고 데이터 가져오기
      const existingRetrospects = getExistingRetrospects();

      // 새로운 회고 데이터 생성
      const newRetrospect: RetrospectData = {
        id: generateNewId(existingRetrospects),
        content: data.content.trim(),
        diaryId: diaryId,
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '. ').replace(/\.$/, '')
      };

      // 로컬스토리지에 저장
      saveRetrospectToStorage(newRetrospect);

      // 폼 초기화
      reset();

      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error('회고 등록 중 오류가 발생했습니다:', error);
      // TODO: 에러 상태 관리를 위한 상태 추가 필요
      throw error;
    }
  });

  return {
    form,
    isSubmitEnabled,
    onSubmit
  };
};