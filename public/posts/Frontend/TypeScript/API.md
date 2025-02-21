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

프론트엔드 개발에서 API 통신은 필수적인 부분입니다. 특히 규모가 큰 프로젝트에서는 페이지별 독립성과 프론트엔드 최적화가 중요합니다. 이번 글에서는 MFA(Micro Frontend Architecture)와 BFF(Backend For Frontend) 개념을 참고하여 Facade 패턴으로 구현한 API 통신 아키텍처 설계 경험을 공유하고자 합니다.

## 도메인 분리와 독립성 확보

프로젝트 초기에는 다음과 같은 문제점들이 있었습니다:

```typescript
// 기존 API 호출 코드 - 컴포넌트에 직접 구현
const AssetDetailPage = () => {
  const fetchData = async () => {
    try {
      // API 호출 로직이 컴포넌트에 직접 구현
      const basic = await axios.get(`${BASE_URL}/asset/${id}/basic`);
      const details = await axios.get(`${BASE_URL}/asset/${id}/details`);
      
      // 데이터 변환 로직도 컴포넌트에 존재
      setAsset({
        ...basic.data,
        details: details.data
      });
    } catch (error) {
      console.error(error);
    }
  };
};
```

이러한 구조의 문제점:
1. 페이지/도메인별 독립성 부족
2. 컴포넌트와 API 통신 로직의 강한 결합
3. 데이터 변환 로직의 중복
4. 타입 안정성 부족

## 개선된 아키텍처 설계

### 1. 도메인별 서비스 레이어 분리

```typescript
/src
  /pages
    /asset              // 자산 관리 도메인
      /components
      /service
        AssetService.ts
    /user               // 사용자 도메인
      /components
      /service
        UserService.ts
```

각 도메인별로 독립적인 서비스 레이어를 구현하여:
- 도메인 로직의 응집도 향상
- 페이지 단위의 독립적 개발 가능
- 팀 단위 개발의 용이성 확보

### 2. Facade 패턴을 활용한 서비스 구현

```typescript
class AssetService {
  private request: AxiosInstance;

  constructor() {
    this.request = axios.create({
      baseURL: '/api/assets'
    });
  }

  async getAssetDetails(assetId: string, options: AssetOptions = {}) {
    try {
      // 여러 API 요청을 하나의 메서드로 통합
      const [basic, details] = await Promise.all([
        this.request.get(`/${assetId}/basic`),
        this.request.get(`/${assetId}/details`)
      ]);

      // 프론트엔드에 최적화된 데이터 구조로 변환
      return {
        ...this.formatBasicInfo(basic.data),
        ...this.formatDetails(details.data)
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private formatBasicInfo(data: RawBasicInfo): FormattedBasicInfo {
    return {
      id: data.id,
      name: data.name,
      value: this.formatCurrency(data.value)
    };
  }
}
```

### 3. 타입 시스템 활용

```typescript
// 요청 옵션 타입
interface AssetOptions {
  includeDetails?: boolean;
  includeHistory?: boolean;
}

// API 응답 데이터 타입
interface RawBasicInfo {
  id: string;
  name: string;
  value: number;
}

// 변환된 데이터 타입
interface FormattedBasicInfo {
  id: string;
  name: string;
  value: string;  // 화폐 형식으로 포맷팅
}
```

## 개선된 사용 예시

```typescript
// pages/AssetDetailPage.tsx
const AssetDetailPage = () => {
  const assetService = new AssetService();
  const [asset, setAsset] = useState<FormattedAsset>();

  const fetchAssetDetail = async () => {
    try {
      // 단순화된 API 호출
      const assetDetails = await assetService.getAssetDetails(assetId, {
        includeDetails: true
      });
      setAsset(assetDetails);
    } catch (error) {
      handleError(error);
    }
  };
};
```

## 아키텍처 개선의 효과

1. **도메인 독립성 향상**
   - 페이지/도메인별 독립적 개발
   - 도메인 로직의 응집도 향상
   - 변경의 영향 범위 최소화

2. **프론트엔드 최적화**
   - API 응답 데이터 통합
   - 컴포넌트에 최적화된 데이터 구조
   - 중복 API 호출 제거

3. **유지보수성 향상**
   - 타입 안정성 확보
   - 테스트 용이성 증가
   - 에러 처리 일관성

## 결론

이러한 아키텍처 설계는 MFA의 '독립성'과 BFF의 '프론트엔드 최적화' 개념을 클라이언트 사이드에서 구현한 것입니다. 완전한 MFA/BFF는 아니지만, 이러한 개념들을 참고하여 실제 프로젝트에 맞는 해결책을 찾을 수 있었습니다.

특히 프로젝트 규모가 커질수록 이러한 구조의 장점이 더욱 부각됩니다. 초기에 시간을 들여 탄탄한 아키텍처를 설계하는 것이, 장기적으로 더 나은 개발 경험과 프로덕트 품질을 보장할 수 있습니다.