"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { PATHS } from '@/commons/constants/url';

// 회원가입 폼 스키마 정의
const signupFormSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.')
    .refine((email) => email.includes('@'), '이메일에는 @가 포함되어야 합니다.'),
  password: z.string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '비밀번호는 영문과 숫자를 포함해야 합니다.'),
  passwordConfirm: z.string()
    .min(1, '비밀번호 확인을 입력해주세요.'),
  name: z.string()
    .min(1, '이름을 입력해주세요.')
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm']
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

// GraphQL API 타입 정의
interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

interface CreateUserResponse {
  _id: string;
}

// GraphQL API 함수
const createUser = async (input: CreateUserInput): Promise<CreateUserResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
          }
        }
      `,
      variables: {
        createUserInput: input
      }
    }),
  });

  if (!response.ok) {
    throw new Error('회원가입 요청에 실패했습니다.');
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || '회원가입에 실패했습니다.');
  }

  return result.data.createUser;
};

/**
 * 회원가입 폼 훅
 * react-hook-form, zod, @tanstack/react-query를 사용하여 폼 상태 관리 및 유효성 검사를 처리합니다.
 */
export const useFormHook = () => {
  const router = useRouter();
  const { openModal, closeAll } = useModal();

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: ''
    }
  });

  // 폼 필드 값 감시
  const watchedValues = watch();

  // 회원가입 API 뮤테이션
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessModal();
      reset(); // 폼 초기화
    },
    onError: (error) => {
      showErrorModal(error.message);
    }
  });

  /**
   * 회원가입 성공 모달 표시
   */
  const showSuccessModal = () => {
    const handleConfirm = () => {
      closeAll(); // 모든 모달 닫기
      router.push(PATHS.AUTH.LOGIN); // 로그인 페이지로 이동
    };

    openModal(
      <Modal
        variant="info"
        actions="single"
        title="회원가입 완료"
        message="회원가입이 완료되었습니다."
        isOpen={true}
        onClose={handleConfirm}
        confirmText="확인"
        onConfirm={handleConfirm}
      />,
      handleConfirm // onClose 콜백 전달
    );
  };

  /**
   * 회원가입 실패 모달 표시
   */
  const showErrorModal = (errorMessage: string) => {
    const handleConfirm = () => {
      closeAll(); // 모든 모달 닫기
    };

      // 네트워크 오류인 경우 더 명확한 메시지 표시
      let displayMessage = errorMessage;
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        displayMessage = '회원가입 요청에 실패했습니다.';
      }

    openModal(
      <Modal
        variant="danger"
        actions="single"
        title="회원가입 실패"
        message={displayMessage}
        isOpen={true}
        onClose={handleConfirm}
        confirmText="확인"
        onConfirm={handleConfirm}
      />,
      handleConfirm // onClose 콜백 전달
    );
  };

  /**
   * 폼 제출 처리
   */
  const onSubmit = (data: SignupFormData) => {
    // 이메일 중복을 피하기 위해 timestamp를 포함한 이메일 생성
    const timestamp = Date.now();
    const uniqueEmail = `${timestamp}_${data.email}`;

    createUserMutation.mutate({
      email: uniqueEmail,
      password: data.password,
      name: data.name
    });
  };

  // 모든 필드가 입력되었는지 확인
  const isAllFieldsFilled = watchedValues.email && 
                           watchedValues.password && 
                           watchedValues.passwordConfirm && 
                           watchedValues.name;

  // 폼이 유효하고 모든 필드가 입력되었는지 확인
  const isFormValid = isValid && isAllFieldsFilled;

  return {
    // react-hook-form 메서드들
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    watchedValues,
    
    // 커스텀 메서드들
    reset,
    
    // 상태 정보
    isFormValid,
    isAllFieldsFilled,
    isSubmitting: createUserMutation.isPending,
    
    // API 상태
    mutation: createUserMutation
  };
};
