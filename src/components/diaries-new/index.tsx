"use client"

import React from 'react';
import styles from './styles.module.css';
import { Input } from '../../commons/components/input';
import { Button } from '../../commons/components/button';
import { EmotionType, EMOTION_LIST, getEmotionLabel } from '../../commons/constants/enum';
import { useModalCloseLink } from './hooks/index.link.modal.close.hook';
import { useFormHook } from './hooks/index.form.hook';

const DiariesNew: React.FC = () => {
  // 모달 닫기 훅 사용
  const { openCancelConfirmModal } = useModalCloseLink();
  
  // 폼 훅 사용
  const {
    register,
    handleSubmit,
    errors,
    watchedValues,
    setEmotion,
    isFormValid
  } = useFormHook();

  // 감정 선택 핸들러
  const handleEmotionChange = (emotion: EmotionType) => {
    setEmotion(emotion);
  };

  // 닫기 버튼 핸들러: 등록취소 모달을 부모 위에 오버레이로 띄움
  const handleClose = () => {
    openCancelConfirmModal();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper} data-testid="diaries-new-container">
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>일기 쓰기</h1>
      </div>
      
      {/* 감정 선택 박스 */}
      <div className={styles.emotionBox}>
        <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
        <div className={styles.emotionRadioGroup}>
          {EMOTION_LIST.map((emotion) => (
            <label key={emotion} className={styles.radioLabel}>
              <input
                type="radio"
                name="emotion"
                value={emotion}
                checked={watchedValues.emotion === emotion}
                onChange={() => handleEmotionChange(emotion)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioText}>{getEmotionLabel(emotion)}</span>
            </label>
          ))}
        </div>
        {errors.emotion && (
          <span className={styles.errorMessage}>{errors.emotion.message}</span>
        )}
      </div>
      
      {/* 제목 입력 영역 */}
      <div className={styles.inputTitle}>
        <Input
          label="제목"
          placeholder="제목을 입력합니다."
          {...register('title')}
          variant="primary"
          size="medium"
          theme="light"
          style={{ width: '100%' }}
        />
        {errors.title && (
          <span className={styles.errorMessage}>{errors.title.message}</span>
        )}
      </div>
      
      {/* 내용 입력 영역 */}
      <div className={styles.inputContent}>
        <label className={styles.contentLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          {...register('content')}
          className={styles.contentTextarea}
          rows={6}
        />
        {errors.content && (
          <span className={styles.errorMessage}>{errors.content.message}</span>
        )}
      </div>
      
      {/* 푸터 영역 */}
      <div className={styles.footer}>
        <Button
          type="button"
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleClose}
          style={{ width: '104px' }}
        >
          닫기
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="medium"
          theme="light"
          disabled={!isFormValid}
          style={{ width: '104px' }}
        >
          등록하기
        </Button>
      </div>
    </form>
  );
};

export default DiariesNew;
