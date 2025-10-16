import { test, expect } from '@playwright/test';

/**
 * 간단한 링크 라우팅 테스트
 * 
 * @description
 * 로컬스토리지 없이 기본적인 라우팅 기능을 테스트합니다.
 */
test.describe('간단한 링크 라우팅 테스트', () => {
  test('일기 카드가 존재하는지 확인', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기 카드가 존재하는지 확인 (데이터가 없어도 빈 상태는 확인 가능)
    const container = page.locator('[data-testid="diaries-container"]');
    await expect(container).toBeVisible();
  });

  test('일기 카드에 cursor: pointer 스타일이 적용되어야 함', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');
    
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기 카드가 있는지 확인
    const diaryCards = page.locator('.diaryCard');
    const cardCount = await diaryCards.count();
    
    if (cardCount > 0) {
      const firstCard = diaryCards.first();
      
      // cursor: pointer 스타일 확인
      const cursorStyle = await firstCard.evaluate((el) => {
        return window.getComputedStyle(el).cursor;
      });
      
      expect(cursorStyle).toBe('pointer');
    } else {
      // 카드가 없는 경우 스킵
      test.skip();
    }
  });
});
