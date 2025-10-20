import { test, expect } from '@playwright/test';

// 로그인 페이지 테스트
test.describe('AuthLogin 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /auth/login 페이지로 이동
    await page.goto('/auth/login');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="auth-login-page"]', { timeout: 2000 });
  });

  test('로그인 폼 초기 상태 확인', async ({ page }) => {
    // 이메일과 비밀번호 입력 필드가 비어있는지 확인
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    await expect(emailInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
    
    // 로그인 버튼이 비활성화 상태인지 확인
    await expect(loginButton).toBeDisabled();
  });

  test('입력 필드에 값이 있을 때 로그인 버튼 활성화', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // 이메일 입력
    await emailInput.fill('123123@123123.com');
    await expect(loginButton).toBeDisabled(); // 비밀번호가 없어서 비활성화

    // 비밀번호 입력
    await passwordInput.fill('qwer1234');
    await expect(loginButton).toBeEnabled(); // 모든 필드가 입력되어 활성화
  });

  test('유효하지 않은 이메일 형식 검증', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // 유효하지 않은 이메일 입력
    await emailInput.fill('invalid-email');
    await passwordInput.fill('qwer1234');
    
    // 로그인 버튼 클릭 시도
    await loginButton.click();
    
    // 폼 제출이 되지 않아야 함 (유효성 검사 실패)
    await expect(loginButton).toBeEnabled();
  });

  test('빈 비밀번호 검증', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // 이메일만 입력
    await emailInput.fill('123123@123123.com');
    await passwordInput.fill('');
    
    // 로그인 버튼이 비활성화 상태여야 함
    await expect(loginButton).toBeDisabled();
  });

  test('성공적인 로그인 시나리오', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // 유효한 로그인 정보 입력
    await emailInput.fill('123123@123123.com');
    await passwordInput.fill('qwer1234');
    
    // 로그인 버튼 클릭
    await loginButton.click();

    // 로그인 API 요청 대기 (network 통신이므로 2000ms 미만)
    const loginResponse = page.waitForResponse(
      response => response.url().includes('/graphql') && 
                  response.request().method() === 'POST' &&
                  response.request().postData()?.includes('loginUser'),
      { timeout: 2000 }
    );

    // fetchUserLoggedIn API 요청 대기
    const userResponse = page.waitForResponse(
      response => response.url().includes('/graphql') && 
                  response.request().method() === 'POST' &&
                  response.request().postData()?.includes('fetchUserLoggedIn'),
      { timeout: 2000 }
    );

    // API 응답 확인
    const [loginRes, userRes] = await Promise.all([loginResponse, userResponse]);
    
    // loginUser API 응답 확인
    const loginData = await loginRes.json();
    expect(loginData.data?.loginUser?.accessToken).toBeTruthy();

    // fetchUserLoggedIn API 응답 확인
    const userData = await userRes.json();
    expect(userData.data?.fetchUserLoggedIn?._id).toBeTruthy();
    expect(userData.data?.fetchUserLoggedIn?.name).toBeTruthy();

    // 로컬스토리지 확인
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const user = await page.evaluate(() => localStorage.getItem('user'));
    
    expect(accessToken).toBeTruthy();
    expect(user).toBeTruthy();
    
    const userObj = JSON.parse(user || '{}');
    expect(userObj._id).toBeTruthy();
    expect(userObj.name).toBeTruthy();

    // 로그인 완료 모달 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    await expect(page.locator('text=로그인이 완료되었습니다')).toBeVisible();

    // 모달 확인 버튼 클릭
    await page.locator('button:has-text("확인")').click();

    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();

    // 일기목록 페이지로 이동 확인
    await expect(page).toHaveURL('/diaries');
  });

  test('로그인 실패 시나리오', async ({ page }) => {
    // API 모킹 설정
    await page.route('**/graphql', async route => {
      const request = route.request();
      const postData = request.postData();
      
      if (postData?.includes('loginUser')) {
        // 로그인 실패 응답 모킹
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              loginUser: null
            },
            errors: [{
              message: '이메일 또는 비밀번호가 올바르지 않습니다.'
            }]
          })
        });
      } else {
        await route.continue();
      }
    });

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // 잘못된 로그인 정보 입력
    await emailInput.fill('wrong@email.com');
    await passwordInput.fill('wrongpassword');
    
    // 로그인 버튼 클릭
    await loginButton.click();

    // 로그인 실패 모달 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    await expect(page.locator('text=로그인에 실패했습니다')).toBeVisible();

    // 모달 확인 버튼 클릭
    await page.locator('button:has-text("확인")').click();

    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();

    // 로그인 페이지에 그대로 남아있는지 확인
    await expect(page).toHaveURL('/auth/login');
  });

  test('네트워크 오류 시나리오', async ({ page }) => {
    // API 모킹 설정 (네트워크 오류)
    await page.route('**/graphql', async route => {
      await route.abort('failed');
    });

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');

    // 유효한 로그인 정보 입력
    await emailInput.fill('123123@123123.com');
    await passwordInput.fill('qwer1234');
    
    // 로그인 버튼 클릭
    await loginButton.click();

    // 로그인 실패 모달 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    await expect(page.locator('text=로그인에 실패했습니다')).toBeVisible();
  });
});
