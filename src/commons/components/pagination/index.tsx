import React from 'react';
import styles from './styles.module.css';

// Pagination variant 타입 정의
export type PaginationVariant = 'primary' | 'secondary' | 'tertiary';
export type PaginationSize = 'small' | 'medium' | 'large';
export type PaginationTheme = 'light' | 'dark';

// Pagination 프롭스 인터페이스
export interface PaginationProps {
  /** 현재 활성화된 페이지 번호 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 호출되는 콜백 함수 */
  onPageChange: (page: number) => void;
  /** Pagination의 시각적 스타일 variant */
  variant?: PaginationVariant;
  /** Pagination의 크기 */
  size?: PaginationSize;
  /** Pagination의 테마 (light/dark) */
  theme?: PaginationTheme;
  /** 표시할 최대 페이지 번호 개수 */
  maxVisiblePages?: number;
  /** 이전/다음 버튼 표시 여부 */
  showPrevNext?: boolean;
  /** 첫번째/마지막 페이지로 이동 버튼 표시 여부 */
  showFirstLast?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 접근성 라벨 */
  'aria-label'?: string;
}

/**
 * Pagination 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * - 페이지 번호 표시 및 네비게이션
 * - 접근성 완전 준수
 * 
 * @example
 * ```tsx
 * // 기본 pagination
 * <Pagination 
 *   currentPage={1} 
 *   totalPages={10} 
 *   onPageChange={(page) => console.log(page)} 
 * />
 * 
 * // 큰 사이즈의 secondary pagination
 * <Pagination 
 *   currentPage={5}
 *   totalPages={20}
 *   variant="secondary" 
 *   size="large"
 *   onPageChange={handlePageChange}
 *   maxVisiblePages={7}
 * />
 * 
 * // 다크 테마의 pagination
 * <Pagination 
 *   currentPage={3}
 *   totalPages={15}
 *   theme="dark"
 *   showFirstLast={true}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  maxVisiblePages = 5,
  showPrevNext = true,
  showFirstLast = false,
  disabled = false,
  className,
  'aria-label': ariaLabel = '페이지네이션',
  ...props
}) => {
  // 페이지 범위 계산 함수
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 표시할 최대 개수보다 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 복잡한 페이지네이션 로직
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // 끝에 가까우면 시작점 조정
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // 첫 페이지와 '...' 처리
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // 중간 페이지들
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // 마지막 페이지와 '...' 처리
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // 페이지 변경 핸들러
  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };

  // 이전 페이지로 이동
  const handlePrevious = () => {
    if (currentPage > 1 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages && !disabled) {
      onPageChange(currentPage + 1);
    }
  };

  // CSS 클래스 조합
  const paginationClasses = [
    styles.pagination,
    styles[`pagination--${variant}`],
    styles[`pagination--${size}`],
    styles[`pagination--${theme}`],
    disabled && styles['pagination--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const pages = getPageNumbers();

  return (
    <nav 
      className={paginationClasses}
      aria-label={ariaLabel}
      role="navigation"
      {...props}
    >
      {/* 첫 번째 페이지 버튼 */}
      {showFirstLast && currentPage > 1 && (
        <button
          className={`${styles.pageButton} ${styles.pageButton__first}`}
          onClick={() => handlePageClick(1)}
          disabled={disabled}
          aria-label="첫 번째 페이지로 이동"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41z" fill="currentColor"/>
            <path d="M6 6h2v12H6V6z" fill="currentColor"/>
          </svg>
        </button>
      )}

      {/* 이전 페이지 버튼 */}
      {showPrevNext && (
        <button
          className={`${styles.pageButton} ${styles.pageButton__prev}`}
          onClick={handlePrevious}
          disabled={currentPage <= 1 || disabled}
          aria-label="이전 페이지로 이동"
          data-testid="pagination-prev"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
          </svg>
        </button>
      )}

      {/* 페이지 번호들 */}
      <div className={styles.pageNumbers}>
        {pages.map((page, index) => (
          <React.Fragment key={`page-${page}-${index}`}>
            {typeof page === 'number' ? (
              <button
                className={`${styles.pageButton} ${styles.pageButton__number} ${
                  page === currentPage ? styles['pageButton--active'] : ''
                }`}
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`${page}페이지로 이동`}
                data-testid={`pagination-page-${page}`}
              >
                {page}
              </button>
            ) : (
              <span className={styles.ellipsis} aria-hidden="true">
                {page}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 다음 페이지 버튼 */}
      {showPrevNext && (
        <button
          className={`${styles.pageButton} ${styles.pageButton__next}`}
          onClick={handleNext}
          disabled={currentPage >= totalPages || disabled}
          aria-label="다음 페이지로 이동"
          data-testid="pagination-next"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
          </svg>
        </button>
      )}

      {/* 마지막 페이지 버튼 */}
      {showFirstLast && currentPage < totalPages && (
        <button
          className={`${styles.pageButton} ${styles.pageButton__last}`}
          onClick={() => handlePageClick(totalPages)}
          disabled={disabled}
          aria-label="마지막 페이지로 이동"
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41z" fill="currentColor"/>
            <path d="M16 6h2v12h-2V6z" fill="currentColor"/>
          </svg>
        </button>
      )}
    </nav>
  );
};

// 기본 export
export default Pagination;
