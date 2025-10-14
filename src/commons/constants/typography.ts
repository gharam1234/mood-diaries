// 폰트 패밀리 정의
export const FONT_FAMILIES = {
  korean: "'Pretendard', sans-serif", // 한국어용 폰트
  english: "'SUIT Variable', sans-serif", // 영어/숫자용 폰트
};

// 폰트 두께 정의
export const FONT_WEIGHTS = {
  extraBold: 800,
  bold: 700,
  semiBold: 600,
  medium: 500,
  regular: 400,
};

// 타이포그래피 스타일 정의 (Figma Typography01 기준)
export const TYPOGRAPHY = {
  // 웹 헤드라인 (데스크톱/웹 전용, 한국어 폰트)
  webHeadline01: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '48px',
    lineHeight: '60px',
  },
  webHeadline02: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '36px',
    lineHeight: '48px',
  },
  webHeadline03: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '28px',
    lineHeight: '36px',
  },

  // 헤드라인 (모바일/데스크톱 공통, 한국어 폰트)
  headline01: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: '24px',
    lineHeight: '32px',
  },
  headline02: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.extraBold,
    fontSize: '22px',
    lineHeight: '30px',
  },
  headline03: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: '20px',
    lineHeight: '28px',
  },

  // 타이틀 (한국어 폰트)
  title01: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: '18px',
    lineHeight: '24px',
  },
  title02: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: '16px',
    lineHeight: '22px',
  },
  title03: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: '14px',
    lineHeight: '20px',
  },

  // 서브 타이틀 (한국어 폰트)
  subTitle01: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '14px',
    lineHeight: '22px',
  },
  subTitle02: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '12px',
    lineHeight: '18px',
  },

  // 본문 - Medium (한국어 폰트)
  body01: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: '16px',
    lineHeight: '24px',
  },
  body02_m: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: '14px',
    lineHeight: '22px',
  },
  body03: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: '12px',
    lineHeight: '18px',
  },

  // 본문 - Regular (한국어 폰트)
  body01_regular: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: '16px',
    lineHeight: '22px',
  },
  body02_s_regular: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: '14px',
    lineHeight: '20px',
  },
  body03_regular: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.regular,
    fontSize: '12px',
    lineHeight: '16px',
  },

  // 캡션 (한국어 폰트)
  caption01: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '12px',
    lineHeight: '14px',
  },
  caption02_m: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '10px',
    lineHeight: '12px',
  },
  caption02_s: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: '10px',
    lineHeight: '12px',
  },
  caption03: {
    fontFamily: FONT_FAMILIES.korean,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: '8px',
    lineHeight: '10px',
  },
};

// 타입 정의
export type FontFamiliesType = keyof typeof FONT_FAMILIES;
export type FontWeightsType = keyof typeof FONT_WEIGHTS;
export type TypographyStyle = keyof typeof TYPOGRAPHY;
