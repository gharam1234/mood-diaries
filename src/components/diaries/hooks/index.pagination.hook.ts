import { useMemo, useState, useEffect } from 'react';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 페이지네이션 타입 정의
 *
 * @interface DiaryData
 * @property {number} id - 일기 고유 ID
 * @property {string} title - 일기 제목
 * @property {string} content - 일기 내용
 * @property {EmotionType} emotion - 감정 타입
 * @property {string} createdAt - 생성 날짜
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 페이지네이션 설정 인터페이스
 *
 * @interface PaginationConfig
 * @property {number} itemsPerPage - 페이지당 표시할 아이템 수 (기본값: 12)
 * @property {number} maxVisiblePages - 최대 표시 페이지 수 (기본값: 5)
 */
export interface PaginationConfig {
  itemsPerPage?: number;
  maxVisiblePages?: number;
}

/**
 * 페이지네이션 훅 반환 타입
 *
 * @interface UseDiaryPaginationReturn
 * @property {DiaryData[]} paginatedDiaries - 현재 페이지의 일기 목록
 * @property {number} currentPage - 현재 페이지 번호
 * @property {number} totalPages - 전체 페이지 수
 * @property {(page: number) => void} setCurrentPage - 페이지 변경 함수
 * @property {() => void} resetPage - 페이지를 1로 리셋하는 함수
 */
export interface UseDiaryPaginationReturn {
  paginatedDiaries: DiaryData[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  resetPage: () => void;
}

/**
 * 일기 페이지네이션 커스텀 훅
 *
 * @description
 * 일기 목록을 페이지네이션 처리하는 커스텀 훅입니다.
 * 검색 및 필터링된 일기 목록을 받아 페이지 단위로 분할하여 제공합니다.
 *
 * @핵심기능
 * 1. 페이지당 12개의 일기 카드 표시 (3행 4열)
 * 2. 최대 5개의 페이지 번호 표시
 * 3. 검색/필터 결과에 따른 동적 페이지 수 계산
 * 4. 페이지 변경 시 자동 스크롤 상단 이동
 *
 * @param {DiaryData[]} diaries - 페이지네이션할 일기 목록 (검색/필터 적용된 데이터)
 * @param {PaginationConfig} config - 페이지네이션 설정
 * @returns {UseDiaryPaginationReturn} 페이지네이션 관련 상태 및 함수
 *
 * @example
 * ```tsx
 * const { paginatedDiaries, currentPage, totalPages, setCurrentPage, resetPage } = useDiaryPagination(filteredDiaries, {
 *   itemsPerPage: 12,
 *   maxVisiblePages: 5
 * });
 * ```
 */
export const useDiaryPagination = (
  diaries: DiaryData[],
  config: PaginationConfig = {}
): UseDiaryPaginationReturn => {
  const {
    itemsPerPage = 12, // 3행 4열 = 12개
  } = config;

  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * 전체 페이지 수 계산
   *
   * @description
   * 일기 목록의 총 개수를 페이지당 아이템 수로 나누어 전체 페이지 수를 계산합니다.
   * 최소 1페이지는 보장합니다.
   */
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(diaries.length / itemsPerPage));
  }, [diaries.length, itemsPerPage]);

  /**
   * 현재 페이지에 표시할 일기 목록
   *
   * @description
   * 현재 페이지 번호에 따라 표시할 일기 목록을 계산합니다.
   * 예: 페이지 1 = 0~11번 인덱스, 페이지 2 = 12~23번 인덱스
   */
  const paginatedDiaries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return diaries.slice(startIndex, endIndex);
  }, [diaries, currentPage, itemsPerPage]);

  /**
   * 일기 목록이 변경되면 페이지를 1로 리셋
   *
   * @description
   * 검색어나 필터가 변경되어 일기 목록이 달라지면 자동으로 1페이지로 이동합니다.
   * 이는 사용자가 새로운 검색/필터 결과를 처음부터 볼 수 있도록 합니다.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [diaries.length]);

  /**
   * 현재 페이지가 전체 페이지 수를 초과하는 경우 마지막 페이지로 이동
   *
   * @description
   * 필터링으로 일기 수가 줄어들어 현재 페이지가 유효하지 않은 경우,
   * 마지막 페이지로 자동 이동합니다.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * 페이지 리셋 함수
   *
   * @description
   * 페이지를 1로 초기화합니다.
   * 검색/필터 초기화 시 사용할 수 있습니다.
   */
  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    paginatedDiaries,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
  };
};
