"use client"
import React, { forwardRef } from 'react';
import styles from './styles.module.css';

// SearchBar variant 타입 정의
export type SearchBarVariant = 'primary' | 'secondary' | 'tertiary';
export type SearchBarSize = 'small' | 'medium' | 'large';
export type SearchBarTheme = 'light' | 'dark';

// SearchBar 프롭스 인터페이스 (HTML size 속성과 충돌 방지를 위해 Omit 사용)
export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** SearchBar의 시각적 스타일 variant */
  variant?: SearchBarVariant;
  /** SearchBar의 크기 */
  size?: SearchBarSize;
  /** SearchBar의 테마 (light/dark) */
  theme?: SearchBarTheme;
  /** 검색 아이콘 표시 여부 */
  showSearchIcon?: boolean;
  /** 검색 버튼 표시 여부 */
  showSearchButton?: boolean;
  /** 검색 버튼 텍스트 */
  searchButtonText?: string;
  /** 검색 실행 콜백 */
  onSearch?: (value: string) => void;
  /** 클리어 버튼 표시 여부 */
  showClearButton?: boolean;
  /** 클리어 실행 콜백 */
  onClear?: () => void;
  /** 전체 너비 차지 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 표시 */
  loading?: boolean;
}

/**
 * SearchBar 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * - 검색 아이콘 및 버튼 지원
 * - 클리어 기능 지원
 * - 접근성 완전 준수
 * 
 * @example
 * ```tsx
 * // 기본 primary searchbar
 * <SearchBar placeholder="검색어를 입력해 주세요." />
 * 
 * // 검색 버튼이 있는 searchbar
 * <SearchBar 
 *   placeholder="검색어를 입력해 주세요."
 *   showSearchButton
 *   onSearch={(value) => console.log('검색:', value)}
 * />
 * 
 * // 클리어 버튼이 있는 secondary searchbar
 * <SearchBar 
 *   variant="secondary"
 *   placeholder="검색어를 입력해 주세요."
 *   showClearButton
 *   onClear={() => console.log('클리어')}
 * />
 * 
 * // 큰 사이즈의 tertiary searchbar
 * <SearchBar 
 *   variant="tertiary" 
 *   size="large" 
 *   theme="dark"
 *   placeholder="검색어를 입력해 주세요."
 *   showSearchIcon
 * />
 * 
 * // 로딩 상태의 전체 너비 searchbar
 * <SearchBar 
 *   loading 
 *   fullWidth
 *   placeholder="검색 중..."
 * />
 * ```
 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  showSearchIcon = true,
  showSearchButton = false,
  searchButtonText = '검색',
  onSearch,
  showClearButton = false,
  onClear,
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  value,
  onChange,
  onKeyDown,
  id,
  ...props
}, ref) => {
  // 고유한 ID 생성
  const searchBarId = id || `searchbar-${Math.random().toString(36).substr(2, 9)}`;
  
  // 검색 실행 핸들러
  const handleSearch = () => {
    if (onSearch && typeof value === 'string') {
      onSearch(value);
    }
  };

  // 클리어 실행 핸들러
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && !loading) {
      handleSearch();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // CSS 클래스 조합
  const containerClasses = [
    styles.container,
    theme === 'dark' && styles['container--dark'],
    fullWidth && styles['container--full-width'],
  ]
    .filter(Boolean)
    .join(' ');

  const searchBarWrapperClasses = [
    styles.searchBarWrapper,
    styles[`searchBarWrapper--${variant}`],
    styles[`searchBarWrapper--${size}`],
    styles[`searchBarWrapper--${theme}`],
    disabled && styles['searchBarWrapper--disabled'],
    loading && styles['searchBarWrapper--loading'],
    showSearchIcon && styles['searchBarWrapper--with-search-icon'],
    showSearchButton && styles['searchBarWrapper--with-search-button'],
    showClearButton && styles['searchBarWrapper--with-clear-button'],
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    styles.input,
    styles[`input--${variant}`],
    styles[`input--${size}`],
    styles[`input--${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hasValue = value && typeof value === 'string' && value.length > 0;

  return (
    <div className={containerClasses}>
      <div className={searchBarWrapperClasses}>
        {/* 검색 아이콘 */}
        {showSearchIcon && (
          <span className={styles.searchIcon} aria-hidden="true">
            <img 
              src="/icons/search_outline_light_m.svg" 
              alt="" 
              width="24" 
              height="24"
            />
          </span>
        )}

        {/* 로딩 표시 */}
        {loading && (
          <span className={styles.loading} aria-hidden="true">
            로딩중...
          </span>
        )}

        {/* 입력 필드 */}
        <input
          ref={ref}
          id={searchBarId}
          className={inputClasses}
          disabled={disabled || loading}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          aria-label="검색어 입력"
          role="searchbox"
          {...props}
        />

        {/* 클리어 버튼 */}
        {showClearButton && hasValue && !loading && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            disabled={disabled}
            aria-label="검색어 지우기"
          >
            <img 
              src="/icons/close_outline_light_s.svg" 
              alt="" 
              width="20" 
              height="20"
            />
          </button>
        )}

        {/* 검색 버튼 */}
        {showSearchButton && (
          <button
            type="button"
            className={styles.searchButton}
            onClick={handleSearch}
            disabled={disabled || loading}
            aria-label="검색 실행"
          >
            {searchButtonText}
          </button>
        )}
      </div>
    </div>
  );
});

// displayName 설정 (디버깅용)
SearchBar.displayName = 'SearchBar';

// 기본 export
export default SearchBar;
