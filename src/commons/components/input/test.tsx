'use client';

import React, { useState } from 'react';
import { Input } from './index';

/**
 * Input 컴포넌트 테스트 페이지
 * 
 * 다크 테마가 올바르게 구현되었는지 확인할 수 있습니다.
 * 모든 variant × size × theme 조합을 테스트합니다.
 */
export const InputTest: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      minHeight: '100vh',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Input 컴포넌트 테스트 - 다크 테마 지원</h1>
        
        <button onClick={toggleTheme} style={{
          padding: '8px 16px',
          marginBottom: '32px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
          color: theme === 'dark' ? '#fff' : '#000',
          cursor: 'pointer',
        }}>
          {theme === 'light' ? '🌙 다크모드로 전환' : '☀️ 라이트모드로 전환'}
        </button>

        {/* 기본 테스트 */}
        <section style={{ marginBottom: '40px' }}>
          <h2>기본 Input (피그마 디자인)</h2>
          <Input
            theme={theme}
            placeholder="회고를 남겨보세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            endButton={
              <button style={{
                backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
                color: theme === 'dark' ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
                입력
              </button>
            }
          />
        </section>

        {/* Variant 테스트 */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Variant 테스트 ({theme} 테마)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <Input theme={theme} variant="primary" placeholder="Primary variant" />
            <Input theme={theme} variant="secondary" placeholder="Secondary variant" />
            <Input theme={theme} variant="tertiary" placeholder="Tertiary variant" />
          </div>
        </section>

        {/* Size 테스트 */}
        <section style={{ marginBottom: '40px' }}>
          <h2>Size 테스트</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <Input theme={theme} size="small" placeholder="Small size" />
            <Input theme={theme} size="medium" placeholder="Medium size" />
            <Input theme={theme} size="large" placeholder="Large size" />
          </div>
        </section>

        {/* 아이콘 테스트 */}
        <section style={{ marginBottom: '40px' }}>
          <h2>아이콘 테스트</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <Input theme={theme} startIcon={<SearchIcon />} placeholder="시작 아이콘" />
            <Input theme={theme} endIcon={<SearchIcon />} placeholder="끝 아이콘" />
          </div>
        </section>

        {/* 상태 테스트 */}
        <section style={{ marginBottom: '40px' }}>
          <h2>상태 테스트</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <Input 
              theme={theme} 
              label="라벨이 있는 Input"
              placeholder="라벨 테스트" 
              helperText="도움말 텍스트입니다"
            />
            <Input 
              theme={theme} 
              error 
              placeholder="에러 상태" 
              errorMessage="에러 메시지입니다"
            />
            <Input theme={theme} disabled placeholder="비활성화 상태" />
          </div>
        </section>

        {/* 조합 테스트 */}
        <section style={{ marginBottom: '40px' }}>
          <h2>조합 테스트</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {(['primary', 'secondary', 'tertiary'] as const).map(variant => (
              <div key={variant}>
                <h3>{variant.charAt(0).toUpperCase() + variant.slice(1)}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <Input 
                      key={size}
                      theme={theme}
                      variant={variant}
                      size={size}
                      placeholder={`${variant} ${size}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ 
          padding: '20px', 
          backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5',
          borderRadius: '8px',
          marginTop: '40px',
        }}>
          <h3>현재 상태</h3>
          <p>테마: {theme}</p>
          <p>입력값: {inputValue}</p>
        </div>
      </div>
    </div>
  );
};

export default InputTest;
