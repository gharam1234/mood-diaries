import React, { forwardRef } from 'react';
import styles from './styles.module.css';

// Input variant 타입 정의
export type InputVariant = 'primary' | 'secondary' | 'tertiary';
export type InputSize = 'small' | 'medium' | 'large';
export type InputTheme = 'light' | 'dark';

// Input 프롭스 인터페이스 (HTML size 속성과 충돌 방지를 위해 Omit 사용)
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input의 시각적 스타일 variant */
  variant?: InputVariant;
  /** Input의 크기 */
  size?: InputSize;
  /** Input의 테마 (light/dark) */
  theme?: InputTheme;
  /** Input 앞에 표시될 아이콘 */
  startIcon?: React.ReactNode;
  /** Input 뒤에 표시될 아이콘 */
  endIcon?: React.ReactNode;
  /** 에러 상태 표시 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 라벨 텍스트 */
  label?: string;
  /** 전체 너비 차지 여부 */
  fullWidth?: boolean;
  /** 입력 필드 오른쪽에 버튼 추가 */
  endButton?: React.ReactNode;
}

/**
 * Input 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * - 아이콘 지원 (startIcon, endIcon)
 * - 에러 상태 지원
 * - 접근성 완전 준수
 * 
 * @example
 * ```tsx
 * // 기본 primary input
 * <Input placeholder="텍스트를 입력하세요" />
 * 
 * // 라벨과 도움말이 있는 input
 * <Input 
 *   label="이메일" 
 *   placeholder="이메일을 입력하세요"
 *   helperText="올바른 이메일 형식으로 입력해주세요"
 * />
 * 
 * // 에러 상태의 input
 * <Input 
 *   error
 *   errorMessage="필수 입력 항목입니다"
 *   placeholder="텍스트를 입력하세요"
 * />
 * 
 * // 아이콘이 있는 secondary input
 * <Input 
 *   variant="secondary" 
 *   startIcon={<SearchIcon />}
 *   placeholder="검색어를 입력하세요"
 * />
 * 
 * // 끝에 버튼이 있는 input (피그마 디자인 기반)
 * <Input 
 *   placeholder="회고를 남겨보세요"
 *   endButton={<button className="submit-btn">입력</button>}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  startIcon,
  endIcon,
  error = false,
  errorMessage,
  helperText,
  label,
  fullWidth = false,
  endButton,
  disabled = false,
  className,
  id,
  ...props
}, ref) => {
  // 고유한 ID 생성 (라벨과 연결용)
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // CSS 클래스 조합
  const containerClasses = [
    styles.container,
    theme === 'dark' && styles['container--dark'],
    fullWidth && styles['container--full-width'],
  ]
    .filter(Boolean)
    .join(' ');

  const inputWrapperClasses = [
    styles.inputWrapper,
    styles[`inputWrapper--${variant}`],
    styles[`inputWrapper--${size}`],
    styles[`inputWrapper--${theme}`],
    error && styles['inputWrapper--error'],
    disabled && styles['inputWrapper--disabled'],
    startIcon && styles['inputWrapper--with-start-icon'],
    endIcon && styles['inputWrapper--with-end-icon'],
    endButton && styles['inputWrapper--with-end-button'],
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

  return (
    <div className={containerClasses}>
      {/* 라벨 */}
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      {/* 입력 필드 래퍼 */}
      <div className={inputWrapperClasses}>
        {/* 시작 아이콘 */}
        {startIcon && (
          <span className={styles.startIcon} aria-hidden="true">
            {startIcon}
          </span>
        )}

        {/* 입력 필드 */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={
            [
              errorMessage && `${inputId}-error`,
              helperText && `${inputId}-helper`,
            ]
              .filter(Boolean)
              .join(' ') || undefined
          }
          {...props}
        />

        {/* 끝 아이콘 */}
        {endIcon && !endButton && (
          <span className={styles.endIcon} aria-hidden="true">
            {endIcon}
          </span>
        )}

        {/* 끝 버튼 (피그마 디자인 기반) */}
        {endButton && (
          <div className={styles.endButton}>
            {endButton}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && errorMessage && (
        <span id={`${inputId}-error`} className={styles.errorMessage} role="alert">
          {errorMessage}
        </span>
      )}

      {/* 도움말 텍스트 */}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
});

// displayName 설정 (디버깅용)
Input.displayName = 'Input';

// 기본 export
export default Input;
