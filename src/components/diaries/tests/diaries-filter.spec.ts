import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

/**
 * 테스트용 로컬스토리지 데이터
 * 
 * @constant {Array} testData - 테스트에 사용될 일기 데이터 배열
 * @property {number} id - 일기 고유 ID
 * @property {string} title - 일기 제목
 * @property {string} content - 일기 내용
 * @property {string} emotion - 감정 타입 (HAPPY, SAD, ANGRY, SURPRISE, ETC)
 * @property {string} createdAt - 작성일 (ISO 8601 형식)
 */
const testData = [
  {
    id: 1,
    title: "오늘의 기쁜 일",
    content: "오늘은 정말 기쁜 일이 있었어요. 새로운 친구를 만났습니다.",
    emotion: "HAPPY",
    createdAt: "2024-01-15T10:30:00.000Z"
  },
  {
    id: 2,
    title: "슬픈 하루",
    content: "오늘은 조금 슬펐어요. 좋아하던 영화가 끝났습니다.",
    emotion: "SAD",
    createdAt: "2024-01-16T14:20:00.000Z"
  },
  {
    id: 3,
    title: "화나는 일",
    content: "오늘은 정말 화가 났어요. 버스를 놓쳤습니다.",
    emotion: "ANGRY",
    createdAt: "2024-01-17T08:45:00.000Z"
  },
  {
    id: 4,
    title: "놀라운 발견",
    content: "오늘은 정말 놀라운 일이 있었어요. 오래된 친구를 만났습니다.",
    emotion: "SURPRISE",
    createdAt: "2024-01-18T16:10:00.000Z"
  },
  {
    id: 5,
    title: "특별한 하루",
    content: "오늘은 특별한 하루였어요. 새로운 취미를 시작했습니다.",
    emotion: "ETC",
    createdAt: "2024-01-19T12:00:00.000Z"
  }
];

/**
 * 필터를 선택하는 헬퍼 함수
 */
async function selectFilterOption(page: import('@playwright/test').Page, optionText: string) {
  // 필터 버튼 클릭
  const filterContainer = page.locator('[data-testid="diary-filter-select"]');
  const triggerButton = filterContainer.locator('button[type="button"]').first();
  await triggerButton.click();

  // 드롭다운 메뉴가 열릴 때까지 대기
  await page.waitForTimeout(100);

  // 옵션 선택
  await page.locator(`[role="listbox"] [role="option"]:has-text("${optionText}")`).click();

  // 드롭다운이 닫힐 때까지 대기
  await page.waitForTimeout(100);
}

test.describe('일기 필터 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, testData);

    // 페이지 새로고침하여 데이터 로드
    await page.reload();

    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
  });

  test('초기 필터 상태 확인', async ({ page }) => {
    // 필터 컨테이너 대기
    await page.waitForSelector('[data-testid="diary-filter-select"]', { timeout: 2000 });

    // 필터 선택박스가 보이는지 확인
    const filterContainer = page.locator('[data-testid="diary-filter-select"]');
    const triggerButton = filterContainer.locator('button[type="button"]').first();
    await expect(triggerButton).toBeVisible();

    // 모든 일기 카드가 표시되는지 확인 (5개)
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(5);
  });

  test('필터 옵션 메뉴 확인', async ({ page }) => {
    // 필터 버튼 클릭
    const filterContainer = page.locator('[data-testid="diary-filter-select"]');
    const triggerButton = filterContainer.locator('button[type="button"]').first();
    await triggerButton.click();

    // 선택 가능한 옵션들이 표시되는지 확인
    await expect(page.locator('[role="listbox"] [role="option"]:has-text("전체")')).toBeVisible();
    await expect(page.locator('[role="listbox"] [role="option"]:has-text("행복해요")')).toBeVisible();
    await expect(page.locator('[role="listbox"] [role="option"]:has-text("슬퍼요")')).toBeVisible();
    await expect(page.locator('[role="listbox"] [role="option"]:has-text("화나요")')).toBeVisible();
    await expect(page.locator('[role="listbox"] [role="option"]:has-text("놀랐어요")')).toBeVisible();
    await expect(page.locator('[role="listbox"] [role="option"]:has-text("기타")')).toBeVisible();
  });

  test('전체 필터 선택 시 모든 일기 카드 노출', async ({ page }) => {
    // 모든 일기 카드가 표시되는지 확인 (5개)
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(5);

    // 각 감정의 일기가 모두 표시되는지 확인
    await expect(page.locator('text=오늘의 기쁜 일')).toBeVisible();
    await expect(page.locator('text=슬픈 하루')).toBeVisible();
    await expect(page.locator('text=화나는 일')).toBeVisible();
    await expect(page.locator('text=놀라운 발견')).toBeVisible();
    await expect(page.locator('text=특별한 하루')).toBeVisible();
  });

  test('행복해요 필터 선택 시 행복한 일기만 노출', async ({ page }) => {
    // 필터 선택박스에서 "행복해요" 선택
    await selectFilterOption(page, '행복해요');

    // 행복한 일기만 표시되는지 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=오늘의 기쁜 일')).toBeVisible();

    // 다른 감정의 일기는 표시되지 않는지 확인
    await expect(page.locator('text=슬픈 하루')).not.toBeVisible();
    await expect(page.locator('text=화나는 일')).not.toBeVisible();
    await expect(page.locator('text=놀라운 발견')).not.toBeVisible();
    await expect(page.locator('text=특별한 하루')).not.toBeVisible();
  });

  test('슬퍼요 필터 선택 시 슬픈 일기만 노출', async ({ page }) => {
    // 필터 선택박스에서 "슬퍼요" 선택
    await selectFilterOption(page, '슬퍼요');

    // 슬픈 일기만 표시되는지 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=슬픈 하루')).toBeVisible();

    // 다른 감정의 일기는 표시되지 않는지 확인
    await expect(page.locator('text=오늘의 기쁜 일')).not.toBeVisible();
    await expect(page.locator('text=화나는 일')).not.toBeVisible();
    await expect(page.locator('text=놀라운 발견')).not.toBeVisible();
    await expect(page.locator('text=특별한 하루')).not.toBeVisible();
  });

  test('화나요 필터 선택 시 화난 일기만 노출', async ({ page }) => {
    // 필터 선택박스에서 "화나요" 선택
    await selectFilterOption(page, '화나요');

    // 화난 일기만 표시되는지 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=화나는 일')).toBeVisible();

    // 다른 감정의 일기는 표시되지 않는지 확인
    await expect(page.locator('text=오늘의 기쁜 일')).not.toBeVisible();
    await expect(page.locator('text=슬픈 하루')).not.toBeVisible();
    await expect(page.locator('text=놀라운 발견')).not.toBeVisible();
    await expect(page.locator('text=특별한 하루')).not.toBeVisible();
  });

  test('놀랐어요 필터 선택 시 놀란 일기만 노출', async ({ page }) => {
    // 필터 선택박스에서 "놀랐어요" 선택
    await selectFilterOption(page, '놀랐어요');

    // 놀란 일기만 표시되는지 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=놀라운 발견')).toBeVisible();

    // 다른 감정의 일기는 표시되지 않는지 확인
    await expect(page.locator('text=오늘의 기쁜 일')).not.toBeVisible();
    await expect(page.locator('text=슬픈 하루')).not.toBeVisible();
    await expect(page.locator('text=화나는 일')).not.toBeVisible();
    await expect(page.locator('text=특별한 하루')).not.toBeVisible();
  });

  test('기타 필터 선택 시 기타 일기만 노출', async ({ page }) => {
    // 필터 선택박스에서 "기타" 선택
    await selectFilterOption(page, '기타');

    // 기타 일기만 표시되는지 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=특별한 하루')).toBeVisible();

    // 다른 감정의 일기는 표시되지 않는지 확인
    await expect(page.locator('text=오늘의 기쁜 일')).not.toBeVisible();
    await expect(page.locator('text=슬픈 하루')).not.toBeVisible();
    await expect(page.locator('text=화나는 일')).not.toBeVisible();
    await expect(page.locator('text=놀라운 발견')).not.toBeVisible();
  });

  test('빈 데이터에 대한 필터링 처리', async ({ page }) => {
    // 빈 데이터로 로컬스토리지 설정
    await page.evaluate(() => {
      localStorage.setItem('diaries', JSON.stringify([]));
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-container"]');

    // 빈 데이터 메시지 확인
    await expect(page.locator('text=작성된 일기가 없습니다')).toBeVisible();

    // 필터 옵션은 여전히 사용 가능한지 확인
    const filterContainer = page.locator('[data-testid="diary-filter-select"]');
    await expect(filterContainer).toBeVisible();
  });
});

test.describe('검색 결과 필터 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 테스트 데이터 설정
    await page.goto('/diaries');
    await page.evaluate((data) => {
      localStorage.setItem('diaries', JSON.stringify(data));
    }, testData);
    
    // 페이지 새로고침하여 데이터 로드
    await page.reload();
    
    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-container"]');
  });

  test('검색 후 필터 적용 - "오늘" 검색 후 행복해요 필터', async ({ page }) => {
    // 검색창에 "오늘의" 입력 (제목에 "오늘의"가 포함된 일기: 1)
    const searchInput = page.locator('input[placeholder*="검색어를 입력해 주세요"]');
    await searchInput.fill('오늘의');

    // 검색 결과가 필터링될 때까지 대기
    await page.waitForTimeout(200);

    // 검색 결과 확인 (1개: "오늘의 기쁜 일"(HAPPY))
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=오늘의 기쁜 일')).toBeVisible();

    // 필터를 "행복해요"로 변경
    await selectFilterOption(page, '행복해요');

    // 검색 결과 중에서 행복한 일기만 표시되는지 확인 (1개)
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('text=오늘의 기쁜 일')).toBeVisible();
  });

  test('검색 후 필터 적용 - "정말" 검색 후 슬퍼요 필터', async ({ page }) => {
    // 검색창에 "일" 입력 (제목에 "일"이 포함된 일기: "오늘의 기쁜 일"(ID 1, HAPPY), "화나는 일"(ID 3, ANGRY))
    const searchInput = page.locator('input[placeholder*="검색어를 입력해 주세요"]');
    await searchInput.fill('일');

    // 검색 결과가 필터링될 때까지 대기
    await page.waitForTimeout(200);

    // 검색 결과 확인 (2개: "오늘의 기쁜 일"(HAPPY), "화나는 일"(ANGRY))
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('text=오늘의 기쁜 일')).toBeVisible();
    await expect(page.locator('text=화나는 일')).toBeVisible();

    // 필터를 "슬퍼요"로 변경
    await selectFilterOption(page, '슬퍼요');

    // 검색 결과 중에서 슬픈 일기는 없으므로 빈 결과 확인
    await expect(diaryCards).toHaveCount(0);
    await expect(page.locator('text=작성된 일기가 없습니다')).toBeVisible();
  });

  test('검색 후 필터 적용 - "오늘" 검색 후 전체 필터로 복원', async ({ page }) => {
    // 검색창에 "하루" 입력 (제목에 "하루"가 포함된 일기: "슬픈 하루"(ID 2, SAD), "특별한 하루"(ID 5, ETC))
    const searchInput = page.locator('input[placeholder*="검색어를 입력해 주세요"]');
    await searchInput.fill('하루');

    // 검색 결과 확인 (2개)
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(2);

    // 필터를 "전체"로 변경
    await selectFilterOption(page, '전체');

    // 검색 결과가 그대로 유지되는지 확인
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('text=슬픈 하루')).toBeVisible();
    await expect(page.locator('text=특별한 하루')).toBeVisible();
  });
});
