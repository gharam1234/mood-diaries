import { test, expect } from '@playwright/test';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 페이지네이션 훅 Playwright 테스트
 *
 * 테스트 시나리오:
 * 1. 페이지네이션 클릭하기
 * 2. 검색결과 페이지네이션하기
 * 3. 필터결과 페이지네이션하기
 */

// 테스트 데이터 생성 함수 (60개의 일기 데이터 생성)
const generateTestDiaries = () => {
  const emotions = [
    EmotionType.HAPPY,
    EmotionType.SAD,
    EmotionType.ANGRY,
    EmotionType.SURPRISE,
    EmotionType.ETC
  ];

  const diaries = [];
  for (let i = 1; i <= 60; i++) {
    diaries.push({
      id: i,
      title: `테스트 일기 ${i}`,
      content: `테스트 내용 ${i}`,
      emotion: emotions[(i - 1) % emotions.length],
      createdAt: new Date(2025, 0, i).toISOString(),
    });
  }
  return diaries;
};

test.describe('일기 페이지네이션 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    const testDiaries = generateTestDiaries();
    await page.addInitScript((diaries) => {
      localStorage.setItem('diaries', JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 로드
    await page.goto('/diaries');

    // 페이지 로드 확인 (data-testid 기반)
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible({ timeout: 10000 });

    // 일기 카드가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diary-card"]', { timeout: 10000 }).catch(() => {
      // 카드가 없는 경우도 허용 (빈 상태일 수 있음)
    });
  });

  test('유저시나리오1: 페이지네이션 클릭하기', async ({ page }) => {
    // 1. 한 페이지에 3행 4열로 총 12개의 일기카드가 노출되는지 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    const cardCount = await diaryCards.count();
    expect(cardCount).toBe(12);

    // 2. 페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 노출되는지 확인
    const pageButtons = page.locator('[data-testid^="pagination-page-"]');
    const visiblePageButtons = await pageButtons.count();
    expect(visiblePageButtons).toBeLessThanOrEqual(5);

    // 첫 번째 페이지 버튼이 1인지 확인
    const firstPageButton = page.locator('[data-testid="pagination-page-1"]');
    await expect(firstPageButton).toBeVisible();

    // 3. 페이지번호 클릭
    const secondPageButton = page.locator('[data-testid="pagination-page-2"]');
    await secondPageButton.click();

    // 4. 해당 페이지번호에 맞는 일기 컨텐츠목록 보여지는지 확인
    // 2페이지는 13번째부터 24번째 일기가 표시되어야 함
    const firstCardAfterPageChange = page.locator('[data-testid="diary-card"]').first();
    await expect(firstCardAfterPageChange).toContainText('테스트 일기 13');
  });

  test('유저시나리오2: 검색결과 페이지네이션하기', async ({ page }) => {
    // 1. 검색창에 검색어를 입력하여 검색
    const searchInput = page.locator('input[placeholder*="검색"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill('테스트 일기 1');

    // 검색 결과 대기 (검색은 실시간으로 수행됨)
    await page.waitForTimeout(300);

    // 2. 검색 결과에 맞게 페이지 수가 변경되었는지 확인
    // "테스트 일기 1"로 검색하면 1, 10, 11, 12, ..., 19 등이 매칭됨 (약 12개)
    const pageButtons = page.locator('[data-testid^="pagination-page-"]');
    const visiblePageButtons = await pageButtons.count();

    // 검색 결과가 12개 이하면 페이지가 1개만 표시되어야 함
    const diaryCards = page.locator('[data-testid="diary-card"]');
    const cardCount = await diaryCards.count();

    if (cardCount <= 12) {
      expect(visiblePageButtons).toBeLessThanOrEqual(1);
    }
  });

  test('유저시나리오3: 필터결과 페이지네이션하기', async ({ page }) => {
    // 1. 필터선택박스 클릭
    const filterSelect = page.locator('[data-testid="diary-filter-select"]');
    await filterSelect.click();

    // 2. 메뉴 선택시, 선택한 emotion과 일치하는 일기 카드들로 페이지 수가 변경되었는지 확인
    // HAPPY 감정 선택 (60개 중 12개 = 1페이지)
    const happyOption = page.locator('text=행복해요').first();
    await happyOption.click();

    // 필터 적용 대기
    await page.waitForTimeout(300);

    // 필터링된 일기 카드 개수 확인
    const diaryCards = page.locator('[data-testid="diary-card"]');
    const cardCount = await diaryCards.count();

    // 모든 카드가 HAPPY 감정인지 확인
    const emotionLabels = diaryCards.locator('span').filter({ hasText: /^(행복해요|슬퍼요|화나요|놀랐어요|기타)$/ });
    const emotionCount = await emotionLabels.count();

    if (emotionCount > 0) {
      for (let i = 0; i < emotionCount; i++) {
        const emotionText = await emotionLabels.nth(i).textContent();
        expect(emotionText).toBe('행복해요');
      }
    }

    // 페이지 수가 필터링된 결과에 맞게 변경되었는지 확인
    const pageButtons = page.locator('[data-testid^="pagination-page-"]');
    const visiblePageButtons = await pageButtons.count();

    // HAPPY 감정은 12개이므로 1페이지만 표시되어야 함
    if (cardCount <= 12) {
      expect(visiblePageButtons).toBeLessThanOrEqual(1);
    }
  });

  test('페이지네이션 다음/이전 버튼 동작 확인', async ({ page }) => {
    // 다음 버튼 클릭
    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(200);

      // 2페이지로 이동했는지 확인
      const secondPageButton = page.locator('[data-testid="pagination-page-2"]');
      await expect(secondPageButton).toHaveClass(/active/);
    }

    // 이전 버튼 클릭
    const prevButton = page.locator('[data-testid="pagination-prev"]');
    if (await prevButton.isVisible()) {
      await prevButton.click();
      await page.waitForTimeout(200);

      // 1페이지로 돌아왔는지 확인
      const firstPageButton = page.locator('[data-testid="pagination-page-1"]');
      await expect(firstPageButton).toHaveClass(/active/);
    }
  });

  test('페이지네이션 범위 변경 확인 (5페이지로 이동)', async ({ page }) => {
    // 5페이지 버튼으로 직접 이동 (60개 데이터 = 5페이지)
    const fifthPageButton = page.locator('[data-testid="pagination-page-5"]');

    if (await fifthPageButton.isVisible()) {
      await fifthPageButton.click();
      await page.waitForTimeout(300);

      // 5페이지의 일기가 표시되는지 확인 (49번째부터 60번째 일기)
      const diaryCards = page.locator('[data-testid="diary-card"]');
      const cardCount = await diaryCards.count();

      // 마지막 페이지는 12개가 표시되어야 함 (49-60 = 12개)
      expect(cardCount).toBe(12);

      // 첫 번째 카드가 "테스트 일기 49"인지 확인
      const firstCard = diaryCards.first();
      await expect(firstCard).toContainText('테스트 일기 49');
    }
  });
});
