'use client';

import { useRouter, usePathname } from 'next/navigation';
import { PATHS } from '../../constants/url';

/**
 * 링크 라우팅 훅
 * 
 * 네비게이션 메뉴 클릭 시 페이지 이동 및 활성 상태 관리를 제공합니다.
 * - 로고, 일기보관함, 사진보관함 클릭 핸들러
 * - 현재 경로 기반 활성 상태 확인
 * - URL 상수를 활용한 안전한 라우팅
 * 
 * @example
 * ```tsx
 * const { handleLogoClick, isDiariesActive } = useLinkRouting();
 * 
 * <div onClick={handleLogoClick}>로고</div>
 * <div className={isDiariesActive() ? 'active' : 'inactive'}>일기보관함</div>
 * ```
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 페이지 이동 함수
   * 
   * @param path - 이동할 경로 (예: '/diaries', '/pictures')
   * @example
   * ```tsx
   * navigateTo('/diaries'); // 일기목록 페이지로 이동
   * ```
   */
  const navigateTo = (path: string) => {
    router.push(path);
  };

  /**
   * 로고 클릭 핸들러 - 일기목록 페이지로 이동
   */
  const handleLogoClick = () => {
    navigateTo(PATHS.DIARIES.LIST);
  };

  /**
   * 일기보관함 클릭 핸들러 - 일기목록 페이지로 이동
   */
  const handleDiariesClick = () => {
    navigateTo(PATHS.DIARIES.LIST);
  };

  /**
   * 사진보관함 클릭 핸들러 - 사진목록 페이지로 이동
   */
  const handlePicturesClick = () => {
    navigateTo(PATHS.PICTURES.LIST);
  };

  /**
   * 현재 경로가 일기 관련 페이지인지 확인
   * @returns 일기 페이지 여부
   */
  const isDiariesActive = () => {
    return pathname === PATHS.DIARIES.LIST || pathname.startsWith('/diaries/');
  };

  /**
   * 현재 경로가 사진 관련 페이지인지 확인
   * @returns 사진 페이지 여부
   */
  const isPicturesActive = () => {
    return pathname === PATHS.PICTURES.LIST;
  };

  return {
    // 네비게이션 함수들
    navigateTo,
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    
    // 활성 상태 확인 함수들
    isDiariesActive,
    isPicturesActive,
    
    // 현재 경로
    currentPath: pathname,
  };
};
