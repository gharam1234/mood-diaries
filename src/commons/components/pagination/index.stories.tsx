import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pagination } from './index';

// 스토리북 메타데이터
const meta: Meta<typeof Pagination> = {
  title: 'Commons/Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Figma 디자인 시스템을 기반으로 한 Pagination 컴포넌트입니다.

**주요 기능:**
- 3가지 variant (primary, secondary, tertiary)
- 3가지 크기 (small, medium, large)  
- 2가지 테마 (light, dark)
- 페이지 번호 표시 및 네비게이션
- 이전/다음, 처음/마지막 페이지 버튼
- 페이지 번호 생략 처리 (...)
- 완전한 접근성 지원

**사용 예시:**
\`\`\`tsx
<Pagination 
  currentPage={5}
  totalPages={20}
  variant="primary" 
  size="medium"
  onPageChange={(page) => console.log(page)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Pagination의 시각적 스타일 variant',
    },
    size: {
      control: 'select', 
      options: ['small', 'medium', 'large'],
      description: 'Pagination의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Pagination의 테마 (light/dark)',
    },
    currentPage: {
      control: 'number',
      description: '현재 활성화된 페이지 번호 (1부터 시작)',
    },
    totalPages: {
      control: 'number',
      description: '전체 페이지 수',
    },
    maxVisiblePages: {
      control: 'number',
      description: '표시할 최대 페이지 번호 개수',
    },
    showPrevNext: {
      control: 'boolean',
      description: '이전/다음 버튼 표시 여부',
    },
    showFirstLast: {
      control: 'boolean',
      description: '첫번째/마지막 페이지로 이동 버튼 표시 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    onPageChange: {
      table: { disable: true },
    },
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    maxVisiblePages: 5,
    showPrevNext: true,
    showFirstLast: false,
    disabled: false,
    onPageChange: (page: number) => console.log('페이지 변경:', page),
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// 기본 스토리
export const Default: Story = {};

// Variant별 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    currentPage: 5,
    totalPages: 10,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    currentPage: 5,
    totalPages: 10,
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    currentPage: 5,
    totalPages: 10,
  },
};

// Size별 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    currentPage: 3,
    totalPages: 8,
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    currentPage: 3,
    totalPages: 8,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    currentPage: 3,
    totalPages: 8,
  },
};

// 테마별 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    currentPage: 4,
    totalPages: 12,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    currentPage: 4,
    totalPages: 12,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 페이지 상황별 스토리들
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 15,
    showFirstLast: true,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 8,
    totalPages: 15,
    showFirstLast: true,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 15,
    totalPages: 15,
    showFirstLast: true,
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 25,
    totalPages: 100,
    maxVisiblePages: 7,
    showFirstLast: true,
  },
};

// 설정별 스토리들
export const WithFirstLastButtons: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    showFirstLast: true,
  },
};

export const WithoutPrevNext: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    showPrevNext: false,
  },
};

export const MaxVisiblePages3: Story = {
  args: {
    currentPage: 8,
    totalPages: 20,
    maxVisiblePages: 3,
  },
};

export const MaxVisiblePages7: Story = {
  args: {
    currentPage: 8,
    totalPages: 20,
    maxVisiblePages: 7,
  },
};

// 상태별 스토리들
export const Disabled: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    disabled: true,
  },
};

// 모든 variant 한번에 보기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Primary</h4>
        <Pagination 
          variant="primary"
          currentPage={5}
          totalPages={10}
          onPageChange={(page: number) => console.log('primary-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Secondary</h4>
        <Pagination 
          variant="secondary"
          currentPage={5}
          totalPages={10}
          onPageChange={(page: number) => console.log('secondary-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Tertiary</h4>
        <Pagination 
          variant="tertiary"
          currentPage={5}
          totalPages={10}
          onPageChange={(page: number) => console.log('tertiary-페이지변경:', page)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant를 한번에 확인할 수 있습니다.',
      },
    },
  },
};

// 모든 크기 한번에 보기
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Small</h4>
        <Pagination 
          size="small"
          currentPage={3}
          totalPages={8}
          onPageChange={(page: number) => console.log('small-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Medium</h4>
        <Pagination 
          size="medium"
          currentPage={3}
          totalPages={8}
          onPageChange={(page: number) => console.log('medium-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Large</h4>
        <Pagination 
          size="large"
          currentPage={3}
          totalPages={8}
          onPageChange={(page: number) => console.log('large-페이지변경:', page)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 크기를 한번에 확인할 수 있습니다.',
      },
    },
  },
};

// 테마 비교
export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Light Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Pagination 
            variant="primary" 
            theme="light" 
            currentPage={5} 
            totalPages={10}
            onPageChange={(page: number) => console.log('light-primary-페이지변경:', page)}
          />
          <Pagination 
            variant="secondary" 
            theme="light" 
            currentPage={5} 
            totalPages={10}
            onPageChange={(page: number) => console.log('light-secondary-페이지변경:', page)}
          />
          <Pagination 
            variant="tertiary" 
            theme="light" 
            currentPage={5} 
            totalPages={10}
            onPageChange={(page: number) => console.log('light-tertiary-페이지변경:', page)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dark Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Pagination 
            variant="primary" 
            theme="dark" 
            currentPage={5} 
            totalPages={10}
            onPageChange={(page: number) => console.log('dark-primary-페이지변경:', page)}
          />
          <Pagination 
            variant="secondary" 
            theme="dark" 
            currentPage={5} 
            totalPages={10}
            onPageChange={(page: number) => console.log('dark-secondary-페이지변경:', page)}
          />
          <Pagination 
            variant="tertiary" 
            theme="dark" 
            currentPage={5} 
            totalPages={10}
            onPageChange={(page: number) => console.log('dark-tertiary-페이지변경:', page)}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Light와 Dark 테마의 모든 variant를 비교할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시들
export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
      {/* 검색 결과 */}
      <div style={{ padding: '24px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>검색 결과</h4>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>총 247개의 결과를 찾았습니다.</p>
        <Pagination 
          variant="primary"
          currentPage={3}
          totalPages={25}
          showFirstLast={true}
          onPageChange={(page: number) => console.log('검색결과-페이지변경:', page)}
        />
      </div>

      {/* 게시판 */}
      <div style={{ padding: '24px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>공지사항</h4>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>1-10 of 47 posts</p>
        <Pagination 
          variant="secondary"
          size="small"
          currentPage={1}
          totalPages={5}
          maxVisiblePages={3}
          onPageChange={(page: number) => console.log('게시판-페이지변경:', page)}
        />
      </div>

      {/* 상품 목록 */}
      <div style={{ padding: '24px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>상품 목록</h4>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>Page 8 of 50</p>
        <Pagination 
          variant="tertiary"
          size="large"
          currentPage={8}
          totalPages={50}
          maxVisiblePages={7}
          showFirstLast={true}
          onPageChange={(page: number) => console.log('상품목록-페이지변경:', page)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 pagination 조합들의 예시입니다.',
      },
    },
  },
};

// 다양한 페이지 상황 시나리오
export const PageScenarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>첫 페이지 (1/20)</h4>
        <Pagination 
          currentPage={1}
          totalPages={20}
          showFirstLast={true}
          onPageChange={(page: number) => console.log('첫페이지-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>중간 페이지 (10/20)</h4>
        <Pagination 
          currentPage={10}
          totalPages={20}
          showFirstLast={true}
          onPageChange={(page: number) => console.log('중간페이지-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>마지막 페이지 (20/20)</h4>
        <Pagination 
          currentPage={20}
          totalPages={20}
          showFirstLast={true}
          onPageChange={(page: number) => console.log('마지막페이지-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>페이지 1개 (1/1)</h4>
        <Pagination 
          currentPage={1}
          totalPages={1}
          onPageChange={(page: number) => console.log('단일페이지-페이지변경:', page)}
        />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>많은 페이지 (50/100)</h4>
        <Pagination 
          currentPage={50}
          totalPages={100}
          maxVisiblePages={7}
          showFirstLast={true}
          onPageChange={(page: number) => console.log('많은페이지-페이지변경:', page)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 페이지 상황에서의 pagination 동작을 확인할 수 있습니다.',
      },
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    maxVisiblePages: 5,
    showPrevNext: true,
    showFirstLast: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 props를 조합해서 테스트해볼 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
