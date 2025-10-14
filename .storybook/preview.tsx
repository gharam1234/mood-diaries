import type { Preview } from '@storybook/nextjs-vite'
import { NextThemesProvider } from '../src/commons/providers/next-themes/next-themes.provider'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    // 스토리북 배경 설정 (테마와 연동)
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'dark', 
          value: '#000000',
        },
      ],
    },
  },

  // 테마 프로바이더로 모든 스토리를 감싸기
  decorators: [
    (Story) => (
      <NextThemesProvider>
        <Story />
      </NextThemesProvider>
    ),
  ],
};

export default preview;