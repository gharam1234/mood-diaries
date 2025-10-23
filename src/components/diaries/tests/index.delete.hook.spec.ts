import { test, expect } from '@playwright/test';

/**
 * 일기 목록 삭제 기능 테스트
 * 
 * @description
 * 일기 목록 페이지에서의 삭제 기능을 테스트합니다.
 * - 비로그인 유저: 삭제 버튼 미노출
 * - 로그인 유저: 삭제 버튼 노출 및 삭제 기능
 * 
 * @fileoverview
 * Playwright를 사용한 E2E 테스트로 실제 사용자 시나리오를 검증합니다.
 */

// 테스트 데이터 설정
const testDiaries = [
  {
    id: 1,
    title: '첫 번째 일기',
    content: '첫 번째 일기 내용입니다.',
    emotion: 'HAPPY',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: '두 번째 일기',
    content: '두 번째 일기 내용입니다.',
    emotion: 'SAD',
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    title: '세 번째 일기',
    content: '세 번째 일기 내용입니다.',
    emotion: 'ANGRY',
    createdAt: '2024-01-03T00:00:00.000Z'
  }
];

test.describe('일기 목록 삭제 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 이동 전에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((diaries) => {
      // 로컬스토리지에 테스트 데이터 설정
      localStorage.setItem('diaries', JSON.stringify(diaries));
      // 기본적으로 로그인 상태로 설정 (각 테스트에서 오버라이드 가능)
      window.__TEST_BYPASS__ = true;
      // 로그인 토큰 설정
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com', name: 'Test User' }));
    }, testDiaries);
  });

  test('비로그인 유저 - 삭제 버튼이 노출되지 않아야 한다', async ({ page }) => {
    // Given: 비로그인 상태로 /diaries에 접속
    await page.goto('/diaries');

    // 비로그인 상태 설정
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = false;
      // 로그인 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    });

    await page.reload();

    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');

    // Then: 삭제 버튼이 노출되지 않아야 함
    const deleteButtons = page.locator('[data-testid="delete-diary-button"]');
    await expect(deleteButtons).toHaveCount(0);
  });

  test('로그인 유저 - 삭제 버튼이 노출되어야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries에 접속 (beforeEach에서 이미 설정됨)
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-container"]');

    // Then: 삭제 버튼이 노출되어야 함
    const deleteButtons = page.locator('[data-testid="delete-diary-button"]');
    await expect(deleteButtons).toHaveCount(3); // 3개의 일기 카드
  });

  test('로그인 유저 - 삭제 버튼 클릭 시 삭제 확인 모달이 노출되어야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries에 접속 (beforeEach에서 이미 설정됨)
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-container"]');

    // When: 첫 번째 일기의 삭제 버튼 클릭
    await page.click('[data-testid="delete-diary-button"]:first-of-type');

    // Then: 삭제 확인 모달이 노출되어야 함
    await expect(page.locator('[data-testid="delete-modal"]')).toBeVisible();
    await expect(page.locator('text=일기 삭제')).toBeVisible();
    await expect(page.locator('[data-testid="delete-modal"]').locator('text=첫 번째 일기')).toBeVisible();
    await expect(page.locator('[data-testid="delete-confirm-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="delete-cancel-button"]')).toBeVisible();
  });

  test('로그인 유저 - 삭제 확인 모달에서 취소 클릭 시 모달이 닫혀야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries에 접속 (beforeEach에서 이미 설정됨)
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-container"]');

    // When: 삭제 버튼 클릭 후 취소 버튼 클릭
    await page.click('[data-testid="delete-diary-button"]:first-of-type');
    await page.click('[data-testid="delete-cancel-button"]');

    // Then: 모달이 닫혀야 함
    await expect(page.locator('[data-testid="delete-modal"]')).not.toBeVisible();

    // 그리고 일기 목록 페이지는 그대로 유지되어야 함
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();
  });

  test('로그인 유저 - 삭제 확인 모달에서 삭제 클릭 시 일기가 삭제되고 페이지가 새로고침되어야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries에 접속 (beforeEach에서 이미 설정됨)
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-container"]');

    // When: 삭제 버튼 클릭 후 삭제 확인
    await page.click('[data-testid="delete-diary-button"]:first-of-type');
    await page.click('[data-testid="delete-confirm-button"]');

    // Then: 페이지가 새로고침되어야 함
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 2000 });

    // 그리고 로컬스토리지에서 해당 일기가 삭제되어야 함
    const remainingDiaries = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : [];
    });

    // id가 1인 일기가 삭제되었는지 확인
    const deletedDiary = remainingDiaries.find((diary: { id: number }) => diary.id === 1);
    expect(deletedDiary).toBeUndefined();

    // id가 2인 일기는 남아있는지 확인
    const remainingDiary = remainingDiaries.find((diary: { id: number }) => diary.id === 2);
    expect(remainingDiary).toBeDefined();

    // 삭제 후 일기 개수가 2개가 되어야 함
    expect(remainingDiaries).toHaveLength(2);
  });

  test('로그인 유저 - 모든 일기 삭제 후 빈 상태 메시지가 표시되어야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries에 접속 (beforeEach에서 이미 설정됨)
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-container"]');

    // When: 모든 일기 삭제
    for (let i = 0; i < 3; i++) {
      await page.click('[data-testid="delete-diary-button"]:first-of-type');
      await page.click('[data-testid="delete-confirm-button"]');
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 2000 });
    }

    // Then: 빈 상태 메시지가 표시되어야 함
    await expect(page.locator('text=작성된 일기가 없습니다.')).toBeVisible();
  });
});