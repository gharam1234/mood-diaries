import { test, expect } from '@playwright/test';

/**
 * 일기 삭제 기능 테스트
 * 
 * @description
 * 일기 삭제 기능의 권한 분기 및 삭제 프로세스를 테스트합니다.
 * - 비로그인 사용자: 삭제 버튼 미노출
 * - 로그인 사용자: 삭제 버튼 노출 및 삭제 기능 동작
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

test.describe('일기 삭제 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);
  });

  test.describe('비로그인 사용자 시나리오', () => {
    test('삭제 버튼이 노출되지 않아야 한다', async ({ page }) => {
      // Given: 비로그인 상태로 /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 대기 (data-testid 기반)
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // When: 페이지 로드 완료
      // Then: 삭제 버튼이 노출되지 않아야 함
      const deleteButtons = await page.locator('[data-testid="delete-diary-button"]');
      await expect(deleteButtons).toHaveCount(0);
    });
  });

  test.describe('로그인 사용자 시나리오', () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태 설정
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'test-token');
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          email: 'test@example.com',
          name: '테스트 사용자'
        }));
      });
    });

    test('삭제 버튼이 노출되어야 한다', async ({ page }) => {
      // Given: 로그인 상태로 /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // When: 페이지 로드 완료
      // Then: 삭제 버튼이 노출되어야 함
      const deleteButtons = await page.locator('[data-testid="delete-diary-button"]');
      await expect(deleteButtons).toHaveCount(testDiaries.length);
    });

    test('삭제 버튼 클릭 시 삭제 확인 모달이 노출되어야 한다', async ({ page }) => {
      // Given: 로그인 상태로 /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // When: 첫 번째 일기의 삭제 버튼 클릭
      const firstDeleteButton = page.locator('[data-testid="delete-diary-button"]').first();
      await firstDeleteButton.click();
      
      // Then: 삭제 확인 모달이 노출되어야 함
      await expect(page.locator('text=일기 삭제')).toBeVisible();
      await expect(page.locator('text="첫 번째 일기" 일기를 삭제하시겠습니까?')).toBeVisible();
      await expect(page.locator('[data-testid="delete-confirm-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="delete-cancel-button"]')).toBeVisible();
    });

    test('삭제 확인 모달에서 취소 클릭 시 모달이 닫혀야 한다', async ({ page }) => {
      // Given: 로그인 상태로 /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // When: 삭제 버튼 클릭 후 취소 버튼 클릭
      const firstDeleteButton = page.locator('[data-testid="delete-diary-button"]').first();
      await firstDeleteButton.click();
      
      const cancelButton = page.locator('[data-testid="delete-cancel-button"]');
      await cancelButton.click();
      
      // Then: 모달이 닫혀야 함
      await expect(page.locator('text=일기 삭제')).not.toBeVisible();
      
      // 그리고 일기 목록은 그대로 유지되어야 함
      const deleteButtons = await page.locator('[data-testid="delete-diary-button"]');
      await expect(deleteButtons).toHaveCount(testDiaries.length);
    });

    test('삭제 확인 모달에서 삭제 클릭 시 일기가 삭제되고 페이지가 새로고침되어야 한다', async ({ page }) => {
      // Given: 로그인 상태로 /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // When: 삭제 버튼 클릭 후 삭제 확인
      const firstDeleteButton = page.locator('[data-testid="delete-diary-button"]').first();
      await firstDeleteButton.click();
      
      const confirmButton = page.locator('[data-testid="delete-confirm-button"]');
      await confirmButton.click();
      
      // Then: 페이지가 새로고침되고 일기가 삭제되어야 함
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 2000 });
      
      // 삭제된 일기 수 확인 (원래 3개에서 1개 삭제되어 2개 남음)
      const remainingDeleteButtons = await page.locator('[data-testid="delete-diary-button"]');
      await expect(remainingDeleteButtons).toHaveCount(2);
      
      // 로컬스토리지에서도 삭제 확인
      const remainingDiaries = await page.evaluate(() => {
        const diaries = localStorage.getItem('diaries');
        return diaries ? JSON.parse(diaries) : [];
      });
      expect(remainingDiaries).toHaveLength(2);
      expect(remainingDiaries.find((diary: any) => diary.id === 1)).toBeUndefined();
    });

    test('모든 일기 삭제 후 빈 상태가 표시되어야 한다', async ({ page }) => {
      // Given: 로그인 상태로 /diaries 페이지 접속
      await page.goto('/diaries');
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // When: 모든 일기 삭제
      for (let i = 0; i < testDiaries.length; i++) {
        const deleteButton = page.locator('[data-testid="delete-diary-button"]').first();
        await deleteButton.click();
        
        const confirmButton = page.locator('[data-testid="delete-confirm-button"]');
        await confirmButton.click();
        
        // 페이지 새로고침 대기
        await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 2000 });
      }
      
      // Then: 빈 상태 메시지가 표시되어야 함
      await expect(page.locator('text=작성된 일기가 없습니다.')).toBeVisible();
    });
  });

  test.describe('권한 검사 테스트', () => {
    test('비로그인 상태에서는 삭제 버튼이 노출되지 않아야 한다', async ({ page }) => {
      // Given: 비로그인 상태
      await page.evaluate(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      });
      
      // 테스트 환경에서 권한 검사 활성화
      await page.evaluate(() => {
        window.__TEST_BYPASS__ = false;
      });
      
      await page.goto('/diaries');
      
      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
      
      // Then: 삭제 버튼이 노출되지 않아야 함
      const deleteButtons = await page.locator('[data-testid="delete-diary-button"]');
      await expect(deleteButtons).toHaveCount(0);
    });
  });
});
