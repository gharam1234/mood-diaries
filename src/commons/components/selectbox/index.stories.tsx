import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SelectBox } from './index';
import type { SelectOption } from './index';

// 스토리북 메타데이터
const meta: Meta<typeof SelectBox> = {
  title: 'Commons/Components/SelectBox',
  component: SelectBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Figma 디자인 시스템을 기반으로 한 SelectBox 컴포넌트입니다.

**주요 기능:**
- 3가지 variant (primary, secondary, tertiary)
- 3가지 크기 (small, medium, large)
- 2가지 테마 (light, dark)
- 키보드 네비게이션 지원 (Arrow keys, Enter, Escape 등)
- 에러 상태 지원
- 라벨 및 도움말 텍스트 지원
- 전체 너비 지원
- 완전한 접근성 지원

**사용 예시:**
\`\`\`tsx
<SelectBox 
  variant="primary" 
  size="medium"
  options={[
    { value: 'all', label: '전체' },
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' }
  ]}
  placeholder="옵션을 선택하세요"
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
      description: 'SelectBox의 시각적 스타일 variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'SelectBox의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'SelectBox의 테마 (light/dark)',
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
    options: {
      table: { disable: true },
    },
    value: {
      table: { disable: true },
    },
    defaultValue: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    onToggle: {
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
    placeholder: '옵션을 선택하세요',
  },
};

export default meta;
type Story = StoryObj<typeof SelectBox>;

// 공통 옵션 데이터
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
  { value: 'hobby', label: '취미' },
  { value: 'study', label: '학습' },
];

const countryOptions: SelectOption[] = [
  { value: 'kr', label: '한국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'gb', label: '영국' },
];

const priorityOptions: SelectOption[] = [
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' },
];

const optionsWithDisabled: SelectOption[] = [
  { value: 'available1', label: '사용 가능한 옵션 1' },
  { value: 'available2', label: '사용 가능한 옵션 2' },
  { value: 'disabled1', label: '비활성화된 옵션 1', disabled: true },
  { value: 'available3', label: '사용 가능한 옵션 3' },
  { value: 'disabled2', label: '비활성화된 옵션 2', disabled: true },
];

// 기본 스토리
export const Default: Story = {
  args: {
    options: basicOptions,
  },
};

// Variant별 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    options: basicOptions,
    placeholder: '주요 선택 상자',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    options: basicOptions,
    placeholder: '보조 선택 상자',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    options: basicOptions,
    placeholder: '기타 선택 상자',
  },
};

// Size별 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    options: basicOptions,
    placeholder: '작은 선택 상자',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    options: basicOptions,
    placeholder: '중간 선택 상자',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    options: basicOptions,
    placeholder: '큰 선택 상자',
  },
};

// 테마별 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    options: basicOptions,
    placeholder: '라이트 테마',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    options: basicOptions,
    placeholder: '다크 테마',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 라벨이 있는 SelectBox
export const WithLabel: Story = {
  args: {
    label: '카테고리',
    options: categoryOptions,
    placeholder: '카테고리를 선택하세요',
  },
};

// 도움말 텍스트가 있는 SelectBox
export const WithHelperText: Story = {
  args: {
    label: '우선순위',
    options: priorityOptions,
    placeholder: '우선순위를 선택하세요',
    helperText: '작업의 중요도에 따라 우선순위를 설정해주세요',
  },
};

// 에러 상태
export const WithError: Story = {
  args: {
    label: '국가',
    options: countryOptions,
    placeholder: '국가를 선택하세요',
    error: true,
    errorMessage: '국가 선택은 필수 항목입니다',
  },
};

// 기본값이 선택된 상태
export const WithDefaultValue: Story = {
  args: {
    label: '카테고리',
    options: categoryOptions,
    defaultValue: 'work',
    placeholder: '카테고리를 선택하세요',
  },
};

// 비활성화된 옵션이 포함된 SelectBox
export const WithDisabledOptions: Story = {
  args: {
    label: '옵션 선택',
    options: optionsWithDisabled,
    placeholder: '옵션을 선택하세요',
    helperText: '일부 옵션은 현재 사용할 수 없습니다',
  },
};

// 상태별 스토리들
export const Disabled: Story = {
  args: {
    disabled: true,
    options: basicOptions,
    placeholder: '비활성화된 선택 상자',
    label: '비활성화됨',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    options: basicOptions,
    placeholder: '전체 너비 선택 상자',
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
      <SelectBox variant="primary" options={basicOptions} placeholder="Primary SelectBox" />
      <SelectBox variant="secondary" options={basicOptions} placeholder="Secondary SelectBox" />
      <SelectBox variant="tertiary" options={basicOptions} placeholder="Tertiary SelectBox" />
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
      <SelectBox size="small" options={basicOptions} placeholder="Small SelectBox" />  
      <SelectBox size="medium" options={basicOptions} placeholder="Medium SelectBox" />
      <SelectBox size="large" options={basicOptions} placeholder="Large SelectBox" />
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
        <SelectBox variant="primary" theme="light" options={basicOptions} placeholder="Primary Light" />
        <SelectBox variant="secondary" theme="light" options={basicOptions} placeholder="Secondary Light" />
        <SelectBox variant="tertiary" theme="light" options={basicOptions} placeholder="Tertiary Light" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', width: '300px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dark Theme</h4>
        <SelectBox variant="primary" theme="dark" options={basicOptions} placeholder="Primary Dark" />
        <SelectBox variant="secondary" theme="dark" options={basicOptions} placeholder="Secondary Dark" />
        <SelectBox variant="tertiary" theme="dark" options={basicOptions} placeholder="Tertiary Dark" />
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
      {/* 카테고리 선택 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>카테고리 선택</h4>
        <SelectBox 
          label="일기 카테고리"
          options={categoryOptions}
          placeholder="카테고리를 선택하세요"
          helperText="일기의 주제에 맞는 카테고리를 선택해주세요"
          fullWidth
        />
      </div>

      {/* 설정 옵션 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>사용자 설정</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SelectBox 
            variant="secondary"
            label="국가"
            options={countryOptions}
            defaultValue="kr"
            fullWidth
          />
          <SelectBox 
            variant="secondary"
            label="알림 우선순위"
            options={priorityOptions}
            defaultValue="medium"
            fullWidth
          />
        </div>
      </div>

      {/* 에러 상태 예시 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>필수 선택 항목</h4>
        <SelectBox 
          label="프로젝트 우선순위"
          options={priorityOptions}
          placeholder="우선순위를 선택하세요"
          error
          errorMessage="프로젝트 우선순위는 필수 선택 항목입니다"
          fullWidth
        />
      </div>

      {/* 비활성화 옵션 포함 */}
      <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>권한별 옵션</h4>
        <SelectBox 
          variant="tertiary"
          label="사용 가능한 기능"
          options={optionsWithDisabled}
          placeholder="기능을 선택하세요"
          helperText="회색으로 표시된 기능은 현재 권한으로는 사용할 수 없습니다"
          fullWidth
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 SelectBox 조합들의 예시입니다.',
      },
    },
  },
};

// 인터랙티브 플레이그라운드
export const Playground: Story = {
  args: {
    options: basicOptions,
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
