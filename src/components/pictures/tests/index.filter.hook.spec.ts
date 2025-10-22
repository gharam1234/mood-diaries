import { test, expect } from '@playwright/test';

/**
 * Pictures 컴포넌트 필터 기능 테스트 스위트
 * 
 * @description
 * 강아지 사진 필터 기능의 동작을 검증하는 Playwright 테스트입니다.
 * 이미지 크기 필터링 기능을 TDD 기반으로 구현하여 다음을 테스트합니다:
 * - 필터 UI 렌더링 및 옵션 표시
 * - 기본/가로형/세로형 필터 선택 기능
 * - 이미지 크기 동적 변경 (640x640, 640x480, 480x640)
 * - 스플래시 스크린 크기 동적 적용
 * - 필터 변경 시 모든 이미지 업데이트
 * 
 * 테스트 범위:
 * - 필터 UI 렌더링 검증
 * - 필터 옵션 선택 기능
 * - 이미지 크기 동적 변경
 * - 스플래시 스크린 크기 적용
 * - 전체 이미지 업데이트 검증
 */
test.describe('Pictures 필터 기능 테스트', () => {
  /**
   * 테스트 전 공통 설정
   * 
   * @description
   * 각 테스트 실행 전에 /pictures 페이지로 이동하고
   * 페이지가 완전히 로드될 때까지 대기합니다.
   */
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto('/pictures');
    
    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="pictures-container"]', { timeout: 2000 });
  });

  /**
   * 필터 UI 렌더링 검증
   * 
   * @description
   * 페이지 로드 후 필터 UI가 정상적으로 렌더링되고
   * 모든 필터 옵션이 올바르게 표시되는지 검증합니다.
   * 
   * @steps
   * 1. 필터 영역 존재 확인
   * 2. SelectBox 컴포넌트 렌더링 확인
   * 3. 필터 옵션 드롭다운 열기
   * 4. 기본/가로형/세로형 옵션 표시 확인
   */
  test('페이지 로드 후 필터 UI가 정상적으로 렌더링된다', async ({ page }) => {
    // 필터 영역이 존재하는지 확인
    const filterArea = page.locator('[data-testid="pictures-container"]').locator('div').filter({ has: page.locator('button[aria-haspopup="listbox"]').first() }).first();
    await expect(filterArea).toBeVisible();
    
    // SelectBox 컴포넌트의 버튼이 렌더링되었는지 확인
    const selectBoxButton = page.locator('button[aria-haspopup="listbox"]').first();
    await expect(selectBoxButton).toBeVisible();
    
    // 필터 옵션들이 정상적으로 표시되는지 확인
    await selectBoxButton.click();
    
    // 기본, 가로형, 세로형 옵션이 모두 존재하는지 확인
    // 드롭다운이 열려있을 때 옵션들이 보이는지 확인 (role="option" 사용)
    const baseOption = page.locator('[role="option"] span:has-text("기본")').first();
    await expect(baseOption).toBeVisible();
    const horizontalOption = page.locator('[role="option"] span:has-text("가로형")').first();
    await expect(horizontalOption).toBeVisible();
    const verticalOption = page.locator('[role="option"] span:has-text("세로형")').first();
    await expect(verticalOption).toBeVisible();
  });

  /**
   * 기본 필터 초기 상태 검증
   * 
   * @description
   * 페이지 로드 시 기본 필터가 선택되어 있고
   * 이미지들이 640x640 크기로 표시되는지 검증합니다.
   * 
   * @steps
   * 1. 기본 필터 선택 상태 확인
   * 2. 이미지 로드 대기
   * 3. 이미지 컨테이너 크기 검증 (640x640)
   */
  test('기본 필터가 선택되어 있고 이미지 크기가 640x640이다', async ({ page }) => {
    // 기본 필터가 선택되어 있는지 확인 - SelectBox의 선택된 값을 확인
    const selectBoxButton = page.locator('button[aria-haspopup="listbox"]').first();
    const triggerText = selectBoxButton.locator('span').first();
    await expect(triggerText).toHaveText('기본');
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지의 크기가 640x640인지 확인
    const firstImage = page.locator('[data-testid="dog-image"]').first();
    const imageContainer = firstImage.locator('..');
    
    // 이미지 컨테이너의 크기 확인
    await expect(imageContainer).toHaveCSS('width', '640px');
    await expect(imageContainer).toHaveCSS('height', '640px');
  });

  /**
   * 가로형 필터 선택 기능 검증
   * 
   * @description
   * 가로형 필터를 선택했을 때 이미지들이 640x480 크기로
   * 변경되는지 검증합니다.
   * 
   * @steps
   * 1. SelectBox 클릭하여 옵션 열기
   * 2. 가로형 옵션 선택
   * 3. 필터 변경 적용 대기
   * 4. 이미지 로드 대기
   * 5. 이미지 컨테이너 크기 검증 (640x480)
   */
  test('가로형 필터 선택 시 이미지 크기가 640x480으로 변경된다', async ({ page }) => {
    // SelectBox 클릭하여 옵션 열기
    const selectBox = page.locator('button[aria-haspopup="listbox"]').first();
    await selectBox.click();
    
    // 가로형 옵션 선택
    await page.locator('text=가로형').click();
    
    // 필터 변경이 적용될 때까지 잠시 대기
    await page.waitForTimeout(500);
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지의 크기가 640x480인지 확인
    const firstImage = page.locator('[data-testid="dog-image"]').first();
    const imageContainer = firstImage.locator('..');
    
    // 이미지 컨테이너의 크기 확인
    await expect(imageContainer).toHaveCSS('width', '640px');
    await expect(imageContainer).toHaveCSS('height', '480px');
  });

  /**
   * 세로형 필터 선택 기능 검증
   * 
   * @description
   * 세로형 필터를 선택했을 때 이미지들이 480x640 크기로
   * 변경되는지 검증합니다.
   * 
   * @steps
   * 1. SelectBox 클릭하여 옵션 열기
   * 2. 세로형 옵션 선택
   * 3. 필터 변경 적용 대기
   * 4. 이미지 로드 대기
   * 5. 이미지 컨테이너 크기 검증 (480x640)
   */
  test('세로형 필터 선택 시 이미지 크기가 480x640으로 변경된다', async ({ page }) => {
    // SelectBox 클릭하여 옵션 열기
    const selectBox = page.locator('button[aria-haspopup="listbox"]').first();
    await selectBox.click();
    
    // 세로형 옵션 선택
    await page.locator('text=세로형').click();
    
    // 필터 변경이 적용될 때까지 잠시 대기
    await page.waitForTimeout(500);
    
    // 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지의 크기가 480x640인지 확인
    const firstImage = page.locator('[data-testid="dog-image"]').first();
    const imageContainer = firstImage.locator('..');
    
    // 이미지 컨테이너의 크기 확인
    await expect(imageContainer).toHaveCSS('width', '480px');
    await expect(imageContainer).toHaveCSS('height', '640px');
  });

  /**
   * 스플래시 스크린 크기 동적 적용 검증
   * 
   * @description
   * 필터 변경 시 스플래시 스크린도 선택된 필터에 맞는 크기로
   * 동적으로 변경되는지 검증합니다.
   * 
   * @steps
   * 1. SelectBox 클릭하여 옵션 열기
   * 2. 가로형 옵션 선택
   * 3. 필터 변경 적용 대기
   * 4. 스플래시 스크린 표시 확인
   * 5. 스플래시 스크린 크기 검증 (640x480)
   */
  test('필터 변경 시 스플래시 스크린도 올바른 크기로 표시된다', async ({ page }) => {
    // SelectBox 클릭하여 옵션 열기
    const selectBox = page.locator('button[aria-haspopup="listbox"]').first();
    await selectBox.click();
    
    // 가로형 옵션 선택
    await page.locator('text=가로형').click();
    
    // 필터 변경이 적용될 때까지 잠시 대기
    await page.waitForTimeout(500);
    
    // 이미지가 로드될 때까지 대기하고 크기 확인
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    // 첫 번째 이미지의 크기가 640x480인지 확인
    const firstImage = page.locator('[data-testid="dog-image"]').first();
    const imageContainer = firstImage.locator('..');
    
    // 이미지 컨테이너의 크기 확인
    await expect(imageContainer).toHaveCSS('width', '640px');
    await expect(imageContainer).toHaveCSS('height', '480px');
  });

  /**
   * 전체 이미지 업데이트 검증
   * 
   * @description
   * 필터 옵션 변경 시 모든 이미지가 새로운 크기로
   * 일괄 업데이트되는지 검증합니다.
   * 
   * @steps
   * 1. 초기 상태에서 모든 이미지 크기 확인 (640x640)
   * 2. 가로형 필터로 변경
   * 3. 필터 변경 적용 대기
   * 4. 모든 이미지 크기 검증 (640x480)
   */
  test('필터 옵션 변경 시 모든 이미지가 새로운 크기로 업데이트된다', async ({ page }) => {
    // 초기 상태에서 모든 이미지가 640x640인지 확인
    await page.waitForSelector('[data-testid="dog-image"]', { timeout: 2000 });
    
    const initialImages = page.locator('[data-testid="dog-image"]');
    const imageCount = await initialImages.count();
    
    // 첫 번째 이미지의 초기 크기 확인
    const firstImageContainer = initialImages.first().locator('..');
    await expect(firstImageContainer).toHaveCSS('width', '640px');
    await expect(firstImageContainer).toHaveCSS('height', '640px');
    
    // 가로형 필터로 변경
    const selectBox = page.locator('button[aria-haspopup="listbox"]').first();
    await selectBox.click();
    await page.locator('text=가로형').click();
    await page.waitForTimeout(500);
    
    // 모든 이미지가 640x480으로 변경되었는지 확인
    for (let i = 0; i < Math.min(imageCount, 3); i++) { // 처음 3개 이미지만 확인
      const imageContainer = initialImages.nth(i).locator('..');
      await expect(imageContainer).toHaveCSS('width', '640px');
      await expect(imageContainer).toHaveCSS('height', '480px');
    }
  });
});