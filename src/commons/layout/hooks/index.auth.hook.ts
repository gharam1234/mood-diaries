'use client';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import { PATHS } from '@/commons/constants/url';
import { useRouter } from 'next/navigation';

/**
 * 레이아웃 인증 관련 훅
 * 인증 상태에 따른 UI 분기 및 인증 관련 기능을 제공합니다.
 */
export const useAuthHook = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  /**
   * 로그인 버튼 클릭 핸들러
   * 로그인 페이지로 이동합니다.
   */
  const handleLoginClick = () => {
    router.push(PATHS.AUTH.LOGIN);
  };

  /**
   * 로그아웃 버튼 클릭 핸들러
   * 인증 프로바이더의 로그아웃 기능을 호출합니다.
   */
  const handleLogoutClick = () => {
    logout();
  };

  /**
   * 현재 로그인 상태를 반환합니다.
   */
  const getAuthStatus = () => ({
    isLoggedIn,
    userName: user?.name || '',
    userEmail: user?.email || '',
  });

  return {
    // 인증 상태
    isLoggedIn,
    userName: user?.name || '',
    
    // 이벤트 핸들러
    handleLoginClick,
    handleLogoutClick,
    
    // 유틸리티 함수
    getAuthStatus,
  };
};
