---
title: Feature-Sliced Design(FSD)으로 React 프로젝트 구조화하기
desc: React 프로젝트를 시작할 때 가장 고민되는 부분 중 하나가 바로 폴더 구조입니다. 처음에는 단순히 components, pages, utils 등으로 나누었지만, 프로젝트가 커질수록 이러한 구조의 한계를 느꼈습니다. 이번에는 Feature-Sliced Design(FSD)을 도입하면서 경험한 내용을 공유하고자 합니다.
createdAt: 2025-02-19
category: Frontend
subcategory: React
tags:
  - 폴더 구조
  - FSD
---

React 프로젝트를 시작할 때 가장 고민되는 부분 중 하나가 바로 폴더 구조입니다. 처음에는 단순히 components, pages, utils 등으로 나누었지만, 프로젝트가 커질수록 이러한 구조의 한계를 느꼈습니다. 이번에는 Feature-Sliced Design(FSD)을 도입하면서 경험한 내용을 공유하고자 합니다.

## FSD의 핵심 개념

### 1. 계층 구조
```txt
src/  
├── app/          # 전역 설정, 프로바이더
├── processes/    # 비즈니스 프로세스
├── pages/        # 페이지 컴포넌트
├── widgets/      # 독립적인 블록
├── features/     # 사용자 상호작용
├── entities/     # 비즈니스 엔티티
└── shared/       # 공유 유틸리티
```

### 2. 주요 원칙
1. **단방향 의존성**
   - 상위 계층은 하위 계층에만 의존 가능
   - app → processes → pages → widgets → features → entities → shared
   - 예를 들어, entities는 features를 import할 수 없지만, features는 entities를 
import 가능

2. **Public API**
   - 각 슬라이스는 index.ts를 통해 public API 제공
   - 내부 구현은 숨기고 필요한 것만 노출

3. **슬라이스 독립성**
   - 각 기능은 독립적으로 개발/테스트 가능
   - 명확한 책임 영역 구분

## 계층별 구현 예시

### 1. Entities (비즈니스 엔티티)
```typescript
// entities/user/
├── model/
│   ├── types.ts      # 타입 정의
│   └── store.ts      # 상태 관리
├── ui/
│   └── UserCard.tsx  # UI 컴포넌트
└── api/
    └── userApi.ts    # API 호출

// types.ts
interface User {
    id: number;
    name: string;
    email: string;
}
```

### 2. Features (사용자 상호작용)
```typescript
// features/auth/
├── model/
│   └── authSlice.ts    # 상태 관리
├── ui/
│   ├── LoginForm.tsx   # UI 컴포넌트
│   └── LogoutButton.tsx
└── api/
    └── authApi.ts      # API 호출
```

### 3. Widgets (복합 컴포넌트)
```typescript
// widgets/header/
├── ui/
│   └── Header.tsx    # 여러 features를 조합한 컴포넌트
└── model/
    └── store.ts      # 위젯 관련 상태
```

### 4. Pages (페이지 컴포넌트)
```typescript
// pages/profile/
├── ui/
│   └── ProfilePage.tsx  # 페이지 컴포넌트
└── model/
    └── store.ts         # 페이지 상태
```

## API 구조화 (Facade 패턴)

### 1. 기본 설정 (Shared Layer)
```typescript
// shared/api/base/index.ts
export const baseApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
```

### 2. 엔티티 API
```typescript
// entities/user/api/userApi.ts
export const userApi = {
    getProfile: async (): Promise<User> => {
        const { data } = await baseApi.get('/users/profile');
        return data;
    }
};
```

### 3. 기능 API (Facade)
```typescript
// features/profile/api/profileApi.ts
export const profileApi = {
    getProfilePageData: async () => {
        const [profile, posts] = await Promise.all([
            userApi.getProfile(),
            postApi.getUserPosts()
        ]);
        return { profile, posts };
    }
};
```

## 실제 적용 시 이점

### 1. 개발 효율성
- 명확한 코드 구조로 빠른 기능 개발
- 재사용 가능한 컴포넌트와 로직
- 독립적인 기능 개발 가능

### 2. 협업 용이성
- 팀원 간 작업 영역 명확화
- 코드 충돌 최소화
- 일관된 코드 스타일 유지

### 3. 유지보수성
- 영향 범위가 명확한 변경
- 쉬운 기능 추가/수정
- 테스트 용이성

## 실제 사용 팁

1. **슬라이스 구조 표준화**
   ```txt
   feature/
   ├── ui/      # UI 컴포넌트
   ├── model/   # 비즈니스 로직
   ├── api/     # API 통신
   └── lib/     # 유틸리티
   ```

2. **문서화 습관**
   - README.md로 각 슬라이스 설명
   - 의존성 관계 명시
   - 사용 예시 포함

3. **점진적 도입**
   - 새로운 기능부터 FSD 적용
   - 기존 코드는 점진적 마이그레이션
   - 팀 합의를 통한 구조 결정

## 결론

FSD는 단순한 폴더 구조가 아닌, 확장 가능하고 유지보수가 용이한 아키텍처 패턴입니다. 특히 중대형 프로젝트에서 그 진가를 발휘하며, 팀 협업 환경에서 큰 강점을 보입니다.

처음에는 다소 복잡해 보일 수 있지만, 실제 적용해보면 코드의 예측 가능성과 관리 용이성이 크게 향상됨을 경험할 수 있습니다. 