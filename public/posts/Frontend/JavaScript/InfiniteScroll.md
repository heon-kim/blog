---
title: Intersection Observer API로 구현하는 무한 스크롤과 캐러셀
desc: 프론트엔드 개발에서 무한 스크롤과 캐러셀은 자주 구현하게 되는 UI 패턴입니다. 이러한 기능을 구현할 때 많은 개발자들이 외부 라이브러리를 먼저 찾아보곤 합니다. 하지만 브라우저의 네이티브 API인 Intersection Observer를 활용하면, 더 효율적이고 가벼운 구현이 가능합니다.
createdAt: 2025-02-18
category: Frontend
subcategory: JavaScript
tags:
  - IntersectionObserver
---

프론트엔드 개발에서 무한 스크롤과 캐러셀은 자주 구현하게 되는 UI 패턴입니다. 이러한 기능을 구현할 때 많은 개발자들이 외부 라이브러리를 먼저 찾아보곤 합니다. 하지만 브라우저의 네이티브 API인 Intersection Observer를 활용하면, 더 효율적이고 가벼운 구현이 가능합니다.

## Intersection Observer API란?

Intersection Observer API는 타겟 요소와 상위 요소 또는 최상위 document의 viewport와의 교차점을 관찰하여 요소가 화면에 보이는지 여부를 비동기적으로 감지할 수 있게 해주는 API입니다.

```typescript
const observer = new IntersectionObserver(callback, options);
```

### 기본 설정 옵션
```typescript
const options = {
  root: null, // 관찰할 부모 요소 (null이면 viewport)
  rootMargin: '0px', // root의 마진
  threshold: 1.0 // 교차 비율 (0.0 ~ 1.0)
};
```

## 무한 스크롤 구현하기

### 1. 커스텀 훅 작성

```typescript
function useInfiniteScroll(onIntersect: () => void) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);

  return targetRef;
}
```

### 2. 실제 사용 예시

```typescript
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newProducts = await fetchProducts(page);
      setProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const targetRef = useInfiniteScroll(loadMore);

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <div ref={targetRef} style={{ height: '10px' }} />
      {loading && <LoadingSpinner />}
    </div>
  );
}
```

## 캐러셀 구현하기

캐러셀도 Intersection Observer를 활용하면 스크롤 기반의 자연스러운 동작을 구현할 수 있습니다.

### 1. 캐러셀 컴포넌트 구현

```typescript
function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      {
        root: carouselRef.current,
        threshold: 0.6,
        rootMargin: '-20px 0px'
      }
    );

    const cards = document.querySelectorAll('.carousel-item');
    cards.forEach(card => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="carousel" ref={carouselRef}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          data-index={index}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

## 성능 최적화 팁

1. **디바운싱 적용**
```typescript
const debouncedLoadMore = useCallback(
  debounce(() => {
    loadMore();
  }, 300),
  []
);
```

2. **메모리 관리**
```typescript
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);
  
  return () => {
    observer.disconnect();
    // 추가적인 클린업 작업
  };
}, []);
```

3. **에러 처리**
```typescript
const loadMore = async () => {
  try {
    setLoading(true);
    await fetchData();
  } catch (error) {
    setError(error);
    // 에러 처리 로직
  } finally {
    setLoading(false);
  }
};
```

## 브라우저 지원 및 폴리필

Intersection Observer API는 현대 브라우저에서 널리 지원되지만, 이전 브라우저를 지원해야 하는 경우 폴리필을 사용할 수 있습니다.

```javascript
if (!('IntersectionObserver' in window)) {
  import('intersection-observer').then(() => {
    // Intersection Observer 사용 가능
  });
}
```

## 결론

Intersection Observer API를 활용하면 스크롤 이벤트 기반 구현보다 더 효율적이고 성능이 좋은 무한 스크롤과 캐러셀을 구현할 수 있습니다. 외부 라이브러리에 의존하지 않고도 필요한 기능을 구현할 수 있으며, 이는 번들 사이즈 최적화와 성능 향상으로 이어집니다.

특히 React와 같은 현대적인 프레임워크와 함께 사용할 때, 커스텀 훅으로 추상화하면 재사용 가능한 깔끔한 코드를 작성할 수 있습니다. 프로젝트의 요구사항과 상황에 따라 적절한 구현 방식을 선택하되, 네이티브 API의 활용도 적극적으로 고려해보시기 바랍니다. 