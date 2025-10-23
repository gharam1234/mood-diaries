import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 카드 링크 라우팅 테스트
 * 
 * 일기 카드 클릭 시 상세 페이지로 올바르게 이동하는지 테스트합니다.
 * TDD 기반으로 구현되어 실제 데이터를 사용하여 테스트합니다.
 */
test.describe('일기 카드 링크 라우팅 테스트', () => {
  // 테스트용 일기 데이터
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

  test.beforeEach(async ({ page }) => {
    // 페이지 로드 전에 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, testDiaryData);
    
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
  });

  test('일기 카드 클릭 시 상세 페이지로 이동해야 함', async ({ page }) => {
    // 첫 번째 일기 카드 클릭
    const firstCard = page.locator('[class*="diaryCard"]').first();
    await firstCard.click();

    // URL이 올바르게 변경되었는지 확인
    await expect(page).toHaveURL(/\/diaries\/\d+/);
  });

  test('삭제 버튼 클릭 시 페이지 이동하지 않아야 함', async ({ page }) => {
    // 로그인 상태로 설정 (localStorage에 accessToken과 user 정보 추가)
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'test-token-123');
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user',
        email: 'test@example.com',
        name: 'Test User'
      }));
    });

    // 페이지 새로고침하여 로그인 상태 반영
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    const currentUrl = page.url();

    // 첫 번째 일기 카드의 삭제 버튼 클릭
    const deleteButton = page.locator('[data-testid="diary-card"]').first().locator('[data-testid="delete-diary-button"]');
    await deleteButton.click();

    // 삭제 확인 모달이 열리는지 확인
    await page.waitForSelector('[data-testid="modal-overlay"]', { timeout: 2000 });

    // URL이 변경되지 않았는지 확인
    await expect(page).toHaveURL(currentUrl);
  });

  test('여러 일기 카드 클릭 시 각각 올바른 상세 페이지로 이동해야 함', async ({ page }) => {
    // 첫 번째 카드 클릭 테스트
    const firstCard = page.locator('[class*="diaryCard"]').first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/diaries\/\d+/);

    // 두 번째 카드 클릭 테스트
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    const secondCard = page.locator('[class*="diaryCard"]').nth(1);
    await secondCard.click();
    await expect(page).toHaveURL(/\/diaries\/\d+/);
  });

  test('일기 카드에 cursor: pointer 스타일이 적용되어야 함', async ({ page }) => {
    const firstCard = page.locator('[class*="diaryCard"]').first();
    
    // cursor: pointer 스타일 확인
    const cursorStyle = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    
    expect(cursorStyle).toBe('pointer');
  });

  test('빈 데이터 상태에서 일기 카드가 렌더링되지 않아야 함', async ({ page }) => {
    // 로컬스토리지 비우기
    await page.evaluate(() => {
      localStorage.removeItem('diaries');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    // 일기 카드가 없는지 확인
    const diaryCards = await page.locator('.diaryCard');
    await expect(diaryCards).toHaveCount(0);
  });

  test('잘못된 데이터 형식일 때 일기 카드가 렌더링되지 않아야 함', async ({ page }) => {
    // 잘못된 형식의 데이터 설정
    await page.evaluate(() => {
      localStorage.setItem('diaries', 'invalid-json');
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });

    // 일기 카드가 없는지 확인
    const diaryCards = await page.locator('.diaryCard');
    await expect(diaryCards).toHaveCount(0);
  });
});
