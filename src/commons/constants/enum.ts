import { COLOR_PALETTE } from './color';

// 감정 타입 정의
export enum EmotionType {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SURPRISE = 'SURPRISE',
  ETC = 'ETC',
}

// 감정별 이미지 크기 타입
export type EmotionImageSize = 'M' | 'S';

// 감정 데이터 인터페이스
export interface EmotionData {
  type: EmotionType;
  label: string; // 화면에 표시될 텍스트
  color: string; // 해당 감정의 색상
  images: {
    medium: string; // M 사이즈 이미지 경로
    small: string;  // S 사이즈 이미지 경로
  };
}

// 감정별 상세 정보 맵
export const EMOTION_MAP: Record<EmotionType, EmotionData> = {
  [EmotionType.HAPPY]: {
    type: EmotionType.HAPPY,
    label: '행복해요',
    color: COLOR_PALETTE.red.red60,
    images: {
      medium: '/images/emotion-happy-m.png',
      small: '/images/emotion-happy-s.png',
    },
  },
  [EmotionType.SAD]: {
    type: EmotionType.SAD,
    label: '슬퍼요',
    color: COLOR_PALETTE.blue.blue60,
    images: {
      medium: '/images/emotion-sad-m.png',
      small: '/images/emotion-sad-s.png',
    },
  },
  [EmotionType.ANGRY]: {
    type: EmotionType.ANGRY,
    label: '화나요',
    color: COLOR_PALETTE.gray.gray60,
    images: {
      medium: '/images/emotion-angry-m.png',
      small: '/images/emotion-angry-s.png',
    },
  },
  [EmotionType.SURPRISE]: {
    type: EmotionType.SURPRISE,
    label: '놀랐어요',
    color: COLOR_PALETTE.yellow.yellow60,
    images: {
      medium: '/images/emotion-surprise-m.png',
      small: '/images/emotion-surprise-s.png',
    },
  },
  [EmotionType.ETC]: {
    type: EmotionType.ETC,
    label: '기타',
    color: COLOR_PALETTE.green.green60,
    images: {
      medium: '/images/emotion-etc-m.png',
      small: '/images/emotion-etc-s.png',
    },
  },
} as const;

// 모든 감정 타입 배열 (순회용)
export const EMOTION_LIST: EmotionType[] = [
  EmotionType.HAPPY,
  EmotionType.SAD,
  EmotionType.ANGRY,
  EmotionType.SURPRISE,
  EmotionType.ETC,
];

// 유틸리티 함수: 감정 타입으로 데이터 가져오기
export const getEmotionData = (type: EmotionType): EmotionData => {
  return EMOTION_MAP[type];
};

// 유틸리티 함수: 감정 타입으로 라벨 가져오기
export const getEmotionLabel = (type: EmotionType): string => {
  return EMOTION_MAP[type].label;
};

// 유틸리티 함수: 감정 타입으로 색상 가져오기
export const getEmotionColor = (type: EmotionType): string => {
  return EMOTION_MAP[type].color;
};

// 유틸리티 함수: 감정 타입과 크기로 이미지 경로 가져오기
export const getEmotionImage = (type: EmotionType, size: EmotionImageSize = 'M'): string => {
  return size === 'M' ? EMOTION_MAP[type].images.medium : EMOTION_MAP[type].images.small;
};

// 기본 내보내기 (하위 호환성)
export default {
  EmotionType,
  EMOTION_MAP,
  EMOTION_LIST,
  getEmotionData,
  getEmotionLabel,
  getEmotionColor,
  getEmotionImage,
};

