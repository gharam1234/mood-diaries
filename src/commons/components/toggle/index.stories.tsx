import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toggle } from './index';

// 스토리북 메타데이터
const meta: Meta<typeof Toggle> = {
  title: 'Commons/Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Figma 디자인 시스템을 기반으로 한 Toggle 컴포넌트입니다.

**주요 기능:**
- 3가지 variant (primary, secondary, tertiary)
- 3가지 크기 (small, medium, large)  
- 2가지 테마 (light, dark)
- 제어/비제어 컴포넌트 모두 지원
- 완전한 접근성 지원 (ARIA 속성, 키보드 네비게이션)
- 체크 상태 관리

**사용 예시:**
\`\`\`tsx
<Toggle 
  checked={isEnabled} 
  onChange={(checked) => setIsEnabled(checked)}
  aria-label="알림 설정"
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
      description: 'Toggle의 시각적 스타일 variant',
    },
    size: {
      control: 'select', 
      options: ['small', 'medium', 'large'],
      description: 'Toggle의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Toggle의 테마 (light/dark)',
    },
    checked: {
      control: 'boolean',
      description: 'Toggle의 현재 상태 (켜짐/꺼짐)',
    },
    defaultChecked: {
      control: 'boolean',
      description: '기본 체크 상태 (비제어 컴포넌트용)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    'aria-label': {
      control: 'text',
      description: '접근성을 위한 라벨',
    },
    onChange: {
      action: 'changed',
      description: '상태 변경 콜백 함수',
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    checked: false,
    disabled: false,
    'aria-label': 'Toggle 스위치',
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// 기본 스토리
export const Default: Story = {};

// Variant별 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    'aria-label': '주요 토글',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    'aria-label': '보조 토글',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    'aria-label': '기타 토글',
  },
};

// Size별 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    'aria-label': '작은 토글',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    'aria-label': '중간 토글',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    'aria-label': '큰 토글',
  },
};

// 테마별 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    'aria-label': '라이트 테마',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    'aria-label': '다크 테마',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태별 스토리들
export const Checked: Story = {
  args: {
    checked: true,
    'aria-label': '체크된 토글',
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
    'aria-label': '체크되지 않은 토글',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': '비활성화된 토글',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    'aria-label': '비활성화된 체크 토글',
  },
};

// 인터랙티브 스토리 (제어 컴포넌트)
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Toggle
          {...args}
          checked={checked}
          onChange={(newChecked) => setChecked(newChecked)}
          aria-label="인터랙티브 토글"
        />
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
          현재 상태: {checked ? 'ON' : 'OFF'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '클릭해서 상태를 변경할 수 있는 인터랙티브 토글입니다.',
      },
    },
  },
};

// 모든 variant 한번에 보기
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Toggle variant="primary" aria-label="Primary variant" />
        <span style={{ fontSize: '12px', color: '#666' }}>Primary</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Toggle variant="secondary" aria-label="Secondary variant" />
        <span style={{ fontSize: '12px', color: '#666' }}>Secondary</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Toggle variant="tertiary" aria-label="Tertiary variant" />
        <span style={{ fontSize: '12px', color: '#666' }}>Tertiary</span>
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
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Toggle size="small" aria-label="Small size" />
        <span style={{ fontSize: '12px', color: '#666' }}>Small</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Toggle size="medium" aria-label="Medium size" />
        <span style={{ fontSize: '12px', color: '#666' }}>Medium</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Toggle size="large" aria-label="Large size" />
        <span style={{ fontSize: '12px', color: '#666' }}>Large</span>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>Light Theme</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Toggle variant="primary" theme="light" aria-label="Light primary" />
            <span style={{ fontSize: '11px', color: '#666' }}>Primary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Toggle variant="secondary" theme="light" aria-label="Light secondary" />
            <span style={{ fontSize: '11px', color: '#666' }}>Secondary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Toggle variant="tertiary" theme="light" aria-label="Light tertiary" />
            <span style={{ fontSize: '11px', color: '#666' }}>Tertiary</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dark Theme</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Toggle variant="primary" theme="dark" aria-label="Dark primary" />
            <span style={{ fontSize: '11px', color: '#ccc' }}>Primary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Toggle variant="secondary" theme="dark" aria-label="Dark secondary" />
            <span style={{ fontSize: '11px', color: '#ccc' }}>Secondary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Toggle variant="tertiary" theme="dark" aria-label="Dark tertiary" />
            <span style={{ fontSize: '11px', color: '#ccc' }}>Tertiary</span>
          </div>
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

// 상태 매트릭스
export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>상태별 토글 매트릭스</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '400px' }}>
        {/* 일반 상태 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Toggle checked={false} aria-label="일반 OFF" />
          <span style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>일반 OFF</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Toggle checked={true} aria-label="일반 ON" />
          <span style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>일반 ON</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Toggle disabled aria-label="비활성화" />
          <span style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>비활성화</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Toggle disabled checked={false} aria-label="비활성화 OFF" />
          <span style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>비활성화 OFF</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Toggle disabled checked={true} aria-label="비활성화 ON" />
          <span style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>비활성화 ON</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '토글의 모든 상태를 매트릭스 형태로 확인할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 예시들
export const RealWorldExamples: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    const [privacy, setPrivacy] = useState(false);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        {/* 설정 패널 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>앱 설정</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>알림 받기</span>
              <Toggle
                checked={notifications}
                onChange={setNotifications}
                aria-label="알림 설정"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>다크 모드</span>
              <Toggle
                variant="secondary"
                checked={darkMode}
                onChange={setDarkMode}
                aria-label="다크 모드 설정"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>자동 저장</span>
              <Toggle
                size="small"
                checked={autoSave}
                onChange={setAutoSave}
                aria-label="자동 저장 설정"
              />
            </div>
          </div>
        </div>

        {/* 개인정보 설정 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>개인정보</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>프로필 공개</div>
                <div style={{ fontSize: '12px', color: '#666' }}>다른 사용자가 프로필을 볼 수 있습니다</div>
              </div>
              <Toggle
                variant="tertiary"
                checked={privacy}
                onChange={setPrivacy}
                aria-label="프로필 공개 설정"
              />
            </div>
          </div>
        </div>

        {/* 비활성화된 설정 */}
        <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', opacity: 0.6 }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>프리미엄 기능</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>고급 분석</div>
              <div style={{ fontSize: '12px', color: '#666' }}>프리미엄 구독 필요</div>
            </div>
            <Toggle
              disabled
              checked={false}
              aria-label="고급 분석 (프리미엄 기능)"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 토글 설정 패널들의 예시입니다.',
      },
    },
  },
};

// 폼 사용 예시
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      dataSharing: false,
    });

    const handleToggleChange = (field: keyof typeof formData) => (checked: boolean) => {
      setFormData(prev => ({ ...prev, [field]: checked }));
    };

    return (
      <div style={{ maxWidth: '500px' }}>
        <form style={{ padding: '24px', border: '1px solid #e0e0e0', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>알림 설정</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block' }}>이메일 알림</label>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>새로운 활동에 대한 이메일을 받습니다</p>
              </div>
              <Toggle
                checked={formData.emailNotifications}
                onChange={handleToggleChange('emailNotifications')}
                aria-label="이메일 알림 설정"
                name="emailNotifications"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block' }}>푸시 알림</label>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>모바일 기기로 즉시 알림을 받습니다</p>
              </div>
              <Toggle
                variant="secondary"
                checked={formData.pushNotifications}
                onChange={handleToggleChange('pushNotifications')}
                aria-label="푸시 알림 설정"
                name="pushNotifications"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block' }}>마케팅 이메일</label>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>제품 업데이트 및 프로모션 정보를 받습니다</p>
              </div>
              <Toggle
                variant="tertiary"
                size="small"
                checked={formData.marketingEmails}
                onChange={handleToggleChange('marketingEmails')}
                aria-label="마케팅 이메일 설정"
                name="marketingEmails"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', display: 'block' }}>데이터 공유</label>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>서비스 개선을 위한 익명 데이터 공유에 동의합니다</p>
              </div>
              <Toggle
                checked={formData.dataSharing}
                onChange={handleToggleChange('dataSharing')}
                aria-label="데이터 공유 설정"
                name="dataSharing"
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>현재 설정</h5>
            <pre style={{ fontSize: '12px', margin: 0, fontFamily: 'monospace' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '폼 내에서 토글을 사용하는 실제 예시입니다. 각 토글은 폼 데이터와 연동되어 있습니다.',
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
    checked: false,
    disabled: false,
    'aria-label': '플레이그라운드 토글',
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 props를 조합해서 테스트해볼 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
