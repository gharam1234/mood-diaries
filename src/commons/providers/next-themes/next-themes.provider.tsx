'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface NextThemesProviderProps {
  children: ReactNode;
}

/**
 * Next.js 애플리케이션의 테마 관리를 위한 Provider 컴포넌트
 * - 다크/라이트 테마 지원
 * - 시스템 테마 자동 감지
 * - 테마 전환 애니메이션 지원
 */
export const NextThemesProvider = ({ children }: NextThemesProviderProps) => {
  return (
    <ThemeProvider
      attribute="class" // 테마 적용 방식 (CSS class 사용)
      defaultTheme="system" // 기본 테마 설정 (시스템 설정 따름)
      enableSystem // 시스템 테마 감지 활성화
      disableTransitionOnChange={false} // 테마 변경 시 전환 애니메이션 활성화
    >
      {children}
    </ThemeProvider>
  );
};
