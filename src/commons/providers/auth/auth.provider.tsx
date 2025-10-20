'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/commons/constants/url';

// 사용자 정보 타입 정의
interface User {
  id: string | number;
  email: string;
  name: string;
  [key: string]: unknown; // 추가 필드 허용
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  // 로그인 상태
  isLoggedIn: boolean;
  
  // 로그인 유저 정보
  user: User | null;
  
  // 로그인 함수
  login: (userData: User, accessToken: string) => void;
  
  // 로그아웃 함수
  logout: () => void;
  
  // 로그인 상태 검증 함수
  checkAuthStatus: () => boolean;
  
  // 로그인 유저 정보 조회 함수
  getUserInfo: () => User | null;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 인증 프로바이더 컴포넌트
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // 로그인 상태 검증 함수
  const checkAuthStatus = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const accessToken = localStorage.getItem('accessToken');
    const hasToken = !!accessToken;
    
    setIsLoggedIn(hasToken);
    return hasToken;
  };

  // 로그인 유저 정보 조회 함수
  const getUserInfo = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        return null;
      }
    }
    return null;
  };

  // 로그인 함수
  const login = (userData: User, accessToken: string): void => {
    if (typeof window === 'undefined') return;
    
    // 로컬스토리지에 토큰과 사용자 정보 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // 상태 업데이트
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 로그아웃 함수
  const logout = (): void => {
    if (typeof window === 'undefined') return;
    
    // 로컬스토리지에서 토큰과 사용자 정보 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // 상태 초기화
    setUser(null);
    setIsLoggedIn(false);
    
    // 로그인 페이지로 이동
    router.push(PATHS.AUTH.LOGIN);
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
    getUserInfo();
  }, []);

  // 로그인 상태 변경 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        checkAuthStatus();
        getUserInfo();
      }
    };

    // 로컬스토리지 변경 감지
    window.addEventListener('storage', handleStorageChange);
    
    // 정리 함수
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 컨텍스트 값
  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuthStatus,
    getUserInfo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 인증 컨텍스트 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  
  return context;
};

// 기본 내보내기
export default AuthProvider;
