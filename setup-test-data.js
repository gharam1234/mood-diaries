// 테스트용 일기 데이터 설정 스크립트
const testData = [
  {
    id: 1,
    title: "오늘의 기쁜 일",
    content: "오늘은 정말 기쁜 일이 있었어요. 새로운 친구를 만났습니다.",
    emotion: "HAPPY",
    createdAt: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    title: "슬픈 하루",
    content: "오늘은 조금 슬펐어요. 좋아하던 영화가 끝났습니다.",
    emotion: "SAD",
    createdAt: "2024-01-16T14:20:00.000Z"
  },
  {
    id: 3,
    title: "화나는 일",
    content: "오늘은 정말 화가 났어요. 버스를 놓쳤습니다.",
    emotion: "ANGRY",
    createdAt: "2024-01-17T08:45:00.000Z"
  },
  {
    id: 4,
    title: "놀라운 발견",
    content: "오늘은 정말 놀라운 일이 있었어요. 오래된 친구를 만났습니다.",
    emotion: "SURPRISE",
    createdAt: "2024-01-18T16:10:00.000Z"
  },
  {
    id: 5,
    title: "특별한 하루",
    content: "오늘은 특별한 하루였어요. 새로운 취미를 시작했습니다.",
    emotion: "ETC",
    createdAt: "2024-01-19T12:00:00.000Z"
  }
];

// 로컬스토리지에 데이터 저장
if (typeof window !== 'undefined') {
  localStorage.setItem('diaries', JSON.stringify(testData));
  console.log('테스트 데이터가 로컬스토리지에 저장되었습니다:', testData);
} else {
  console.log('브라우저 환경이 아닙니다. 브라우저에서 실행해주세요.');
}
