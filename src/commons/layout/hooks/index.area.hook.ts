'use client';

import { usePathname } from 'next/navigation';
import { getPageUI } from '../../constants/url';

/**
 * 영역 노출 여부 반환 타입
 */
export interface AreaVisibility {
  /** Header 영역 노출 여부 */
  header: {
    /** Header 전체 노출 여부 */
    visible: boolean;
    /** 로고 노출 여부 */
    logo: boolean;
  };
  /** Banner 영역 노출 여부 */
  banner: boolean;
  /** Navigation 영역 노출 여부 */
  navigation: boolean;
  /** Footer 영역 노출 여부 */
  footer: boolean;
}

/**
 * URL 기반 영역 노출 제어 커스텀 훅
 * 
 * 현재 URL 경로에 따라 각 레이아웃 영역의 노출 여부를 결정합니다.
 * url.ts의 PAGE_CONFIGS를 참조하여 동적으로 UI 컴포넌트 노출을 제어합니다.
 * 
 * @returns {AreaVisibility} 각 영역의 노출 여부 정보
 * @example
 * ```tsx
 * const { header, banner, navigation, footer } = useAreaVisibility();
 * 
 * // 조건부 렌더링에 활용
 * {header.visible && <Header />}
 * {banner && <Banner />}
 * {navigation && <Navigation />}
 * {footer && <Footer />}
 * ```
 */
export const useAreaVisibility = (): AreaVisibility => {
  // Next.js usePathname 훅을 사용하여 현재 경로 가져오기
  const pathname = usePathname();
  
  // url.ts의 getPageUI 함수를 사용하여 현재 경로의 UI 설정 가져오기
  const pageUI = getPageUI(pathname);
  
  return {
    header: {
      visible: pageUI.header.visible,
      logo: pageUI.header.logo,
    },
    banner: pageUI.banner,
    navigation: pageUI.navigation,
    footer: pageUI.footer,
  };
};

/**
 * 개별 영역 노출 여부 확인 유틸리티 함수들
 */

/**
 * Header 영역 노출 여부 확인
 * 
 * @param pathname - 확인할 경로 (선택사항, 미제공시 현재 경로 사용)
 * @returns Header 노출 여부
 * @example
 * ```tsx
 * const isHeaderVisible = useHeaderVisibility('/diaries');
 * const currentHeaderVisible = useHeaderVisibility(); // 현재 경로 기준
 * ```
 */
export const useHeaderVisibility = (pathname?: string): boolean => {
  const currentPathname = usePathname();
  const targetPath = pathname || currentPathname;
  return getPageUI(targetPath).header.visible;
};

/**
 * Banner 영역 노출 여부 확인
 * 
 * @param pathname - 확인할 경로 (선택사항, 미제공시 현재 경로 사용)
 * @returns Banner 노출 여부
 * @example
 * ```tsx
 * const isBannerVisible = useBannerVisibility('/diaries');
 * const currentBannerVisible = useBannerVisibility(); // 현재 경로 기준
 * ```
 */
export const useBannerVisibility = (pathname?: string): boolean => {
  const currentPathname = usePathname();
  const targetPath = pathname || currentPathname;
  return getPageUI(targetPath).banner;
};

/**
 * Navigation 영역 노출 여부 확인
 * 
 * @param pathname - 확인할 경로 (선택사항, 미제공시 현재 경로 사용)
 * @returns Navigation 노출 여부
 * @example
 * ```tsx
 * const isNavigationVisible = useNavigationVisibility('/diaries');
 * const currentNavigationVisible = useNavigationVisibility(); // 현재 경로 기준
 * ```
 */
export const useNavigationVisibility = (pathname?: string): boolean => {
  const currentPathname = usePathname();
  const targetPath = pathname || currentPathname;
  return getPageUI(targetPath).navigation;
};

/**
 * Footer 영역 노출 여부 확인
 * 
 * @param pathname - 확인할 경로 (선택사항, 미제공시 현재 경로 사용)
 * @returns Footer 노출 여부
 * @example
 * ```tsx
 * const isFooterVisible = useFooterVisibility('/diaries');
 * const currentFooterVisible = useFooterVisibility(); // 현재 경로 기준
 * ```
 */
export const useFooterVisibility = (pathname?: string): boolean => {
  const currentPathname = usePathname();
  const targetPath = pathname || currentPathname;
  return getPageUI(targetPath).footer;
};
