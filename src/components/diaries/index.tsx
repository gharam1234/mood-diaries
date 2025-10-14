import React from 'react';
import styles from './styles.module.css';

/**
 * 다이어리 목록 컴포넌트
 * 와이어프레임 구조: gap -> search -> gap -> main -> gap -> pagination -> gap
 */
export const Diaries: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Gap 1: 1168 * 32 */}
      <div className={styles.gap32}></div>
      
      {/* Search 영역: 1168 * 48 */}
      <section className={styles.search}>
        <div className={styles.searchPlaceholder}>검색 영역</div>
      </section>
      
      {/* Gap 2: 1168 * 42 */}
      <div className={styles.gap42}></div>
      
      {/* Main 영역: 1168 * 936 */}
      <main className={styles.main}>
        <div className={styles.mainPlaceholder}>메인 콘텐츠 영역</div>
      </main>
      
      {/* Gap 3: 1168 * 40 */}
      <div className={styles.gap40}></div>
      
      {/* Pagination 영역: 1168 * 32 */}
      <section className={styles.pagination}>
        <div className={styles.paginationPlaceholder}>페이지네이션 영역</div>
      </section>
      
      {/* Gap 4: 1168 * 40 */}
      <div className={styles.gap40}></div>
    </div>
  );
};

export default Diaries;
