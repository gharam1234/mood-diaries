import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정 파일
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // // 테스트 파일 위치
  // testDir: './tests',
  
  // // 전역 설정
  // fullyParallel: true,
  // forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : undefined,
  
  // // 리포터 설정
  // reporter: 'html',
  
  // 공통 테스트 설정
  use: {
    // 기본 URL (개발 서버)
    baseURL: 'http://localhost:3000',
    
    // 스크린샷 및 비디오 설정
    // trace: 'on-first-retry',
    // screenshot: 'only-on-failure',
  },

  // 브라우저 프로젝트 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // 모바일 테스트 (필요시 주석 해제)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // 개발 서버 설정 (테스트 실행 시 자동으로 Next.js 서버 시작)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
