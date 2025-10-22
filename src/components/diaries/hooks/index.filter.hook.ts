'use client';

import { useState, useCallback } from 'react';
import { DiaryData } from './index.binding.hook';
import { EmotionType, EMOTION_MAP } from '@/commons/constants/enum';

/**
 * 필터 옵션 인터페이스
 *
 * @interface FilterOption
 * @property {string} value - 필터 값 (emotion type 또는 'all')
 * @property {string} label - 화면에 표시될 필터 라벨
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * 필터 훅의 반환 타입
 *
 * @interface UseDiaryFilterReturn
 * @property {DiaryData[]} filteredDiaries - 필터링된 일기 데이터 배열
 * @property {string} selectedFilter - 현재 선택된 필터 값
 * @property {(filter: string) => void} setSelectedFilter - 필터 설정 함수
 * @property {FilterOption[]} filterOptions - 필터 옵션 목록
 */
export interface UseDiaryFilterReturn {
  filteredDiaries: DiaryData[];
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filterOptions: FilterOption[];
}

/**
 * 일기 필터 기능을 제공하는 훅
 *
 * @description
 * 일기 목록을 감정 타입에 따라 필터링하는 기능을 제공합니다.
 * EmotionType enum에 정의된 감정별로 필터링하고, '전체' 옵션으로 모든 일기를 표시합니다.
 *
 * @param {DiaryData[]} diaries - 필터링할 일기 데이터 배열
 * @returns {UseDiaryFilterReturn} 필터링 결과 객체
 * @returns {DiaryData[]} filteredDiaries - 필터링된 일기 데이터
 * @returns {string} selectedFilter - 현재 선택된 필터 값
 * @returns {(filter: string) => void} setSelectedFilter - 필터 설정 함수
 * @returns {FilterOption[]} filterOptions - 필터 옵션 목록
 *
 * @example
 * ```tsx
 * const { filteredDiaries, selectedFilter, setSelectedFilter, filterOptions } = useDiaryFilter(diaries);
 *
 * return (
 *   <div>
 *     <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
 *       {filterOptions.map(option => (
 *         <option key={option.value} value={option.value}>
 *           {option.label}
 *         </option>
 *       ))}
 *     </select>
 *     {filteredDiaries.map(diary => (
 *       <div key={diary.id}>{diary.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useDiaryFilter = (diaries: DiaryData[]): UseDiaryFilterReturn => {
  const [selectedFilter, setSelectedFilterState] = useState<string>('all');

  /**
   * 필터 옵션 생성 함수
   *
   * @description
   * EmotionType enum에 정의된 감정별 필터 옵션을 생성합니다.
   * 첫 번째 옵션은 '전체'이고, 나머지는 EmotionType의 순서대로 생성됩니다.
   *
   * @returns {FilterOption[]} 필터 옵션 배열
   */
  const generateFilterOptions = useCallback((): FilterOption[] => {
    const options: FilterOption[] = [
      { value: 'all', label: '전체' }
    ];

    // EmotionType의 모든 값을 순회하며 필터 옵션 생성
    Object.values(EmotionType).forEach((emotionType) => {
      const emotionData = EMOTION_MAP[emotionType as EmotionType];
      options.push({
        value: emotionType,
        label: emotionData.label
      });
    });

    return options;
  }, []);

  /**
   * 필터 설정 함수
   *
   * @description
   * 선택된 필터 값을 설정합니다.
   *
   * @param {string} filter - 필터 값
   * @returns {void}
   */
  const setSelectedFilter = useCallback((filter: string): void => {
    setSelectedFilterState(filter);
  }, []);

  /**
   * 일기 목록을 필터링하는 함수
   *
   * @description
   * 선택된 필터에 따라 일기 목록을 필터링합니다.
   * 'all'이 선택된 경우 모든 일기를 반환하고,
   * 특정 emotion이 선택된 경우 해당 emotion의 일기만 반환합니다.
   *
   * @param {DiaryData[]} diaryList - 필터링할 일기 목록
   * @param {string} filter - 필터 값
   * @returns {DiaryData[]} 필터링된 일기 목록
   */
  const filterDiaries = useCallback((diaryList: DiaryData[], filter: string): DiaryData[] => {
    if (filter === 'all') {
      return diaryList;
    }

    return diaryList.filter((diary) => diary.emotion === filter);
  }, []);

  // 필터에 따라 필터링된 일기 데이터
  const filteredDiaries = filterDiaries(diaries, selectedFilter);

  // 필터 옵션
  const filterOptions = generateFilterOptions();

  return {
    filteredDiaries,
    selectedFilter,
    setSelectedFilter,
    filterOptions,
  };
};
