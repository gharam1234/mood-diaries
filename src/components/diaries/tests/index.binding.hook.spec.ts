import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 테스트용 일기 데이터
 * 
 * @constant {Array} testDiaryData - 테스트에 사용될 일기 데이터 배열
 * @property {number} id - 일기 고유 ID
 * @property {string} title - 일기 제목
 * @property {string} content - 일기 내용
 * @property {EmotionType} emotion - 감정 타입
 * @property {string} createdAt - 작성일 (ISO 8601 형식)
 */
const testDiaryData = [
  {
    id: 1,
    title: '첫 번째 일기',
    content: '오늘은 정말 좋은 하루였어요.',
    emotion: EmotionType.HAPPY,
    createdAt: '2024-03-12T10:00:00Z'
  },
  {
    id: 2,
    title: '두 번째 일기',
    content: '오늘은 조금 슬펐어요.',
    emotion: EmotionType.SAD,
    createdAt: '2024-03-13T15:30:00Z'
  },
  {
    id: 3,
    title: '세 번째 일기',
    content: '오늘은 정말 화가 났어요.',
    emotion: EmotionType.ANGRY,
    createdAt: '2024-03-14T09:15:00Z'
  }
];

/**
 * Diaries 바인딩 훅 테스트 그룹
 * 
 * @description
 * 로컬스토리지에서 일기 데이터를 가져와서 바인딩하는 기능을 테스트합니다.
 * 실제 데이터를 사용하여 TDD 기반으로 구현된 바인딩 훅의 동작을 검증합니다.
 */
test.describe('Diaries 바인딩 훅 테스트', () => {
  /**
   * 테스트 전 공통 설정
   * 
   * @description
   * 각 테스트 실행 전에 로컬스토리지에 테스트 데이터를 설정하고
   * 페이지를 로드합니다.
   */
  test.beforeEach(async ({ page }) => {
    // 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 로컬스토리지에 테스트 데이터 설정 (페이지 로드 후)
    await page.evaluate((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, testDiaryData);
    
    // 바인딩 훅이 데이터를 로드할 때까지 추가 대기
    await page.waitForTimeout(300);
  });

  /**
   * 로컬스토리지에서 일기 데이터가 올바르게 로드되는지 확인
   * 
   * @description
   * 로컬스토리지에 저장된 일기 데이터가 올바르게 파싱되고
   * 화면에 렌더링되는지 검증합니다.
   * 
   * @steps
   * 1. 로컬스토리지에 테스트 데이터 설정
   * 2. 페이지 로드 및 바인딩 훅 실행
   * 3. 일기 카드 렌더링 확인
   * 4. 제목, 감정, 작성일 데이터 검증
   */
  test('로컬스토리지에서 일기 데이터가 올바르게 로드되는지 확인', async ({ page }) => {
    // 일기 카드들이 렌더링되는지 확인
    const diaryCards = await page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(3);

    // 첫 번째 일기 카드의 내용 확인
    const firstCard = diaryCards.first();
    
    // 제목 확인
    await expect(firstCard.locator('[class*="cardTitle"]')).toContainText('첫 번째 일기');
    
    // 감정 텍스트 확인
    await expect(firstCard.locator('[class*="emotionLabel"]')).toContainText('행복해요');
    
    // 작성일 확인
    await expect(firstCard.locator('[class*="dateLabel"]')).toContainText('2024. 03. 12');
  });

  test('감정별 이미지가 올바르게 표시되는지 확인', async ({ page }) => {
    const diaryCards = await page.locator('[class*="diaryCard"]');
    
    // 첫 번째 카드 (HAPPY) - 행복한 감정 이미지
    const firstCard = diaryCards.nth(0);
    const firstImage = firstCard.locator('img[class*="cardImg"]');
    await expect(firstImage).toHaveAttribute('src', /emotion-happy-m\.png/);
    
    // 두 번째 카드 (SAD) - 슬픈 감정 이미지
    const secondCard = diaryCards.nth(1);
    const secondImage = secondCard.locator('img[class*="cardImg"]');
    await expect(secondImage).toHaveAttribute('src', /emotion-sad-m\.png/);
    
    // 세 번째 카드 (ANGRY) - 화난 감정 이미지
    const thirdCard = diaryCards.nth(2);
    const thirdImage = thirdCard.locator('img[class*="cardImg"]');
    await expect(thirdImage).toHaveAttribute('src', /emotion-angry-m\.png/);
  });

  test('감정별 색상이 올바르게 적용되는지 확인', async ({ page }) => {
    const diaryCards = await page.locator('[class*="diaryCard"]');
    
    // 첫 번째 카드 (HAPPY) - 빨간색
    const firstEmotionLabel = diaryCards.nth(0).locator('[class*="emotionLabel"]');
    await expect(firstEmotionLabel).toHaveCSS('color', 'rgb(133, 10, 27)'); // red60
    
    // 두 번째 카드 (SAD) - 파란색
    const secondEmotionLabel = diaryCards.nth(1).locator('[class*="emotionLabel"]');
    await expect(secondEmotionLabel).toHaveCSS('color', 'rgb(58, 92, 243)'); // blue60
    
    // 세 번째 카드 (ANGRY) - 회색
    const thirdEmotionLabel = diaryCards.nth(2).locator('[class*="emotionLabel"]');
    await expect(thirdEmotionLabel).toHaveCSS('color', 'rgb(119, 119, 119)'); // gray60
  });

  test('제목이 길 때 말줄임표가 적용되는지 확인', async ({ page }) => {
    // 긴 제목을 가진 일기 데이터로 업데이트
    const longTitleData = [
      {
        id: 1,
        title: '이것은 매우 긴 제목입니다. 일기 카드의 너비를 넘어가는 긴 제목이어야 합니다.',
        content: '내용',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-03-12T10:00:00Z'
      }
    ];

    await page.evaluate((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, longTitleData);

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    const diaryCard = page.locator('[class*="diaryCard"]').first();
    const titleElement = diaryCard.locator('[class*="cardTitle"]');
    
    // CSS 속성 확인
    await expect(titleElement).toHaveCSS('white-space', 'nowrap');
    await expect(titleElement).toHaveCSS('overflow', 'hidden');
    await expect(titleElement).toHaveCSS('text-overflow', 'ellipsis');
  });

  test('로컬스토리지가 비어있을 때 빈 상태가 표시되는지 확인', async ({ page }) => {
    // 로컬스토리지 비우기
    await page.evaluate(() => {
      localStorage.removeItem('diaries');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    // 일기 카드가 없는지 확인
    const diaryCards = await page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test('잘못된 데이터 형식일 때 빈 상태가 표시되는지 확인', async ({ page }) => {
    // 잘못된 형식의 데이터 설정
    await page.evaluate(() => {
      localStorage.setItem('diaries', 'invalid-json');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    // 일기 카드가 없는지 확인
    const diaryCards = await page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test('유효하지 않은 감정 타입이 포함된 데이터를 필터링하는지 확인', async ({ page }) => {
    // 유효하지 않은 감정 타입을 포함한 데이터
    const invalidData = [
      {
        id: 1,
        title: '유효한 일기',
        content: '내용',
        emotion: EmotionType.HAPPY,
        createdAt: '2024-03-12T10:00:00Z'
      },
      {
        id: 2,
        title: '유효하지 않은 감정',
        content: '내용',
        emotion: 'INVALID_EMOTION',
        createdAt: '2024-03-13T10:00:00Z'
      }
    ];

    await page.evaluate((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, invalidData);

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    // 유효한 일기만 표시되는지 확인
    const diaryCards = await page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(diaryCards.first().locator('[class*="cardTitle"]')).toContainText('유효한 일기');
  });
});
