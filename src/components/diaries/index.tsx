'use client';

import React from 'react';
import styles from './styles.module.css';
import { SelectBox } from '../../commons/components/selectbox';
import { SearchBar as Searchbar } from '../../commons/components/searchbar';
import { Button } from '../../commons/components/button';
import { Pagination } from '../../commons/components/pagination';
import Image from 'next/image';
import { EmotionType, getEmotionData } from '@/commons/constants/enum';
import { useModalLink } from './hooks/index.link.modal.hook';
import { useDiaryBinding, DiaryData as BindingDiaryData } from './hooks/index.binding.hook';
import { useLinkRouting } from './hooks/index.link.routing.hook';

/**
 * 일기 카드 표시용 데이터 타입
 * 
 * @interface DiaryCardData
 * @property {number} id - 일기 고유 ID
 * @property {EmotionType} emotion - 감정 타입
 * @property {string} date - 표시용 날짜 (YYYY. MM. DD 형식)
 * @property {string} title - 일기 제목
 * @property {string} image - 이미지 경로
 */
interface DiaryCardData {
  id: number;
  emotion: EmotionType;
  date: string;
  title: string;
  image: string;
}

/**
 * 바인딩 데이터를 카드 표시용 데이터로 변환하는 함수
 * 
 * @description
 * 로컬스토리지에서 가져온 원본 데이터를 화면 표시에 적합한 형태로 변환합니다.
 * 날짜 형식을 변환하고 감정에 따른 이미지 경로를 설정합니다.
 * 
 * @param {BindingDiaryData} bindingData - 바인딩된 원본 데이터
 * @returns {DiaryCardData} 카드 표시용 데이터
 */
const convertToCardData = (bindingData: BindingDiaryData): DiaryCardData => {
  const emotionData = getEmotionData(bindingData.emotion);
  
  // createdAt을 YYYY. MM. DD 형식으로 변환
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  return {
    id: bindingData.id,
    emotion: bindingData.emotion,
    date: formatDate(bindingData.createdAt),
    title: bindingData.title,
    image: emotionData.images.medium
  };
};

/**
 * 일기 카드 컴포넌트
 * 
 * @description
 * 개별 일기 데이터를 카드 형태로 표시하는 컴포넌트입니다.
 * 감정에 따른 이미지와 색상을 적용하여 시각적으로 구분합니다.
 * 카드 클릭 시 해당 일기의 상세 페이지로 이동합니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {DiaryCardData} props.diary - 카드에 표시할 일기 데이터
 * @param {Function} props.onCardClick - 카드 클릭 핸들러
 * @returns {JSX.Element} 일기 카드 JSX 요소
 */
const DiaryCard: React.FC<{ 
  diary: DiaryCardData; 
  onCardClick: (diaryId: number) => void;
}> = ({ diary, onCardClick }) => {
  const emotionData = getEmotionData(diary.emotion);
  
  /**
   * 카드 클릭 핸들러
   * 
   * @description
   * 카드 클릭 시 해당 일기의 상세 페이지로 이동합니다.
   * 삭제 버튼 클릭은 이벤트 전파를 막아 페이지 이동을 방지합니다.
   */
  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 삭제 버튼 클릭 시 이벤트 전파 중단
    if ((event.target as HTMLElement).closest('.closeButton')) {
      return;
    }
    
    onCardClick(diary.id);
  };
  
  return (
    <div 
      className={styles.diaryCard}
      onClick={handleCardClick}
    >
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
  
  // 바인딩 훅 사용
  const { diaries, loading, error } = useDiaryBinding();
  
  // 링크 라우팅 훅 사용
  const { navigateToDiaryDetail } = useLinkRouting();
  
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

  // 일기 카드 클릭 핸들러
  const handleDiaryCardClick = (diaryId: number) => {
    navigateToDiaryDetail(diaryId);
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
              data-testid="write-diary-button"
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
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>오류가 발생했습니다: {error}</div>
          ) : diaries.length === 0 ? (
            <div>작성된 일기가 없습니다.</div>
          ) : (
            diaries.map((diary) => (
              <DiaryCard 
                key={diary.id} 
                diary={convertToCardData(diary)} 
                onCardClick={handleDiaryCardClick}
              />
            ))
          )}
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
