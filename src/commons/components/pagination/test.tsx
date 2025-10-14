'use client';

import React, { useState } from 'react';
import { Pagination } from './index';

/**
 * Pagination 컴포넌트 테스트 및 데모 페이지
 * 
 * 이 파일은 Pagination 컴포넌트의 다양한 variant, size, theme 조합을 
 * 테스트하고 시각적으로 확인하기 위한 데모 페이지입니다.
 */
const PaginationTest: React.FC = () => {
  // 각 테스트 케이스별 상태 관리
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(5);
  const [currentPage3, setCurrentPage3] = useState(3);
  const [currentPage4, setCurrentPage4] = useState(2);
  const [currentPage5, setCurrentPage5] = useState(7);
  const [currentPage6, setCurrentPage6] = useState(1);

  const TestSection: React.FC<{ title: string; children: React.ReactNode }> = ({ 
    title, 
    children 
  }) => (
    <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <h1 style={{ 
        marginBottom: '40px', 
        fontSize: '32px', 
        fontWeight: '700',
        textAlign: 'center'
      }}>
        Pagination 컴포넌트 테스트
      </h1>

      {/* 기본 사용법 */}
      <TestSection title="1. 기본 사용법">
        <div style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '10px', color: '#666' }}>
            현재 페이지: {currentPage1} / 총 10페이지
          </p>
          <Pagination
            currentPage={currentPage1}
            totalPages={10}
            onPageChange={setCurrentPage1}
          />
        </div>
      </TestSection>

      {/* Size Variants */}
      <TestSection title="2. Size Variants">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Small</h4>
            <Pagination
              currentPage={currentPage2}
              totalPages={15}
              onPageChange={setCurrentPage2}
              size="small"
              maxVisiblePages={7}
            />
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Medium (기본값)</h4>
            <Pagination
              currentPage={currentPage2}
              totalPages={15}
              onPageChange={setCurrentPage2}
              size="medium"
              maxVisiblePages={7}
            />
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Large</h4>
            <Pagination
              currentPage={currentPage2}
              totalPages={15}
              onPageChange={setCurrentPage2}
              size="large"
              maxVisiblePages={7}
            />
          </div>
        </div>
      </TestSection>

      {/* Variant Styles */}
      <TestSection title="3. Variant Styles">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Primary (기본값)</h4>
            <Pagination
              currentPage={currentPage3}
              totalPages={8}
              onPageChange={setCurrentPage3}
              variant="primary"
            />
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Secondary</h4>
            <Pagination
              currentPage={currentPage3}
              totalPages={8}
              onPageChange={setCurrentPage3}
              variant="secondary"
            />
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Tertiary</h4>
            <Pagination
              currentPage={currentPage3}
              totalPages={8}
              onPageChange={setCurrentPage3}
              variant="tertiary"
            />
          </div>
        </div>
      </TestSection>

      {/* Theme Variants */}
      <TestSection title="4. Theme Variants">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>Light Theme (기본값)</h4>
            <Pagination
              currentPage={currentPage4}
              totalPages={6}
              onPageChange={setCurrentPage4}
              theme="light"
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '20px', 
            borderRadius: '8px',
            marginTop: '10px'
          }}>
            <h4 style={{ 
              marginBottom: '10px', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#ffffff'
            }}>
              Dark Theme
            </h4>
            <Pagination
              currentPage={currentPage4}
              totalPages={6}
              onPageChange={setCurrentPage4}
              theme="dark"
            />
          </div>
        </div>
      </TestSection>

      {/* 고급 기능 테스트 */}
      <TestSection title="5. 고급 기능">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>
              첫번째/마지막 버튼 포함
            </h4>
            <Pagination
              currentPage={currentPage5}
              totalPages={20}
              onPageChange={setCurrentPage5}
              showFirstLast={true}
              maxVisiblePages={5}
            />
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>
              이전/다음 버튼 숨김
            </h4>
            <Pagination
              currentPage={currentPage6}
              totalPages={5}
              onPageChange={setCurrentPage6}
              showPrevNext={false}
            />
          </div>
          
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>
              비활성화 상태
            </h4>
            <Pagination
              currentPage={3}
              totalPages={10}
              onPageChange={() => {}}
              disabled={true}
            />
          </div>
        </div>
      </TestSection>

      {/* 조합 테스트 */}
      <TestSection title="6. 복합 Variant 조합">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>
              Large + Secondary + Light
            </h4>
            <Pagination
              currentPage={currentPage1}
              totalPages={12}
              onPageChange={setCurrentPage1}
              variant="secondary"
              size="large"
              theme="light"
              showFirstLast={true}
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#1f2937', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h4 style={{ 
              marginBottom: '10px', 
              fontSize: '16px', 
              fontWeight: '500',
              color: '#ffffff'
            }}>
              Small + Tertiary + Dark
            </h4>
            <Pagination
              currentPage={currentPage2}
              totalPages={25}
              onPageChange={setCurrentPage2}
              variant="tertiary"
              size="small"
              theme="dark"
              maxVisiblePages={3}
            />
          </div>
        </div>
      </TestSection>

      {/* 접근성 테스트 정보 */}
      <TestSection title="7. 접근성 정보">
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '500' }}>
            접근성 기능
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>키보드 네비게이션 지원 (Tab, Enter, Space)</li>
            <li>스크린 리더용 ARIA 라벨 및 역할 지정</li>
            <li>고대비 모드 지원</li>
            <li>포커스 표시 강화</li>
            <li>움직임 줄이기 선호 시 애니메이션 제거</li>
            <li>의미론적 HTML 구조 (nav, button, aria-current)</li>
          </ul>
        </div>
      </TestSection>

      {/* 개발자 정보 */}
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4 style={{ marginBottom: '10px', fontSize: '16px', fontWeight: '500' }}>
          개발자 정보
        </h4>
        <p style={{ margin: 0, color: '#666' }}>
          이 컴포넌트는 Figma 디자인을 기반으로 완전한 variant 시스템과 접근성을 
          지원하도록 구현되었습니다. 브라우저 개발자 도구에서 DOM 구조와 
          ARIA 속성을 확인해보세요.
        </p>
      </div>
    </div>
  );
};

export default PaginationTest;
