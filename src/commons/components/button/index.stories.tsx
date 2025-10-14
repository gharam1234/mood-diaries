import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './index';

// 스토리북 메타데이터
const meta: Meta<typeof Button> = {
  title: 'Commons/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Figma 디자인 시스템을 기반으로 한 Button 컴포넌트입니다.

**주요 기능:**
- 3가지 variant (primary, secondary, tertiary)
- 3가지 크기 (small, medium, large)  
- 2가지 테마 (light, dark)
- 아이콘 지원 (startIcon, endIcon)
- 로딩 상태 지원
- 전체 너비 지원
- 완전한 접근성 지원

**사용 예시:**
\`\`\`tsx
<Button variant="primary" size="medium">
  확인
</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '버튼의 시각적 스타일 variant',
    },
    size: {
      control: 'select', 
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '버튼의 테마 (light/dark)',
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
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
    startIcon: {
      table: { disable: true },
    },
    endIcon: {
      table: { disable: true },
    },
  },
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 아이콘 컴포넌트들 (예시용)
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15M7 10L12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 기본 스토리
export const Default: Story = {};

// Variant별 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '주요 버튼',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary', 
    children: '보조 버튼',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: '기타 버튼',
  },
};

// Size별 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    children: '작은 버튼',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: '중간 버튼',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: '큰 버튼',
  },
};

// 테마별 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    children: '라이트 테마',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    children: '다크 테마',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 아이콘이 있는 버튼들
export const WithStartIcon: Story = {
  args: {
    startIcon: <PlusIcon />,
    children: '시작 아이콘',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <ArrowRightIcon />,
    children: '끝 아이콘',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <DownloadIcon />,
    endIcon: <ArrowRightIcon />,
    children: '양쪽 아이콘',
  },
};

// 상태별 스토리들
export const Loading: Story = {
  args: {
    loading: true,
    children: '로딩 중...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '비활성화됨',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: '전체 너비',
  },
  parameters: {
    layout: 'padded',
  },
};

// 모든 variant 한번에 보기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
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
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Light Theme</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" theme="light">Primary</Button>
          <Button variant="secondary" theme="light">Secondary</Button>
          <Button variant="tertiary" theme="light">Tertiary</Button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dark Theme</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" theme="dark">Primary</Button>
          <Button variant="secondary" theme="dark">Secondary</Button>
          <Button variant="tertiary" theme="dark">Tertiary</Button>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      {/* 일기 작성 영역 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>일기 작성</h4>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="tertiary" size="small">취소</Button>
          <Button variant="primary" size="small" startIcon={<PlusIcon />}>저장</Button>
        </div>
      </div>

      {/* 다운로드 섹션 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>파일 다운로드</h4>
        <Button variant="secondary" fullWidth startIcon={<DownloadIcon />}>
          PDF로 다운로드
        </Button>
      </div>

      {/* 로딩 상태 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>업로드 중</h4>
        <Button variant="primary" fullWidth loading>
          업로드 중...
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 버튼 조합들의 예시입니다.',
      },
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  args: {
    children: '플레이그라운드',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    loading: false,
    disabled: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 props를 조합해서 테스트해볼 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
