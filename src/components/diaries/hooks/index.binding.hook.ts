'use client';

import { useState, useEffect } from 'react';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 로컬스토리지에서 가져올 일기 데이터 타입
 * 
 * @interface DiaryData
 * @property {number} id - 일기 고유 ID
 * @property {string} title - 일기 제목
 * @property {string} content - 일기 내용
 * @property {EmotionType} emotion - 감정 타입
 * @property {string} createdAt - 작성일 (ISO 8601 형식)
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 바인딩 훅의 반환 타입
 * 
 * @interface UseDiaryBindingReturn
 * @property {DiaryData[]} diaries - 일기 데이터 배열
 * @property {boolean} loading - 로딩 상태
 * @property {string | null} error - 에러 메시지
 * @property {() => void} refreshDiaries - 데이터 새로고침 함수
 */
export interface UseDiaryBindingReturn {
  diaries: DiaryData[];
  loading: boolean;
  error: string | null;
  refreshDiaries: () => void;
}

/**
 * 로컬스토리지에서 일기 데이터를 가져오는 바인딩 훅
 * 
 * @description
 * 로컬스토리지의 'diaries' 키에서 일기 데이터를 가져와서
 * 유효성 검사를 거친 후 반환합니다.
 * 
 * @returns {UseDiaryBindingReturn} 바인딩 결과 객체
 * @returns {DiaryData[]} diaries - 일기 데이터 배열
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {() => void} refreshDiaries - 데이터 새로고침 함수
 * 
 * @example
 * ```tsx
 * const { diaries, loading, error, refreshDiaries } = useDiaryBinding();
 * 
 * if (loading) return <div>로딩 중...</div>;
 * if (error) return <div>오류: {error}</div>;
 * 
 * return (
 *   <div>
 *     {diaries.map(diary => (
 *       <div key={diary.id}>{diary.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useDiaryBinding = (): UseDiaryBindingReturn => {
  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 데이터를 가져오는 함수
   * 
   * @description
   * 로컬스토리지에서 'diaries' 데이터를 가져와서 파싱하고
   * 유효성 검사를 수행한 후 상태를 업데이트합니다.
   * 
   * @returns {void}
   */
  const loadDiaries = (): void => {
    try {
      setLoading(true);
      setError(null);

      // 로컬스토리지에서 diaries 데이터 가져오기
      const storedData = localStorage.getItem('diaries');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // 데이터 유효성 검사
        if (Array.isArray(parsedData)) {
          // 각 일기 데이터의 유효성 검사
          const validDiaries = parsedData.filter((diary: unknown) => {
            return (
              diary &&
              typeof (diary as Record<string, unknown>).id === 'number' &&
              typeof (diary as Record<string, unknown>).title === 'string' &&
              typeof (diary as Record<string, unknown>).content === 'string' &&
              typeof (diary as Record<string, unknown>).emotion === 'string' &&
              typeof (diary as Record<string, unknown>).createdAt === 'string' &&
              Object.values(EmotionType).includes((diary as Record<string, unknown>).emotion as EmotionType)
            );
          });

          setDiaries(validDiaries);
        } else {
          setDiaries([]);
        }
      } else {
        setDiaries([]);
      }
    } catch (err) {
      console.error('일기 데이터 로드 중 오류 발생:', err);
      setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 일기 데이터를 새로고침하는 함수
   * 
   * @description
   * 로컬스토리지에서 일기 데이터를 다시 로드하여
   * 최신 상태로 업데이트합니다.
   * 
   * @returns {void}
   */
  const refreshDiaries = (): void => {
    loadDiaries();
  };

  // 컴포넌트 마운트 시 일기 데이터 로드
  useEffect(() => {
    loadDiaries();
  }, []);

  return {
    diaries,
    loading,
    error,
    refreshDiaries,
  };
};
