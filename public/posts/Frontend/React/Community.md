---
title: React와 TypeScript로 구현하는 무한 스크롤 커뮤니티
desc: 오늘의집이나 당근마켓 같은 커뮤니티 서비스들은 이미 무한 스크롤과 카테고리 필터링을 효과적으로 활용하고 있습니다. 특히 오늘의집의 경우 콘텐츠 성격에 따라 카테고리를 분류하고, 각 카테고리별로 최적화된 UI를 제공하고 있죠. 우리 프로젝트에서도 이러한 사례를 참고하여, 금융 정보의 특성에 맞는 카테고리 시스템을 설계했습니다. 프로젝트 요구사항을 받고 가장 먼저 고민한 것은 사용자 경험이었습니다. 페이지네이션 대신 무한 스크롤을, 새로고침 대신 실시간 필터링을 선택한 이유와 구현 과정을 공유하고자 합니다.
createdAt: 2025-02-21
category: Frontend
subcategory: React
tags:
  - 무한 스크롤
  - 카테고리 필터링
  - 커뮤니티 서비스
  - 성능 최적화
  - 사용자 경험
  - 컴포넌트 설계
  - 타입스크립트
  - 반응형 디자인
---

<img width="873" alt="Image" src="https://github.com/user-attachments/assets/8c9bf47f-4924-4521-b5d9-ee26f9fa0f89" style="border:1px solid #ccc; border-radius: 10px;" />

오늘의집이나 당근마켓 같은 커뮤니티 서비스들은 이미 무한 스크롤과 카테고리 필터링을 효과적으로 활용하고 있습니다. 특히 오늘의집의 경우 '집들이', '집사진', '홈스트랑' 등 콘텐츠 성격에 따라 카테고리를 분류하고, 각 카테고리별로 최적화된 UI를 제공하고 있죠.

우리 프로젝트에서도 이러한 사례를 참고하여, 금융 정보의 특성에 맞는 카테고리 시스템을 설계했습니다.

프로젝트 요구사항을 받고 가장 먼저 고민한 것은 사용자 경험이었습니다. 페이지네이션 대신 무한 스크롤을, 새로고침 대신 실시간 필터링을 선택한 이유와 구현 과정을 공유하고자 합니다.

## 주요 기술 선택

### 1. InfiniteScroll 컴포넌트
페이지네이션은 사용자가 '다음' 버튼을 클릭해야 하는 불편함이 있습니다. 특히 모바일 환경에서는 무한 스크롤이 더 자연스러운 UX를 제공합니다:

```typescript
<InfiniteScroll
  dataLength={communityList.length}
  next={loadMoreData}
  hasMore={hasMore}
  loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
  endMessage={<Divider plain>더 이상 게시물이 없습니다.</Divider>}
  scrollableTarget='scrollableDiv'
>
  // 리스트 컴포넌트
</InfiniteScroll>
```

### 2. 효율적인 데이터 로딩
스크롤할 때마다 서버에 요청을 보내면 성능 이슈가 발생할 수 있습니다. 이를 최적화하기 위한 전략을 구현했습니다:

```typescript
const loadMoreData = useCallback(() => {
  if (loading) return;  // 중복 요청 방지
  setLoading(true);

  setCommunityList((prevData) => {
    const nextData = communityList.slice(prevData.length, prevData.length + 5);
    if (nextData.length === 0) setHasMore(false);
    return [...prevData, ...nextData];
  });

  setLoading(false);
}, [loading, communityList]);
```

### 3. 카테고리 필터링
전체, 주식, 소비, 저축 등 다양한 카테고리를 실시간으로 필터링할 수 있도록 구현했습니다:

```typescript
const getCommunityByCategory = useCallback(
  async (category: string, location: string | null) => {
    try {
      setLoading(true);
      const response = await communityService.getCommunityList(location);
      
      if (category === '전체') {
        setCommunityList(response.data);
      } else {
        const filteredData = response.data.filter(
          (post) => post.categoryName === category
        );
        setCommunityList(filteredData);
      }
    } catch (error) {
      message.error('게시물을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  },
  []
);
```

## 카테고리 시스템 설계

### 1. 콘텐츠 특성에 따른 분류
오늘의집이 상단 탭으로 '사진', '집들이', '노하우'를 구분한 것처럼, 우리도 금융 정보를 직관적인 카테고리로 분류했습니다:

- 투자 관련: 주식, 펀드, 가상화폐
- 지출 관련: 소비, 절약, 저축
- 세금 관련: 연말정산, 세금/납부
- 생애주기: 청약, 노후대비

### 2. 상단 탭 네비게이션 구현
```typescript
// components/board/Category/CommunityCategory.tsx
const CommunityCategory: React.FC<{ setCategory: (category: string) => void }> = ({ setCategory }) => {
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'stock', name: '주식' },
    { id: 'saving', name: '저축' },
    // ... 기타 카테고리
  ];

  return (
    <div className="sticky top-0 bg-white z-10 border-b">
      <div className="flex overflow-x-auto hide-scrollbar">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setCategory(category.name)}
            className={`
              flex-shrink-0 px-4 py-3 
              ${selectedCategory === category.name 
                ? 'text-mainColor border-b-2 border-mainColor font-bold'
                : 'text-gray-600'}
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
```

오늘의 집의 탭 UI를 참고하여:
- 상단 고정 (sticky) 포지셔닝
- 가로 스크롤 지원
- 선택된 탭 하이라이트
- 부드러운 전환 효과

등을 구현했습니다.

### 3. 카테고리별 맞춤 UI
```typescript
const renderListItem = useCallback((item: CommunityListDTO) => (
  <List.Item key={item.postId}>
    <div className='py-3 px-5 flex'>
      {/* 카테고리별 맞춤 아이콘 */}
      <CategoryIcon type={item.categoryName} />
      
      {/* 카테고리별 최적화된 레이아웃 */}
      <div className='w-full flex flex-col'>
        <p className='text-sm text-gray-500'>{item.categoryName}</p>
        {item.categoryName === '주식' && <StockPreview data={item} />}
        {item.categoryName === '절약' && <SavingTipLayout data={item} />}
        {/* 기타 카테고리별 맞춤 컴포넌트 */}
      </div>
    </div>
  </List.Item>
), []);
```

### 4. 탭 전환 시 데이터 처리
```typescript
// 탭 변경 시 스크롤 위치 초기화 및 데이터 새로고침
const handleCategoryChange = useCallback((category: string) => {
  setSelectedCategory(category);
  window.scrollTo(0, 0);
  
  // 스켈레톤 UI 표시
  setLoading(true);
  
  // 새로운 카테고리의 데이터 로드
  getCommunityByCategory(category, userLocation)
    .finally(() => setLoading(false));
}, [userLocation]);
```

## 사용자 경험 개선

### 1. 로딩 상태 처리
카테고리별로 다른 로딩 UI를 제공했습니다:

```typescript
// 카테고리별 맞춤 스켈레톤
const CategorySkeleton = ({ category }) => {
  switch(category) {
    case '주식':
      return <StockSkeleton />;
    case '절약':
      return <SavingTipSkeleton />;
    default:
      return <DefaultSkeleton />;
  }
};

loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
```

### 2. 텍스트 최적화
긴 텍스트의 경우 적절히 잘라서 보여주도록 구현했습니다:

```typescript
const truncateText = useCallback((text: string, maxLength: number) => {
  return text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}, []);
```

### 3. 반응형 이미지 처리
```typescript
{item.filePaths.length > 0 && (
  <div className=''>
    <img
      src={item.filePaths[0]}
      className='w-20 h-20 object-cover rounded-md'
      alt='Post'
    />
  </div>
)}
```

## 실제 적용 시 고려사항

### 1. 성능 최적화
- useCallback을 사용한 함수 메모이제이션
- 조건부 렌더링으로 불필요한 렌더링 방지
- 이미지 최적화

### 2. 에러 처리
- 네트워크 오류 대응
- 데이터 누락 처리
- 사용자 피드백 제공

### 3. 보안
- 인증 상태 확인
- API 요청 검증

## 배운 점

1. **컴포넌트 설계**
   - 재사용성을 고려한 컴포넌트 분리
   - Props와 상태 관리 전략
   - TypeScript를 활용한 타입 안정성

2. **성능 최적화**
   - 무한 스크롤 구현 시 메모리 관리
   - 이미지 로딩 최적화
   - 렌더링 성능 개선

3. **사용자 경험**
   - 로딩 상태 표시
   - 에러 처리
   - 반응형 디자인

4. **서비스 분석**
    - 오늘의집, 당근마켓 등 성공적인 커뮤니티 서비스 분석
    - 카테고리 시스템의 UX 패턴 연구
    - 사용자 행동 패턴에 따른 UI/UX 최적화

## 마치며

무한 스크롤과 카테고리 필터링은 현대 웹 애플리케이션에서 필수적인 기능이 되었습니다. 이러한 기능을 구현할 때는 사용자 경험과 성능 모두를 고려해야 합니다.

앞으로는 가상 스크롤링 도입, 이미지 최적화 등을 통해 더 나은 성능을 제공할 계획입니다. 