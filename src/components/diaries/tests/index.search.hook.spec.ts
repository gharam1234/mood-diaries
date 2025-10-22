import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 테스트용 일기 데이터
 * 
 * @constant {Array} testDiaryData - 검색 테스트에 사용될 일기 데이터 배열
 * @property {number} id - 일기 고유 ID
 * @property {string} title - 일기 제목
 * @property {string} content - 일기 내용
 * @property {EmotionType} emotion - 감정 타입
 * @property {string} createdAt - 작성일 (ISO 8601 형식)
 */
const testDiaryData = [
  {
    id: 1,
    title: '기쁨 가득한 하루',
    content: '오늘은 정말 기쁜 하루였어요.',
    emotion: EmotionType.HAPPY,
    createdAt: '2024-03-12T10:00:00Z'
  },
  {
    id: 2,
    title: '슬픈 날의 기록',
    content: '오늘은 조금 슬펐어요.',
    emotion: EmotionType.SAD,
    createdAt: '2024-03-13T10:00:00Z'
  },
  {
    id: 3,
    title: '화가 난 오후',
    content: '오늘은 정말 화가 났어요.',
    emotion: EmotionType.ANGRY,
    createdAt: '2024-03-14T10:00:00Z'
  },
  {
    id: 4,
    title: '놀라운 발견',
    content: '오늘은 놀라운 일이 있었어요.',
    emotion: EmotionType.SURPRISE,
    createdAt: '2024-03-15T10:00:00Z'
  }
];

/**
 * Diaries 검색 훅 테스트 그룹
 * 
 * @description
 * 로컬스토리지의 실제 데이터를 사용하여 검색 기능을 테스트합니다.
 * 엔터 키와 검색 버튼 클릭을 통한 검색 실행을 검증합니다.
 */
test.describe('Diaries 검색 훅 테스트', () => {

  /**
   * 테스트 전 공통 설정
   * 
   * @description
   * 각 테스트 실행 전에 로컬스토리지에 테스트 데이터를 설정하고
   * 페이지를 로드합니다.
   */
  test.beforeEach(async ({ page }) => {
    // 페이지 로드 전에 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, testDiaryData);
    
    // 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
  });

  /**
   * 엔터 키로 검색이 실행되는지 확인
   * 
   * @description
   * 검색창에 검색어를 입력하고 엔터 키를 눌렀을 때
   * 제목에 검색어가 포함된 일기만 필터링되어 표시되는지 검증합니다.
   * 
   * @steps
   * 1. 검색창에 '기쁨' 입력
   * 2. 엔터 키 누르기
   * 3. '기쁨 가득한 하루' 제목의 일기만 표시되는지 확인
   */
  test('검색창에 입력 후 엔터로 검색이 실행되어 제목 필터링된다', async ({ page }) => {
    const input = page.getByRole('searchbox', { name: '검색어 입력' });

    await input.fill('기쁨');
    await input.press('Enter');

    const cards = page.locator('[class*="diaryCard"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('[class*="cardTitle"]')).toHaveText(/기쁨 가득한 하루/);
  });

  /**
   * 검색 버튼 클릭으로 검색이 실행되는지 확인
   * 
   * @description
   * 검색창에 검색어를 입력하고 검색 버튼을 클릭했을 때
   * 제목에 검색어가 포함된 일기만 필터링되어 표시되는지 검증합니다.
   * 
   * @steps
   * 1. 검색창에 '발견' 입력
   * 2. 검색 버튼 클릭
   * 3. '놀라운 발견' 제목의 일기만 표시되는지 확인
   */
  test('검색창에 입력 후 검색 버튼 클릭으로 검색이 실행된다', async ({ page }) => {
    const input = page.getByRole('searchbox', { name: '검색어 입력' });
    await input.fill('발견');

    // 검색 버튼은 aria-label="검색 실행" 으로 제공됨
    const searchButton = page.getByRole('button', { name: '검색 실행' });
    await searchButton.click();

    const cards = page.locator('[class*="diaryCard"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('[class*="cardTitle"]')).toHaveText(/놀라운 발견/);
  });

  /**
   * 실시간 검색 기능 확인
   * 
   * @description
   * 검색어를 입력하는 동안 실시간으로 필터링이 적용되는지 검증합니다.
   * 검색어를 지우면 모든 일기가 다시 표시되는지도 확인합니다.
   * 
   * @steps
   * 1. 초기 상태에서 모든 카드(4개) 표시 확인
   * 2. '기쁨' 입력 시 1개 카드만 표시 확인
   * 3. 검색어 지우면 다시 4개 카드 표시 확인
   */
  test('검색어 입력 시 실시간으로 필터링된다', async ({ page }) => {
    const input = page.getByRole('searchbox', { name: '검색어 입력' });
    
    // 초기 상태: 모든 카드 표시
    let cards = page.locator('[class*="diaryCard"]');
    await expect(cards).toHaveCount(4);

    // '기쁨' 입력 시 실시간 필터링
    await input.fill('기쁨');
    cards = page.locator('[class*="diaryCard"]');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('[class*="cardTitle"]')).toHaveText(/기쁨 가득한 하루/);

    // 검색어 지우면 모든 카드 다시 표시
    await input.fill('');
    cards = page.locator('[class*="diaryCard"]');
    await expect(cards).toHaveCount(4);
  });

  /**
   * 검색 결과가 없을 때 빈 상태 표시 확인
   * 
   * @description
   * 존재하지 않는 검색어로 검색했을 때 빈 상태 메시지가
   * 표시되는지 검증합니다.
   * 
   * @steps
   * 1. 존재하지 않는 제목으로 검색
   * 2. 일기 카드가 0개 표시되는지 확인
   * 3. 빈 상태 메시지가 표시되는지 확인
   */
  test('검색 결과가 없을 때 빈 상태가 표시된다', async ({ page }) => {
    const input = page.getByRole('searchbox', { name: '검색어 입력' });
    await input.fill('존재하지않는제목');

    const cards = page.locator('[class*="diaryCard"]');
    await expect(cards).toHaveCount(0);
    
    // 빈 상태 메시지 확인
    const emptyMessage = page.locator('text=작성된 일기가 없습니다.');
    await expect(emptyMessage).toBeVisible();
  });
});


