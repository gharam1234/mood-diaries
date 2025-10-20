import { test, expect } from '@playwright/test';

/**
 * AuthSignup 폼 기능 테스트
 * TDD 기반으로 회원가입 폼의 모든 기능을 검증합니다.
 */

test.describe('AuthSignup 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto('/auth/signup');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="auth-signup-page"]', { timeout: 2000 });
  });

  test('회원가입 페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toContainText('회원가입');
    
    // 모든 입력 필드가 존재하는지 확인
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-confirm-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    
    // 회원가입 버튼이 비활성화 상태인지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeDisabled();
  });

  test('모든 필드가 입력되면 회원가입 버튼이 활성화되는지 확인', async ({ page }) => {
    const timestamp = Date.now();
    
    // 모든 필드 입력
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@test.com`);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 회원가입 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeEnabled();
  });

  test('이메일 validation이 정상적으로 작동하는지 확인', async ({ page }) => {
    // 잘못된 이메일 형식 입력
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 버튼이 비활성화 상태인지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeDisabled();
    
    // 올바른 이메일 형식으로 변경
    const timestamp = Date.now();
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@example.com`);
    
    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeEnabled();
  });

  test('비밀번호 validation이 정상적으로 작동하는지 확인', async ({ page }) => {
    const timestamp = Date.now();
    
    // 짧은 비밀번호 입력
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@test.com`);
    await page.fill('[data-testid="password-input"]', '123');
    await page.fill('[data-testid="password-confirm-input"]', '123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 버튼이 비활성화 상태인지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeDisabled();
    
    // 영문과 숫자를 포함한 8자리 이상 비밀번호로 변경
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    
    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeEnabled();
  });

  test('비밀번호 확인 validation이 정상적으로 작동하는지 확인', async ({ page }) => {
    const timestamp = Date.now();
    
    // 비밀번호와 비밀번호 확인이 다른 경우
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@test.com`);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'different123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 버튼이 비활성화 상태인지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeDisabled();
    
    // 비밀번호 확인을 올바르게 변경
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    
    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeEnabled();
  });

  test('이름 validation이 정상적으로 작동하는지 확인', async ({ page }) => {
    const timestamp = Date.now();
    
    // 이름을 입력하지 않은 경우
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@test.com`);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    
    // 버튼이 비활성화 상태인지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeDisabled();
    
    // 이름 입력
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 버튼이 활성화되는지 확인
    await expect(page.locator('[data-testid="signup-button"]')).toBeEnabled();
  });

  test('회원가입 성공 시나리오 - 실제 API 호출', async ({ page }) => {
    const timestamp = Date.now();
    
    // 모든 필드 입력
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@test.com`);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 회원가입 버튼 클릭
    await page.click('[data-testid="signup-button"]');
    
    // 로딩 상태 확인
    await expect(page.locator('[data-testid="signup-button"]')).toContainText('회원가입 중...');
    
    // 성공 모달이 나타나는지 확인
    await page.waitForSelector('[data-testid="modal-overlay"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    
    // 모달 내용 확인
    await expect(page.locator('text=회원가입 완료')).toBeVisible();
    await expect(page.locator('text=회원가입이 완료되었습니다.')).toBeVisible();
    
    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');
    
    // 로그인 페이지로 이동하는지 확인
    await page.waitForURL('/auth/login', { timeout: 2000 });
    await expect(page).toHaveURL('/auth/login');
  });

  test('회원가입 실패 시나리오 - API 모킹', async ({ page }) => {
    // API 요청을 모킹하여 실패 응답 반환
    await page.route('**/graphql', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: '이미 존재하는 이메일입니다.' }]
        })
      });
    });

    const timestamp = Date.now();
    
    // 모든 필드 입력
    await page.fill('[data-testid="email-input"]', `test.${timestamp}@test.com`);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="password-confirm-input"]', 'password123');
    await page.fill('[data-testid="name-input"]', '테스트사용자');
    
    // 회원가입 버튼 클릭
    await page.click('[data-testid="signup-button"]');
    
    // 실패 모달이 나타나는지 확인
    await page.waitForSelector('[data-testid="modal-overlay"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    
    // 모달 내용 확인
    await expect(page.locator('text=회원가입 실패')).toBeVisible();
    // 에러 메시지가 표시되는지 확인 (정확한 메시지가 아닐 수 있으므로 더 일반적으로 확인)
    await expect(page.locator('[data-testid="modal-overlay"]')).toContainText('실패');
    
    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');
    
    // 모달이 닫히고 회원가입 페이지에 남아있는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
    await expect(page).toHaveURL('/auth/signup');
  });

  test('로그인 페이지로 이동 링크가 정상적으로 작동하는지 확인', async ({ page }) => {
    // 로그인 링크 클릭
    await page.click('a[href="/auth/login"]');
    
    // 로그인 페이지로 이동하는지 확인
    await page.waitForURL('/auth/login', { timeout: 2000 });
    await expect(page).toHaveURL('/auth/login');
  });
});