import { test, expect } from '@playwright/test';

/**
 * 레이아웃 인증 기능 테스트
 * 비로그인/로그인 유저 시나리오를 테스트합니다.
 */
test.describe('Layout Auth Hook Tests', () => {
  
  test.describe('비로그인 유저 시나리오', () => {
    test('비회원으로 /diaries에 접속하여 페이지 로드 확인', async ({ page }) => {
      // /diaries 페이지로 이동
      await page.goto('/diaries');
      
      // 페이지 로드 확인 (data-testid 기반)
      await expect(page.locator('[data-testid="layout-container"]')).toBeVisible();
      
      // 레이아웃 컨테이너가 표시되는지 확인
      await expect(page.locator('[data-testid="layout-container"]')).toBeInViewport();
    });

    test('layout의 로그인버튼 노출여부 확인', async ({ page }) => {
      // /diaries 페이지로 이동
      await page.goto('/diaries');
      
      // 로그인 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      
      // 로그아웃 버튼은 표시되지 않는지 확인
      await expect(page.locator('[data-testid="logout-button"]')).not.toBeVisible();
    });

    test('로그인버튼 클릭하여 /auth/login 페이지로 이동', async ({ page }) => {
      // /diaries 페이지로 이동
      await page.goto('/diaries');
      
      // 로그인 버튼 클릭
      await page.click('[data-testid="login-button"]');
      
      // /auth/login 페이지로 이동했는지 확인
      await expect(page).toHaveURL('/auth/login');
      
      // 로그인 페이지 로드 확인
      await expect(page.locator('[data-testid="layout-container"]')).toBeVisible();
    });
  });

  test.describe('로그인 유저 시나리오', () => {
    test('비회원으로 /auth/login에 접속하여 페이지 로드 확인', async ({ page }) => {
      // /auth/login 페이지로 이동
      await page.goto('/auth/login');
      
      // 페이지 로드 확인
      await expect(page.locator('[data-testid="layout-container"]')).toBeVisible();
      
      // 로그인 페이지의 폼 버튼이 표시되는지 확인 (header가 숨겨져 있으므로)
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('로그인 시도 및 성공', async ({ page }) => {
      // /auth/login 페이지로 이동
      await page.goto('/auth/login');
      
      // 로그인 폼 입력
      await page.fill('input[type="email"]', 'a@c.com');
      await page.fill('input[type="password"]', '1234qwer');
      
      // 로그인 버튼 클릭
      await page.click('button[type="submit"]');
      
      // 로그인 성공 후 완료 모달이 표시되는지 확인
      await expect(page.locator('[data-testid="success-modal"]')).toBeVisible();
      
      // 완료 모달의 확인 버튼 클릭
      await page.click('[data-testid="success-modal"] button');
      
      // /diaries 페이지로 이동했는지 확인
      await expect(page).toHaveURL('/diaries');
    });

    test('로그인 성공 후 layout에서 유저이름, 로그아웃버튼 노출여부 확인', async ({ page }) => {
      // 로그인 상태로 설정
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', 'a@c.com');
      await page.fill('input[type="password"]', '1234qwer');
      await page.click('button[type="submit"]');
      await page.click('[data-testid="success-modal"] button');
      
      // /diaries 페이지에서 인증 상태 확인
      await expect(page).toHaveURL('/diaries');
      
      // 사용자 이름이 표시되는지 확인
      await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-name"]')).toContainText('님');
      
      // 로그아웃 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
      
      // 로그인 버튼은 표시되지 않는지 확인
      await expect(page.locator('[data-testid="login-button"]')).not.toBeVisible();
    });

    test('로그아웃버튼 클릭하여 /auth/login 페이지로 이동', async ({ page }) => {
      // 로그인 상태로 설정
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', 'a@c.com');
      await page.fill('input[type="password"]', '1234qwer');
      await page.click('button[type="submit"]');
      await page.click('[data-testid="success-modal"] button');
      
      // 로그아웃 버튼 클릭
      await page.click('[data-testid="logout-button"]');
      
      // /auth/login 페이지로 이동했는지 확인
      await expect(page).toHaveURL('/auth/login');
      
      // 로그인 페이지 로드 확인
      await expect(page.locator('[data-testid="layout-container"]')).toBeVisible();
    });

    test('로그아웃 후 /diaries에 접속하여 페이지 로드 확인', async ({ page }) => {
      // 로그인 상태로 설정
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', 'a@c.com');
      await page.fill('input[type="password"]', '1234qwer');
      await page.click('button[type="submit"]');
      await page.click('[data-testid="success-modal"] button');
      
      // 로그아웃
      await page.click('[data-testid="logout-button"]');
      
      // /diaries 페이지로 이동
      await page.goto('/diaries');
      
      // 페이지 로드 확인
      await expect(page.locator('[data-testid="layout-container"]')).toBeVisible();
    });

    test('로그아웃 후 layout에 로그인버튼 노출여부 확인', async ({ page }) => {
      // 로그인 상태로 설정
      await page.goto('/auth/login');
      await page.fill('input[type="email"]', 'a@c.com');
      await page.fill('input[type="password"]', '1234qwer');
      await page.click('button[type="submit"]');
      await page.click('[data-testid="success-modal"] button');
      
      // 로그아웃
      await page.click('[data-testid="logout-button"]');
      
      // /diaries 페이지로 이동
      await page.goto('/diaries');
      
      // 로그인 버튼이 표시되는지 확인
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
      
      // 로그아웃 버튼은 표시되지 않는지 확인
      await expect(page.locator('[data-testid="logout-button"]')).not.toBeVisible();
      
      // 사용자 이름은 표시되지 않는지 확인
      await expect(page.locator('.userName')).not.toBeVisible();
    });
  });
});
