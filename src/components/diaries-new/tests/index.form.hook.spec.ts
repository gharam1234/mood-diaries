import { test, expect } from '@playwright/test';

test.describe('일기 등록 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 전 로컬스토리지 초기화
    await page.goto('/diaries');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('일기쓰기 모달이 정상적으로 열리는지 확인', async ({ page }) => {
    // /diaries 페이지 로드 대기 (data-testid 기반)
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 일기쓰기 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();
    await expect(page.locator('text=일기 쓰기')).toBeVisible();
  });

  test('모든 필드가 입력되면 등록하기 버튼이 활성화되는지 확인', async ({ page }) => {
    // /diaries 페이지 로드 및 일기쓰기 모달 열기
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    await page.click('[data-testid="write-diary-button"]');
    
    // 초기 상태에서 등록하기 버튼 비활성화 확인
    const submitButton = page.locator('button:has-text("등록하기")');
    await expect(submitButton).toBeDisabled();
    
    // 감정 선택
    await page.click('input[name="emotion"][value="HAPPY"]');
    await expect(submitButton).toBeDisabled(); // 아직 비활성화
    
    // 제목 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', '테스트 제목');
    await expect(submitButton).toBeDisabled(); // 아직 비활성화
    
    // 내용 입력
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '테스트 내용');
    
    // 모든 필드 입력 후 등록하기 버튼 활성화 확인
    await expect(submitButton).toBeEnabled();
  });

  test('새로운 일기 등록 시 로컬스토리지에 정상 저장되는지 확인', async ({ page }) => {
    // /diaries 페이지 로드 및 일기쓰기 모달 열기
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    await page.click('[data-testid="write-diary-button"]');
    
    // 폼 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', '첫 번째 일기');
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '오늘은 정말 행복한 하루였다.');
    
    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');
    
    // 등록 완료 모달 확인
    await expect(page.locator('text=일기 등록 완료')).toBeVisible();
    await expect(page.locator('text=등록이 완료 되었습니다.')).toBeVisible();
    
    // 로컬스토리지 확인
    const diariesData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });
    
    expect(diariesData).toBeTruthy();
    expect(diariesData).toHaveLength(1);
    expect(diariesData[0]).toMatchObject({
      id: 1,
      title: '첫 번째 일기',
      content: '오늘은 정말 행복한 하루였다.',
      emotion: 'HAPPY'
    });
    expect(diariesData[0].createdAt).toBeTruthy();
  });

  test('기존 일기가 있을 때 새 일기 등록 시 ID가 올바르게 증가하는지 확인', async ({ page }) => {
    // 기존 데이터 설정
    await page.goto('/diaries');
    await page.evaluate(() => {
      const existingDiaries = [
        {
          id: 1,
          title: '기존 일기 1',
          content: '기존 내용 1',
          emotion: 'SAD',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 3,
          title: '기존 일기 3',
          content: '기존 내용 3',
          emotion: 'ANGRY',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ];
      localStorage.setItem('diaries', JSON.stringify(existingDiaries));
    });
    
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    await page.click('[data-testid="write-diary-button"]');
    
    // 새 일기 입력
    await page.click('input[name="emotion"][value="SURPRISE"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', '새로운 일기');
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '새로운 내용입니다.');
    
    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');
    
    // 등록 완료 모달 확인
    await expect(page.locator('text=일기 등록 완료')).toBeVisible();
    
    // 로컬스토리지 확인 - 새 ID가 4여야 함 (최대 ID 3 + 1)
    const diariesData = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });
    
    expect(diariesData).toHaveLength(3);
    type DiaryItem = { id: number; title: string; content: string; emotion: string; createdAt: string };
    const newDiary = (diariesData as DiaryItem[]).find((diary) => diary.title === '새로운 일기');
    expect(newDiary).toBeTruthy();
    expect(newDiary.id).toBe(4);
  });

  test('등록 완료 모달에서 확인 버튼 클릭 시 상세페이지로 이동하는지 확인', async ({ page }) => {
    // /diaries 페이지 로드 및 일기쓰기 모달 열기
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    await page.click('[data-testid="write-diary-button"]');
    
    // 폼 입력
    await page.click('input[name="emotion"][value="ETC"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', '상세페이지 테스트');
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '상세페이지로 이동 테스트');
    
    // 등록하기 버튼 클릭
    await page.click('button:has-text("등록하기")');
    
    // 등록 완료 모달에서 확인 버튼 클릭
    await page.click('button:has-text("확인")');
    
    // 상세페이지로 이동했는지 확인 (/diaries/1)
    await expect(page).toHaveURL('/diaries/1');
    
    // 모든 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible();
  });


  test('폼 유효성 검사가 올바르게 작동하는지 확인', async ({ page }) => {
    // /diaries 페이지 로드 및 일기쓰기 모달 열기
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 });
    await page.click('[data-testid="write-diary-button"]');
    
    const submitButton = page.locator('button:has-text("등록하기")');
    
    // 빈 상태에서 등록하기 버튼 비활성화 확인
    await expect(submitButton).toBeDisabled();
    
    // 제목만 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', '제목만 입력');
    await expect(submitButton).toBeDisabled();
    
    // 제목 삭제 후 내용만 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', '');
    await page.fill('textarea[placeholder="내용을 입력합니다."]', '내용만 입력');
    await expect(submitButton).toBeDisabled();
    
    // 제목, 내용 입력 후 감정만 없는 상태
    await page.fill('input[placeholder="제목을 입력합니다."]', '제목과 내용 입력');
    await expect(submitButton).toBeDisabled();
    
    // 모든 필드 입력 후 활성화 확인
    await page.click('input[name="emotion"][value="HAPPY"]');
    await expect(submitButton).toBeEnabled();
  });
});
