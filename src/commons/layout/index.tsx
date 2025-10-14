import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * 메인 레이아웃 컴포넌트
 * 와이어프레임 구조: header -> gap -> banner -> gap -> navigation -> children -> footer
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Header 영역: 1168 * 60 */}
      <header className={styles.header}>
        <div className={styles.logo}>
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
          <div className={styles.activeTab}>
            <span className={styles.activeTabText}>일기보관함</span>
          </div>
          <div className={styles.inactiveTab}>
            <span className={styles.inactiveTabText}>사진보관함</span>
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
