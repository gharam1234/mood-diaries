"use client";

import React from 'react';
import Image from 'next/image';

import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { getEmotionData, EmotionType, EMOTION_LIST } from '@/commons/constants/enum';

import { useDiaryBinding } from './hooks/index.binding.hook';
import { useRetrospectForm, RetrospectData } from './hooks/index.retrospect.form.hook';
import { useDiaryUpdateForm } from './hooks/index.update.hook';
import { useDiaryDelete } from './hooks/index.delete.hook';
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

  // 수정 모드 상태
  const [isEditMode, setIsEditMode] = React.useState(false);

  // 회고 목록을 위한 상태
  const [retrospectList, setRetrospectList] = React.useState<RetrospectData[]>([]);

  // 회고 등록 성공 시 상태 업데이트 콜백
  const handleRetrospectSuccess = (newRetrospect: RetrospectData) => {
    setRetrospectList(prev => [...prev, newRetrospect]);
  };

  // 회고 폼 훅 연동 (diaryData가 없어도 훅은 호출해야 함 - React Hooks Rules)
  // diaryId가 필요하면 diaryId를 직접 전달하고, 없으면 0 또는 기본값 사용
  const { form, isSubmitEnabled, onSubmit } = useRetrospectForm(
    diaryData?.id ? Number(diaryData.id) : Number(diaryId) || 0,
    handleRetrospectSuccess
  );

  // 일기 수정 폼 훅
  const {
    form: updateForm,
    isFormValid,
    initializeForm,
    onSubmit: onUpdateSubmit,
    onCancel: onUpdateCancel
  } = useDiaryUpdateForm(
    diaryData?.id ? Number(diaryData.id) : Number(diaryId) || 0,
    () => {
      // 수정 완료 후 처리
      setIsEditMode(false);
      // 데이터 업데이트를 위해 페이지 새로고침
      window.location.reload();
    },
    () => {
      // 수정 취소 처리
      setIsEditMode(false);
    }
  );

  // 일기 삭제 훅
  const {
    openDeleteModal,
  } = useDiaryDelete(diaryData?.id ? Number(diaryData.id) : Number(diaryId) || 0);

  // 회고 데이터 로드
  React.useEffect(() => {
    try {
      const data = localStorage.getItem('retrospects');
      const allRetrospects = data ? JSON.parse(data) : [];
      const currentDiaryId = diaryData?.id ? Number(diaryData.id) : Number(diaryId);
      // 현재 diaryId와 일치하는 회고만 필터링
      const filtered = allRetrospects.filter(
        (r: RetrospectData) => r.diaryId === currentDiaryId
      );
      setRetrospectList(filtered);
    } catch (error) {
      console.error('회고 데이터 조회 실패:', error);
      setRetrospectList([]);
    }
  }, [diaryData, diaryId]);

  // 수정 모드 진입 시 폼 초기화
  React.useEffect(() => {
    if (isEditMode && diaryData) {
      initializeForm(diaryData);
    }
  }, [isEditMode, diaryData, initializeForm]);

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
    setIsEditMode(true);
  };

  // 삭제 버튼 핸들러
  const handleDelete = () => {
    openDeleteModal();
  };

  // 회고 입력 핸들러 (훅 onSubmit 호출)
  const handleRetrospectSubmit = () => {
    onSubmit();
  };

  return (
    <div className={styles.container} data-testid="diary-detail-container">
      {!isEditMode ? (
        // 수정 전 화면 (기존 화면)
        <>
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
                data-testid="delete-button"
              >
                삭제
              </Button>
            </div>
          </div>
        </>
      ) : (
        // 수정 중 화면
        <form className={styles.editForm} data-testid="edit-form" onSubmit={(e) => {
          console.log('[DiariesDetail] Form onSubmit triggered');
          onUpdateSubmit(e);
        }}>
          {/* 감정 선택 영역 */}
          <div className={styles.editEmotionBox}>
            <h2 className={styles.editEmotionTitle}>오늘 기분은 어땠나요?</h2>
            <div className={styles.editEmotionRadioGroup} data-testid="edit-emotion-select">
              {EMOTION_LIST.map((emotion) => (
                <label key={emotion} className={styles.editRadioLabel}>
                  <input
                    type="radio"
                    name="emotion"
                    value={emotion}
                    checked={updateForm.watch('emotion') === emotion}
                    onChange={() => {
                      updateForm.setValue('emotion', emotion as EmotionType, { shouldValidate: true });
                    }}
                    className={styles.editRadioInput}
                  />
                  <span className={styles.editRadioCustom}></span>
                  <span className={styles.editRadioText}>{getEmotionData(emotion).label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 제목 입력 영역 */}
          <div className={styles.titleSection}>
            <div className={styles.editTitleLabel}>제목</div>
            <div className={styles.titleContainer}>
              <Input
                variant="primary"
                theme="light"
                size="medium"
                value={updateForm.watch('title')}
                onChange={(e) => {
                  updateForm.setValue('title', e.target.value, { shouldValidate: true });
                }}
                onBlur={() => updateForm.trigger('title')}
                placeholder="제목을 입력하세요"
                data-testid="edit-title-input"
                style={{ width: '100%', fontSize: '16px' }}
              />
            </div>
          </div>

          {/* 내용 입력 영역 */}
          <div className={styles.contentSection}>
            <div className={styles.editContentLabel}>내용</div>
            <textarea
              className={styles.editContentTextarea}
              value={updateForm.watch('content')}
              onChange={(e) => {
                updateForm.setValue('content', e.target.value, { shouldValidate: true });
              }}
              onBlur={() => updateForm.trigger('content')}
              placeholder="내용을 입력하세요"
              data-testid="edit-content-textarea"
              rows={8}
              style={{
                width: '100%',
                minHeight: '128px',
                padding: '12px',
                border: '1px solid var(--color-border-primary)',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'var(--font-family-default)',
                resize: 'vertical'
              }}
            />
          </div>

          {/* 버튼 영역 - 중앙정렬 */}
          <div className={styles.editButtonContainer}>
            <Button
              type="button"
              variant="secondary"
              theme="light"
              size="medium"
              onClick={onUpdateCancel}
              className={styles.editCancelButton}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              theme="light"
              size="medium"
              disabled={!isFormValid}
              className={styles.editSubmitButton}
            >
              수정 하기
            </Button>
          </div>
        </form>
      )}

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
            style={{ width: '100%' }}
            data-testid="retrospect-input"
            disabled={isEditMode}
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
                disabled={!isSubmitEnabled || isEditMode}
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