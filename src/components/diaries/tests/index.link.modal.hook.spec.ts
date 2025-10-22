import { test, expect } from '@playwright/test';

/**
 * 일기쓰기 모달 권한분기 테스트
 * 
 * 요구사항:
 * - 비로그인 유저: 일기쓰기 버튼 클릭 시 로그인 요청 모달 노출
 * - 로그인 유저: 일기쓰기 버튼 클릭 시 일기쓰기 페이지 모달 노출
 * - 실제 데이터 사용 (Mock 데이터 사용 금지)
 * - 로그인 데이터는 window.__TEST_BYPASS__ 전역변수 사용
 * - timeout 500ms 미만 설정
 * - data-testid를 통한 페이지 로드 식별
 */

test.describe('일기쓰기 모달 권한분기 테스트', () => {
  
  test('비로그인 유저 - 일기쓰기 버튼 클릭 시 로그인 요청 모달 노출', async ({ page }) => {
    // 테스트 환경에서 로그인 검사 우회 비활성화
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = false;
    });

    // /diaries 페이지 접속
    await page.goto('/diaries');
    
    // 페이지 로드 확인 (data-testid 대기)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 로그인 요청 모달 노출 확인
    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible({ timeout: 500 });
    await expect(page.locator('text=로그인하시겠습니까?')).toBeVisible({ timeout: 500 });
    await expect(page.locator('text=로그인하러가기')).toBeVisible({ timeout: 500 });
    await expect(page.locator('text=취소')).toBeVisible({ timeout: 500 });
  });

  test('로그인 유저 - 일기쓰기 버튼 클릭 시 일기쓰기 페이지 모달 노출', async ({ page }) => {
    // 테스트 환경에서 로그인 검사 우회 활성화
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = true;
    });

    // /diaries 페이지 접속
    await page.goto('/diaries');
    
    // 페이지 로드 확인 (data-testid 대기)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 일기쓰기 페이지 모달 노출 확인
    // DiariesNew 컴포넌트가 모달로 표시되는지 확인
    await expect(page.locator('text=일기쓰기')).toBeVisible({ timeout: 500 });
    
    // 로그인 요청 모달이 노출되지 않는지 확인
    await expect(page.locator('text=로그인이 필요합니다')).not.toBeVisible({ timeout: 500 });
  });

  test('로그인 유저 - 모달 닫기 기능 테스트', async ({ page }) => {
    // 테스트 환경에서 로그인 검사 우회 활성화
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = true;
    });

    // /diaries 페이지 접속
    await page.goto('/diaries');
    
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 일기쓰기 모달 노출 확인 (DiariesNew 컴포넌트의 특정 요소 확인)
    await expect(page.locator('[data-testid="diaries-new-container"]')).toBeVisible({ timeout: 500 });
    
    // 모달 닫기 버튼 클릭 (ESC 키 또는 닫기 버튼)
    await page.keyboard.press('Escape');
    
    // 모달이 닫혔는지 확인 (DiariesNew 컴포넌트가 사라졌는지 확인)
    await expect(page.locator('[data-testid="diaries-new-container"]')).not.toBeVisible({ timeout: 500 });
  });

  test('비로그인 유저 - 로그인 모달에서 로그인 페이지 이동 테스트', async ({ page }) => {
    // 테스트 환경에서 로그인 검사 우회 비활성화
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = false;
    });

    // /diaries 페이지 접속
    await page.goto('/diaries');
    
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 로그인 요청 모달 노출 확인
    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible({ timeout: 500 });
    
    // "로그인하러가기" 버튼 클릭
    await page.click('text=로그인하러가기');
    
    // 페이지 이동 대기 및 확인
    await page.waitForURL('/auth/login', { timeout: 2000 });
    await expect(page).toHaveURL('/auth/login');
  });

  test('비로그인 유저 - 로그인 모달에서 취소 버튼 테스트', async ({ page }) => {
    // 테스트 환경에서 로그인 검사 우회 비활성화
    await page.addInitScript(() => {
      window.__TEST_BYPASS__ = false;
    });

    // /diaries 페이지 접속
    await page.goto('/diaries');
    
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 로그인 요청 모달 노출 확인
    await expect(page.locator('text=로그인이 필요합니다')).toBeVisible({ timeout: 500 });
    
    // "취소" 버튼 클릭
    await page.click('text=취소');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('text=로그인이 필요합니다')).not.toBeVisible({ timeout: 500 });
    
    // 여전히 /diaries 페이지에 있는지 확인
    await expect(page).toHaveURL('/diaries');
  });
});