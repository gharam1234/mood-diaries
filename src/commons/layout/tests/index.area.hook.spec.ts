import { test, expect } from '@playwright/test';

/**
 * Layout Area Visibility Hook 테스트
 * 
 * TDD 기반으로 구현된 URL 기반 영역 노출 제어 기능 테스트입니다.
 * - 페이지별 영역 노출 여부 테스트 (header, banner, navigation, footer)
 * - 동적 라우팅 지원 테스트 (/diaries/[id] 패턴)
 * - 기본 페이지 설정 테스트
 * - 스킵 대상 라우트 명시적 제외
 * - 에러 상황 및 예외 케이스 처리 테스트
 * 
 * @requires Playwright
 * @requires Next.js 개발 서버 (http://localhost:3000)
 */

// 테스트 데이터 정의
const testRoutes = [
  {
    path: '/diaries',
    name: '일기목록 페이지',
    expectation: {
      header: true,
      banner: true,
      navigation: true,
      footer: true
    }
  },
  {
    path: '/diaries/1',
    name: '일기상세 페이지',
    expectation: {
      header: true,
      banner: false,
      navigation: false,
      footer: true
    }
  },
  {
    path: '/diaries/123',
    name: '일기상세 페이지 (동적 라우팅)',
    expectation: {
      header: true,
      banner: false,
      navigation: false,
      footer: true
    }
  }
];

// 테스트 스킵 대상 라우트
const skipRoutes = ['/auth/login', '/auth/signup', '/pictures'];

// 에러 케이스 테스트 데이터
const errorRoutes = [
  {
    path: '/nonexistent',
    name: '존재하지 않는 페이지',
    expectation: {
      header: true,
      banner: true,
      navigation: true,
      footer: true
    }
  }
];

test.describe('Layout Area Visibility Hook', () => {
  
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 기본 설정
    // 페이지 로드 에러 무시 (404 페이지 테스트를 위해)
    page.on('pageerror', () => {});
    page.on('response', response => {
      // 404 응답도 정상적으로 처리
      if (response.status() === 404) {
        console.log(`404 response for ${response.url()}`);
      }
    });
  });
  testRoutes.forEach(({ path, name, expectation }) => {
    test(`${name} - 영역별 노출 여부 확인`, async ({ page }) => {
      // 페이지 이동 (baseUrl 제외, 경로만 사용)
      await page.goto(path);
      
      // 페이지 로드 완료 대기 (data-testid 기반, 기존 패턴과 일치하도록 timeout 증가)
      await page.waitForSelector('[data-testid="layout-container"]', { 
        timeout: 1000 
      });

      // Header 영역 검증
      const headerVisible = await page.isVisible('[data-testid="header"]');
      expect(headerVisible).toBe(expectation.header);
      
      if (expectation.header) {
        // 로고 노출 확인
        const logoVisible = await page.isVisible('[data-testid="logo"]');
        expect(logoVisible).toBe(true);
      }

      // Banner 영역 검증
      const bannerVisible = await page.isVisible('[data-testid="banner"]');
      expect(bannerVisible).toBe(expectation.banner);

      // Navigation 영역 검증
      const navigationVisible = await page.isVisible('[data-testid="navigation"]');
      expect(navigationVisible).toBe(expectation.navigation);

      // Footer 영역 검증
      const footerVisible = await page.isVisible('[data-testid="footer"]');
      expect(footerVisible).toBe(expectation.footer);
    });
  });

  // 기본 페이지 (루트) 테스트
  test('기본 페이지 - 모든 영역 노출', async ({ page }) => {
    // 페이지 이동 (baseUrl 제외, 경로만 사용)
    await page.goto('/');
    
    // 페이지 로드 완료 대기 (기존 패턴과 일치하도록 timeout 증가)
    await page.waitForSelector('[data-testid="layout-container"]', { 
      timeout: 1000 
    });

    // 모든 영역이 노출되어야 함 (기본 설정)
    const headerVisible = await page.isVisible('[data-testid="header"]');
    const bannerVisible = await page.isVisible('[data-testid="banner"]');
    const navigationVisible = await page.isVisible('[data-testid="navigation"]');
    const footerVisible = await page.isVisible('[data-testid="footer"]');

    expect(headerVisible).toBe(true);
    expect(bannerVisible).toBe(true);
    expect(navigationVisible).toBe(true);
    expect(footerVisible).toBe(true);
  });

  // 에러 케이스 및 예외 상황 테스트
  errorRoutes.forEach(({ path, name, expectation }) => {
    test(`${name} - 기본 설정 적용 확인`, async ({ page }) => {
      // 존재하지 않는 페이지로 이동
      await page.goto(path);
      
      // 페이지 로드 완료 대기 (404 페이지도 레이아웃은 렌더링됨)
      await page.waitForSelector('[data-testid="layout-container"]', { 
        timeout: 1000 
      });

      // 기본 설정에 따라 모든 영역이 노출되어야 함
      const headerVisible = await page.isVisible('[data-testid="header"]');
      const bannerVisible = await page.isVisible('[data-testid="banner"]');
      const navigationVisible = await page.isVisible('[data-testid="navigation"]');
      const footerVisible = await page.isVisible('[data-testid="footer"]');

      expect(headerVisible).toBe(expectation.header);
      expect(bannerVisible).toBe(expectation.banner);
      expect(navigationVisible).toBe(expectation.navigation);
      expect(footerVisible).toBe(expectation.footer);
    });
  });

  // 영역 간 상호작용 테스트
  test('영역 노출 상태가 페이지 이동 시 올바르게 변경됨', async ({ page }) => {
    // 1. 일기목록 페이지 (모든 영역 노출)
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 1000 });
    
    expect(await page.isVisible('[data-testid="header"]')).toBe(true);
    expect(await page.isVisible('[data-testid="banner"]')).toBe(true);
    expect(await page.isVisible('[data-testid="navigation"]')).toBe(true);
    expect(await page.isVisible('[data-testid="footer"]')).toBe(true);

    // 2. 일기상세 페이지로 이동 (banner, navigation 숨김)
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 1000 });
    
    expect(await page.isVisible('[data-testid="header"]')).toBe(true);
    expect(await page.isVisible('[data-testid="banner"]')).toBe(false);
    expect(await page.isVisible('[data-testid="navigation"]')).toBe(false);
    expect(await page.isVisible('[data-testid="footer"]')).toBe(true);

    // 3. 다시 일기목록으로 돌아가기 (모든 영역 노출)
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 1000 });
    
    expect(await page.isVisible('[data-testid="header"]')).toBe(true);
    expect(await page.isVisible('[data-testid="banner"]')).toBe(true);
    expect(await page.isVisible('[data-testid="navigation"]')).toBe(true);
    expect(await page.isVisible('[data-testid="footer"]')).toBe(true);
  });

  // 로고 노출 조건부 테스트
  test('Header 노출 시에만 로고가 표시됨', async ({ page }) => {
    // Header가 노출되는 페이지에서 로고 확인
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 1000 });
    
    const headerVisible = await page.isVisible('[data-testid="header"]');
    const logoVisible = await page.isVisible('[data-testid="logo"]');
    
    if (headerVisible) {
      expect(logoVisible).toBe(true);
    } else {
      expect(logoVisible).toBe(false);
    }
  });

  // 스킵 라우트에 대한 테스트 설명
  skipRoutes.forEach((route) => {
    test.skip(`${route} - 테스트 스킵 대상`, async () => {
      // 이 테스트는 요구사항에 따라 스킵됨
    });
  });
});
