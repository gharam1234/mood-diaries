'use client';

import React from 'react';
import styles from './styles.module.css';
import { SelectBox } from '../../commons/components/selectbox';
import { SearchBar as Searchbar } from '../../commons/components/searchbar';
import { Button } from '../../commons/components/button';
import { Pagination } from '../../commons/components/pagination';
import Image from 'next/image';
import { EmotionType, getEmotionData } from '../../commons/constants/enum';
import { useModalLink } from './hooks/index.link.modal.hook';

// 일기 데이터 인터페이스
interface DiaryData {
  id: string;
  emotion: EmotionType;
  date: string;
  title: string;
  image: string;
}

// Mock 데이터 생성
const mockDiaryData: DiaryData[] = [
  {
    id: '1',
    emotion: EmotionType.SAD,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    image: '/images/emotion-sad-m.png'
  },
  {
    id: '2',
    emotion: EmotionType.SURPRISE,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-surprise-m.png'
  },
  {
    id: '3',
    emotion: EmotionType.ANGRY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-angry-m.png'
  },
  {
    id: '4',
    emotion: EmotionType.HAPPY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-happy-m.png'
  },
  {
    id: '5',
    emotion: EmotionType.ETC,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    image: '/images/emotion-etc-m.png'
  },
  {
    id: '6',
    emotion: EmotionType.SURPRISE,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-surprise-m.png'
  },
  {
    id: '7',
    emotion: EmotionType.ANGRY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-angry-m.png'
  },
  {
    id: '8',
    emotion: EmotionType.HAPPY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-happy-m.png'
  },
  {
    id: '9',
    emotion: EmotionType.SAD,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
    image: '/images/emotion-sad-m.png'
  },
  {
    id: '10',
    emotion: EmotionType.SURPRISE,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-surprise-m.png'
  },
  {
    id: '11',
    emotion: EmotionType.ANGRY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-angry-m.png'
  },
  {
    id: '12',
    emotion: EmotionType.HAPPY,
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
    image: '/images/emotion-happy-m.png'
  }
];

// 일기 카드 컴포넌트
const DiaryCard: React.FC<{ diary: DiaryData }> = ({ diary }) => {
  const emotionData = getEmotionData(diary.emotion);
  
  return (
    <div className={styles.diaryCard}>
      {/* 카드 이미지 */}
      <div className={styles.cardImage}>
        <Image
          src={diary.image}
          alt={diary.title}
          width={274}
          height={208}
          className={styles.cardImg}
        />
        {/* 닫기 아이콘 - flexbox 방식으로 배치 */}
        <div className={styles.closeButtonContainer}>
          <button className={styles.closeButton}>
            <Image
              src="/icons/close_outline_light_m.svg"
              alt="close"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      
      {/* 카드 콘텐츠 */}
      <div className={styles.cardContent}>
        {/* 감정과 날짜 */}
        <div className={styles.cardHeader}>
          <span 
            className={styles.emotionLabel}
            style={{ color: emotionData.color }}
          >
            {emotionData.label}
          </span>
          <span className={styles.dateLabel}>
            {diary.date}
          </span>
        </div>
        
        {/* 제목 */}
        <div className={styles.cardTitle}>
          {diary.title}
        </div>
      </div>
    </div>
  );
};

/**
 * 다이어리 목록 컴포넌트
 * 와이어프레임 구조: gap -> search -> gap -> main -> gap -> pagination -> gap
 */
export const Diaries: React.FC = () => {
  // 모달 훅 사용
  const { openWriteDiaryModal } = useModalLink();
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 5; // 총 페이지 수 (예시)

  // 필터 옵션 정의
  const filterOptions = [
    { value: 'all', label: '전체' },
    { value: 'happy', label: '기쁨' },
    { value: 'sad', label: '슬픔' },
    { value: 'angry', label: '화남' },
    { value: 'surprise', label: '놀람' },
    { value: 'etc', label: '기타' },
  ];

  // 검색 핸들러
  const handleSearch = (value: string) => {
    console.log('검색어:', value);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (value: string, option: { value: string; label: string }) => {
    console.log('선택된 필터:', value, option);
  };

  // 일기쓰기 버튼 클릭 핸들러
  const handleWriteDiary = () => {
    openWriteDiaryModal();
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('페이지 변경:', page);
  };

  return (
    <div className={styles.container} data-testid="diaries-container">
      {/* Gap 1: 1168 * 32 */}
      <div className={styles.gap32}></div>
      
      {/* Search 영역: 1168 * 48 */}
      <section className={styles.search}>
        <div className={styles.searchContent}>
          {/* 필터 선택박스 */}
          <div className={styles.filterSelect}>
            <SelectBox
              variant="primary"
              theme="light"
              size="medium"
              options={filterOptions}
              defaultValue="all"
              onChange={handleFilterChange}
              className={styles.filterWidth}
            />
          </div>
          
          {/* 검색바 */}
          <div className={styles.searchBar}>
            <Searchbar
              variant="primary"
              theme="light"
              size="medium"
              placeholder="검색어를 입력해 주세요."
              showSearchIcon={true}
              onSearch={handleSearch}
              className={styles.searchWidth}
            />
          </div>
        </div>
          
          {/* 일기쓰기 버튼 */}
          <div className={styles.writeButton}>
            <Button
              variant="primary"
              theme="light"
              size="medium"
              onClick={handleWriteDiary}
              className={styles.buttonWidth}
              startIcon={
                <Image
                  src="/icons/plus_outline_light_m.png"
                  alt="plus icon"
                  width={24}
                  height={24}
                  priority
                />
              }
            >
              일기쓰기
            </Button>
          </div>
        
      </section>
      
      {/* Gap 2: 1168 * 42 */}
      <div className={styles.gap42}></div>
      
      {/* Main 영역: 1168 * 936 */}
      <main className={styles.main}>
        <div className={styles.diaryGrid}>
          {mockDiaryData.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      </main>
      
      {/* Gap 3: 1168 * 40 */}
      <div className={styles.gap40}></div>
      
      {/* Pagination 영역: 1168 * 32 */}
      <section className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="primary"
          theme="light"
          size="medium"
          maxVisiblePages={5}
          showPrevNext={true}
          showFirstLast={false}
          className={styles.paginationWidth}
        />
      </section>
      
      {/* Gap 4: 1168 * 40 */}
      <div className={styles.gap40}></div>
    </div>
  );
};

export default Diaries;
