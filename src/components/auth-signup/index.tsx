"use client"

import React from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { useFormHook } from './hooks/index.form.hook';

/**
 * AuthSignup 컴포넌트
 * 
 * 회원가입 페이지의 UI를 담당하는 컴포넌트입니다.
 * - 이메일, 비밀번호, 비밀번호 재입력, 이름 입력 필드
 * - 회원가입 버튼
 * - 로그인 페이지로 이동 링크
 * 
 * @example
 * ```tsx
 * <AuthSignup />
 * ```
 */
export const AuthSignup: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    isFormValid,
    isSubmitting
  } = useFormHook();

  return (
    <div className={styles.container} data-testid="auth-signup-page">
      <div className={styles.wrapper}>
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            새로운 계정을 만들어 시작해보세요
          </p>
        </div>

        {/* 폼 섹션 */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
              <div className={styles.inputGroup}>
                <Input
                  {...register('email')}
                  variant="primary"
                  theme="light"
                  size="medium"
                  label="이메일"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className={styles.input}
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  aria-label="이메일"
                />
              </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputGroup}>
            <Input
              {...register('password')}
              variant="primary"
              theme="light"
              size="medium"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className={styles.input}
              error={!!errors.password}
              errorMessage={errors.password?.message}
              aria-label="비밀번호"
            />
          </div>

          {/* 비밀번호 재입력 */}
          <div className={styles.inputGroup}>
            <Input
              {...register('passwordConfirm')}
              variant="primary"
              theme="light"
              size="medium"
              label="비밀번호 재입력"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className={styles.input}
              error={!!errors.passwordConfirm}
              errorMessage={errors.passwordConfirm?.message}
              aria-label="비밀번호 재입력"
            />
          </div>

          {/* 이름 입력 */}
          <div className={styles.inputGroup}>
            <Input
              {...register('name')}
              variant="primary"
              theme="light"
              size="medium"
              label="이름"
              type="text"
              placeholder="이름을 입력하세요"
              className={styles.input}
              error={!!errors.name}
              errorMessage={errors.name?.message}
              aria-label="이름"
            />
          </div>

          {/* 회원가입 버튼 */}
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              theme="light"
              size="medium"
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? '회원가입 중...' : '회원가입'}
            </Button>
          </div>
        </form>

        {/* 로그인 페이지로 이동 링크 */}
        <div className={styles.footer}>
          <p className={styles.loginText}>
            이미 계정이 있으신가요?{' '}
            <a href="/auth/login" className={styles.loginLink}>
              로그인하기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// 기본 export
export default AuthSignup;
