import React, { useState } from 'react';
import { SelectBox, SelectOption } from './index';

// 테스트용 옵션 데이터
const basicOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

const categoryOptions: SelectOption[] = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'study', label: '학습' },
  { value: 'hobby', label: '취미' },
  { value: 'travel', label: '여행' },
];

const statusOptions: SelectOption[] = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'pending', label: '대기중' },
  { value: 'disabled', label: '비활성화됨', disabled: true },
];

const longOptions: SelectOption[] = [
  { value: 'short', label: '짧은 옵션' },
  { value: 'medium', label: '중간 길이의 옵션입니다' },
  { value: 'long', label: '매우 긴 옵션 텍스트로 말줄임표 테스트를 위한 옵션입니다' },
  { value: 'very-long', label: '극도로 긴 옵션 텍스트로 UI 레이아웃이 깨지지 않는지 확인하기 위한 매우 긴 텍스트입니다' },
];

/**
 * SelectBox 컴포넌트 테스트 페이지
 * 모든 variant, size, theme 조합을 시각적으로 확인할 수 있습니다.
 */
export const SelectBoxTest: React.FC = () => {
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('work');
  const [selectedValue3, setSelectedValue3] = useState('');
  const [selectedValue4, setSelectedValue4] = useState('');
  const [isError, setIsError] = useState(false);

  const handleToggleError = () => {
    setIsError(!isError);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Pretendard Variable, sans-serif' }}>
      <h1>SelectBox 컴포넌트 테스트</h1>
      
      {/* 기본 variant 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Variant 테스트 (Light Theme)</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <SelectBox 
            variant="primary" 
            theme="light"
            options={basicOptions}
            placeholder="Primary 선택"
            value={selectedValue1}
            onChange={(value) => setSelectedValue1(value)}
          />
          <SelectBox 
            variant="secondary" 
            theme="light"
            options={basicOptions}
            placeholder="Secondary 선택"
          />
          <SelectBox 
            variant="tertiary" 
            theme="light"
            options={basicOptions}
            placeholder="Tertiary 선택"
          />
        </div>
        
        <h3>Dark Theme</h3>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          flexWrap: 'wrap', 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#1C1C1C', 
          borderRadius: '8px' 
        }}>
          <SelectBox 
            variant="primary" 
            theme="dark"
            options={basicOptions}
            placeholder="Primary 선택"
          />
          <SelectBox 
            variant="secondary" 
            theme="dark"
            options={basicOptions}
            placeholder="Secondary 선택"
          />
          <SelectBox 
            variant="tertiary" 
            theme="dark"
            options={basicOptions}
            placeholder="Tertiary 선택"
          />
        </div>
      </section>

      {/* 크기 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Size 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '20px' }}>
          <SelectBox 
            size="small"
            options={basicOptions}
            placeholder="Small"
          />
          <SelectBox 
            size="medium"
            options={basicOptions}
            placeholder="Medium"
          />
          <SelectBox 
            size="large"
            options={basicOptions}
            placeholder="Large"
          />
        </div>
      </section>

      {/* Figma 디자인 기반 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Figma 디자인 기반 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <SelectBox 
            options={[{ value: 'all', label: '전체' }, ...categoryOptions.slice(1)]}
            defaultValue="all"
            style={{ minWidth: '120px' }}
          />
          <SelectBox 
            options={categoryOptions}
            placeholder="카테고리 선택"
            value={selectedValue2}
            onChange={(value) => setSelectedValue2(value)}
          />
        </div>
      </section>

      {/* 라벨 및 메시지 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>라벨 및 메시지 테스트</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <SelectBox 
            label="카테고리"
            options={categoryOptions}
            placeholder="카테고리를 선택하세요"
            helperText="원하는 카테고리를 선택해주세요"
          />
          <SelectBox 
            label="상태"
            options={statusOptions}
            placeholder="상태를 선택하세요"
            error={isError}
            errorMessage={isError ? "필수 선택 항목입니다" : undefined}
            value={selectedValue3}
            onChange={(value) => setSelectedValue3(value)}
          />
        </div>
        <button 
          onClick={handleToggleError}
          style={{ padding: '8px 16px', marginBottom: '20px' }}
        >
          에러 상태 토글
        </button>
      </section>

      {/* 상태 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>상태 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <SelectBox 
            options={basicOptions}
            placeholder="일반 상태"
          />
          <SelectBox 
            options={basicOptions}
            placeholder="비활성화 상태"
            disabled
          />
          <SelectBox 
            options={statusOptions}
            placeholder="일부 옵션 비활성화"
          />
        </div>
      </section>

      {/* 긴 텍스트 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>긴 텍스트 테스트</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <SelectBox 
            options={longOptions}
            placeholder="긴 텍스트 옵션들"
            style={{ width: '200px' }}
          />
          <SelectBox 
            options={longOptions}
            placeholder="더 넓은 SelectBox"
            style={{ width: '300px' }}
          />
        </div>
      </section>

      {/* 전체 너비 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>전체 너비 테스트</h2>
        <div style={{ marginBottom: '20px' }}>
          <SelectBox 
            label="전체 너비 SelectBox"
            options={categoryOptions}
            placeholder="전체 너비로 표시됩니다"
            fullWidth
            helperText="이 SelectBox는 부모 컨테이너의 전체 너비를 차지합니다"
          />
        </div>
      </section>

      {/* 제어 컴포넌트 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>제어 컴포넌트 테스트</h2>
        <div style={{ marginBottom: '20px' }}>
          <SelectBox 
            label="제어되는 SelectBox"
            options={categoryOptions}
            value={selectedValue4}
            onChange={(value, option) => {
              setSelectedValue4(value);
              console.log('선택된 값:', value, '옵션:', option);
            }}
            onToggle={(isOpen) => {
              console.log('드롭다운 상태:', isOpen ? '열림' : '닫힘');
            }}
          />
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#777' }}>
            현재 선택된 값: {selectedValue4 || '없음'}
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button onClick={() => setSelectedValue4('work')}>업무 선택</button>
            <button onClick={() => setSelectedValue4('personal')}>개인 선택</button>
            <button onClick={() => setSelectedValue4('')}>선택 해제</button>
          </div>
        </div>
      </section>

      {/* 모든 조합 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>모든 Variant × Size 조합</h2>
        {(['primary', 'secondary', 'tertiary'] as const).map(variant => (
          <div key={variant} style={{ marginBottom: '20px' }}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '10px' }}>{variant}</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {(['small', 'medium', 'large'] as const).map(size => (
                <SelectBox
                  key={`${variant}-${size}`}
                  variant={variant}
                  size={size}
                  options={basicOptions}
                  placeholder={`${variant} ${size}`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 키보드 네비게이션 안내 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>키보드 네비게이션 테스트</h2>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#F6F6F9', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <h4>키보드 단축키:</h4>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li><strong>Enter/Space:</strong> 드롭다운 열기/옵션 선택</li>
            <li><strong>Escape:</strong> 드롭다운 닫기</li>
            <li><strong>Arrow Up/Down:</strong> 옵션 간 이동</li>
            <li><strong>Home/End:</strong> 첫 번째/마지막 옵션으로 이동</li>
          </ul>
        </div>
        <SelectBox 
          label="키보드 네비게이션 테스트"
          options={categoryOptions}
          placeholder="키보드로 조작해보세요"
          helperText="Tab으로 포커스하고 Enter로 열어보세요"
        />
      </section>

      {/* 접근성 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>접근성 테스트</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <SelectBox 
            id="accessibility-test-1"
            label="스크린 리더 테스트"
            options={categoryOptions}
            placeholder="접근성 준수 SelectBox"
            helperText="aria-* 속성들이 적절히 설정되어 있습니다"
          />
          <SelectBox 
            id="accessibility-test-2"
            label="에러 상태 접근성"
            options={statusOptions}
            error
            errorMessage="이 필드는 필수입니다"
            placeholder="에러 상태 접근성 테스트"
          />
        </div>
      </section>

      {/* 성능 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h2>성능 테스트 (많은 옵션)</h2>
        <SelectBox 
          label="100개 옵션 테스트"
          options={Array.from({ length: 100 }, (_, i) => ({
            value: `option-${i}`,
            label: `옵션 ${i + 1}`,
          }))}
          placeholder="100개 옵션 중 선택"
          helperText="스크롤 성능과 가상화 테스트"
        />
      </section>
    </div>
  );
};

// 기본 export
export default SelectBoxTest;
