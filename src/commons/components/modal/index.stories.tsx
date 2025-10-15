import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Modal, { ModalProps } from './index';

const meta: Meta<typeof Modal> = {
  title: 'Commons/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['info', 'danger'],
      description: '모달의 시각적 스타일 variant',
    },
    actions: {
      control: { type: 'inline-radio' },
      options: ['single', 'dual'],
      description: '모달의 액션 타입 (단일/이중 버튼)',
    },
    theme: {
      control: { type: 'inline-radio' },
      options: ['light', 'dark'],
      description: '모달의 테마 (light/dark)',
    },
    onClose: { action: 'closed' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const defaultArgs: Partial<ModalProps> = {
  title: '일기 등록 완료',
  message: '등록이 완료 되었습니다.',
  isOpen: true,
  confirmText: '확인',
  cancelText: '취소',
  onClose: () => {},
  onConfirm: () => {},
  onCancel: () => {},
};

export const InfoSingleLight: Story = {
  name: 'info/single (light)',
  args: {
    ...defaultArgs,
    variant: 'info',
    actions: 'single',
    theme: 'light',
  },
};

export const InfoDualLight: Story = {
  name: 'info/dual (light)',
  args: {
    ...defaultArgs,
    title: '일기 등록 취소',
    message: '일기 등록을 취소 하시겠어요?\n작성 중인 내용은 저장되지 않습니다.',
    variant: 'info',
    actions: 'dual',
    theme: 'light',
    confirmText: '계속 작성',
    cancelText: '등록 취소',
  },
};

export const DangerSingleLight: Story = {
  name: 'danger/single (light)',
  args: {
    ...defaultArgs,
    title: '삭제 불가',
    message: '해당 항목은 현재 상태에서 삭제할 수 없습니다.',
    variant: 'danger',
    actions: 'single',
    theme: 'light',
  },
};

export const DangerDualLight: Story = {
  name: 'danger/dual (light)',
  args: {
    ...defaultArgs,
    title: '정말 삭제하시겠어요?',
    message: '삭제하면 되돌릴 수 없어요.',
    variant: 'danger',
    actions: 'dual',
    theme: 'light',
    confirmText: '삭제',
    cancelText: '취소',
  },
};

export const InfoSingleDark: Story = {
  name: 'info/single (dark)',
  args: {
    ...defaultArgs,
    variant: 'info',
    actions: 'single',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const InfoDualDark: Story = {
  name: 'info/dual (dark)',
  args: {
    ...defaultArgs,
    variant: 'info',
    actions: 'dual',
    theme: 'dark',
    confirmText: '확인',
    cancelText: '취소',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const DangerSingleDark: Story = {
  name: 'danger/single (dark)',
  args: {
    ...defaultArgs,
    variant: 'danger',
    actions: 'single',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const DangerDualDark: Story = {
  name: 'danger/dual (dark)',
  args: {
    ...defaultArgs,
    variant: 'danger',
    actions: 'dual',
    theme: 'dark',
    confirmText: '삭제',
    cancelText: '취소',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};


