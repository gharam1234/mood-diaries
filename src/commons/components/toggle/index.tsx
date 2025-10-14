import React from 'react';
import styles from './styles.module.css';

// Toggle variant 타입 정의
export type ToggleVariant = 'primary' | 'secondary' | 'tertiary';
export type ToggleSize = 'small' | 'medium' | 'large';
export type ToggleTheme = 'light' | 'dark';

// Toggle 프롭스 인터페이스
export interface ToggleProps {
  /** Toggle의 시각적 스타일 variant */
  variant?: ToggleVariant;
  /** Toggle의 크기 */
  size?: ToggleSize;
  /** Toggle의 테마 (light/dark) */
  theme?: ToggleTheme;
  /** Toggle의 현재 상태 (켜짐/꺼짐) */
  checked?: boolean;
  /** 기본 체크 상태 (비제어 컴포넌트용) */
  defaultChecked?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 상태 변경 콜백 함수 */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 접근성을 위한 라벨 */
  'aria-label'?: string;
  /** 접근성을 위한 라벨 ID 참조 */
  'aria-labelledby'?: string;
  /** 접근성을 위한 설명 */
  'aria-describedby'?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** HTML input 요소의 name 속성 */
  name?: string;
  /** HTML input 요소의 id 속성 */
  id?: string;
}

/**
 * Toggle 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * - 접근성 완전 준수 (ARIA 속성, 키보드 네비게이션)
 * - 제어/비제어 컴포넌트 모두 지원
 * 
 * @example
 * ```tsx
 * // 기본 primary toggle
 * <Toggle />
 * 
 * // 제어 컴포넌트로 사용
 * <Toggle 
 *   checked={isEnabled} 
 *   onChange={(checked) => setIsEnabled(checked)}
 *   aria-label="알림 설정"
 * />
 * 
 * // 큰 사이즈의 secondary toggle
 * <Toggle 
 *   variant="secondary" 
 *   size="large" 
 *   theme="dark"
 *   defaultChecked={true}
 * />
 * 
 * // 비활성화된 tertiary toggle
 * <Toggle 
 *   variant="tertiary" 
 *   disabled 
 *   aria-label="프리미엄 기능"
 * />
 * ```
 */
export const Toggle: React.FC<ToggleProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  checked,
  defaultChecked = false,
  disabled = false,
  onChange,
  className,
  name,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}) => {
  // 제어/비제어 컴포넌트 상태 관리
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const checkedValue = isControlled ? checked : internalChecked;

  // 상태 변경 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked, event);
  };

  // CSS 클래스 조합
  const toggleClasses = [
    styles.toggle,
    styles[`toggle--${variant}`],
    styles[`toggle--${size}`],
    styles[`toggle--${theme}`],
    checkedValue && styles['toggle--checked'],
    disabled && styles['toggle--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const trackClasses = [
    styles.track,
    styles[`track--${variant}`],
    styles[`track--${size}`],
    styles[`track--${theme}`],
    checkedValue && styles['track--checked'],
    disabled && styles['track--disabled'],
  ]
    .filter(Boolean)
    .join(' ');

  const thumbClasses = [
    styles.thumb,
    styles[`thumb--${variant}`],
    styles[`thumb--${size}`],
    styles[`thumb--${theme}`],
    checkedValue && styles['thumb--checked'],
    disabled && styles['thumb--disabled'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={toggleClasses}>
      {/* 숨겨진 체크박스 (접근성 및 폼 제출용) */}
      <input
        type="checkbox"
        className={styles.input}
        checked={checkedValue}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        id={id}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-checked={checkedValue}
      />
      
      {/* Toggle 트랙 (배경) */}
      <span className={trackClasses} aria-hidden="true">
        {/* Toggle 썸 (동그라미) */}
        <span className={thumbClasses} />
      </span>
    </label>
  );
};

// 기본 export
export default Toggle;
