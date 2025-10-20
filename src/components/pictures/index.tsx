'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { SelectBox } from '@/commons/components/selectbox';
import { mockDogPictures, filterOptions, DogPicture } from './mockData';
import styles from './styles.module.css';

/**
 * Pictures 컴포넌트 - 피그마 디자인을 기반으로 한 강아지 사진 갤러리
 * 필터 기능과 반응형 레이아웃을 제공합니다.
 */
const Pictures: React.FC = () => {
  // 필터 상태 관리
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // 필터링된 강아지 사진 데이터
  const filteredPictures = useMemo(() => {
    if (selectedFilter === 'all') {
      return mockDogPictures;
    }
    return mockDogPictures.filter(dog => dog.breed === selectedFilter);
  }, [selectedFilter]);

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className={styles.container}>
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
            placeholder="강아지 종류를 선택하세요"
            className={styles.filterSelectBox}
          />
        </div>
      </div>
      
      {/* 두 번째 gap 영역 */}
      <div className={styles.gap}></div>
      
      {/* main 영역 */}
      <div className={styles.main}>
        <div className={styles.pictureGrid}>
          {filteredPictures.map((dog: DogPicture) => (
            <div key={dog.id} className={styles.pictureCard}>
              <div className={styles.pictureImageContainer}>
                <Image
                  src={dog.imageUrl}
                  alt={`${dog.name} - ${dog.description}`}
                  width={640}
                  height={640}
                  className={styles.pictureImage}
                  priority={false}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* 결과가 없을 때 표시 */}
        {filteredPictures.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>선택한 조건에 맞는 강아지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pictures;
