'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { useLinkRouting } from './hooks/index.link.routing.hook';

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

  return (
    <div className={styles.layout}>
      {/* Header 영역: 1168 * 60 */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={handleLogoClick} data-testid="logo">
          <span className={styles.logoText}>민지의 다이어리</span>
        </div>
      </header>
      
      {/* Gap 1: 1168 * 24 */}
      <div className={styles.gap}></div>
      
      {/* Banner 영역: 1168 * 240 */}
      <section className={styles.banner}>
        <Image
          src="/images/banner.png"
          alt="배너 이미지"
          width={1168}
          height={240}
          className={styles.bannerImage}
        />
      </section>
      
      {/* Gap 2: 1168 * 24 */}
      <div className={styles.gap}></div>
      
      {/* Navigation 영역: 1168 * 48 */}
      <nav className={styles.navigation}>
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
      
      {/* Children 영역: 1168 * auto */}
      <main className={styles.children}>
        {children}
      </main>
      
      {/* Footer 영역: 1168 * 160 */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTitle}>민지의 다이어리</div>
          <div className={styles.footerInfo}>
            <div className={styles.footerRepresentative}>대표 : {'{name}'}</div>
            <div className={styles.footerCopyright}>Copyright © 2024. {'{name}'} Co., Ltd.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
