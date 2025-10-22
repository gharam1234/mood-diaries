import { test, expect } from '@playwright/test'

// 한국어 주석: func-modal-close TDD 시나리오 구현
// - /diaries 로드 후 일기쓰기 버튼으로 부모 모달 오픈
// - 닫기 클릭 시 등록취소(자식) 모달이 부모 위에 오버레이로 표시
// - 계속 작성: 자식만 닫히고 부모는 유지
// - 등록 취소: 자식과 부모 모두 닫힘

test('일기쓰기 닫기 플로우: 자식 모달 오버레이 및 닫힘 동작', async ({ page }) => {
  // 테스트 환경에서 로그인 검사 우회 (액션GUARD 무시)
  await page.addInitScript(() => {
    window.__TEST_BYPASS__ = true;
  });

  // 페이지 진입
  await page.goto('/diaries')

  // 네트워크 유휴 대기 금지 조건을 준수: 고정식별자 대기
  await expect(page.getByTestId('diaries-container')).toBeVisible()

  // 일기쓰기 버튼 클릭 → 부모(일기쓰기 폼) 모달 오픈
  await page.getByRole('button', { name: '일기쓰기' }).click()

  // 모달 오버레이 카운트 확인 (부모 1개)
  await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(1)

  // 부모 모달 내 닫기 버튼 클릭 → 자식(등록취소) 모달 오버레이로 추가
  await page.getByRole('button', { name: '닫기' }).click()
  await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(2)

  // 자식 모달의 계속 작성 클릭 → 최상단(자식)만 닫히고 부모 유지
  await page.getByRole('button', { name: '계속 작성' }).click()
  await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(1)

  // 다시 닫기 → 자식 모달 재오픈 후 등록 취소 클릭 → 모두 닫힘
  await page.getByRole('button', { name: '닫기' }).click()
  await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(2)
  await page.getByRole('button', { name: '등록 취소' }).click()
  await expect(page.locator('[data-testid="modal-overlay"]')).toHaveCount(0)
})


