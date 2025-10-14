import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchBar } from './index';

// 스토리북 메타데이터
const meta: Meta<typeof SearchBar> = {
  title: 'Commons/Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Figma 디자인 시스템을 기반으로 한 SearchBar 컴포넌트입니다.

**주요 기능:**
- 3가지 variant (primary, secondary, tertiary)
- 3가지 크기 (small, medium, large)
- 2가지 테마 (light, dark)
- 검색 아이콘 지원 (showSearchIcon)
- 검색 버튼 지원 (showSearchButton)
- 클리어 버튼 지원 (showClearButton)
- 로딩 상태 지원
- 전체 너비 지원
- 완전한 접근성 지원

**사용 예시:**
\`\`\`tsx
<SearchBar 
  variant="primary" 
  size="medium"
  placeholder="검색어를 입력해 주세요."
  showSearchIcon
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
      description: 'SearchBar의 시각적 스타일 variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'SearchBar의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'SearchBar의 테마 (light/dark)',
    },
    showSearchIcon: {
      control: 'boolean',
      description: '검색 아이콘 표시 여부',
    },
    showSearchButton: {
      control: 'boolean',
      description: '검색 버튼 표시 여부',
    },
    showClearButton: {
      control: 'boolean',
      description: '클리어 버튼 표시 여부',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 차지 여부',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    searchButtonText: {
      control: 'text',
      description: '검색 버튼 텍스트',
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    showSearchIcon: true,
    showSearchButton: false,
    showClearButton: false,
    loading: false,
    disabled: false,
    fullWidth: false,
    placeholder: '검색어를 입력해 주세요.',
    searchButtonText: '검색',
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

// 기본 스토리
export const Default: Story = {};

// Variant별 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: '주요 검색 필드',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: '보조 검색 필드',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: '기타 검색 필드',
  },
};

// Size별 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: '작은 검색 필드',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: '중간 검색 필드',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: '큰 검색 필드',
  },
};

// 테마별 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: '라이트 테마 검색',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    placeholder: '다크 테마 검색',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 기능별 스토리들
export const WithSearchIcon: Story = {
  args: {
    showSearchIcon: true,
    placeholder: '검색 아이콘이 있는 검색바',
  },
};

export const WithSearchButton: Story = {
  args: {
    showSearchButton: true,
    placeholder: '검색 버튼이 있는 검색바',
    searchButtonText: '검색',
  },
};

export const WithClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState('검색어 예시');
    
    return (
      <SearchBar 
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    showClearButton: true,
    placeholder: '클리어 버튼이 있는 검색바',
  },
};

export const WithAllFeatures: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    
    return (
      <SearchBar 
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={(searchValue) => alert(`검색: ${searchValue}`)}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    showSearchIcon: true,
    showSearchButton: true,
    showClearButton: true,
    placeholder: '모든 기능이 있는 검색바',
    searchButtonText: '검색',
  },
};

// 상태별 스토리들
export const Loading: Story = {
  args: {
    loading: true,
    placeholder: '검색 중...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 검색바',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: '전체 너비 검색바',
  },
  parameters: {
    layout: 'padded',
  },
};

// 모든 variant 한번에 보기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <SearchBar variant="primary" placeholder="Primary SearchBar" />
      <SearchBar variant="secondary" placeholder="Secondary SearchBar" />
      <SearchBar variant="tertiary" placeholder="Tertiary SearchBar" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <SearchBar size="small" placeholder="Small SearchBar" />
      <SearchBar size="medium" placeholder="Medium SearchBar" />
      <SearchBar size="large" placeholder="Large SearchBar" />
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', width: '350px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Light Theme</h4>
        <SearchBar variant="primary" theme="light" placeholder="Primary Light" />
        <SearchBar variant="secondary" theme="light" placeholder="Secondary Light" />
        <SearchBar variant="tertiary" theme="light" placeholder="Tertiary Light" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', width: '350px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dark Theme</h4>
        <SearchBar variant="primary" theme="dark" placeholder="Primary Dark" />
        <SearchBar variant="secondary" theme="dark" placeholder="Secondary Dark" />
        <SearchBar variant="tertiary" theme="dark" placeholder="Tertiary Dark" />
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
  render: () => {
    const [globalSearch, setGlobalSearch] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [diarySearch, setDiarySearch] = useState('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
        {/* 전역 검색 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>전역 검색</h4>
          <SearchBar 
            variant="primary"
            size="large"
            fullWidth
            showSearchIcon
            showSearchButton
            showClearButton
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onSearch={(value) => alert(`전역 검색: ${value}`)}
            onClear={() => setGlobalSearch('')}
            placeholder="앱 전체에서 검색"
            searchButtonText="검색"
          />
        </div>

        {/* 필터링 검색 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>목록 필터링</h4>
          <SearchBar 
            variant="secondary"
            size="medium"
            fullWidth
            showSearchIcon
            showClearButton
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            onClear={() => setFilterSearch('')}
            placeholder="목록에서 검색하여 필터링"
          />
        </div>

        {/* 일기 검색 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>일기 검색</h4>
          <SearchBar 
            variant="tertiary"
            size="small"
            fullWidth
            showSearchIcon
            value={diarySearch}
            onChange={(e) => setDiarySearch(e.target.value)}
            placeholder="일기 내용에서 검색"
          />
        </div>

        {/* 로딩 상태 검색 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>검색 중</h4>
          <SearchBar 
            loading
            fullWidth
            placeholder="검색 중..."
          />
        </div>

        {/* 비활성화 상태 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>권한 없음</h4>
          <SearchBar 
            disabled
            fullWidth
            showSearchIcon
            placeholder="검색 권한이 없습니다"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 SearchBar 조합들의 예시입니다.',
      },
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    
    return (
      <SearchBar 
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onSearch={(searchValue) => {
          console.log('검색:', searchValue);
          alert(`검색: ${searchValue}`);
        }}
        onClear={() => setValue('')}
      />
    );
  },
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    showSearchIcon: true,
    showSearchButton: false,
    showClearButton: false,
    loading: false,
    disabled: false,
    fullWidth: false,
    placeholder: '플레이그라운드에서 테스트',
    searchButtonText: '검색',
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 props를 조합해서 테스트해볼 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
