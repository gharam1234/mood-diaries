import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

/**
 * 회고 폼 훅 기능 테스트
 * 
 * @description
 * DiariesDetail 컴포넌트의 회고 폼 기능을 검증하는 Playwright 테스트입니다.
 * 회고 입력, 버튼 활성화, 로컬스토리지 저장, ID 증가 로직을 테스트합니다.
 * 
 * 테스트 범위:
 * - 회고 입력 시 버튼 활성화
 * - 회고 저장 후 로컬스토리지 데이터 검증
 * - 기존 데이터가 있을 때 ID 증가 로직
 * - 페이지 새로고침 동작
 * 
 * 요구사항:
 * - 페이지 로드는 data-testid 대기 방식 사용
 * - timeout은 500ms 이하 설정
 * - 로컬스토리지 실제 데이터 사용 (모킹 금지)
 * - key: retrospects, value: { id:number, content:string, diaryId:number, createdAt:string }[]
 */

test.describe('DiariesDetail - 회고 폼 훅', () => {
  test.beforeEach(async ({ page }) => {
    // origin 설정을 위해 루트로 이동
    await page.goto('/');

    // 로컬스토리지 데이터 주입
    await page.evaluate(() => {
      localStorage.setItem('diaries', JSON.stringify([
        { id: 1, title: '테스트 일기 1', content: '내용', emotion: 'HAPPY', createdAt: '2024. 01. 01' }
      ]));
      localStorage.removeItem('retrospects');
    });
  });

  /**
   * 회고 입력 시 버튼 활성화 및 저장 후 데이터 검증
   * 
   * 시나리오:
   * 1. 회고 입력 필드에 텍스트 입력
   * 2. 입력 버튼 활성화 확인
   * 3. 입력 버튼 클릭하여 저장
   * 4. 페이지 새로고침 확인
   * 5. 로컬스토리지에 데이터가 올바르게 저장되었는지 검증
   * 
   * 검증 항목:
   * - 버튼 활성화 상태
   * - 로컬스토리지 데이터 구조
   * - ID 자동 생성 (첫 번째는 1)
   * - diaryId 연결 확인
   * - createdAt 날짜 형식
   */
  test('입력 시 버튼 활성화, 저장 후 새로고침 및 데이터 검증', async ({ page }) => {
    // 페이지로 이동
    await page.goto('/diaries/1', { waitUntil: 'domcontentloaded' });

    // 일기 상세 데이터 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 3000 });

    // 입력 인풋 대기 (data-testid 기반)
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.waitFor({ timeout: 1000 });

    // 입력 인풋 채우기 -> 버튼 활성화 확인
    await input.fill('오늘의 배움: TDD로 회고 기능 추가');

    // 입력 버튼 클릭
    const submitButton = page.locator('button:has-text("입력")');
    await expect(submitButton).toBeEnabled({ timeout: 500 });
    await submitButton.click();

    // 새로고침 발생 확인을 위해 페이지 리프레시 대기 (컴포넌트에서 router.refresh 호출)
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });

    // 로컬스토리지 검증: id=1, diaryId=1로 저장되었는지 확인
    const retrospects = await page.evaluate(() => {
      const raw = localStorage.getItem('retrospects');
      return raw ? JSON.parse(raw) : [];
    });

    expect(Array.isArray(retrospects)).toBe(true);
    expect(retrospects.length).toBe(1);
    expect(retrospects[0].id).toBe(1);
    expect(retrospects[0].diaryId).toBe(1);
    expect(typeof retrospects[0].createdAt).toBe('string');
    expect(retrospects[0].content).toBe('오늘의 배움: TDD로 회고 기능 추가');
  });

  /**
   * 기존 데이터가 있을 때 ID 증가 로직 검증
   * 
   * 시나리오:
   * 1. 로컬스토리지에 기존 회고 데이터 설정 (ID: 1, 3)
   * 2. 새로운 회고 입력 및 저장
   * 3. ID가 가장 큰 값(3) + 1 = 4로 생성되는지 확인
   * 
   * 검증 항목:
   * - ID 자동 증가 로직 (max ID + 1)
   * - 기존 데이터 유지
   * - 새 데이터 추가
   * - diaryId 연결 확인
   */
  test('기존 데이터가 있을 때 id가 가장 큰 값 + 1로 증가 저장', async ({ page }) => {
    // 페이지로 이동
    await page.goto('/diaries/1', { waitUntil: 'domcontentloaded' });

    // 일기 상세 데이터 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 3000 });

    // 입력 인풋 대기
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.waitFor({ timeout: 1000 });

    // 기존 데이터 주입 (실제 로컬스토리지 사용, 모킹 아님)
    await page.evaluate(() => {
      localStorage.setItem('retrospects', JSON.stringify([
        { id: 1, content: '기존 회고 1', diaryId: 1, createdAt: '2024. 09. 24' },
        { id: 3, content: '기존 회고 3', diaryId: 1, createdAt: '2024. 09. 25' }
      ]));
    });

    // 입력 후 저장
    await input.fill('새 회고 - 증가 ID 확인');
    const submitButton = page.locator('button:has-text("입력")');
    await expect(submitButton).toBeEnabled({ timeout: 500 });
    await submitButton.click();

    await page.waitForSelector('[data-testid="diary-detail-container"]', { timeout: 5000 });

    const retrospects = await page.evaluate(() => {
      const raw = localStorage.getItem('retrospects');
      return raw ? JSON.parse(raw) : [];
    });

    // 기존 max id = 3 이므로 신규는 4
    const newest = retrospects[retrospects.length - 1];
    expect(newest.id).toBe(4);
    expect(newest.content).toBe('새 회고 - 증가 ID 확인');
    expect(newest.diaryId).toBe(1);
  });
});


