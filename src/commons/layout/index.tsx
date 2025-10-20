'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useLinkRouting } from './hooks/index.link.routing.hook';
import { useAreaVisibility } from './hooks/index.area.hook';
import { Button } from '../components/button';

// Layout 컴포넌트 Props 타입 정의
export interface LayoutProps {
  /** 레이아웃 내부에 렌더링될 자식 요소들 */
  children: React.ReactNode;
}

/**
 * 메인 레이아웃 컴포넌트
 * 와이어프레임 구조: header -> gap -> banner -> gap -> navigation -> children -> footer
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    isDiariesActive,
    isPicturesActive,
  } = useLinkRouting();

  // URL 기반 영역 노출 여부 가져오기
  const areaVisibility = useAreaVisibility();

  // 로컬스토리지에서 사용자 이름 가져오기
  const [userName, setUserName] = React.useState<string>('');

  // 로컬스토리지에서 사용자 정보를 가져오는 함수
  const loadUserName = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.name || '');
        } else {
          setUserName('');
        }
      } catch (error) {
        console.error('로컬스토리지에서 사용자 데이터를 가져오는 중 오류 발생:', error);
        setUserName('');
      }
    }
  }, []);

  React.useEffect(() => {
    // 초기 로드
    loadUserName();

    // 로컬스토리지 변경 감지 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUserName();
      }
    };

    // 커스텀 이벤트 감지 (같은 탭에서의 변경 감지)
    const handleUserDataChange = () => {
      loadUserName();
    };

    // 주기적 체크 (1초마다)
    const intervalId = setInterval(() => {
      loadUserName();
    }, 1000);

    // 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataChanged', handleUserDataChange);

    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChange);
      clearInterval(intervalId);
    };
  }, [loadUserName]);

  return (
    <div className={styles.layout} data-testid="layout-container">
      {/* Header 영역: 1168 * 60 - 조건부 렌더링 */}
      {areaVisibility.header.visible && (
        <header className={styles.header} data-testid="header">
          {areaVisibility.header.logo && (
            <div className={styles.logo} onClick={handleLogoClick} data-testid="logo">
              <span className={styles.logoText}>민지의 다이어리</span>
            </div>
          )}
          
          {/* 인증 상태 UI - 로그인/비로그인 상태 구분 */}
          <div className={styles.authStatus}>
            {userName ? (
              // 로그인 상태: 사용자 이름 + 로그아웃 버튼
              <>
                <span className={styles.userName}>
                  {userName}님
                </span>
                <Button
                  variant="secondary"
                  theme="light"
                  size="medium"
                  className={styles.logoutButton}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              // 비로그인 상태: 로그인 버튼만
              <Button
                variant="primary"
                theme="light"
                size="medium"
                className={styles.loginButton}
              >
                로그인
              </Button>
            )}
          </div>
        </header>
      )}
      
      {/* Gap 1: 1168 * 24 - Header가 있을 때만 노출 */}
      {areaVisibility.header.visible && <div className={styles.gap}></div>}
      
      {/* Banner 영역: 1168 * 240 - 조건부 렌더링 */}
      {areaVisibility.banner && (
        <section className={styles.banner} data-testid="banner">
          <Image
            src="/images/banner.png"
            alt="배너 이미지"
            width={1168}
            height={240}
            className={styles.bannerImage}
          />
        </section>
      )}
      
      {/* Gap 2: 1168 * 24 - Banner가 있을 때만 노출 */}
      {areaVisibility.banner && <div className={styles.gap}></div>}
      
      {/* Navigation 영역: 1168 * 48 - 조건부 렌더링 */}
      {areaVisibility.navigation && (
        <nav className={styles.navigation} data-testid="navigation">
          <div className={styles.navTabs}>
            <div 
              className={isDiariesActive() ? styles.activeTab : styles.inactiveTab}
              onClick={handleDiariesClick}
              data-testid="diaries-tab"
            >
              <span className={isDiariesActive() ? styles.activeTabText : styles.inactiveTabText}>
                일기보관함
              </span>
            </div>
            <div 
              className={isPicturesActive() ? styles.activeTab : styles.inactiveTab}
              onClick={handlePicturesClick}
              data-testid="pictures-tab"
            >
              <span className={isPicturesActive() ? styles.activeTabText : styles.inactiveTabText}>
                사진보관함
              </span>
            </div>
          </div>
        </nav>
      )}
      
      {/* Children 영역: 1168 * auto */}
      <main className={styles.children}>
        {children}
      </main>
      
      {/* Footer 영역: 1168 * 160 - 조건부 렌더링 */}
      {areaVisibility.footer && (
        <footer className={styles.footer} data-testid="footer">
          <div className={styles.footerContent}>
            <div className={styles.footerTitle}>민지의 다이어리</div>
            <div className={styles.footerInfo}>
              <div className={styles.footerRepresentative}>대표 : {'{name}'}</div>
              <div className={styles.footerCopyright}>Copyright © 2024. {'{name}'} Co., Ltd.</div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
