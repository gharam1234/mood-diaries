/**
 * 모달 링크 훅 Playwright 테스트
 * 
 * useModalLink 훅의 모달 열기/닫기 기능을 E2E 테스트합니다.
 * - 일기쓰기 버튼 클릭시 모달 열기
 * - 다양한 방법으로 모달 닫기 (배경 클릭, ESC 키, 닫기 버튼)
 * - 모달 내 컨텐츠 표시 확인
 * 
 * @example
 * ```bash
 * npm run test:e2e -- src/components/diaries/tests/index.link.modal.hook.spec.ts
 * ```
 */
import { test, expect } from '@playwright/test'

test.describe('모달 링크 훅 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries')
    
    // 페이지가 완전히 로드될 때까지 대기 (고정식별자 data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', { timeout: 500 })
  })

  test('일기쓰기 버튼 클릭시 모달이 열린다', async ({ page }) => {
    // 일기쓰기 버튼 찾기
    const writeButton = page.locator('button:has-text("일기쓰기")')
    await expect(writeButton).toBeVisible()

    // 모달이 처음에는 보이지 않는지 확인
    const modal = page.locator('[data-testid="modal-overlay"]')
    await expect(modal).not.toBeVisible()

    // 일기쓰기 버튼 클릭
    await writeButton.click()

    // 모달이 나타나는지 확인
    await expect(modal).toBeVisible({ timeout: 500 })
    
    // 모달 내용 확인 - 일기 쓰기 제목
    const modalTitle = page.locator('h1:has-text("일기 쓰기")')
    await expect(modalTitle).toBeVisible()
  })

  test('모달 배경 클릭시 모달이 닫힌다', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")')
    await writeButton.click()

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="modal-overlay"]')
    await expect(modal).toBeVisible()

    // 모달 배경 클릭 (모달 컨텐츠가 아닌 배경 영역)
    await modal.click({ position: { x: 50, y: 50 } })

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible({ timeout: 500 })
  })

  test('모달 내 닫기 버튼 클릭시 등록취소 모달이 추가로 열린다', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")')
    await writeButton.click()

    // 부모 모달이 열렸는지 확인 (오버레이 1개)
    await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(1)

    // 모달 내 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")')
    await expect(closeButton).toBeVisible()
    await closeButton.click()

    // 자식 모달이 추가로 열렸는지 확인 (오버레이 2개)
    await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(2)
    
    // 등록취소 모달의 내용이 표시되는지 확인
    await expect(page.getByText('일기 등록 취소')).toBeVisible()
    await expect(page.getByText('작성 중인 내용을 취소하시겠어요?')).toBeVisible()
  })

  test('ESC 키 누르면 모달이 닫힌다', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")')
    await writeButton.click()

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="modal-overlay"]')
    await expect(modal).toBeVisible()

    // ESC 키 누르기
    await page.keyboard.press('Escape')

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible({ timeout: 500 })
  })

  test('모달이 열렸을 때 감정 선택 라디오 버튼들이 표시된다', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")')
    await writeButton.click()

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="modal-overlay"]')
    await expect(modal).toBeVisible()

    // 감정 선택 제목 확인
    const emotionTitle = page.locator('h2:has-text("오늘 기분은 어땠나요?")')
    await expect(emotionTitle).toBeVisible()

    // 감정 라디오 버튼들 확인
    const emotionRadios = page.locator('input[name="emotion"]')
    await expect(emotionRadios).toHaveCount(5) // 5개의 감정 옵션

    // 각 감정 라벨 확인 (모달 내에서만)
    const emotionLabels = ['행복해요', '슬퍼요', '화나요', '놀랐어요', '기타']
    for (const label of emotionLabels) {
      await expect(modal.locator(`text=${label}`)).toBeVisible()
    }
  })

  test('모달이 열렸을 때 제목과 내용 입력 필드가 표시된다', async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('button:has-text("일기쓰기")')
    await writeButton.click()

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="modal-overlay"]')
    await expect(modal).toBeVisible()

    // 제목 입력 필드 확인
    const titleInput = page.locator('input[placeholder="제목을 입력합니다."]')
    await expect(titleInput).toBeVisible()

    // 내용 입력 필드 확인
    const contentTextarea = page.locator('textarea[placeholder="내용을 입력합니다."]')
    await expect(contentTextarea).toBeVisible()

    // 등록하기 버튼 확인
    const submitButton = page.locator('button:has-text("등록하기")')
    await expect(submitButton).toBeVisible()
  })
})
