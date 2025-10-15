"use client"

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import styles from './styles.module.css';

// SelectBox variant 타입 정의
export type SelectBoxVariant = 'primary' | 'secondary' | 'tertiary';
export type SelectBoxSize = 'small' | 'medium' | 'large';
export type SelectBoxTheme = 'light' | 'dark';

// 옵션 타입 정의
export interface SelectOption {
  /** 옵션의 고유 값 */
  value: string;
  /** 화면에 표시될 라벨 */
  label: string;
  /** 옵션 비활성화 여부 */
  disabled?: boolean;
}

// SelectBox 프롭스 인터페이스
export interface SelectBoxProps {
  /** SelectBox의 시각적 스타일 variant */
  variant?: SelectBoxVariant;
  /** SelectBox의 크기 */
  size?: SelectBoxSize;
  /** SelectBox의 테마 (light/dark) */
  theme?: SelectBoxTheme;
  /** 선택 가능한 옵션들 */
  options: SelectOption[];
  /** 현재 선택된 값 */
  value?: string;
  /** 기본 선택된 값 */
  defaultValue?: string;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 에러 상태 표시 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 라벨 텍스트 */
  label?: string;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 전체 너비 차지 여부 */
  fullWidth?: boolean;
  /** 값 변경 시 호출되는 콜백 */
  onChange?: (value: string, option: SelectOption) => void;
  /** 드롭다운 열림/닫힘 상태 변경 시 호출되는 콜백 */
  onToggle?: (isOpen: boolean) => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 고유 ID */
  id?: string;
}

/**
 * SelectBox 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * - 키보드 네비게이션 지원
 * - 접근성 완전 준수
 * 
 * @example
 * ```tsx
 * // 기본 primary selectbox
 * <SelectBox 
 *   options={[
 *     { value: 'all', label: '전체' },
 *     { value: 'option1', label: '옵션 1' },
 *     { value: 'option2', label: '옵션 2' }
 *   ]}
 *   placeholder="옵션을 선택하세요"
 * />
 * 
 * // 라벨과 도움말이 있는 selectbox
 * <SelectBox 
 *   label="카테고리" 
 *   options={options}
 *   helperText="원하는 카테고리를 선택해주세요"
 * />
 * 
 * // 에러 상태의 selectbox
 * <SelectBox 
 *   error
 *   errorMessage="필수 선택 항목입니다"
 *   options={options}
 * />
 * 
 * // 큰 사이즈의 secondary selectbox
 * <SelectBox 
 *   variant="secondary" 
 *   size="large"
 *   options={options}
 * />
 * ```
 */
export const SelectBox = forwardRef<HTMLDivElement, SelectBoxProps>(({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  options = [],
  value,
  defaultValue,
  placeholder = '선택하세요',
  error = false,
  errorMessage,
  helperText,
  label,
  disabled = false,
  fullWidth = false,
  onChange,
  onToggle,
  className,
  id,
}, ref) => {
  // 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // 참조
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  // 고유한 ID 생성
  const selectId = id || `selectbox-${Math.random().toString(36).substr(2, 9)}`;
  
  // 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === selectedValue);
  
  // 드롭다운 토글
  const toggleDropdown = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
    
    if (newIsOpen) {
      // 현재 선택된 항목에 포커스 설정
      const currentIndex = options.findIndex(option => option.value === selectedValue);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  };
  
  // 옵션 선택
  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    
    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value, option);
    onToggle?.(false);
    
    // 포커스를 트리거로 되돌림
    triggerRef.current?.focus();
  };
  
  // 키보드 이벤트 처리
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          toggleDropdown();
        } else if (focusedIndex >= 0) {
          selectOption(options[focusedIndex]);
        }
        break;
        
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          onToggle?.(false);
          triggerRef.current?.focus();
        }
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          toggleDropdown();
        } else {
          const nextIndex = Math.min(focusedIndex + 1, options.length - 1);
          setFocusedIndex(nextIndex);
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const prevIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
        }
        break;
        
      case 'Home':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(0);
        }
        break;
        
      case 'End':
        if (isOpen) {
          event.preventDefault();
          setFocusedIndex(options.length - 1);
        }
        break;
    }
  };
  
  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onToggle?.(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onToggle]);
  
  // value prop 변경 감지
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  // CSS 클래스 조합
  const containerClasses = [
    styles.container,
    theme === 'dark' && styles['container--dark'],
    fullWidth && styles['container--full-width'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const triggerClasses = [
    styles.trigger,
    styles[`trigger--${variant}`],
    styles[`trigger--${size}`],
    styles[`trigger--${theme}`],
    error && styles['trigger--error'],
    disabled && styles['trigger--disabled'],
    isOpen && styles['trigger--open'],
  ]
    .filter(Boolean)
    .join(' ');

  const dropdownClasses = [
    styles.dropdown,
    styles[`dropdown--${variant}`],
    styles[`dropdown--${size}`],
    styles[`dropdown--${theme}`],
    isOpen && styles['dropdown--open'],
  ]
    .filter(Boolean)
    .join(' ');

  // forwardRef와 containerRef 연결
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(containerRef.current);
      } else {
        ref.current = containerRef.current;
      }
    }
  }, [ref]);

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
    >
      {/* 라벨 */}
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}

      {/* 선택 트리거 */}
      <div className={styles.selectWrapper}>
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          className={triggerClasses}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={
            [
              errorMessage && `${selectId}-error`,
              helperText && `${selectId}-helper`,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.triggerText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          {/* 드롭다운 아이콘 */}
          <span 
            className={`${styles.triggerIcon} ${isOpen ? styles['triggerIcon--open'] : ''}`}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M7 10L12 15L17 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* 드롭다운 리스트 */}
        {isOpen && (
          <div className={dropdownClasses}>
            <ul
              ref={listRef}
              role="listbox"
              aria-labelledby={selectId}
              className={styles.optionList}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === selectedValue}
                  aria-disabled={option.disabled}
                  className={`
                    ${styles.option}
                    ${option.value === selectedValue ? styles['option--selected'] : ''}
                    ${index === focusedIndex ? styles['option--focused'] : ''}
                    ${option.disabled ? styles['option--disabled'] : ''}
                  `.trim()}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <span className={styles.optionText}>
                    {option.label}
                  </span>
                  {(option.value === selectedValue || index === focusedIndex) && (
                    <span className={styles.optionCheckIcon} aria-hidden="true">
                      <svg 
                        width={size === 'small' ? '14' : size === 'large' ? '18' : '16'} 
                        height={size === 'small' ? '14' : size === 'large' ? '18' : '16'} 
                        viewBox="0 0 16 16" 
                        fill="none"
                      >
                        <path 
                          d="M13.5 4.5L6 12L2.5 8.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && errorMessage && (
        <span id={`${selectId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </span>
      )}

      {/* 도움말 텍스트 */}
      {!error && helperText && (
        <span id={`${selectId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
});

// displayName 설정 (디버깅용)
SelectBox.displayName = 'SelectBox';

// 기본 export
export default SelectBox;
