import { test, expect } from '@playwright/test';

/**
 * 일기상세 삭제 기능 테스트
 * 
 * @description
 * 일기 상세 페이지에서의 삭제 기능을 테스트합니다.
 * - 삭제 버튼 클릭 시 모달 표시
 * - 취소 클릭 시 모달 닫기
 * - 삭제 클릭 시 일기 삭제 및 페이지 이동
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

test.describe('일기상세 삭제 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries/1');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
  });

  test('로그인 유저 - 삭제 버튼 클릭 시 삭제 확인 모달이 노출되어야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries/1에 접속
    await page.goto('/diaries/1');
    
    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // When: 삭제 버튼 클릭
    await page.click('[data-testid="delete-button"]');
    
    // Then: 일기삭제 모달이 노출되어야 함
    await expect(page.locator('[data-testid="delete-modal"]')).toBeVisible();
    await expect(page.locator('text=일기 삭제')).toBeVisible();
    await expect(page.locator('text=정말로 이 일기를 삭제하시겠어요?')).toBeVisible();
    await expect(page.locator('[data-testid="delete-confirm-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="delete-cancel-button"]')).toBeVisible();
  });

  test('로그인 유저 - 삭제 확인 모달에서 취소 클릭 시 모달이 닫혀야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries/1에 접속
    await page.goto('/diaries/1');

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // When: 삭제 버튼 클릭 후 취소 버튼 클릭
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="delete-cancel-button"]');

    // Then: 모달이 사라질 때까지 대기
    await page.waitForSelector('[data-testid="delete-modal"]', { state: 'hidden', timeout: 5000 });

    // 그리고 일기 상세 페이지는 그대로 유지되어야 함
    await expect(page.locator('[data-testid="diary-detail-container"]')).toBeVisible();
  });

  test('로그인 유저 - 삭제 확인 모달에서 삭제 클릭 시 일기가 삭제되고 /diaries로 이동해야 한다', async ({ page }) => {
    // Given: 로그인 상태로 /diaries/1에 접속
    await page.goto('/diaries/1');
    
    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // When: 삭제 버튼 클릭 후 삭제 확인
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="delete-confirm-button"]');
    
    // Then: /diaries로 페이지 이동해야 함
    await page.waitForURL('/diaries');
    await expect(page).toHaveURL('/diaries');
    
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
  });

  test('존재하지 않는 일기 ID로 접속 시 에러 메시지가 표시되어야 한다', async ({ page }) => {
    // Given: 존재하지 않는 일기 ID로 접속
    await page.goto('/diaries/999');
    
    // Then: 에러 메시지가 표시되어야 함
    await page.waitForSelector('[data-testid="diary-error"]');
    await expect(page.locator('[data-testid="diary-error"]')).toBeVisible();
  });
});
