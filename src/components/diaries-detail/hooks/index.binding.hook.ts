"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 상세 데이터 인터페이스
 * 
 * @interface DiaryDetailData
 * @property {number} id - 일기 고유 ID
 * @property {string} title - 일기 제목
 * @property {string} content - 일기 내용
 * @property {EmotionType} emotion - 감정 타입
 * @property {string} createdAt - 작성일 (YYYY. MM. DD 형식)
 */
export interface DiaryDetailData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 상세 데이터 바인딩 훅
 * 
 * 다이나믹 라우팅의 [id] 파라미터를 추출하여 로컬스토리지에서
 * 해당하는 일기 데이터를 찾아 바인딩하는 기능을 제공합니다.
 * 
 * @returns {Object} 바인딩 결과
 * @returns {DiaryDetailData | null} diaryData - 바인딩된 일기 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * 
 * @example
 * ```tsx
 * const { diaryData, loading, error } = useDiaryBinding();
 * 
 * if (loading) return <div>로딩 중...</div>;
 * if (error) return <div>오류: {error}</div>;
 * if (!diaryData) return <div>데이터 없음</div>;
 * 
 * return <div>{diaryData.title}</div>;
 * ```
 */
export const useDiaryBinding = () => {
  const params = useParams();
  const [diaryData, setDiaryData] = useState<DiaryDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // URL에서 id 파라미터 추출
      const diaryId = params?.id;
      
      if (!diaryId || typeof diaryId !== 'string') {
        setError('유효하지 않은 일기 ID입니다.');
        setLoading(false);
        return;
      }

      // 로컬스토리지에서 diaries 데이터 가져오기
      const diariesJson = localStorage.getItem('diaries');
      
      if (!diariesJson) {
        setError('저장된 일기가 없습니다.');
        setLoading(false);
        return;
      }

      // JSON 파싱
      const diaries: DiaryDetailData[] = JSON.parse(diariesJson);
      
      // 숫자 ID로 변환
      const numericId = parseInt(diaryId, 10);
      
      if (isNaN(numericId)) {
        setError('유효하지 않은 일기 ID 형식입니다.');
        setLoading(false);
        return;
      }

      // 해당 ID에 맞는 일기 데이터 찾기
      const foundDiary = diaries.find(diary => diary.id === numericId);
      
      if (!foundDiary) {
        setError('해당 일기를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      // 데이터 설정
      setDiaryData(foundDiary);
      setError(null);
    } catch (err) {
      console.error('일기 데이터 로딩 중 오류 발생:', err);
      setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  return {
    diaryData,
    loading,
    error
  };
};
