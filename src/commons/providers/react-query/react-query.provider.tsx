'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * React Query를 위한 Provider 컴포넌트
 * - 서버 상태 관리 및 클라이언트 캐싱 제공
 * - 자동 배경 refetch 및 캐시 무효화
 * - 네트워크 상태 기반 스마트 재요청
 */
export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  // QueryClient 인스턴스를 useState로 생성하여 리렌더링 시에도 동일한 인스턴스 유지
  const [queryClient] = useState(() => 
    new QueryClient({
      defaultOptions: {
        queries: {
          // 5분 동안 데이터를 fresh 상태로 유지
          staleTime: 5 * 60 * 1000,
          // 10분 후 가비지 컬렉션
          gcTime: 10 * 60 * 1000,
          // 에러 시 3번까지 재시도
          retry: 3,
          // 윈도우 포커스 시 자동 refetch
          refetchOnWindowFocus: false,
        },
        mutations: {
          // 뮤테이션 에러 시 1번 재시도
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
