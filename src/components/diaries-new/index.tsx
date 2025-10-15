"use client"

import React, { useState } from 'react';
import styles from './styles.module.css';
import { Input } from '../../commons/components/input';
import { Button } from '../../commons/components/button';
import { EmotionType, EMOTION_LIST, getEmotionLabel } from '../../commons/constants/enum';
import { useModal } from '../../commons/providers/modal/modal.provider';

const DiariesNew: React.FC = () => {
  // 모달 훅 사용
  const { closeTop } = useModal();
  
  // 선택된 감정 상태 관리
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  // 제목 입력 상태 관리
  const [title, setTitle] = useState('');
  // 내용 입력 상태 관리
  const [content, setContent] = useState('');

  // 감정 선택 핸들러
  const handleEmotionChange = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  // 닫기 버튼 핸들러
  const handleClose = () => {
    closeTop();
  };

  // 등록하기 버튼 핸들러
  const handleSubmit = () => {
    // TODO: 등록 로직 구현
    console.log('등록하기 버튼 클릭', {
      emotion: selectedEmotion,
      title,
      content
    });
    
    // 등록 후 모달 닫기
    closeTop();
  };

  return (
    <div className={styles.wrapper}>
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
                checked={selectedEmotion === emotion}
                onChange={() => handleEmotionChange(emotion)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom}></span>
              <span className={styles.radioText}>{getEmotionLabel(emotion)}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* 제목 입력 영역 */}
      <div className={styles.inputTitle}>
        <Input
          label="제목"
          placeholder="제목을 입력합니다."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="primary"
          size="medium"
          theme="light"
          style={{ width: '100%' }}
        />
      </div>
      
      {/* 내용 입력 영역 */}
      <div className={styles.inputContent}>
        <label className={styles.contentLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.contentTextarea}
          rows={6}
        />
      </div>
      
      {/* 푸터 영역 */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleClose}
          style={{ width: '104px' }}
        >
          닫기
        </Button>
        <Button
          variant="primary"
          size="medium"
          theme="light"
          onClick={handleSubmit}
          style={{ width: '104px' }}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default DiariesNew;
