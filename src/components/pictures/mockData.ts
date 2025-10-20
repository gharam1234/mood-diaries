/**
 * Pictures 컴포넌트용 Mock 데이터
 * 강아지 사진 데이터를 생성합니다.
 */

// 필터 옵션 데이터
export const filterOptions = [
  { value: 'all', label: '전체' },
  { value: 'golden-retriever', label: '골든 리트리버' },
  { value: 'labrador', label: '래브라도' },
  { value: 'husky', label: '허스키' },
  { value: 'poodle', label: '푸들' },
  { value: 'bulldog', label: '불독' },
  { value: 'beagle', label: '비글' },
  { value: 'chihuahua', label: '치와와' },
];

// 강아지 사진 데이터 타입 정의
export interface DogPicture {
  id: string;
  breed: string;
  name: string;
  age: number;
  imageUrl: string;
  description: string;
}

// Mock 강아지 사진 데이터 생성
export const generateMockDogPictures = (count: number = 20): DogPicture[] => {
  const breeds = [
    'golden-retriever', 'labrador', 'husky', 'poodle', 
    'bulldog', 'beagle', 'chihuahua', 'maltese', 'shiba', 'corgi'
  ];
  
  const names = [
    '멍멍이', '뽀삐', '초코', '바둑이', '나비', '별이', '하늘이', '구름이',
    '해피', '럭키', '스마일', '포도', '사과', '딸기', '바나나', '오렌지',
    '레몬', '체리', '복숭아', '수박', '키위', '망고', '파인애플', '자두'
  ];
  
  const descriptions = [
    '사랑스러운 강아지입니다', '활발하고 건강한 강아지', '친근하고 순한 성격',
    '장난꾸러기 강아지', '똑똑하고 영리한 강아지', '사교적인 성격의 강아지',
    '온순하고 착한 강아지', '에너지 넘치는 강아지', '귀엽고 사랑스러운 강아지',
    '충성스러운 강아지', '재미있고 장난스러운 강아지', '사랑받는 강아지'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `dog-${index + 1}`,
    breed: breeds[index % breeds.length],
    name: names[index % names.length],
    age: Math.floor(Math.random() * 10) + 1, // 1-10세
    imageUrl: '/images/dog-1.jpg', // 요구사항에 따라 모든 사진을 동일한 Mock 사진으로 통일
    description: descriptions[index % descriptions.length]
  }));
};

// 기본 Mock 데이터
export const mockDogPictures = generateMockDogPictures(20);
