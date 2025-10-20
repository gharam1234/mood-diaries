import { test, expect } from '@playwright/test';

test.describe('회원가입 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /auth/signup 페이지로 이동
    await page.goto('/auth/signup');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="auth-signup-page"]', { timeout: 2000 });
  });

  test('회원가입 페이지 로드 확인', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.locator('h1')).toHaveText('회원가입');
    
    // 폼 필드들 확인
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
    await expect(page.locator('input[type="text"]')).toBeVisible();
    
    // 회원가입 버튼 확인 (초기에는 비활성화)
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test('폼 유효성 검사 - 이메일 형식 오류', async ({ page }) => {
    // 잘못된 이메일 입력
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 이메일 오류 메시지 확인 (timeout: 500ms 미만)
    await expect(page.locator('text=올바른 이메일 형식이 아닙니다')).toBeVisible({ timeout: 500 });
    
    // 버튼이 여전히 비활성화인지 확인
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('폼 유효성 검사 - 비밀번호 형식 오류', async ({ page }) => {
    // 잘못된 비밀번호 입력 (영문과 숫자 미포함)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', '123456');
    await page.fill('input[name="passwordConfirm"]', '123456');
    await page.fill('input[type="text"]', '홍길동');
    
    // 실제 표시되는 오류 메시지 확인 (에러 메시지가 있는지 확인)
    const errorMessages = page.locator('span[role="alert"]');
    await expect(errorMessages.first()).toBeVisible({ timeout: 500 });
    
    // 버튼이 여전히 비활성화인지 확인
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('폼 유효성 검사 - 비밀번호 확인 불일치', async ({ page }) => {
    // 비밀번호와 비밀번호 확인이 다른 경우
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'different123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 비밀번호 확인 오류 메시지 확인 (timeout: 500ms 미만)
    await expect(page.locator('text=비밀번호가 일치하지 않습니다')).toBeVisible({ timeout: 500 });
    
    // 버튼이 여전히 비활성화인지 확인
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('폼 유효성 검사 - 이름 미입력', async ({ page }) => {
    // 이름을 입력하지 않은 경우
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    
    // 이름 필드가 비어있는지 확인
    await expect(page.locator('input[type="text"]')).toHaveValue('');
    
    // 버튼이 여전히 비활성화인지 확인 (이름이 비어있으면 버튼이 비활성화됨)
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('모든 필드 입력 시 버튼 활성화', async ({ page }) => {
    // 모든 필드에 유효한 값 입력
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 버튼이 활성화되는지 확인
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('회원가입 성공 시나리오', async ({ page }) => {
    // 실제 API를 사용한 성공 시나리오
    const timestamp = Date.now();
    const uniqueEmail = `${timestamp}@example.com`;
    
    // 모든 필드에 유효한 값 입력
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 로딩 상태 확인
    await expect(page.locator('button[type="submit"]')).toHaveText('회원가입 중...');
    
    // 모달 확인 (timeout: 2000ms 미만)
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 2000 });
    
    // 모달 내용 확인 (성공 모달)
    const modalTitle = page.locator('[role="dialog"] h2');
    const modalMessage = page.locator('[role="dialog"] p');
    await expect(modalTitle).toHaveText('회원가입 완료');
    await expect(modalMessage).toHaveText('회원가입이 완료되었습니다.');
    
    // 확인 버튼 클릭
    await page.click('text=확인');
    
    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL('/auth/login');
  });

  test('회원가입 실패 시나리오 - API 모킹', async ({ page }) => {
    // API 모킹을 통한 실패 시나리오 (테스트 목적으로만 사용)
    await page.route('https://main-practice.codebootcamp.co.kr/graphql', async route => {
      // 실패 응답 모킹
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: '이미 존재하는 이메일입니다.' }]
        })
      });
    });
    
    // 모든 필드에 유효한 값 입력
    await page.fill('input[type="email"]', 'existing@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 실패 모달 확인 (timeout: 2000ms 미만)
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 2000 });
    
    // 모달 내용 확인
    const modalTitle = page.locator('[role="dialog"] h2');
    const modalMessage = page.locator('[role="dialog"] p');
    
    await expect(modalTitle).toHaveText('회원가입 실패');
    await expect(modalMessage).toHaveText('회원가입 요청에 실패했습니다.');
    
    // 확인 버튼 클릭
    await page.click('text=확인');
    
    // 모달이 닫히고 회원가입 페이지에 남아있는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
    await expect(page).toHaveURL('/auth/signup');
  });

  test('네트워크 오류 시나리오 - API 모킹', async ({ page }) => {
    // 네트워크 오류 모킹 (테스트 목적으로만 사용)
    await page.route('https://main-practice.codebootcamp.co.kr/graphql', async route => {
      await route.abort('failed');
    });
    
    // 모든 필드에 유효한 값 입력
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 실패 모달 확인 (timeout: 2000ms 미만)
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 2000 });
    
    // 모달 내용 확인
    const modalTitle = page.locator('[role="dialog"] h2');
    const modalMessage = page.locator('[role="dialog"] p');
    await expect(modalTitle).toHaveText('회원가입 실패');
    await expect(modalMessage).toHaveText('회원가입 요청에 실패했습니다.');
  });

  test('폼 리셋 기능', async ({ page }) => {
    // 모든 필드에 값 입력
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 성공적인 회원가입 후 폼이 리셋되는지 확인
    const timestamp = Date.now();
    const uniqueEmail = `${timestamp}@example.com`;
    
    await page.fill('input[type="email"]', uniqueEmail);
    await page.click('button[type="submit"]');
    
    // 성공 모달 확인 후 확인 버튼 클릭
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 2000 });
    await page.click('text=확인');
    
    // 로그인 페이지로 이동 후 다시 회원가입 페이지로 이동
    await page.goto('/auth/signup');
    await page.waitForSelector('[data-testid="auth-signup-page"]', { timeout: 2000 });
    
    // 폼이 비어있는지 확인
    await expect(page.locator('input[type="email"]')).toHaveValue('');
    await expect(page.locator('input[type="password"]').first()).toHaveValue('');
    await expect(page.locator('input[name="passwordConfirm"]')).toHaveValue('');
    await expect(page.locator('input[type="text"]')).toHaveValue('');
  });

  test('접근성 테스트', async ({ page }) => {
    // 폼 라벨과 입력 필드 연결 확인
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const passwordConfirmInput = page.locator('input[name="passwordConfirm"]');
    const nameInput = page.locator('input[type="text"]');
    
    // 각 입력 필드가 적절한 라벨을 가지고 있는지 확인
    await expect(emailInput).toHaveAttribute('aria-label', '이메일');
    await expect(passwordInput).toHaveAttribute('aria-label', '비밀번호');
    await expect(passwordConfirmInput).toHaveAttribute('aria-label', '비밀번호 재입력');
    await expect(nameInput).toHaveAttribute('aria-label', '이름');
    
    // 제출 버튼이 적절한 텍스트를 가지고 있는지 확인
    await expect(page.locator('button[type="submit"]')).toHaveText('회원가입');
  });

  test('zod 검증 조건 상세 테스트 - 이메일 @ 포함', async ({ page }) => {
    // @가 없는 이메일 입력
    await page.fill('input[type="email"]', 'testexample.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 실제 표시되는 오류 메시지 확인 (에러 메시지가 있는지 확인)
    const errorMessages = page.locator('span[role="alert"]');
    await expect(errorMessages.first()).toBeVisible({ timeout: 500 });
    
    // 버튼이 여전히 비활성화인지 확인
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('zod 검증 조건 상세 테스트 - 비밀번호 8자리 이상', async ({ page }) => {
    // 8자리 미만 비밀번호 입력
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'pass123');
    await page.fill('input[name="passwordConfirm"]', 'pass123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 8자리 이상 오류 메시지 확인 (timeout: 500ms 미만)
    await expect(page.locator('text=비밀번호는 8자리 이상이어야 합니다')).toBeVisible({ timeout: 500 });
    
    // 버튼이 여전히 비활성화인지 확인
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('모달 동작 상세 테스트 - 가입완료모달', async ({ page }) => {
    // 실제 API를 사용한 성공 시나리오
    const timestamp = Date.now();
    const uniqueEmail = `${timestamp}@example.com`;
    
    // 모든 필드에 유효한 값 입력
    await page.fill('input[type="email"]', uniqueEmail);
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 가입완료모달 확인 (variant: 'info', actions: 'single')
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 2000 });
    
    // 모달 내용 확인 (성공 모달)
    const modalTitle = page.locator('[role="dialog"] h2');
    const modalMessage = page.locator('[role="dialog"] p');
    await expect(modalTitle).toHaveText('회원가입 완료');
    await expect(modalMessage).toHaveText('회원가입이 완료되었습니다.');
    
    // 확인 버튼이 있는지 확인
    await expect(page.locator('text=확인')).toBeVisible();
    
    // 확인 버튼 클릭
    await page.click('text=확인');
    
    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL('/auth/login');
  });

  test('모달 동작 상세 테스트 - 가입실패모달', async ({ page }) => {
    // API 모킹을 통한 실패 시나리오 (테스트 목적으로만 사용)
    await page.route('https://main-practice.codebootcamp.co.kr/graphql', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: '이미 존재하는 이메일입니다.' }]
        })
      });
    });
    
    // 모든 필드에 유효한 값 입력
    await page.fill('input[type="email"]', 'existing@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.fill('input[type="text"]', '홍길동');
    
    // 회원가입 버튼 클릭
    await page.click('button[type="submit"]');
    
    // 가입실패모달 확인 (variant: 'danger', actions: 'single')
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible({ timeout: 2000 });
    
    // 모달 내용 확인
    const modalTitle = page.locator('[role="dialog"] h2');
    const modalMessage = page.locator('[role="dialog"] p');
    await expect(modalTitle).toHaveText('회원가입 실패');
    await expect(modalMessage).toHaveText('회원가입 요청에 실패했습니다.');
    
    // 확인 버튼이 있는지 확인
    await expect(page.locator('text=확인')).toBeVisible();
    
    // 확인 버튼 클릭
    await page.click('text=확인');
    
    // 모달이 닫히고 회원가입 페이지에 남아있는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
    await expect(page).toHaveURL('/auth/signup');
  });
});
