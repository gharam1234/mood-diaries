import { useState, useMemo } from 'react';

/**
 * 이미지 크기 필터 타입 정의
 */
export type ImageSizeFilter = 'default' | 'landscape' | 'portrait';

/**
 * 이미지 크기 정보 타입 정의
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * 필터 옵션 타입 정의
 */
export interface FilterOption {
  value: ImageSizeFilter;
  label: string;
}

/**
 * 이미지 크기 필터 훅의 반환 타입
 */
export interface UseImageSizeFilterReturn {
  selectedFilter: ImageSizeFilter;
  setSelectedFilter: (filter: ImageSizeFilter) => void;
  currentImageSize: ImageSize;
  filterOptions: FilterOption[];
  handleFilterChange: (value: string) => void;
}

/**
 * 이미지 크기별 필터 옵션 상수
 */
const IMAGE_SIZE_FILTER_OPTIONS: FilterOption[] = [
  { value: 'default', label: '기본' },
  { value: 'landscape', label: '가로형' },
  { value: 'portrait', label: '세로형' },
];

/**
 * 이미지 크기별 치수 매핑
 */
const IMAGE_SIZE_MAPPING: Record<ImageSizeFilter, ImageSize> = {
  default: { width: 640, height: 640 },
  landscape: { width: 640, height: 480 },
  portrait: { width: 480, height: 640 },
};

/**
 * 이미지 크기 필터 훅
 * 
 * @description
 * 강아지 사진의 크기를 필터링하는 기능을 제공합니다.
 * 기본(640x640), 가로형(640x480), 세로형(480x640) 세 가지 옵션을 제공합니다.
 * 
 * @returns {UseImageSizeFilterReturn} 필터 상태와 핸들러 함수들
 */
export const useImageSizeFilter = (): UseImageSizeFilterReturn => {
  // 현재 선택된 필터 상태 (기본값: 'default')
  const [selectedFilter, setSelectedFilter] = useState<ImageSizeFilter>('default');

  // 현재 선택된 필터에 해당하는 이미지 크기
  const currentImageSize = useMemo(() => {
    return IMAGE_SIZE_MAPPING[selectedFilter];
  }, [selectedFilter]);

  // 필터 옵션 목록
  const filterOptions = useMemo(() => {
    return IMAGE_SIZE_FILTER_OPTIONS;
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    const filterValue = value as ImageSizeFilter;
    if (Object.keys(IMAGE_SIZE_MAPPING).includes(filterValue)) {
      setSelectedFilter(filterValue);
    }
  };

  return {
    selectedFilter,
    setSelectedFilter,
    currentImageSize,
    filterOptions,
    handleFilterChange,
  };
};