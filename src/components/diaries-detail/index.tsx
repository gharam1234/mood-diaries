"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { EmotionType, getEmotionData } from '@/commons/constants/enum';
import styles from './styles.module.css';

// Mock 데이터 인터페이스
interface DiaryDetailData {
  id: string;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

// 회고 데이터 인터페이스
interface RetrospectData {
  id: string;
  content: string;
  createdAt: string;
}

// Mock 데이터
const mockDiaryData: DiaryDetailData = {
  id: '1',
  title: '이것은 타이틀 입니다.',
  content: '내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다',
  emotion: EmotionType.HAPPY,
  createdAt: '2024. 07. 12',
};

// Mock 회고 데이터
const mockRetrospectData: RetrospectData[] = [
  {
    id: '1',
    content: '3년이 지나고 다시 보니 이때가 그립다.',
    createdAt: '2024. 09. 24'
  },
  {
    id: '2',
    content: '3년이 지나고 다시 보니 이때가 그립다.',
    createdAt: '2024. 09. 24'
  }
];

/**
 * DiariesDetail 컴포넌트
 * 
 * 일기 상세 페이지를 렌더링하는 컴포넌트입니다.
 * - detail-title: 제목, 감정 아이콘/텍스트, 작성일
 * - detail-content: 내용 레이블, 내용 텍스트, 복사 버튼
 * - detail-footer: 수정/삭제 버튼
 * - retrospect-input: 회고 입력 영역
 * - retrospect-list: 회고 목록 영역
 */
export const DiariesDetail: React.FC = () => {
  const emotionData = getEmotionData(mockDiaryData.emotion);
  const [retrospectInput, setRetrospectInput] = useState('');
  const [retrospectList, setRetrospectList] = useState<RetrospectData[]>(mockRetrospectData);

  // 내용 복사 핸들러
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(mockDiaryData.content);
      alert('내용이 복사되었습니다.');
    } catch (error) {
      console.error('복사 실패:', error);
      alert('복사에 실패했습니다.');
    }
  };

  // 수정 버튼 핸들러
  const handleEdit = () => {
    console.log('수정 버튼 클릭');
    // TODO: 수정 페이지로 이동 로직 구현
  };

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    console.log('삭제 버튼 클릭');
    // TODO: 삭제 확인 모달 및 삭제 로직 구현
  };

  // 회고 입력 핸들러
  const handleRetrospectSubmit = () => {
    if (retrospectInput.trim()) {
      const newRetrospect: RetrospectData = {
        id: Date.now().toString(),
        content: retrospectInput.trim(),
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '. ').replace(/\.$/, '')
      };
      setRetrospectList(prev => [newRetrospect, ...prev]);
      setRetrospectInput('');
    }
  };

  return (
    <div className={styles.container}>
      {/* detail-title 영역 */}
      <div className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{mockDiaryData.title}</h1>
        </div>
        <div className={styles.emotionAndDate}>
          <div className={styles.emotionContainer}>
            <div className={styles.emotionIcon}>
              <Image
                src={emotionData.images.small}
                alt={emotionData.label}
                width={32}
                height={32}
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <span className={styles.emotionText}>{emotionData.label}</span>
          </div>
          <div className={styles.dateContainer}>
            <span className={styles.dateText}>{mockDiaryData.createdAt}</span>
            <span className={styles.dateLabel}>작성</span>
          </div>
        </div>
      </div>

      {/* detail-content 영역 */}
      <div className={styles.contentSection}>
        <div className={styles.contentArea}>
          <div className={styles.contentLabel}>내용</div>
          <div className={styles.contentText}>{mockDiaryData.content}</div>
        </div>
        <div className={styles.copyContainer}>
          <button className={styles.copyButton} onClick={handleCopyContent}>
            <Image
              src="/icons/copy_outline_light_m.svg"
              alt="복사"
              width={24}
              height={24}
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className={styles.copyText}>내용 복사</span>
          </button>
        </div>
      </div>

      {/* detail-footer 영역 */}
      <div className={styles.detailFooter}>
        <div className={styles.buttonContainer}>
          <Button
            variant="secondary"
            theme="light"
            size="medium"
            className={styles.editButton}
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button
            variant="secondary"
            theme="light"
            size="medium"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* retrospect-input 영역 */}
      <div className={styles.retrospectInput}>
        <div className={styles.retrospectLabel}>회고</div>
        <div className={styles.retrospectInputContainer}>
          <Input
            variant="primary"
            theme="light"
            size="medium"
            placeholder="회고를 남겨보세요."
            value={retrospectInput}
            onChange={(e) => setRetrospectInput(e.target.value)}
            style={{ width: '1081px' }}
            // endButton={
            //   <Button
            //     variant="primary"
            //     theme="light"
            //     size="medium"
            //     onClick={handleRetrospectSubmit}
            //     style={{ width: '51px' }}
            //   >
            //     입력
            //   </Button>
            // }
            // 회고칸과 입력사이에 갭이 16px 적용시키기 위해 따로 분리 함
          />
          <Button
                variant="primary"
                theme="light"
                size="medium"
                onClick={handleRetrospectSubmit}
                style={{ width: '51px' }}
              >
                입력
              </Button>
        </div>
      </div>

      {/* retrospect-list 영역 */}
      <div className={styles.retrospectList}>
        {retrospectList.map((retrospect, index) => (
          <div key={retrospect.id} className={styles.retrospectItem}>
            <div className={styles.retrospect}>
              <div className={styles.retrospectContent}>{retrospect.content}</div>
              <div className={styles.retrospectDate}>[{retrospect.createdAt}]</div>
            </div>
            {index < retrospectList.length - 1 && <div className={styles.retrospectDivider} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiariesDetail;