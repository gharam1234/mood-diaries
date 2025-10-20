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
            - text: a@c.com
        - generic [ref=e16]:
          - generic [ref=e17]: 비밀번호
          - textbox "비밀번호" [ref=e19]:
            - /placeholder: 비밀번호를 입력하세요
            - text: 1234qwer
        - button "로그인" [ref=e21] [cursor=pointer]:
          - generic [ref=e22]: 로그인
      - paragraph [ref=e24]:
        - text: 아직 계정이 없으신가요?
        - link "회원가입" [ref=e25] [cursor=pointer]:
          - /url: /auth/signup
  - alert [ref=e26]
  - dialog "로그인이 완료되었습니다" [ref=e29]:
    - generic [ref=e30]:
      - heading "로그인이 완료되었습니다" [level=2] [ref=e31]
      - paragraph [ref=e32]: 환영합니다!
    - button "확인" [ref=e34] [cursor=pointer]:
      - generic [ref=e35]: 확인
```