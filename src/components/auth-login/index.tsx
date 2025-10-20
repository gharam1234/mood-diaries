"use client"

import React from 'react';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';

/**
 * AuthLogin 컴포넌트
 * 
 * 로그인 페이지의 모던한 UI를 담당하는 컴포넌트입니다.
 * - 이메일, 비밀번호 입력 필드 (공통컴포넌트 활용)
 * - 로그인 버튼 (공통컴포넌트 활용)
 * - 회원가입 페이지로 이동 링크
 * 
 * @example
 * ```tsx
 * <AuthLogin />
 * ```
 */
export const AuthLogin: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 헤더 섹션 */}
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            계정에 로그인하여 서비스를 이용하세요
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

          {/* 로그인 버튼 */}
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              theme="light"
              size="medium"
              type="submit"
              className={styles.loginButton}
            >
              로그인
            </Button>
          </div>
        </form>

        {/* 회원가입 페이지로 이동 링크 */}
        <div className={styles.footer}>
          <p className={styles.signupText}>
            아직 계정이 없으신가요?{' '}
            <a href="/auth/signup" className={styles.signupLink}>
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// 기본 export
export default AuthLogin;
