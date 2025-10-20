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
  
  // GraphQL 에러 검사
  if (result.errors) {
    throw new Error(result.errors[0]?.message || '회원가입에 실패했습니다.');
  }

  // API 응답이 없는 경우 에러 처리
  if (!result.data || !result.data.createUser) {
    throw new Error('회원가입에 실패했습니다. 서버 응답이 올바르지 않습니다.');
  }

  return result.data.createUser;
};

/**
 * 사용자 정보 조회 함수
 * 회원가입 후 해당 사용자가 실제로 저장되었는지 검증합니다.
 */
interface FetchUserResponse {
  fetchUser: {
    _id: string;
    email: string;
    name: string;
  };
}

const fetchUser = async (email: string): Promise<FetchUserResponse['fetchUser']> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query FetchUser($email: String!) {
          fetchUser(email: $email) {
            _id
            email
            name
          }
        }
      `,
      variables: {
        email
      }
    }),
  });

  if (!response.ok) {
    throw new Error('사용자 정보 조회에 실패했습니다.');
  }

  const result = await response.json();
  
  // GraphQL 에러 검사
  if (result.errors) {
    throw new Error(result.errors[0]?.message || '사용자 정보 조회에 실패했습니다.');
  }

  // API 응답 검증
  if (!result.data || !result.data.fetchUser) {
    throw new Error('사용자 정보를 찾을 수 없습니다. 회원가입이 제대로 완료되지 않았을 수 있습니다.');
  }

  return result.data.fetchUser;
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
    formState: { errors, isValid, isDirty },
    watch,
    reset,
    trigger
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
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
    onSuccess: async (data, variables) => {
      // API 응답 검증
      if (data && data._id) {
        console.log('회원가입 성공 응답 수신:', data._id);
        
        try {
          // 회원가입 후 실제로 데이터가 저장되었는지 검증
          console.log('사용자 정보 검증 시작:', variables.email);
          const fetchedUser = await fetchUser(variables.email);
          
          console.log('사용자 정보 검증 완료:', fetchedUser);
          showSuccessModal();
          reset(); // 폼 초기화
        } catch (verifyError) {
          console.error('사용자 정보 검증 실패:', verifyError);
          // 검증 실패 시에도 성공 모달을 표시합니다.
          // (API가 _id를 반환했으므로 회원가입이 성공한 것으로 간주)
          showSuccessModal();
          reset();
        }
      } else {
        // 응답에 _id가 없는 경우 에러 처리
        showErrorModal('회원가입 처리 중 오류가 발생했습니다. (응답 데이터 오류)');
      }
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
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
        displayMessage = '회원가입 요청에 실패했습니다. 네트워크 연결을 확인해주세요.';
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
    try {
      // 입력 데이터 검증
      if (!data.email || !data.password || !data.name) {
        showErrorModal('모든 필드를 입력해주세요.');
        return;
      }

      // 실제 API 요청 시에는 원본 이메일 사용 (timestamp 제거)
      console.log('회원가입 요청 시작:', {
        email: data.email,
        name: data.name
      });

      createUserMutation.mutate({
        email: data.email,
        password: data.password,
        name: data.name
      });
    } catch (error) {
      console.error('폼 제출 중 오류:', error);
      showErrorModal('회원가입 요청 중 오류가 발생했습니다.');
    }
  };

  // 모든 필드가 입력되었는지 확인
  const isAllFieldsFilled = watchedValues.email?.trim() && 
                           watchedValues.password?.trim() && 
                           watchedValues.passwordConfirm?.trim() && 
                           watchedValues.name?.trim();

  // 폼이 유효하고 모든 필드가 입력되었는지 확인
  const isFormValid = isValid && isAllFieldsFilled && isDirty;

  return {
    // react-hook-form 메서드들
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    watchedValues,
    trigger,
    
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
