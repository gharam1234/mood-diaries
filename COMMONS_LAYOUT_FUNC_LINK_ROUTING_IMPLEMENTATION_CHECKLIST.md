# Commons Layout Func Link Routing 구현 체크리스트

## 📋 구현 완료 항목

### ✅ 1. 링크 라우팅 훅 구현
- **파일**: `src/commons/layout/hooks/index.link.routing.hook.ts`
- **기능**:
  - `useLinkRouting` 훅 구현
  - Next.js `useRouter`, `usePathname` 활용
  - `url.ts`에서 경로 상수 import 하여 사용 (하드코딩 방지)
  - 로고, 일기보관함, 사진보관함 클릭 핸들러 구현
  - 현재 경로 기반 활성 상태 확인 함수 구현

### ✅ 2. Layout 컴포넌트 업데이트
- **파일**: `src/commons/layout/index.tsx`
- **기능**:
  - `useLinkRouting` 훅 import 및 사용
  - 로고 클릭 이벤트 추가 (`handleLogoClick`)
  - 네비게이션 탭 클릭 이벤트 추가 (`handleDiariesClick`, `handlePicturesClick`)
  - 동적 활성 상태 적용 (`isDiariesActive()`, `isPicturesActive()`)
  - 테스트용 `data-testid` 속성 추가

### ✅ 3. CSS 스타일 업데이트
- **파일**: `src/commons/layout/styles.module.css`
- **기능**:
  - `.logo`에 `cursor: pointer` 추가
  - `.activeTab`에 `cursor: pointer` 추가
  - `.inactiveTab`에 `cursor: pointer` 추가

### ✅ 4. Playwright 테스트 구현
- **파일**: `src/commons/layout/tests/index.link.routing.hook.spec.ts`
- **기능**:
  - TDD 기반 테스트 구현
  - 페이지 로드 대기: `data-testid` 기반 (networkidle 사용 안함)
  - timeout 설정: 500ms 미만
  - 테스트 케이스:
    - 로고 클릭 시 일기목록 페이지 이동
    - 일기보관함 탭 클릭 시 페이지 이동 및 활성 상태 변경
    - 사진보관함 탭 클릭 시 페이지 이동 및 활성 상태 변경 (skip 대상: /pictures)
    - 일기 상세 페이지에서 일기보관함 탭 활성화
    - 커서 스타일 확인
    - 페이지 간 네비게이션 시 활성 상태 변경

## 🎯 핵심 요구사항 충족 확인

### ✅ Navigation 메뉴 클릭 시 활성 상태 변경
- `styles_activeTab`, `styles_activeTabText` CSS 클래스가 동적으로 적용됨
- 현재 경로에 따라 `isDiariesActive()`, `isPicturesActive()` 함수로 활성 상태 판단
- 클릭 시 즉시 활성 상태가 변경되도록 구현

### ✅ URL.ts 기반 경로 이동
- `commons/constants/url.ts`의 `PATHS` 상수 사용
- 하드코딩 없이 경로 관리
- 로고 클릭: `PATHS.DIARIES.LIST` (/diaries)
- 일기보관함 클릭: `PATHS.DIARIES.LIST` (/diaries)
- 사진보관함 클릭: `PATHS.PICTURES.LIST` (/pictures)

### ✅ Playwright 테스트 조건 준수
- jest, @testing-library/react 사용 안함
- timeout 500ms 미만 설정
- `data-testid` 기반 페이지 로드 대기
- networkidle 사용 안함
- /pictures 경로 테스트 skip 적용

### ✅ CSS cursor: pointer 적용
- 로고, 활성 탭, 비활성 탭 모두에 적용
- 클릭 가능한 UI 요소임을 명확히 표시

## 📁 생성된 파일 목록

1. `src/commons/layout/hooks/index.link.routing.hook.ts` - 링크 라우팅 훅
2. `src/commons/layout/tests/index.link.routing.hook.spec.ts` - Playwright 테스트 파일
3. `COMMONS_LAYOUT_FUNC_LINK_ROUTING_IMPLEMENTATION_CHECKLIST.md` - 이 체크리스트

## 📝 수정된 파일 목록

1. `src/commons/layout/index.tsx` - 훅 사용 및 클릭 이벤트 추가
2. `src/commons/layout/styles.module.css` - cursor: pointer 스타일 추가

## 🔍 커서룰 적용 결과

### @01-common.mdc 적용 결과
- ✅ 한국어 주석 작성
- ✅ TypeScript 타입 안전성 확보
- ✅ 함수형 컴포넌트 및 훅 패턴 사용
- ✅ 명확한 네이밍 컨벤션 적용

### @04-func.mdc 적용 결과
- ✅ TDD 기반 Playwright 테스트 구현
- ✅ 기능별 모듈 분리 (훅, 컴포넌트, 테스트)
- ✅ 재사용 가능한 훅 패턴 적용
- ✅ 상태 관리 로직 분리

## ✨ 구현 완료

모든 요구사항이 성공적으로 구현되었습니다. Navigation 메뉴 클릭 시 활성 상태가 올바르게 변경되며, URL 기반 라우팅이 정상 작동합니다.
