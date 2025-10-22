'use client';

import { useState, useCallback } from 'react';
import { DiaryData } from './index.binding.hook';

/**
 * 검색 훅의 반환 타입
 * 
 * @interface UseDiarySearchReturn
 * @property {DiaryData[]} filteredDiaries - 필터링된 일기 데이터 배열
 * @property {string} searchTerm - 현재 검색어
 * @property {(term: string) => void} setSearchTerm - 검색어 설정 함수
 * @property {() => void} clearSearch - 검색어 초기화 함수
 * @property {boolean} isSearching - 검색 중인지 여부
 */
export interface UseDiarySearchReturn {
  filteredDiaries: DiaryData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

/**
 * 일기 검색 기능을 제공하는 훅
 * 
 * @description
 * 일기 목록에서 제목을 기준으로 검색하고 필터링하는 기능을 제공합니다.
 * 실시간 검색과 엔터/버튼 클릭 검색을 모두 지원합니다.
 * 
 * @param {DiaryData[]} diaries - 검색할 일기 데이터 배열
 * @returns {UseDiarySearchReturn} 검색 결과 객체
 * @returns {DiaryData[]} filteredDiaries - 필터링된 일기 데이터
 * @returns {string} searchTerm - 현재 검색어
 * @returns {(term: string) => void} setSearchTerm - 검색어 설정 함수
 * @returns {() => void} clearSearch - 검색어 초기화 함수
 * @returns {boolean} isSearching - 검색 중인지 여부
 * 
 * @example
 * ```tsx
 * const { filteredDiaries, searchTerm, setSearchTerm, clearSearch, isSearching } = useDiarySearch(diaries);
 * 
 * return (
 *   <div>
 *     <input 
 *       value={searchTerm} 
 *       onChange={(e) => setSearchTerm(e.target.value)} 
 *     />
 *     {filteredDiaries.map(diary => (
 *       <div key={diary.id}>{diary.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useDiarySearch = (diaries: DiaryData[]): UseDiarySearchReturn => {
  const [searchTerm, setSearchTermState] = useState<string>('');

  const setSearchTerm = useCallback((term: string): void => {
    setSearchTermState(term);
  }, []);

  const clearSearch = useCallback((): void => {
    setSearchTermState('');
  }, []);

  /**
   * 일기 목록을 검색어로 필터링하는 함수
   * 
   * @description
   * 제목에 검색어가 포함된 일기만 필터링하여 반환합니다.
   * 대소문자를 구분하지 않으며, 공백은 제거합니다.
   * 
   * @param {DiaryData[]} diaryList - 필터링할 일기 목록
   * @param {string} term - 검색어
   * @returns {DiaryData[]} 필터링된 일기 목록
   */
  const filterDiaries = useCallback((diaryList: DiaryData[], term: string): DiaryData[] => {
    if (!term.trim()) {
      return diaryList;
    }

    const normalizedTerm = term.toLowerCase().trim();
    
    return diaryList.filter((diary) => 
      diary.title.toLowerCase().includes(normalizedTerm)
    );
  }, []);

  // 검색어에 따라 필터링된 일기 데이터
  const filteredDiaries = filterDiaries(diaries, searchTerm);
  
  // 검색 중인지 여부 (검색어가 있고 필터링된 결과가 원본과 다른 경우)
  const isSearching = searchTerm.trim() !== '' && filteredDiaries.length !== diaries.length;

  return {
    filteredDiaries,
    searchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
  };
};