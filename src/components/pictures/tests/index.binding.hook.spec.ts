import { test, expect } from '@playwright/test';

/**
 * Pictures 컴포넌트 API 바인딩 테스트 스위트
 * 
 * @description
 * Pictures 컴포넌트의 API 연동 기능을 테스트합니다.
 * 실제 dog.ceo API를 사용하여 성공/실패 시나리오를 모두 검증합니다.
 * 
 * 테스트 범위:
 * - API 요청 성공 시나리오
 * - 로딩 상태 표시
 * - 이미지 렌더링
 * - 무한스크롤 기능
 * - 에러 처리 (네트워크 오류, 500 에러)
 */
test.describe('Pictures 컴포넌트 - API 바인딩 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
  });

  test('페이지 로드 시 강아지 목록 API 요청 성공', async ({ page }) => {
    // API 요청이 성공적으로 완료되었는지 확인
    const response = await page.waitForResponse(
      response => response.url().includes('dog.ceo/api/breeds/image/random/6') && response.status() === 200,
      { timeout: 2000 }
    );

    // 응답 데이터 검증
    const responseData = await response.json();
    expect(responseData.status).toBe('success');
    expect(Array.isArray(responseData.message)).toBe(true);
    expect(responseData.message).toHaveLength(6);
    
    // 모든 이미지 URL이 dog.ceo를 포함하는지 확인
    responseData.message.forEach((imageUrl: string) => {
      expect(imageUrl).toContain('dog.ceo');
    });
  });

  test('로딩 중 스플래시 스크린 표시', async ({ page }) => {
    // 스플래시 스크린이 표시되는지 확인
    const splashScreens = await page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens).toHaveCount(6);
    
    // 스플래시 스크린이 로딩 애니메이션을 가지고 있는지 확인
    const firstSplash = splashScreens.first();
    await expect(firstSplash).toHaveClass(/splashScreen/);
  });

  test('API 성공 후 강아지 이미지들이 표시됨', async ({ page }) => {
    // API 응답 대기
    await page.waitForResponse(
      response => response.url().includes('dog.ceo/api/breeds/image/random/6') && response.status() === 200,
      { timeout: 2000 }
    );

    // 강아지 이미지들이 표시되는지 확인
    const dogImages = await page.locator('[data-testid="dog-image"]');
    await expect(dogImages).toHaveCount(6);
    
    // 각 이미지가 올바른 src를 가지고 있는지 확인
    for (let i = 0; i < 6; i++) {
      const imageSrc = await dogImages.nth(i).getAttribute('src');
      expect(imageSrc).toContain('dog.ceo');
    }
  });

  test('무한스크롤 - 마지막 2개 이미지 근처에서 추가 로드', async ({ page }) => {
    // 초기 6개 이미지 로드 대기
    await page.waitForResponse(
      response => response.url().includes('dog.ceo/api/breeds/image/random/6') && response.status() === 200,
      { timeout: 2000 }
    );

    // 스크롤을 마지막 2개 이미지 근처로 이동
    const dogImages = page.locator('[data-testid="dog-image"]');
    const lastImage = dogImages.nth(5);
    await lastImage.scrollIntoViewIfNeeded();
    
    // 추가 API 요청이 발생하는지 확인
    await page.waitForResponse(
      response => response.url().includes('dog.ceo/api/breeds/image/random/6') && response.status() === 200,
      { timeout: 2000 }
    );

    // 총 12개의 이미지가 표시되는지 확인
    await expect(dogImages).toHaveCount(12);
  });

  test('API 실패 시나리오 - 네트워크 오류 처리', async ({ page }) => {
    // API 요청을 실패하도록 모킹
    await page.route('**/dog.ceo/api/breeds/image/random/6', route => {
      route.abort('failed');
    });

    // 페이지 새로고침하여 실패 시나리오 테스트
    await page.reload();
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });

    // 에러 상태가 표시될 때까지 대기
    await page.waitForTimeout(3000);

    // 에러 상태가 표시되는지 확인
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
  });

  test('API 실패 시나리오 - 500 에러 처리', async ({ page }) => {
    // API 요청을 500 에러로 모킹
    await page.route('**/dog.ceo/api/breeds/image/random/6', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error', status: 'error' })
      });
    });

    // 페이지 새로고침하여 실패 시나리오 테스트
    await page.reload();
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });

    // 에러 상태가 표시될 때까지 대기
    await page.waitForTimeout(3000);

    // 에러 상태가 표시되는지 확인
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
  });
});
