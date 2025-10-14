// Color Foundation - 피그마 디자인 시스템 기반
// 모든 색상은 토큰화되어 라이트/다크 모드를 지원합니다

export const COLOR_PALETTE = {
  // Blue Scale
  blue: {
    blue05: '#F0F7FF',
    blue10: '#DBEEFF',
    blue20: '#BDDBFF',
    blue30: '#93BEFF',
    blue40: '#6DA5FA', // System color
    blue50: '#497CFF',
    blue60: '#3A5CF3', // System color
    blue70: '#274AE1',
    blue80: '#1530A6',
    blue90: '#0B2184',
  },
  
  // Gray Scale
  gray: {
    white: '#FFFFFF',
    gray05: '#F2F2F2',
    gray10: '#E4E4E4',
    gray20: '#D4D3D3',
    gray30: '#C7C7C7',
    gray40: '#ABABAB',
    gray50: '#919191',
    gray60: '#777777',
    gray70: '#5F5F5F',
    gray80: '#333333',
    gray90: '#1C1C1C',
    black: '#000000',
  },
  
  // Red Scale
  red: {
    red05: '#FDD7DC',
    red10: '#F797A4',
    red20: '#F4677A',
    red30: '#F03851', // Error color
    red40: '#E4112E',
    red50: '#B40E24',
    red60: '#850A1B',
  },
  
  // Green Scale
  green: {
    green05: '#D3F3E0',
    green10: '#92E6B9',
    green20: '#15D66F',
    green30: '#12B75F', // Success color
    green40: '#109C51',
    green50: '#0E723C',
    green60: '#084424',
  },
  
  // Yellow Scale
  yellow: {
    yellow05: '#FFE499',
    yellow10: '#FFD666',
    yellow20: '#FFC933',
    yellow30: '#FFB300',
    yellow40: '#EBA500',
    yellow50: '#D69600',
    yellow60: '#B27D00',
  },
  
  // Cool Gray Scale
  coolGray: {
    coolGray01: '#F8F8FA',
    coolGray05: '#F6F6F9',
    coolGray10: '#EDEEF2',
    coolGray20: '#DDDFE5',
    coolGray30: '#D2D4DD',
    coolGray40: '#C7C9D5',
    coolGray50: '#BBBECD',
    coolGray60: '#B0B3C4',
  },

  // Gradients
  gradient: {
    // Primary Gradient (추가 231107)
    primary: 'linear-gradient(135deg, #6DA5FA 0%, #92EAF5 100%)',
    // Skeleton Gradient (Light Mode)
    skeletonLight: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
    // Skeleton Gradient (Dark Mode)
    skeletonDark: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
  },
} as const;

// 시맨틱 컬러 토큰 (라이트 모드)
export const LIGHT_THEME_COLORS = {
  // Primary colors
  primary: COLOR_PALETTE.green.green30, // #12B75F
  secondary: COLOR_PALETTE.yellow.yellow30, // #FFB300
  
  // Background colors
  background: {
    primary: COLOR_PALETTE.gray.white, // #FFFFFF
    secondary: COLOR_PALETTE.gray.gray05, // #F2F2F2
    tertiary: COLOR_PALETTE.coolGray.coolGray05, // #F6F6F9
    accent: COLOR_PALETTE.blue.blue05, // #F0F7FF
  },
  
  // Text colors
  text: {
    primary: COLOR_PALETTE.gray.black, // #000000
    secondary: COLOR_PALETTE.gray.gray60, // #777777
    tertiary: COLOR_PALETTE.gray.gray50, // #919191
    disabled: COLOR_PALETTE.gray.gray40, // #ABABAB
    inverse: COLOR_PALETTE.gray.white, // #FFFFFF
  },
  
  // Border colors
  border: {
    primary: COLOR_PALETTE.gray.gray20, // #D4D3D3
    secondary: COLOR_PALETTE.gray.gray10, // #E4E4E4
    tertiary: COLOR_PALETTE.coolGray.coolGray20, // #DDDFE5
  },
  
  // Status colors
  status: {
    success: COLOR_PALETTE.green.green30, // #12B75F
    error: COLOR_PALETTE.red.red30, // #F03851
    warning: COLOR_PALETTE.yellow.yellow30, // #FFB300
    info: COLOR_PALETTE.blue.blue60, // #3A5CF3
  },
  
  // Interactive colors
  interactive: {
    primary: COLOR_PALETTE.blue.blue60, // #3A5CF3
    primaryHover: COLOR_PALETTE.blue.blue70, // #274AE1
    primaryActive: COLOR_PALETTE.blue.blue80, // #1530A6
    secondary: COLOR_PALETTE.blue.blue40, // #6DA5FA
    disabled: COLOR_PALETTE.gray.gray30, // #C7C7C7
  },

  // Gradients
  gradient: {
    primary: COLOR_PALETTE.gradient.primary,
    skeleton: COLOR_PALETTE.gradient.skeletonLight,
  },
} as const;

// 시맨틱 컬러 토큰 (다크 모드)
export const DARK_THEME_COLORS = {
  // Primary colors
  primary: COLOR_PALETTE.green.green20, // 다크모드에서 더 밝은 그린 사용
  secondary: COLOR_PALETTE.yellow.yellow30, // #FFB300
  
  // Background colors
  background: {
    primary: COLOR_PALETTE.gray.black, // #000000
    secondary: COLOR_PALETTE.gray.gray90, // #1C1C1C
    tertiary: COLOR_PALETTE.gray.gray80, // #333333
    accent: COLOR_PALETTE.blue.blue90, // #0B2184
  },
  
  // Text colors
  text: {
    primary: COLOR_PALETTE.gray.white, // #FFFFFF
    secondary: COLOR_PALETTE.gray.gray30, // #C7C7C7
    tertiary: COLOR_PALETTE.gray.gray40, // #ABABAB
    disabled: COLOR_PALETTE.gray.gray60, // #777777
    inverse: COLOR_PALETTE.gray.black, // #000000
  },
  
  // Border colors
  border: {
    primary: COLOR_PALETTE.gray.gray70, // #5F5F5F
    secondary: COLOR_PALETTE.gray.gray80, // #333333
    tertiary: COLOR_PALETTE.gray.gray90, // #1C1C1C
  },
  
  // Status colors
  status: {
    success: COLOR_PALETTE.green.green20, // 다크모드에서 더 밝은 색상
    error: COLOR_PALETTE.red.red20, // 다크모드에서 더 밝은 색상
    warning: COLOR_PALETTE.yellow.yellow20, // 다크모드에서 더 밝은 색상
    info: COLOR_PALETTE.blue.blue40, // 다크모드에서 더 밝은 색상
  },
  
  // Interactive colors
  interactive: {
    primary: COLOR_PALETTE.blue.blue40, // #6DA5FA
    primaryHover: COLOR_PALETTE.blue.blue30, // #93BEFF
    primaryActive: COLOR_PALETTE.blue.blue20, // #BDDBFF
    secondary: COLOR_PALETTE.blue.blue50, // #497CFF
    disabled: COLOR_PALETTE.gray.gray70, // #5F5F5F
  },

  // Gradients
  gradient: {
    primary: COLOR_PALETTE.gradient.primary,
    skeleton: COLOR_PALETTE.gradient.skeletonDark,
  },
} as const;

// 전체 컬러 시스템
export const COLORS = {
  light: LIGHT_THEME_COLORS,
  dark: DARK_THEME_COLORS,
  palette: COLOR_PALETTE,
} as const;

// 타입 정의
export type ColorMode = 'light' | 'dark';
export type ColorPalette = typeof COLOR_PALETTE;
export type LightThemeColors = typeof LIGHT_THEME_COLORS;
export type DarkThemeColors = typeof DARK_THEME_COLORS;
export type ThemeColors = LightThemeColors | DarkThemeColors;

// 유틸리티 함수: 테마에 따른 색상 가져오기
export const getThemeColors = (mode: ColorMode): ThemeColors => {
  return mode === 'light' ? LIGHT_THEME_COLORS : DARK_THEME_COLORS;
};

// 기본 내보내기 (하위 호환성)
export default COLORS;
