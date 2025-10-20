# 인증 상태 UI 구현 체크리스트

## 📋 구현 완료 사항

### ✅ 조건-커서룰 적용
- [x] @01-common.mdc 적용: 공통컴포넌트 Button 사용
- [x] @02-wireframe.mdc 적용: header 영역 우측에 인증 상태 UI 배치
- [x] @03-ui.mdc 적용: 메인페이지 톤앤매너에 맞는 디자인 구현

### ✅ 조건-파일경로
- [x] TSX 파일: `src/commons/layout/index.tsx` 수정 완료
- [x] CSS 파일: `src/commons/layout/styles.module.css` 수정 완료

### ✅ 조건-공통목록
- [x] 공통컴포넌트 사용: `<Button />` 컴포넌트 활용
- [x] 색상 토큰 사용: `var(--color-text-primary)` 등 global.css 변수 활용
- [x] 타이포그래피 토큰 사용: `var(--typography-body02_m-*)` 등 global.css 변수 활용

### ✅ 핵심요구사항
- [x] 구현방식: 메인페이지 톤앤매너에 맞게 구현
  - 메인페이지의 깔끔한 그리드 레이아웃과 일치하는 디자인
  - 일관된 색상 및 타이포그래피 토큰 사용
- [x] 구현위치: header 영역 우측에 구현
  - `justify-content: space-between`으로 좌측 로고와 우측 인증 상태 분리
- [x] 구현내용: UI만 구현 (기능 미구현)
  - 로그인상태: 유저이름("민지님"), 로그아웃 버튼
  - 비로그인상태: 구현하지 않음 (요구사항에 따라)

### ✅ 공통컴포넌트 규칙 준수
- [x] 원본 수정 없이 props만 활용
  - `variant: "secondary"` 사용
  - `theme: "light"` 사용
  - `size: "medium"` 사용 (피그마와 일치)
  - `className` 전달: width만 허용 (`width: 80px`)
- [x] 적용된 공통컴포넌트: 로그아웃 버튼 `<Button />`

## 🎨 디자인 구현 세부사항

### 레이아웃
- Header 영역을 `justify-content: space-between`으로 변경하여 좌측 로고와 우측 인증 상태 분리
- 인증 상태 컨테이너: `display: flex`, `align-items: center`, `gap: 12px`

### 색상
- 유저이름: `var(--color-text-primary)` (일관된 텍스트 색상)
- 버튼: secondary variant 사용으로 메인페이지와 조화

### 타이포그래피
- 유저이름: `var(--typography-body02_m-*)` 토큰 사용
- 폰트 패밀리: `var(--font-family-default)` 사용

### 크기
- 버튼 너비: 80px (적절한 크기)
- 컨테이너 높이: 40px (header 높이 60px 내에서 적절한 비율)

## 📝 구현 코드 요약

### TSX 구현
```tsx
{/* 인증 상태 UI - 로그인 상태만 구현 */}
<div className={styles.authStatus}>
  <span className={styles.userName}>민지님</span>
  <Button
    variant="secondary"
    theme="light"
    size="medium"
    className={styles.logoutButton}
  >
    로그아웃
  </Button>
</div>
```

### CSS 구현
```css
/* 인증 상태 UI */
.authStatus {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
}

.userName {
  font-family: var(--font-family-default);
  font-size: var(--typography-body02_m-fontSize);
  font-weight: var(--typography-body02_m-fontWeight);
  line-height: var(--typography-body02_m-lineHeight);
  letter-spacing: -0.14px;
  color: var(--color-text-primary);
}

.logoutButton {
  width: 80px;
}
```

## ✅ 최종 검증
- [x] 모든 커서룰 조건 충족
- [x] 메인페이지 톤앤매너 일치
- [x] 공통컴포넌트 규칙 준수
- [x] CSS 변수 토큰 사용
- [x] UI만 구현 (기능 미구현)
- [x] 로그인 상태만 구현 (비로그인 상태 미구현)
- [x] 린터 오류 없음

## 📊 구현 완료율: 100%
모든 요구사항이 성공적으로 구현되었습니다.
