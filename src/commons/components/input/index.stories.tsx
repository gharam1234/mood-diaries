import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './index';

// 스토리북 메타데이터
const meta: Meta<typeof Input> = {
  title: 'Commons/Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Figma 디자인 시스템을 기반으로 한 Input 컴포넌트입니다.

**주요 기능:**
- 3가지 variant (primary, secondary, tertiary)
- 3가지 크기 (small, medium, large)
- 2가지 테마 (light, dark)
- 아이콘 지원 (startIcon, endIcon)
- 에러 상태 지원
- 라벨 및 도움말 텍스트 지원
- endButton 지원 (피그마 디자인 기반)
- 전체 너비 지원
- 완전한 접근성 지원

**사용 예시:**
\`\`\`tsx
<Input 
  variant="primary" 
  size="medium"
  placeholder="텍스트를 입력하세요"
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
      description: 'Input의 시각적 스타일 variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Input의 테마 (light/dark)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    error: {
      control: 'boolean',
      description: '에러 상태 표시',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 차지 여부',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    helperText: {
      control: 'text',
      description: '도움말 텍스트',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    startIcon: {
      table: { disable: true },
    },
    endIcon: {
      table: { disable: true },
    },
    endButton: {
      table: { disable: true },
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    error: false,
    fullWidth: false,
    placeholder: '텍스트를 입력하세요',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// 아이콘 컴포넌트들 (예시용)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 기본 스토리
export const Default: Story = {};

// Variant별 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: '주요 입력 필드',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: '보조 입력 필드',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: '기타 입력 필드',
  },
};

// Size별 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: '작은 입력 필드',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: '중간 입력 필드',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: '큰 입력 필드',
  },
};

// 테마별 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: '라이트 테마',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    placeholder: '다크 테마',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 라벨이 있는 입력
export const WithLabel: Story = {
  args: {
    label: '이메일 주소',
    placeholder: '이메일을 입력하세요',
  },
};

// 도움말 텍스트가 있는 입력
export const WithHelperText: Story = {
  args: {
    label: '사용자명',
    placeholder: '사용자명을 입력하세요',
    helperText: '영문, 숫자, 언더스코어만 사용 가능합니다',
  },
};

// 에러 상태
export const WithError: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    error: true,
    errorMessage: '비밀번호는 8자 이상이어야 합니다',
    type: 'password',
  },
};

// 아이콘이 있는 입력들
export const WithStartIcon: Story = {
  args: {
    startIcon: <SearchIcon />,
    placeholder: '검색어를 입력하세요',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: <EyeIcon />,
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
  },
};

export const WithBothIcons: Story = {
  args: {
    startIcon: <UserIcon />,
    endIcon: <EyeIcon />,
    placeholder: '사용자 정보를 입력하세요',
  },
};

// endButton이 있는 입력 (피그마 디자인 기반)
export const WithEndButton: Story = {
  args: {
    placeholder: '회고를 남겨보세요',
    endButton: (
      <button 
        style={{
          background: '#007AFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        입력
      </button>
    ),
  },
};

// 상태별 스토리들
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 입력 필드',
    label: '비활성화됨',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: '전체 너비 입력 필드',
    label: '전체 너비',
  },
  parameters: {
    layout: 'padded',
  },
};

// 모든 variant 한번에 보기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" placeholder="Primary Input" />
      <Input variant="secondary" placeholder="Secondary Input" />
      <Input variant="tertiary" placeholder="Tertiary Input" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input size="small" placeholder="Small Input" />
      <Input size="medium" placeholder="Medium Input" />
      <Input size="large" placeholder="Large Input" />
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', width: '300px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Light Theme</h4>
        <Input variant="primary" theme="light" placeholder="Primary Light" />
        <Input variant="secondary" theme="light" placeholder="Secondary Light" />
        <Input variant="tertiary" theme="light" placeholder="Tertiary Light" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', width: '300px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dark Theme</h4>
        <Input variant="primary" theme="dark" placeholder="Primary Dark" />
        <Input variant="secondary" theme="dark" placeholder="Secondary Dark" />
        <Input variant="tertiary" theme="dark" placeholder="Tertiary Dark" />
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
      {/* 로그인 폼 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>로그인</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input 
            label="이메일"
            placeholder="이메일을 입력하세요"
            startIcon={<MailIcon />}
            type="email"
            fullWidth
          />
          <Input 
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            endIcon={<EyeIcon />}
            type="password"
            fullWidth
          />
        </div>
      </div>

      {/* 검색 영역 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>검색</h4>
        <Input 
          variant="secondary"
          startIcon={<SearchIcon />}
          placeholder="검색어를 입력하세요"
          fullWidth
        />
      </div>

      {/* 회고 작성 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>회고 작성</h4>
        <Input 
          placeholder="회고를 남겨보세요"
          endButton={
            <button 
              style={{
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              입력
            </button>
          }
          fullWidth
        />
      </div>

      {/* 에러 상태 예시 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>에러 상태</h4>
        <Input 
          label="사용자명"
          placeholder="사용자명을 입력하세요"
          error
          errorMessage="이미 사용중인 사용자명입니다"
          startIcon={<UserIcon />}
          fullWidth
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 Input 조합들의 예시입니다.',
      },
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: false,
    error: false,
    fullWidth: false,
    placeholder: '플레이그라운드',
    label: '라벨',
    helperText: '도움말 텍스트',
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 props를 조합해서 테스트해볼 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
