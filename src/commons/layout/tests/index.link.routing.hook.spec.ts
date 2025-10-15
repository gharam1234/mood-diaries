import { test, expect } from '@playwright/test';

/**
 * Layout 링크 라우팅 기능 테스트
 * 
 * TDD 기반으로 구현된 네비게이션 메뉴 클릭 및 활성 상태 변경 테스트입니다.
 * - 로고 클릭 시 페이지 이동 테스트
 * - 네비게이션 탭 클릭 시 페이지 이동 및 활성 상태 변경 테스트
 * - 커서 스타일 및 접근성 테스트
 * - 페이지 간 네비게이션 시 상태 변경 테스트
 * 
 * @requires Playwright
 * @requires Next.js 개발 서버 (http://localhost:3000)
 */
test.describe('Layout Link Routing', () => {
  
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동하여 테스트 시작
    await page.goto('/diaries');
    // 페이지 로드 완료 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="logo"]', { timeout: 1000 });
  });

  test('로고 클릭 시 일기목록 페이지로 이동', async ({ page }) => {
    // 다른 페이지로 먼저 이동
    await page.goto('/temp');
    await page.waitForSelector('[data-testid="logo"]', { timeout: 1000 });
    
    // 로고 클릭
    await page.click('[data-testid="logo"]');
    
    // URL이 일기목록 페이지로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭이 활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="diaries-tab"]');
    await expect(diariesTab).toHaveClass(/activeTab/);
  });

  test('일기보관함 탭 클릭 시 일기목록 페이지로 이동 및 활성 상태 변경', async ({ page }) => {
    // 일기보관함 탭 클릭
    await page.click('[data-testid="diaries-tab"]');
    
    // URL이 일기목록 페이지인지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 일기보관함 탭이 활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="diaries-tab"]');
    await expect(diariesTab).toHaveClass(/activeTab/);
    
    // 사진보관함 탭이 비활성화되었는지 확인
    const picturesTab = page.locator('[data-testid="pictures-tab"]');
    await expect(picturesTab).toHaveClass(/inactiveTab/);
  });

  test.skip('사진보관함 탭 클릭 시 사진목록 페이지로 이동 및 활성 상태 변경', async ({ page }) => {
    // 사진보관함 탭 클릭
    await page.click('[data-testid="pictures-tab"]');
    
    // URL이 사진목록 페이지로 변경되었는지 확인
    await expect(page).toHaveURL('/pictures');
    
    // 사진보관함 탭이 활성화되었는지 확인
    const picturesTab = page.locator('[data-testid="pictures-tab"]');
    await expect(picturesTab).toHaveClass(/activeTab/);
    
    // 일기보관함 탭이 비활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="diaries-tab"]');
    await expect(diariesTab).toHaveClass(/inactiveTab/);
  });

  test('일기 상세 페이지에서 navigation 영역이 숨겨짐', async ({ page }) => {
    // 일기 상세 페이지로 이동 (예: /diaries/1)
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="logo"]', { timeout: 1000 });
    
    // navigation 영역이 숨겨져 있는지 확인 (영역 노출 제어 기능 검증)
    const navigationVisible = await page.isVisible('[data-testid="navigation"]');
    expect(navigationVisible).toBe(false);
    
    // diaries-tab과 pictures-tab이 DOM에 존재하지 않는지 확인
    const diariesTab = page.locator('[data-testid="diaries-tab"]');
    const picturesTab = page.locator('[data-testid="pictures-tab"]');
    
    await expect(diariesTab).toHaveCount(0);
    await expect(picturesTab).toHaveCount(0);
  });

  test('네비게이션 탭들이 클릭 가능한 커서 스타일을 가짐', async ({ page }) => {
    // 일기보관함 탭의 커서 스타일 확인
    const diariesTab = page.locator('[data-testid="diaries-tab"]');
    const diariesCursor = await diariesTab.evaluate(el => getComputedStyle(el).cursor);
    expect(diariesCursor).toBe('pointer');
    
    // 사진보관함 탭의 커서 스타일 확인
    const picturesTab = page.locator('[data-testid="pictures-tab"]');
    const picturesCursor = await picturesTab.evaluate(el => getComputedStyle(el).cursor);
    expect(picturesCursor).toBe('pointer');
    
    // 로고의 커서 스타일 확인
    const logo = page.locator('[data-testid="logo"]');
    const logoCursor = await logo.evaluate(el => getComputedStyle(el).cursor);
    expect(logoCursor).toBe('pointer');
  });

  test('페이지 간 네비게이션 시 활성 상태가 올바르게 변경됨', async ({ page }) => {
    // 초기 상태: 일기목록 페이지에서 일기보관함 탭 활성화
    const diariesTab = page.locator('[data-testid="diaries-tab"]');
    const picturesTab = page.locator('[data-testid="pictures-tab"]');
    
    await expect(diariesTab).toHaveClass(/activeTab/);
    await expect(picturesTab).toHaveClass(/inactiveTab/);
    
    // 일기 상세 페이지로 이동하여 네비게이션 테스트
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="logo"]', { timeout: 1000 });
    
    // 일기 상세 페이지에서는 navigation이 숨겨져 있으므로
    // 로고 클릭으로 일기목록으로 돌아가기
    await page.click('[data-testid="logo"]');
    await expect(page).toHaveURL('/diaries');
    
    // 다시 일기보관함 탭 활성화 확인
    await expect(diariesTab).toHaveClass(/activeTab/);
    await expect(picturesTab).toHaveClass(/inactiveTab/);
  });
});
