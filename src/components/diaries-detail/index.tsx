"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';

import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { getEmotionData } from '@/commons/constants/enum';

import { useDiaryBinding } from './hooks/index.binding.hook';
import { useRetrospectForm, RetrospectData } from './hooks/index.retrospect.form.hook';
import styles from './styles.module.css';

interface DiariesDetailProps {
  diaryId?: string;
}

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
export const DiariesDetail: React.FC<DiariesDetailProps> = ({ diaryId }) => {
  // 실제 데이터 바인딩 훅 사용
  const { diaryData, loading, error } = useDiaryBinding(diaryId);

  // 회고 폼 훅 연동 (diaryData가 없어도 훅은 호출해야 함 - React Hooks Rules)
  // diaryId가 필요하면 diaryId를 직접 전달하고, 없으면 0 또는 기본값 사용
  const { form, isSubmitEnabled, onSubmit } = useRetrospectForm(
    diaryData?.id ? Number(diaryData.id) : Number(diaryId) || 0
  );

  /**
   * 로컬스토리지에서 현재 일기의 회고 목록을 가져옵니다.
   *
   * @description
   * 로컬스토리지의 'retrospects' 데이터에서 현재 diaryId와 일치하는 회고만 필터링합니다.
   * 데이터 조회 실패 시 빈 배열을 반환합니다.
   */
  const retrospectList = useMemo(() => {
    try {
      const data = localStorage.getItem('retrospects');
      const allRetrospects = data ? JSON.parse(data) : [];
      const currentDiaryId = diaryData?.id ? Number(diaryData.id) : Number(diaryId);
      // 현재 diaryId와 일치하는 회고만 필터링
      return allRetrospects.filter(
        (r: RetrospectData) => r.diaryId === currentDiaryId
      );
    } catch (error) {
      console.error('회고 데이터 조회 실패:', error);
      return [];
    }
  }, [diaryData, diaryId]);

  // 로딩 중이거나 에러가 있는 경우 처리
  if (loading) {
    return (
      <div className={styles.container} data-testid="diary-detail-container">
        <div data-testid="diary-loading">로딩 중...</div>
      </div>
    );
  }

  if (error || !diaryData) {
    return (
      <div className={styles.container} data-testid="diary-detail-container">
        <div data-testid="diary-error">오류: {error || '일기 데이터를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  // 감정 데이터 가져오기
  const emotionData = getEmotionData(diaryData.emotion);
  const contentValue = form.watch('content');

  // 내용 복사 핸들러
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(diaryData.content);
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

  // 회고 입력 핸들러 (훅 onSubmit 호출)
  const handleRetrospectSubmit = () => {
    onSubmit();
  };

  return (
    <div className={styles.container} data-testid="diary-detail-container">
      {/* detail-title 영역 */}
      <div className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title} data-testid="diary-title">{diaryData.title}</h1>
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
            <span className={styles.emotionText} data-testid="diary-emotion-text">{emotionData.label}</span>
          </div>
          <div className={styles.dateContainer}>
            <span className={styles.dateText} data-testid="diary-created-at">{diaryData.createdAt}</span>
            <span className={styles.dateLabel}>작성</span>
          </div>
        </div>
      </div>

      {/* detail-content 영역 */}
      <div className={styles.contentSection}>
        <div className={styles.contentArea}>
          <div className={styles.contentLabel}>내용</div>
          <div className={styles.contentText} data-testid="diary-content">{diaryData.content}</div>
        </div>
        <div className={styles.copyContainer}>
          <button className={styles.copyButton} onClick={handleCopyContent} data-testid="copy-button">
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
            value={contentValue}
            onChange={(e) => form.setValue('content', e.target.value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
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
                disabled={!isSubmitEnabled}
              >
                입력
              </Button>
        </div>
      </div>

      {/* retrospect-list 영역 */}
      <div className={styles.retrospectList}>
        {retrospectList.map((retrospect: RetrospectData, index: number) => (
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