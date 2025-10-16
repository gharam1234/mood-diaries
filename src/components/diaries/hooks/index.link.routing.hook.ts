'use client';

import { useRouter } from 'next/navigation';
import { PATHS } from '../../../commons/constants/url';

/**
 * 일기 카드 링크 라우팅 훅
 * 
 * 일기 카드 클릭 시 상세 페이지로 이동하는 기능을 제공합니다.
 * Next.js의 useRouter를 사용하여 클라이언트 사이드 라우팅을 처리합니다.
 * 
 * @returns {Object} 링크 라우팅 관련 함수들
 * @returns {Function} navigateToDiaryDetail - 일기 상세 페이지로 이동하는 함수
 */
export const useLinkRouting = () => {
  const router = useRouter();

  /**
   * 일기 상세 페이지로 이동
   * 
   * 전달받은 일기 ID를 사용하여 해당 일기의 상세 페이지로 이동합니다.
   * url.ts에 정의된 경로 패턴을 사용하여 하드코딩을 방지합니다.
   * 
   * @param {number} diaryId - 이동할 일기의 고유 ID
   * @example
   * navigateToDiaryDetail(123); // /diaries/123으로 이동
   */
  const navigateToDiaryDetail = (diaryId: number): void => {
    const detailPath = PATHS.DIARIES.DETAIL(diaryId);
    router.push(detailPath);
  };

  return {
    navigateToDiaryDetail,
  };
};
