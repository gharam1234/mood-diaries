"use client"

import React, { useState } from 'react';
import { SearchBar } from './index';

/**
 * SearchBar 테스트 컴포넌트
 * 
 * 모든 variant, size, theme 조합을 테스트하고
 * 다양한 기능들을 시연합니다.
 */
export const SearchBarTest: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 검색 실행 핸들러
  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    
    setIsLoading(true);
    
    // 실제 검색 API 호출 시뮬레이션
    setTimeout(() => {
      const mockResults = [
        `"${value}"에 대한 검색 결과 1`,
        `"${value}"에 대한 검색 결과 2`,
        `"${value}"에 대한 검색 결과 3`,
      ];
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };


  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '40px', fontSize: '32px', fontWeight: 'bold' }}>
        SearchBar 컴포넌트 테스트
      </h1>

      {/* 기본 사용 예제 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          기본 사용 예제
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '500' }}>
            검색 기능이 있는 SearchBar
          </h3>
          <SearchBar
            placeholder="검색어를 입력해 주세요."
            value={searchValue}
            onChange={handleInputChange}
            onSearch={handleSearch}
            showSearchButton
            showClearButton
            loading={isLoading}
            fullWidth
          />
          
          {/* 검색 결과 표시 */}
          {searchResults.length > 0 && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f6f6f9', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>검색 결과:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {searchResults.map((result, index) => (
                  <li key={index} style={{ padding: '4px 0', fontSize: '14px', color: '#333333' }}>
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Size Variants */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          Size Variants
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Small</h3>
            <SearchBar
              size="small"
              placeholder="Small 크기 검색바"
              showSearchIcon
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Medium (기본)</h3>
            <SearchBar
              size="medium"
              placeholder="Medium 크기 검색바"
              showSearchIcon
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Large</h3>
            <SearchBar
              size="large"
              placeholder="Large 크기 검색바"
              showSearchIcon
            />
          </div>
        </div>
      </section>

      {/* Variant Styles */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          Variant Styles
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Primary</h3>
            <SearchBar
              variant="primary"
              placeholder="Primary 스타일 검색바"
              showSearchIcon
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Secondary</h3>
            <SearchBar
              variant="secondary"
              placeholder="Secondary 스타일 검색바"
              showSearchIcon
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>Tertiary</h3>
            <SearchBar
              variant="tertiary"
              placeholder="Tertiary 스타일 검색바"
              showSearchIcon
            />
          </div>
        </div>
      </section>

      {/* Theme Variants */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          Theme Variants
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Light Theme */}
          <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e4e4e4' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>Light Theme</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SearchBar
                theme="light"
                variant="primary"
                placeholder="Light Primary 검색바"
                showSearchIcon
              />
              <SearchBar
                theme="light"
                variant="secondary"
                placeholder="Light Secondary 검색바"
                showSearchIcon
              />
              <SearchBar
                theme="light"
                variant="tertiary"
                placeholder="Light Tertiary 검색바"
                showSearchIcon
              />
            </div>
          </div>
          
          {/* Dark Theme */}
          <div style={{ padding: '20px', backgroundColor: '#1c1c1c', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '500', color: '#ffffff' }}>Dark Theme</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SearchBar
                theme="dark"
                variant="primary"
                placeholder="Dark Primary 검색바"
                showSearchIcon
              />
              <SearchBar
                theme="dark"
                variant="secondary"
                placeholder="Dark Secondary 검색바"
                showSearchIcon
              />
              <SearchBar
                theme="dark"
                variant="tertiary"
                placeholder="Dark Tertiary 검색바"
                showSearchIcon
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Combinations */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          Feature Combinations
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>검색 아이콘만</h3>
            <SearchBar
              placeholder="검색 아이콘만 있는 검색바"
              showSearchIcon
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>검색 버튼만</h3>
            <SearchBar
              placeholder="검색 버튼만 있는 검색바"
              showSearchButton
              searchButtonText="검색"
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>클리어 버튼만</h3>
            <SearchBar
              placeholder="클리어 버튼만 있는 검색바"
              showClearButton
              defaultValue="테스트 텍스트"
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>모든 기능</h3>
            <SearchBar
              placeholder="모든 기능이 있는 검색바"
              showSearchIcon
              showSearchButton
              showClearButton
              searchButtonText="찾기"
              defaultValue="검색어 예시"
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>로딩 상태</h3>
            <SearchBar
              placeholder="로딩 중..."
              loading
            />
          </div>
          
          <div>
            <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '500' }}>비활성화 상태</h3>
            <SearchBar
              placeholder="비활성화된 검색바"
              disabled
              showSearchIcon
              showSearchButton
            />
          </div>
        </div>
      </section>

      {/* Full Width Examples */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          Full Width Examples
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SearchBar
            placeholder="전체 너비 Primary 검색바"
            variant="primary"
            showSearchIcon
            showSearchButton
            fullWidth
          />
          
          <SearchBar
            placeholder="전체 너비 Secondary 검색바"
            variant="secondary"
            showSearchIcon
            showClearButton
            fullWidth
            defaultValue="검색어 입력됨"
          />
          
          <SearchBar
            placeholder="전체 너비 Tertiary 검색바"
            variant="tertiary"
            size="large"
            showSearchIcon
            showSearchButton
            showClearButton
            fullWidth
            defaultValue="모든 기능 포함"
          />
        </div>
      </section>

      {/* Responsive Test */}
      <section>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          반응형 테스트
        </h2>
        <p style={{ marginBottom: '16px', fontSize: '14px', color: '#777777' }}>
          브라우저 창 크기를 조절하여 반응형 동작을 확인해보세요.
        </p>
        
        <SearchBar
          size="large"
          placeholder="반응형 Large 검색바 (모바일에서는 Medium으로 변경)"
          showSearchIcon
          showSearchButton
          showClearButton
          fullWidth
          defaultValue="반응형 테스트"
        />
      </section>
    </div>
  );
};

export default SearchBarTest;
