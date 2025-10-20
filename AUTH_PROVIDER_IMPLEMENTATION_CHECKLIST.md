# AuthProvider 구현 체크리스트

## 📋 구현 완료 사항

### ✅ 조건-커서룰 적용
- [x] @01-common.mdc 커서룰 적용
  - [x] TypeScript 타입 정의 완료
  - [x] React 컴포넌트 구조 적용
  - [x] 한국어 주석 작성
  - [x] 명확한 함수명과 변수명 사용
  - [x] 에러 처리 구현

### ✅ 조건-파일경로
- [x] 구현된 TSX 파일경로: `src/commons/providers/auth/auth.provider.tsx`
- [x] 파일 생성 및 구현 완료

### ✅ 핵심요구사항 - Layout 연결
- [x] `src/app/layout.tsx`에서 AuthProvider import
- [x] ReactQueryProvider보다 위에 위치
- [x] children을 감싸도록 구조 설정

### ✅ 핵심요구사항 - 기능 구현

#### 1. 페이지URL 경로
- [x] `commons/constants/url.ts`에서 로그인 페이지 경로 확인
- [x] `/auth/login` 경로 사용

#### 2. 로그인 기능
- [x] url.ts에 정의된 로그인페이지로 이동 (`/auth/login`)
- [x] `login` 함수 구현
- [x] 로컬스토리지에 accessToken과 user 정보 저장

#### 3. 로그아웃 기능
- [x] 로컬스토리지에서 accessToken 제거
- [x] 로컬스토리지에서 user 제거
- [x] url.ts에 정의된 로그인페이지로 이동 (`/auth/login`)

#### 4. 로그인상태검증 기능
- [x] 로컬스토리지의 accessToken 유무로 로그인 상태 판단
- [x] accessToken 복호화 없이 토큰 유무만 확인
- [x] 모든 페이지에서 실시간 로그인 상태 감지
- [x] `checkAuthStatus` 함수 구현

#### 5. 로그인유저정보조회 기능
- [x] 로컬스토리지에서 user 정보 반환
- [x] 모든 페이지에서 실시간 유저 정보 감지
- [x] `getUserInfo` 함수 구현

### ✅ 추가 구현 사항

#### Context API 구조
- [x] AuthContext 생성
- [x] AuthProvider 컴포넌트 구현
- [x] useAuth 훅 구현
- [x] 타입 안전성 보장

#### 상태 관리
- [x] isLoggedIn 상태 관리
- [x] user 상태 관리
- [x] 실시간 상태 업데이트

#### 이벤트 처리
- [x] 로컬스토리지 변경 감지
- [x] 컴포넌트 마운트 시 상태 초기화
- [x] 메모리 누수 방지를 위한 이벤트 리스너 정리

#### 에러 처리
- [x] useAuth 훅 사용 시 AuthProvider 외부에서 호출하는 경우 에러 처리
- [x] JSON 파싱 에러 처리
- [x] SSR 환경에서의 안전한 처리

## 📝 구현 세부사항

### 파일 구조
```
src/commons/providers/auth/
├── auth.provider.tsx          # 메인 AuthProvider 구현
└── prompts/
    └── prompt.101.provider.txt # 구현 요구사항 문서
```

### 주요 함수
1. **login(userData, accessToken)**: 로그인 처리
2. **logout()**: 로그아웃 처리
3. **checkAuthStatus()**: 로그인 상태 검증
4. **getUserInfo()**: 유저 정보 조회

### Context API 사용법
```tsx
// 컴포넌트에서 사용
import { useAuth } from '@/commons/providers/auth/auth.provider';

const MyComponent = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  // ... 컴포넌트 로직
};
```

## ✅ 최종 검증

- [x] 모든 요구사항 구현 완료
- [x] TypeScript 타입 안전성 확보
- [x] React Context API 올바른 사용
- [x] 로컬스토리지 기반 인증 상태 관리
- [x] 실시간 상태 업데이트 구현
- [x] 에러 처리 및 예외 상황 대응
- [x] 메모리 누수 방지
- [x] SSR 환경 호환성
- [x] 한국어 주석 작성
- [x] 린터 오류 없음

## 🎯 구현 완료

AuthProvider가 성공적으로 구현되었으며, 모든 요구사항이 충족되었습니다. 하위 컴포넌트에서 `useAuth` 훅을 통해 인증 관련 기능을 사용할 수 있습니다.
