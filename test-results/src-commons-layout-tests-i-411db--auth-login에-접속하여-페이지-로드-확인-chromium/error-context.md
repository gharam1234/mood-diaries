# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "로그인" [level=1] [ref=e7]
        - paragraph [ref=e8]: 계정에 로그인하여 서비스를 이용하세요
      - generic [ref=e9]:
        - generic [ref=e11]:
          - generic [ref=e12]: 이메일
          - textbox "이메일" [ref=e14]:
            - /placeholder: 이메일을 입력하세요
        - generic [ref=e16]:
          - generic [ref=e17]: 비밀번호
          - textbox "비밀번호" [ref=e19]:
            - /placeholder: 비밀번호를 입력하세요
        - button "로그인" [disabled] [ref=e21]:
          - generic [ref=e22]: 로그인
      - paragraph [ref=e24]:
        - text: 아직 계정이 없으신가요?
        - link "회원가입" [ref=e25] [cursor=pointer]:
          - /url: /auth/signup
  - alert [ref=e26]
```