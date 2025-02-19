---
title: Redux로 배우는 상태 관리의 중요성
desc: 지역 기반 커뮤니티 서비스를 개발하면서 처음으로 제대로 된 상태 관리의 필요성을 느꼈습니다. 단순히 props로 데이터를 전달하는 것을 넘어서, 애플리케이션의 상태를 어떻게 효율적으로 관리할 수 있을지 고민했던 경험을 공유하고자 합니다.
createdAt: 2025-02-19
category: Frontend
subcategory: React
tags:
  - 상태관리
  - Redux
---

지역 기반 커뮤니티 서비스를 개발하면서 처음으로 제대로 된 상태 관리의 필요성을 느꼈습니다. 단순히 props로 데이터를 전달하는 것을 넘어서, 애플리케이션의 상태를 어떻게 효율적으로 관리할 수 있을지 고민했던 경험을 공유하고자 합니다.

## Props Drilling의 문제점

처음에는 단순히 props로 데이터를 전달했습니다:
```typescript
// 상위 컴포넌트
function ParentComponent() {
  const [userLocation, setUserLocation] = useState('성동구');
  return (
    <ChildComponent 
      userLocation={userLocation} 
      setUserLocation={setUserLocation}
    />
  );
}

// 하위 컴포넌트
function ChildComponent({ userLocation, setUserLocation }) {
  return (
    <GrandChildComponent 
      userLocation={userLocation}
      setUserLocation={setUserLocation} 
    />
  );
}
```

이 방식의 문제점:
- 컴포넌트 계층이 깊어질수록 props 전달이 복잡해짐
- 중간 컴포넌트들이 불필요한 props를 가지게 됨
- 상태 변경 시 추적이 어려움

## Redux 도입 과정

### 1. 상태 설계
먼저 어떤 데이터를 전역으로 관리할지 결정했습니다:
```typescript
interface AuthState {
    isAuthenticated: boolean;
    authToken: string | null;
    userId: number | null;
    userEmail: string | null;
    userRole: string | null;
    userLocation: string | null;
    nickname: string | null;
    branchName?: string;
    interestLocations: string[];
}
```

### 2. 액션 정의
상태를 변경하는 액션들을 정의했습니다:
```typescript
// 액션 타입
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGOUT = 'auth/LOGOUT';
const UPDATE_LOCATION = 'auth/UPDATE_LOCATION';

// 액션 생성자
const loginSuccess = (userData) => ({
    type: LOGIN_SUCCESS,
    payload: userData
});
```

### 3. Reducer 구현
상태 변경 로직을 구현했습니다:
```typescript
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                authToken: action.payload.token,
                userId: action.payload.userId,
                userLocation: action.payload.location
            };
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                authToken: null
            };
        default:
            return state;
    }
};
```

## 실제 사용 경험

### 1. 컴포넌트에서의 사용
Redux를 도입한 후 컴포넌트 코드가 훨씬 깔끔해졌습니다:
```typescript
function LocationBasedContent() {
    const userLocation = useSelector(state => state.auth.userLocation);
    const dispatch = useDispatch();

    const handleLocationChange = (newLocation) => {
        dispatch({ type: UPDATE_LOCATION, payload: newLocation });
    };

    return (
        <div>
            <h2>{userLocation} 지역 소식</h2>
            {/* 컨텐츠 */}
        </div>
    );
}
```

### 2. 개발 과정에서 배운 점

1. **상태 설계의 중요성**
   - 너무 많은 데이터를 전역으로 관리하면 오히려 복잡해짐
   - 컴포넌트 로컬 상태와 전역 상태의 적절한 분리가 중요

2. **TypeScript와의 시너지**
   ```typescript
   // 타입 정의로 안정성 확보
   interface LocationAction {
       type: typeof UPDATE_LOCATION;
       payload: string;
   }
   ```

3. **디버깅 용이성**
   - Redux DevTools를 통한 상태 변화 추적
   - 액션 히스토리 확인 가능

## 고민했던 부분들

### 1. 새로고침 시 상태 유지
처음에는 localStorage를 사용했지만, 보안을 고려해야 했습니다:
```typescript
// 민감하지 않은 정보만 저장
const initialState = {
    userLocation: localStorage.getItem('userLocation'),
    // 민감한 정보는 제외
};
```

### 2. 성능 최적화
불필요한 리렌더링을 방지하기 위한 노력:
```typescript
// 필요한 상태만 선택적으로 구독
const userLocation = useSelector(
    state => state.auth.userLocation,
    shallowEqual
);
```

## 결론

Redux를 도입하면서 단순히 상태 관리를 넘어서 애플리케이션 아키텍처에 대해 더 깊이 고민하게 되었습니다. 특히 다음과 같은 점들을 배웠습니다:

1. 상태 관리는 단순히 데이터 저장이 아닌 애플리케이션 설계의 문제
2. TypeScript와 함께 사용할 때 더욱 강력한 개발 경험
3. 올바른 추상화 수준의 중요성

모든 프로젝트에 Redux가 필요한 것은 아니지만, 규모가 있는 프로젝트에서는 충분히 도입을 고려해볼 만한 가치가 있다고 생각합니다. 