/**
 * URL 경로 및 페이지 설정 관리
 * 
 * 각 페이지별 URL 경로, 접근 권한, UI 컴포넌트 노출 여부를 중앙 관리합니다.
 */

// 접근 권한 타입
export type AccessType = 'PUBLIC' | 'PRIVATE';

// 페이지 설정 타입
export interface PageConfig {
  path: string;
  access: AccessType;
  ui: {
    header: {
      visible: boolean;
      logo: boolean;
      darkModeToggle: boolean;
    };
    banner: boolean;
    navigation: boolean;
    footer: boolean;
  };
}

// URL 경로 상수
export const PATHS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  
  // 일기 관련
  DIARIES: {
    LIST: '/diaries',
    DETAIL: (id: string | number) => `/diaries/${id}`,
    DETAIL_PATTERN: '/diaries/[id]',
  },
  
  // 사진 관련
  PICTURES: {
    LIST: '/pictures',
  },
} as const;

// 페이지별 설정
export const PAGE_CONFIGS: Record<string, PageConfig> = {
  // 로그인 페이지
  [PATHS.AUTH.LOGIN]: {
    path: PATHS.AUTH.LOGIN,
    access: 'PUBLIC', // 누구나
    ui: {
      header: {
        visible: false,
        logo: false,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  
  // 회원가입 페이지
  [PATHS.AUTH.SIGNUP]: {
    path: PATHS.AUTH.SIGNUP,
    access: 'PUBLIC', // 누구나
    ui: {
      header: {
        visible: false,
        logo: false,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  
  // 일기목록 페이지
  [PATHS.DIARIES.LIST]: {
    path: PATHS.DIARIES.LIST,
    access: 'PUBLIC', // 누구나
    ui: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
  
  // 일기상세 페이지 (다이나믹 라우팅)
  [PATHS.DIARIES.DETAIL_PATTERN]: {
    path: PATHS.DIARIES.DETAIL_PATTERN,
    access: 'PRIVATE', // 회원전용
    ui: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: true,
    },
  },
  
  // 사진목록 페이지
  [PATHS.PICTURES.LIST]: {
    path: PATHS.PICTURES.LIST,
    access: 'PUBLIC', // 누구나
    ui: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
};

/**
 * 현재 경로의 페이지 설정 가져오기
 * @param pathname - 현재 페이지 경로
 * @returns 페이지 설정 또는 기본 설정
 */
export const getPageConfig = (pathname: string): PageConfig => {
  // 정확한 경로 매칭
  if (PAGE_CONFIGS[pathname]) {
    return PAGE_CONFIGS[pathname];
  }
  
  // 다이나믹 라우팅 경로 매칭
  if (pathname.startsWith('/diaries/') && pathname !== '/diaries') {
    return PAGE_CONFIGS[PATHS.DIARIES.DETAIL_PATTERN];
  }
  
  // 기본 설정 반환
  return {
    path: pathname,
    access: 'PUBLIC',
    ui: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  };
};

/**
 * 페이지 접근 권한 확인
 * @param pathname - 확인할 페이지 경로
 * @returns 접근 권한 타입
 */
export const getPageAccess = (pathname: string): AccessType => {
  const config = getPageConfig(pathname);
  return config.access;
};

/**
 * 페이지 UI 컴포넌트 노출 여부 확인
 * @param pathname - 확인할 페이지 경로
 * @returns UI 컴포넌트 노출 설정
 */
export const getPageUI = (pathname: string) => {
  const config = getPageConfig(pathname);
  return config.ui;
};

