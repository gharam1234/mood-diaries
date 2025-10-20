"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 로그인 폼 스키마 정의
const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// API 응답 타입 정의
interface LoginResponse {
  loginUser: {
    accessToken: string;
  };
}

interface UserResponse {
  fetchUserLoggedIn: {
    _id: string;
    name: string;
  };
}

// GraphQL 쿼리 정의
const LOGIN_USER_MUTATION = `
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

const FETCH_USER_LOGGED_IN_QUERY = `
  query FetchUserLoggedIn {
    fetchUserLoggedIn {
      _id
      name
    }
  }
`;

// API 요청 함수들
const loginUser = async (variables: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: LOGIN_USER_MUTATION,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error('로그인 요청에 실패했습니다.');
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0]?.message || '로그인에 실패했습니다.');
  }

  if (!data.data?.loginUser?.accessToken) {
    throw new Error('로그인에 실패했습니다.');
  }

  return data.data;
};

const fetchUserLoggedIn = async (accessToken: string): Promise<UserResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: FETCH_USER_LOGGED_IN_QUERY,
    }),
  });

  if (!response.ok) {
    throw new Error('사용자 정보 조회에 실패했습니다.');
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0]?.message || '사용자 정보 조회에 실패했습니다.');
  }

  if (!data.data?.fetchUserLoggedIn?._id || !data.data?.fetchUserLoggedIn?.name) {
    throw new Error('사용자 정보를 가져올 수 없습니다.');
  }

  return data.data;
};

// 로그인 폼 훅
export const useLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAll } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 설정
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      try {
        // accessToken을 로컬스토리지에 저장
        localStorage.setItem('accessToken', data.loginUser.accessToken);

        // 사용자 정보 조회
        const userData = await fetchUserLoggedIn(data.loginUser.accessToken);
        
        // 사용자 정보를 로컬스토리지에 저장
        localStorage.setItem('user', JSON.stringify({
          _id: userData.fetchUserLoggedIn._id,
          name: userData.fetchUserLoggedIn.name,
        }));

        // 커스텀 이벤트 발생 (같은 탭에서의 변경 감지)
        window.dispatchEvent(new CustomEvent('userDataChanged'));

        // 로그인 완료 모달 표시
        const handleSuccessConfirm = () => {
          closeAll();
          // 모달이 완전히 닫힌 후 페이지 이동
          setTimeout(() => {
            router.push('/diaries');
          }, 100);
        };

        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인이 완료되었습니다"
            message="환영합니다!"
            isOpen={true}
            onClose={handleSuccessConfirm}
            confirmText="확인"
            onConfirm={handleSuccessConfirm}
          />,
          handleSuccessConfirm
        );
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 로그인 실패 모달 표시
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="로그인에 실패했습니다"
            message="사용자 정보를 가져올 수 없습니다."
            isOpen={true}
            onClose={() => {}}
            confirmText="확인"
            onConfirm={() => {
              closeAll();
            }}
          />
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      // 로그인 실패 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="로그인에 실패했습니다"
          message={error.message || '이메일 또는 비밀번호를 확인해주세요.'}
          isOpen={true}
          onClose={() => {}}
          confirmText="확인"
          onConfirm={() => {
            closeAll();
          }}
        />
      );
      setIsSubmitting(false);
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    loginMutation.mutate(data);
  };

  // 폼 유효성 검사 - 이메일과 비밀번호가 모두 입력되었는지 확인
  const emailValue = form.watch('email');
  const passwordValue = form.watch('password');
  const isFormValid = Boolean(emailValue && emailValue.trim().length > 0 && 
                             passwordValue && passwordValue.trim().length > 0);

  return {
    form,
    onSubmit,
    isFormValid,
    isSubmitting,
    errors: form.formState.errors,
  };
};
