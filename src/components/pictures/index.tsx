'use client';

import React, { useMemo, useEffect } from 'react';
import Image from 'next/image';
import { SelectBox } from '@/commons/components/selectbox';
import { useDogImages, useInfiniteScroll, DogImage } from './hooks/index.binding.hook';
import { useImageSizeFilter } from './hooks/index.filter.hook';
import styles from './styles.module.css';

/**
 * 스플래시 스크린 컴포넌트 - 로딩 중 표시
 * 
 * @description
 * 강아지 이미지 로딩 중에 표시되는 스켈레톤 UI 컴포넌트입니다.
 * 회색 배경에 흰색 세로줄이 30도 기울어진 애니메이션을 제공합니다.
 * 
 * @returns {JSX.Element} 스플래시 스크린 JSX 요소
 */
const SplashScreen: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <div
    className={styles.splashScreen}
    data-testid="splash-screen"
    style={{ width: `${width}px`, height: `${height}px` }}
  >
  </div>
);

/**
 * 에러 상태 컴포넌트
 * 
 * @description
 * API 요청 실패 시 표시되는 에러 메시지와 재시도 버튼을 제공합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Function} props.onRetry - 재시도 버튼 클릭 핸들러
 * @returns {JSX.Element} 에러 상태 JSX 요소
 */
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className={styles.errorState}>
    <p className={styles.errorMessage} data-testid="error-message">
      강아지 사진을 불러오는데 실패했습니다.
    </p>
    <button className={styles.retryButton} onClick={onRetry}>
      다시 시도
    </button>
  </div>
);

/**
 * 강아지 이미지 카드 컴포넌트
 * 
 * @description
 * 개별 강아지 이미지를 표시하는 카드 컴포넌트입니다.
 * Next.js Image 컴포넌트를 사용하여 최적화된 이미지 로딩을 제공합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {DogImage} props.dog - 강아지 이미지 데이터
 * @returns {JSX.Element} 강아지 이미지 카드 JSX 요소
 */
const DogImageCard: React.FC<{ dog: DogImage; width: number; height: number }> = ({ dog, width, height }) => (
  <div className={styles.pictureCard}>
    <div className={styles.pictureImageContainer} style={{ width: `${width}px`, height: `${height}px` }}>
      <Image
        src={dog.imageUrl}
        alt={`강아지 사진 - ${dog.breed || 'unknown'}`}
        width={width}
        height={height}
        className={styles.pictureImage}
        data-testid="dog-image"
        priority={false}
      />
    </div>
  </div>
);

/**
 * Pictures 컴포넌트 - 피그마 디자인을 기반으로 한 강아지 사진 갤러리
 * 
 * @description
 * dog.ceo API를 연동하여 강아지 이미지를 무한스크롤로 표시하는 컴포넌트입니다.
 * 로딩 상태, 에러 상태, 성공 상태를 모두 처리하며 필터링 기능을 제공합니다.
 * 
 * 주요 기능:
 * - API 기반 강아지 이미지 조회
 * - 무한스크롤을 통한 추가 이미지 로드
 * - 스플래시 스크린을 통한 로딩 상태 표시
 * - 에러 상태 처리 및 재시도 기능
 * - 강아지 종별 필터링
 * 
 * @returns {JSX.Element} Pictures 컴포넌트 JSX 요소
 */
const Pictures: React.FC = () => {
  // 이미지 크기 필터 훅 사용
  const { selectedFilter, currentImageSize, filterOptions, handleFilterChange } = useImageSizeFilter();

  // 강아지 이미지 데이터 조회
  const {
    dogImages,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  } = useDogImages();

  // 무한스크롤 핸들러
  const { handleScroll } = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 이미지 목록은 사이즈 필터와 무관하므로 전체 사용
  const filteredPictures = useMemo(() => dogImages, [dogImages]);

  // 재시도 핸들러
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className={styles.container} data-testid="pictures-container">
      {/* 첫 번째 gap 영역 */}
      <div className={styles.gap}></div>
      
      {/* filter 영역 */}
      <div className={styles.filter}>
        <div className={styles.filterContent}>
          <SelectBox
            variant="primary"
            theme="light"
            size="medium"
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            placeholder="이미지 크기를 선택하세요"
            className={styles.filterSelectBox}
          />
        </div>
      </div>
      
      {/* 두 번째 gap 영역 */}
      <div className={styles.gap}></div>
      
      {/* main 영역 */}
      <div className={styles.main}>
        {/* 로딩 상태 */}
        {isLoading && (
          <div className={styles.splashGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <SplashScreen key={index} width={currentImageSize.width} height={currentImageSize.height} />
            ))}
          </div>
        )}

        {/* 에러 상태 */}
        {isError && (
          <ErrorState onRetry={handleRetry} />
        )}

        {/* 성공 상태 - 강아지 이미지 그리드 */}
        {!isLoading && !isError && filteredPictures.length > 0 && (
          <div className={styles.pictureGrid}>
            {filteredPictures.map((dog: DogImage) => (
              <DogImageCard key={dog.id} dog={dog} width={currentImageSize.width} height={currentImageSize.height} />
            ))}
            
            {/* 추가 로딩 중 스플래시 스크린 */}
            {isFetchingNextPage && (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SplashScreen key={`loading-${index}`} width={currentImageSize.width} height={currentImageSize.height} />
                ))}
              </>
            )}
          </div>
        )}
        
        {/* 결과가 없을 때 표시 */}
        {!isLoading && !isError && filteredPictures.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>선택한 조건에 맞는 강아지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pictures;
