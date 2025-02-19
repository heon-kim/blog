---
title: Vue.js에서 다중 테넌트를 위한 동적 BaseURL 구현하기
desc: 여러 회사가 사용하는 관리자 시스템을 개발하면서, 각 회사별로 다른 URL 경로를 제공해야 하는 요구사항을 받았습니다.
createdAt: 2025-02-19
category: Frontend
subcategory: Vue
tags:
  - 라우팅
---


여러 회사가 사용하는 관리자 시스템을 개발하면서, 각 회사별로 다른 URL 경로를 제공해야 하는 요구사항을 받았습니다. 

## 처음 마주친 문제들

### 1. 정적 설정의 한계
처음에는 `vue.config.js`에서 baseURL을 정적으로 설정했습니다:

```javascript
// vue.config.js
module.exports = {
  publicPath: '/company/admin'
}
```

하지만 이 방식으로는 회사별로 다른 URL을 설정할 수 없었죠. 배포할 때마다 설정을 변경해야 했고, 이는 현실적인 해결책이 아니었습니다.

### 2. 데이터 중복 관리의 함정
다음으로 시도한 방법은 회사별 URL 정보를 데이터베이스에 저장하고, 이를 프론트엔드와 백엔드 양쪽에서 관리하는 것이었습니다. 하지만 이 접근법에는 몇 가지 문제가 있었습니다:

- 데이터 동기화 이슈
- 관리 포인트 증가
- 설정 변경 시 양쪽 모두 수정 필요

### 3. Vue.js의 기술적 제약
가장 큰 도전은 Vue 인스턴스가 생성된 후에는 baseURL을 변경할 수 없다는 점이었습니다. 이는 프레임워크의 근본적인 제약사항이었습니다.

## 해결 방안: 중앙화된 설정 관리

### 1. Kubernetes 환경변수 활용
먼저 Kubernetes의 환경변수를 활용하여 baseURL을 중앙에서 관리하도록 했습니다:

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-service
spec:
  template:
    spec:
      containers:
        - name: backend
          env:
            - name: BASE_URL
              value: "/company/admin"
```

### 2. 로그인 시 동적 URL 전달
백엔드에서는 로그인 성공 시 해당 회사의 baseURL을 함께 전달하도록 구현했습니다:

```typescript
const handleLogin = async (req, res) => {
  try {
    const loginResult = await authenticateUser(req.body);
    if (loginResult.success) {
      res.json({
        success: true,
        baseURL: process.env.BASE_URL,
        redirectTo: '/dashboard'
      });
    }
  } catch (error) {
    handleError(error);
  }
};
```

### 3. Vue 초기화 전 설정 적용
가장 중요한 부분은 Vue 인스턴스가 생성되기 전에 baseURL을 설정하는 것이었습니다:

```javascript
const initializeApp = async () => {
  // Vue 인스턴스 생성 전 baseURL 설정 감지
  const baseURL = await detectBaseURL();
  
  // 동적 라우터 설정
  const router = createRouter({
    base: baseURL,
    // 라우터 설정
  });

  new Vue({
    router,
    // Vue 설정
  }).$mount('#app');
};
```

## 결과 및 교훈

이러한 접근 방식을 통해 다음과 같은 성과를 얻을 수 있었습니다:

1. **관리 효율성 향상**
   - 단일 지점에서 모든 URL 설정 관리
   - 설정 변경 시 즉시 반영
   - 운영 비용 감소

2. **확장성 확보**
   - 새로운 회사 추가가 용이
   - URL 체계 변경이 자유로움
   - 커스텀 설정 확장 가능

## 마치며

이 경험을 통해 프레임워크의 생명주기를 이해하고 이를 고려한 설계의 중요성을 배웠습니다. 특히 다중 테넌트 환경에서는 설정의 중앙화와 동적 처리가 얼마나 중요한지 깨달을 수 있었습니다.