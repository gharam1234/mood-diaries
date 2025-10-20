import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Dog API 응답 타입 정의
 * 
 * @interface DogApiResponse
 * @property {string[]} message - 강아지 이미지 URL 배열
 * @property {string} status - API 응답 상태
 */
interface DogApiResponse {
  message: string[];
  status: string;
}

/**
 * 강아지 이미지 데이터 타입
 * 
 * @interface DogImage
 * @property {string} id - 강아지 이미지 고유 ID
 * @property {string} imageUrl - 강아지 이미지 URL
 * @property {string} [breed] - 강아지 종 (선택적)
 */
export interface DogImage {
  id: string;
  imageUrl: string;
  breed?: string;
}

/**
 * 강아지 이미지 API 요청 함수
 * 
 * @description
 * dog.ceo API를 통해 랜덤한 강아지 이미지 6개를 가져옵니다.
 * 
 * @returns {Promise<DogApiResponse>} API 응답 데이터
 * @throws {Error} API 요청 실패 시 에러 발생
 */
const fetchDogImages = async (): Promise<DogApiResponse> => {
  const response = await fetch('https://dog.ceo/api/breeds/image/random/6');
  
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  
  return response.json();
};

/**
 * 강아지 이미지 데이터를 변환하는 함수
 * 
 * @description
 * API 응답 데이터를 컴포넌트에서 사용할 수 있는 형태로 변환합니다.
 * 각 이미지 URL에서 강아지 종을 추출하고 고유 ID를 생성합니다.
 * 
 * @param {DogApiResponse} apiResponse - API 응답 데이터
 * @returns {DogImage[]} 변환된 강아지 이미지 데이터 배열
 */
const transformDogImages = (apiResponse: DogApiResponse): DogImage[] => {
  return apiResponse.message.map((imageUrl, index) => ({
    id: `dog-${Date.now()}-${index}`,
    imageUrl,
    breed: extractBreedFromUrl(imageUrl)
  }));
};

/**
 * URL에서 강아지 종을 추출하는 함수
 * 
 * @description
 * dog.ceo API의 이미지 URL에서 강아지 종 정보를 추출합니다.
 * 
 * @param {string} url - 강아지 이미지 URL
 * @returns {string} 추출된 강아지 종 또는 'unknown'
 */
const extractBreedFromUrl = (url: string): string => {
  const match = url.match(/breeds\/([^\/]+)\//);
  return match ? match[1] : 'unknown';
};

/**
 * 무한스크롤을 위한 강아지 이미지 조회 훅
 * 
 * @description
 * @tanstack/react-query의 useInfiniteQuery를 사용하여 강아지 이미지를 무한스크롤로 조회합니다.
 * 페이지네이션, 캐싱, 에러 처리, 재시도 로직을 포함합니다.
 * 
 * @returns {Object} 훅 반환 객체
 * @returns {DogImage[]} dogImages - 모든 페이지의 강아지 이미지 데이터
 * @returns {Error | null} error - 에러 객체
 * @returns {boolean} isLoading - 초기 로딩 상태
 * @returns {boolean} isError - 에러 상태
 * @returns {boolean} isFetching - 데이터 페칭 상태
 * @returns {boolean} isFetchingNextPage - 다음 페이지 페칭 상태
 * @returns {boolean} hasNextPage - 다음 페이지 존재 여부
 * @returns {Function} fetchNextPage - 다음 페이지 페치 함수
 * @returns {Function} refetch - 데이터 재페치 함수
 */
export const useDogImages = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['dogImages'],
    queryFn: fetchDogImages,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 페이지 번호를 기반으로 다음 페이지 파라미터 반환
      return allPages.length < 10 ? allPages.length + 1 : undefined; // 최대 10페이지까지만
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
    retry: (failureCount, error) => {
      // 네트워크 오류나 특정 에러의 경우 재시도하지 않음
      if (error?.message?.includes('failed') || error?.message?.includes('aborted')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const allDogImages: DogImage[] = data?.pages.flatMap(page => 
    transformDogImages(page)
  ) ?? [];

  return {
    dogImages: allDogImages,
    error,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch
  };
};

/**
 * 스크롤 위치를 확인하여 추가 로드가 필요한지 판단하는 훅
 * 
 * @description
 * 페이지 스크롤 위치를 모니터링하여 무한스크롤 트리거를 관리합니다.
 * 스크롤이 하단 근처에 도달했을 때 다음 페이지를 로드합니다.
 * 
 * @param {Function} fetchNextPage - 다음 페이지 페치 함수
 * @param {boolean} hasNextPage - 다음 페이지 존재 여부
 * @param {boolean} isFetchingNextPage - 다음 페이지 페칭 상태
 * @returns {Object} 훅 반환 객체
 * @returns {Function} handleScroll - 스크롤 이벤트 핸들러
 */
export const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean
) => {
  const handleScroll = () => {
    // 페이지 전체 스크롤 위치 확인
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    // 스크롤이 하단 근처(마지막 2개 아이템 높이만큼)에 도달했을 때
    const threshold = clientHeight * 0.8; // 화면 높이의 80% 지점
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return { handleScroll };
};
