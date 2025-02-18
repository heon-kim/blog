---
title: TypeScript와 함께하는 효율적인 API 통신 아키텍처 설계
desc: 프론트엔드 개발에서 API 통신은 필수적인 부분입니다. 특히 TypeScript를 도입한 프로젝트에서는 타입 안정성과 함께 효율적인 API 통신 구조를 설계하는 것이 중요합니다. 이번 글에서는 실제 프로젝트에서 적용한 API 통신 아키텍처 설계 경험을 공유하고자 합니다.
createdAt: 2025-02-18
category: Frontend
subcategory: TypeScript
tags:
  - API
  - TypeScript
---

프론트엔드 개발에서 API 통신은 필수적인 부분입니다. 특히 TypeScript를 도입한 프로젝트에서는 타입 안정성과 함께 효율적인 API 통신 구조를 설계하는 것이 중요합니다. 이번 글에서는 실제 프로젝트에서 적용한 API 통신 아키텍처 설계 경험을 공유하고자 합니다.

## 기존 API 통신의 문제점

프로젝트 초기에는 다음과 같은 문제점들이 있었습니다:

```typescript
// 기존 API 호출 코드
const getAssetDetail = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/asset/detail`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const postRealEstate = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/asset/real-estate`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

1. **타입 안정성 부족**
   - API 응답 데이터의 타입이 보장되지 않음
   - 런타임 에러 발생 위험

2. **중복 코드**
   - 에러 처리 로직 중복
   - API 설정 코드 중복

3. **유지보수의 어려움**
   - API 엔드포인트 관리가 어려움
   - 공통 로직 변경 시 여러 곳을 수정해야 함

## 개선된 아키텍처 설계

### 1. 중앙화된 API 클라이언트

```typescript
// service/request.tsx
import axios, { Method, AxiosResponse } from 'axios';

interface RequestConfig {
    method: Method;
    url: string;
    data?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export const request = async <T = unknown>({ 
  method, 
  url, 
  data, 
  headers, 
  params 
}: RequestConfig): Promise<AxiosResponse<T>> => {
    const accessToken = getAuthToken();
    const defaultHeaders: Record<string, string> = {};

    if (accessToken) {
        defaultHeaders.Authorization = `Bearer ${accessToken}`;
    }

    try {
        return await axios({
            method,
            url,
            headers: { ...defaultHeaders, ...headers },
            data,
            params
        });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
```

### 2. 도메인별 API 서비스 모듈화

```typescript
// service/api.ts
import { request } from '../request';
import * as dto from '../dto/Asset';

export const assetService = {
  getDetail: () => {
    return request<dto.DetailResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/detail`,
    });
  },

  postRealEstate: (data: dto.PostRealEstateRequestDTO) => {
    return request<dto.PostRealEstateResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/asset/real-estate`,
      data,
    });
  },
};
```

### 3. DTO를 통한 타입 안정성 확보

```typescript
// service/dto.ts
export interface DetailResponseDTO {
  result: DetailResponseDTO;
  assetsDetail: AssetsDetail;
  loan: Loan[];
  loanTotal: string;
}

export interface PostRealEstateRequestDTO {
  name: string;
  address: string;
  purchasePrice: number;
  currentPrice?: number;
  realEstateType: string;
}
```

## 적용된 디자인 패턴

### 1. Facade 패턴
API 호출의 복잡성을 숨기고 간단한 인터페이스를 제공합니다.

```typescript
// 사용 예시
const { data } = await assetService.getDetail();
```

### 2. Singleton 패턴
axios 인스턴스를 중앙에서 관리하여 설정의 일관성을 유지합니다.

```typescript
axios.defaults.baseURL = config.apiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

### 3. Factory 패턴
API 요청 객체를 동적으로 생성합니다.

```typescript
const createRequestConfig = (config: RequestConfig) => {
  // 요청 설정 생성 로직
  return {
    ...config,
    headers: getHeaders(config),
  };
};
```

## 개선된 아키텍처의 이점

1. **타입 안정성**
   - 컴파일 타임에 타입 오류 발견
   - API 응답 데이터 예측 가능

2. **코드 재사용성**
   - 공통 로직 중앙화
   - 설정 관리 용이

3. **유지보수성**
   - API 엔드포인트 관리 용이
   - 일관된 에러 처리

## 실제 사용 예시

```typescript
// 컴포넌트에서의 사용
const AssetDetailPage = () => {
  const [assetDetail, setAssetDetail] = useState<dto.DetailResponseDTO>();

  const fetchAssetDetail = async () => {
    try {
      const { data } = await assetService.getDetail();
      setAssetDetail(data);
    } catch (error) {
      // 에러 처리
    }
  };

  // ...
};
```

## 결론

API 통신 아키텍처를 설계할 때는 단순히 동작하는 코드를 작성하는 것을 넘어서, 타입 안정성, 재사용성, 유지보수성을 모두 고려해야 합니다. TypeScript와 적절한 디자인 패턴을 활용하면 이러한 목표를 효과적으로 달성할 수 있습니다.

특히 프로젝트 규모가 커질수록 잘 설계된 API 통신 아키텍처의 중요성이 더욱 커집니다. 초기에 시간을 들여 탄탄한 기반을 마련하는 것이, 장기적으로 더 나은 개발 경험과 프로덕트 품질을 보장할 수 있습니다.