"use client"

import React from 'react';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';

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
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            새로운 계정을 만들어 시작해보세요
          </p>
        </div>

        {/* 폼 섹션 */}
        <form className={styles.form}>
          {/* 이메일 입력 */}
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              className={styles.input}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              className={styles.input}
            />
          </div>

          {/* 비밀번호 재입력 */}
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              label="비밀번호 재입력"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className={styles.input}
            />
          </div>

          {/* 이름 입력 */}
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              label="이름"
              type="text"
              placeholder="이름을 입력하세요"
              className={styles.input}
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
            >
              회원가입
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
