---
title: WebdriverIO E2E 테스트 자동화 (QA와 개발의 경계를 허물다)
desc: 늘어나는 기능과 짧아지는 개발 주기 속에서, QA 팀의 수동 테스트는 점점 더 큰 병목이 되어가고 있었습니다. 이 글에서는 프론트엔드 개발팀이 E2E 테스트 자동화를 도입하여 이 문제를 해결한 경험을 공유하고자 합니다.
createdAt: 2025-02-20
category: Frontend
subcategory: Test
tags:
  - E2E
  - WebdriverIO
---


"QA 팀의 테스트 일정이 늦어져서 배포가 지연될 것 같습니다."
이런 소식을 들을 때마다 마음이 무거웠습니다. 

늘어나는 기능과 짧아지는 개발 주기 속에서, QA 팀의 수동 테스트는 점점 더 큰 병목이 되어가고 있었습니다.

이 글에서는 프론트엔드 개발팀이 E2E 테스트 자동화를 도입하여 이 문제를 해결한 경험을 공유하고자 합니다.

## 왜 E2E 테스트였나?

### 단위 테스트의 한계
처음에는 단위 테스트 도입을 고려했습니다. 하지만 단위 테스트만으로는:
- 실제 사용자 시나리오 검증이 어려움
- 컴포넌트 간 상호작용 테스트의 한계
- 브라우저 호환성 문제 발견 불가

이러한 한계가 있었습니다.

### E2E 테스트의 장점
E2E 테스트는 실제 사용자의 행동을 그대로 시뮬레이션할 수 있습니다:
```javascript
// 실제 사용자의 로그인 과정을 그대로 테스트
await $('#username').setValue('user@example.com');
await $('#password').setValue('password');
await $('button[type="submit"]').click();
```

## WebdriverIO를 선택한 이유

시장에는 Cypress, Playwright 등 여러 E2E 테스트 도구가 있었습니다. 

우리가 WebdriverIO를 선택한 이유는:

1. **넓은 브라우저 지원**
   - Selenium 기반으로 거의 모든 브라우저 지원
   - 크로스 브라우저 테스트 용이

2. **개발자 친화적 API**
   ```javascript
   // 직관적인 체이닝 문법
   const button = $('div').$('button');
   await button.click();
   ```

3. **Jest와 유사한 문법**
   ```javascript
   describe('로그인 기능', () => {
     it('유효한 자격증명으로 로그인 성공', async () => {
       // 테스트 코드
     });
   });
   ```

## 주요 도전 과제와 해결 방법

### 1. 불안정한 테스트 문제
가장 큰 고민은 불안정한 테스트였습니다. 같은 테스트 코드가 때때로 실패하는 현상이 발생했습니다.

**해결 방법: 명시적 대기 전략**
```javascript
// 기존 코드의 문제점
await $('.dashboard').click();  // 요소가 준비되지 않았을 수 있음

// 개선된 코드
await browser.waitUntil(
  async () => await $('.dashboard').isDisplayed(),
  {
    timeout: 5000,
    timeoutMsg: '대시보드가 표시되지 않음'
  }
);
```

### 2. 테스트 코드 유지보수성
테스트 코드가 늘어나면서 유지보수가 어려워지기 시작했습니다.

**해결 방법: 페이지 객체 모델 도입**
```javascript
class LoginPage {
  get usernameInput() { return $('#username'); }
  get passwordInput() { return $('#password'); }
  
  async login(username, password) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await $('button[type="submit"]').click();
  }
}

// 테스트 코드
const loginPage = new LoginPage();
await loginPage.login('user', 'password');
```

## 실제 도입 효과

### 1. 시간 절감
- 회귀 테스트: 2주 → 2시간
- QA 리소스 절감
- 배포 주기: 2주 → 1주

### 2. 품질 향상
- 사전 버그 발견률 증가
- 테스트 커버리지 100% 달성

## 예상치 못한 이점

### 1. 개발과 QA 협업 개선
테스트 자동화는 개발팀과 QA팀 사이의 벽을 허물어주었습니다. 

QA팀은 이제 더 전략적인 테스트에 집중할 수 있게 되었고, 개발팀은 QA의 관점을 더 잘 이해하게 되었습니다.

### 2. 문서화 자동화
테스트 코드가 곧 살아있는 문서가 되었습니다:
```javascript
describe('장바구니 기능', () => {
  it('상품 추가 시 장바구니 카운트가 증가해야 함', async () => {
    // 이 테스트 코드 자체가 기능 명세가 됨
  });
});
```

## 마치며

E2E 테스트 자동화는 단순한 도구 도입 그 이상이었습니다. 이는 개발 프로세스 전반의 혁신이었고, QA와 개발 사이의 새로운 협업 모델을 만드는 계기가 되었습니다.

여러분의 프로젝트에서도 E2E 테스트 자동화를 고려하고 계신다면, 이 글이 도움이 되었기를 바랍니다. 