import React from 'react';
import { Button } from './index';

// 테스트용 아이콘 컴포넌트
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Button 컴포넌트 테스트 페이지
 * 모든 variant, size, theme 조합을 시각적으로 확인할 수 있습니다.
 */
export const ButtonTest: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Pretendard Variable, sans-serif' }}>
      <h1>Button 컴포넌트 테스트</h1>
      
      {/* 기본 variant 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Variant 테스트 (Light Theme)</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="primary" theme="light">Primary</Button>
          <Button variant="secondary" theme="light">Secondary</Button>
          <Button variant="tertiary" theme="light">Tertiary</Button>
        </div>
        
        <h3>Dark Theme</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', padding: '20px', backgroundColor: '#1C1C1C', borderRadius: '8px' }}>
          <Button variant="primary" theme="dark">Primary</Button>
          <Button variant="secondary" theme="dark">Secondary</Button>
          <Button variant="tertiary" theme="dark">Tertiary</Button>
        </div>
      </section>

      {/* 크기 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Size 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      {/* 아이콘 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>아이콘 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button startIcon={<PlusIcon />}>시작 아이콘</Button>
          <Button endIcon={<ArrowIcon />}>끝 아이콘</Button>
          <Button startIcon={<PlusIcon />} endIcon={<ArrowIcon />}>양쪽 아이콘</Button>
        </div>
        
        <h3>Figma 스타일 - 일기쓰기 버튼</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="primary" startIcon={<PlusIcon />}>일기쓰기</Button>
          <Button variant="secondary" startIcon={<PlusIcon />}>일기쓰기</Button>
        </div>
      </section>

      {/* 상태 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>상태 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button disabled>Disabled</Button>
          <Button loading={loading}>
            {loading ? '로딩 중...' : '로딩 테스트'}
          </Button>
          <Button fullWidth>Full Width</Button>
        </div>
        <button 
          onClick={handleLoadingTest}
          style={{ padding: '8px 16px', marginBottom: '20px' }}
        >
          로딩 상태 테스트
        </button>
      </section>

      {/* 모든 조합 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>모든 Variant × Size 조합</h2>
        {(['primary', 'secondary', 'tertiary'] as const).map(variant => (
          <div key={variant} style={{ marginBottom: '20px' }}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '10px' }}>{variant}</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {(['small', 'medium', 'large'] as const).map(size => (
                <Button key={size} variant={variant} size={size}>
                  {variant} {size}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 접근성 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>접근성 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button 
            onClick={() => alert('클릭됨!')}
            aria-label="알림 버튼"
          >
            클릭 테스트
          </Button>
          <Button 
            type="submit"
            form="test-form"
          >
            Submit 버튼
          </Button>
        </div>
        <p style={{ fontSize: '14px', color: '#777' }}>
          * 키보드 탐색(Tab), 포커스 상태, 스크린 리더 지원 등을 확인하세요.
        </p>
      </section>

      {/* 숨겨진 폼 (Submit 버튼 테스트용) */}
      <form 
        id="test-form" 
        onSubmit={(e) => { e.preventDefault(); alert('폼 제출됨!'); }}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ButtonTest;
