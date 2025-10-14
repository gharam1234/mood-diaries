"use client"

import React, { useState } from 'react';
import { Toggle, ToggleProps } from './index';

/**
 * Toggle 컴포넌트 테스트 페이지
 * 
 * 모든 variant, size, theme 조합을 테스트하고 시연합니다.
 * 접근성 기능과 상호작용도 함께 테스트합니다.
 */
const ToggleTest: React.FC = () => {
  // 제어 컴포넌트 상태 관리
  const [primaryChecked, setPrimaryChecked] = useState(false);
  const [secondaryChecked, setSecondaryChecked] = useState(true);
  const [tertiaryChecked, setTertiaryChecked] = useState(false);

  // 테스트용 상태들
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const variants: ToggleProps['variant'][] = ['primary', 'secondary', 'tertiary'];
  const sizes: ToggleProps['size'][] = ['small', 'medium', 'large'];
  const themes: ToggleProps['theme'][] = ['light', 'dark'];

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Pretendard, sans-serif',
      backgroundColor: darkModeEnabled ? '#1C1C1C' : '#FFFFFF',
      color: darkModeEnabled ? '#FFFFFF' : '#000000',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        Toggle 컴포넌트 테스트
      </h1>

      {/* 기본 사용법 섹션 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
          기본 사용법
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              checked={primaryChecked}
              onChange={(checked) => setPrimaryChecked(checked)}
              aria-label="Primary Toggle"
            />
            <span>Primary Toggle (제어 컴포넌트): {primaryChecked ? '켜짐' : '꺼짐'}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              variant="secondary"
              checked={secondaryChecked}
              onChange={(checked) => setSecondaryChecked(checked)}
              aria-label="Secondary Toggle"
            />
            <span>Secondary Toggle: {secondaryChecked ? '켜짐' : '꺼짐'}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              variant="tertiary"
              checked={tertiaryChecked}
              onChange={(checked) => setTertiaryChecked(checked)}
              aria-label="Tertiary Toggle"
            />
            <span>Tertiary Toggle: {tertiaryChecked ? '켜짐' : '꺼짐'}</span>
          </div>
        </div>
      </section>

      {/* 실제 사용 시나리오 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
          실제 사용 시나리오
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              variant="primary"
              size="medium"
              theme={darkModeEnabled ? 'dark' : 'light'}
              checked={darkModeEnabled}
              onChange={(checked) => setDarkModeEnabled(checked)}
              aria-label="다크 모드 설정"
            />
            <div>
              <div style={{ fontWeight: '500' }}>다크 모드</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                어두운 테마로 전환합니다
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              variant="secondary"
              size="medium"
              theme={darkModeEnabled ? 'dark' : 'light'}
              checked={notificationsEnabled}
              onChange={(checked) => setNotificationsEnabled(checked)}
              aria-label="알림 설정"
            />
            <div>
              <div style={{ fontWeight: '500' }}>푸시 알림</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                새로운 소식을 알려드립니다
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              variant="tertiary"
              size="medium"
              theme={darkModeEnabled ? 'dark' : 'light'}
              checked={autoSaveEnabled}
              onChange={(checked) => setAutoSaveEnabled(checked)}
              aria-label="자동 저장 설정"
            />
            <div>
              <div style={{ fontWeight: '500' }}>자동 저장</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                작성 중인 내용을 자동으로 저장합니다
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모든 Variant 조합 테스트 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
          모든 Variant 조합 테스트
        </h2>
        
        {themes.map((theme) => (
          <div key={theme} style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '500' }}>
              {theme === 'light' ? '라이트 테마' : '다크 테마'}
            </h3>
            
            {variants.map((variant) => (
              <div key={variant} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '500' }}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)} Variant
                </h4>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  {sizes.map((size) => (
                    <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <Toggle 
                        variant={variant}
                        size={size}
                        theme={theme}
                        defaultChecked={false}
                        aria-label={`${variant} ${size} ${theme} toggle off`}
                      />
                      <Toggle 
                        variant={variant}
                        size={size}
                        theme={theme}
                        defaultChecked={true}
                        aria-label={`${variant} ${size} ${theme} toggle on`}
                      />
                      <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                        {size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* 비활성화 상태 테스트 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
          비활성화 상태 테스트
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Toggle 
              disabled
              defaultChecked={false}
              aria-label="비활성화된 토글 (꺼짐)"
            />
            <span style={{ fontSize: '0.75rem' }}>꺼짐 + 비활성화</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Toggle 
              disabled
              defaultChecked={true}
              aria-label="비활성화된 토글 (켜짐)"
            />
            <span style={{ fontSize: '0.75rem' }}>켜짐 + 비활성화</span>
          </div>
        </div>
      </section>

      {/* 접근성 테스트 */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
          접근성 테스트
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            키보드로 Tab 키를 눌러 포커스를 이동하고, Space 키로 토글을 조작해보세요.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              id="accessibility-test-1"
              aria-label="접근성 테스트 토글 1"
            />
            <label htmlFor="accessibility-test-1" style={{ cursor: 'pointer' }}>
              aria-label로 라벨링된 토글
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              id="accessibility-test-2"
              aria-labelledby="toggle-label-2"
            />
            <span id="toggle-label-2" style={{ cursor: 'pointer' }}>
              aria-labelledby로 라벨링된 토글
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              id="accessibility-test-3"
              aria-label="설명이 있는 토글"
              aria-describedby="toggle-description-3"
            />
            <div>
              <div style={{ fontWeight: '500' }}>설명이 있는 토글</div>
              <div id="toggle-description-3" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                이 토글은 aria-describedby로 추가 설명을 제공합니다
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 폼 통합 테스트 */}
      <section>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>
          폼 통합 테스트
        </h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            alert('폼 데이터: ' + JSON.stringify(data, null, 2));
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              name="newsletter"
              id="newsletter-toggle"
              aria-label="뉴스레터 구독"
            />
            <label htmlFor="newsletter-toggle">뉴스레터 구독</label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Toggle 
              name="marketing"
              id="marketing-toggle"
              defaultChecked={true}
              aria-label="마케팅 정보 수신"
            />
            <label htmlFor="marketing-toggle">마케팅 정보 수신</label>
          </div>
          
          <button 
            type="submit"
            style={{ 
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3A5CF3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            폼 제출 테스트
          </button>
        </form>
      </section>
    </div>
  );
};

export default ToggleTest;
