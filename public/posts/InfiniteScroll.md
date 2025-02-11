## 필요성

### **1. 사용자 경험(UX) 향상**

- **끊김 없는 탐색**: 사용자가 페이지네이션 버튼을 클릭하지 않고도 콘텐츠를 자연스럽게 탐색할 수 있음.
- **몰입도 증가**: 계속해서 콘텐츠가 로드되므로 사용자 이탈률을 줄이고 사이트 체류 시간을 늘릴 수 있음.
- **모바일 친화적**: 모바일 환경에서는 페이지네이션보다 스크롤을 통한 탐색이 더 직관적임.

---

### **2. 성능 최적화 및 효율적인 데이터 로딩**

- **불필요한 데이터 로딩 방지**: Intersection Observer API를 활용하여 사용자가 실제로 볼 가능성이 높은 데이터만 로드할 수 있음.
- **네트워크 요청 최적화**: 스크롤 이벤트 기반이 아닌 관찰(Observer) 기반이므로 불필요한 요청을 방지할 수 있음.
- **메모리 관리 용이**: 기존 데이터를 유지하면서 점진적으로 추가하는 방식이므로, 한 번에 많은 데이터를 불러오는 것보다 메모리 사용량이 적음.

---

### **3. 페이지네이션보다 유리한 점**

- **자동 로드 vs. 수동 페이지 이동**: 사용자가 직접 버튼을 누를 필요 없이 데이터를 지속적으로 불러올 수 있음.
- **연속적인 UI 흐름 유지**: 사용자가 새 페이지로 이동할 때 기존 컨텍스트가 사라지는 문제가 없음.

---

### **4. 유연한 구현 가능**

- **데이터 페칭 전략 선택 가능**: 필요에 따라 서버에서 데이터를 가져오는 방식(API 호출)과 로컬 데이터 페칭을 조합할 수 있음.
- **페이지네이션과 혼용 가능**: 무한 스크롤을 사용하면서도 일정 구간에서 ‘더 보기’ 버튼을 제공하는 하이브리드 방식 적용 가능.

---

## **구현 방법**

인피니트 스크롤은 Intersection Observer API를 사용하여 구현되며, 스크롤이 특정 지점에 도달했을 때 추가 데이터를 로드하는 기능입니다.

**1. 커스텀 훅 생성**

```jsx
interface UseInfiniteScrollProps {
    threshold?: number;      // 교차 지점 비율 (0~1)
    rootMargin?: string;     // 관찰 영역의 여백
    onIntersect: () => void; // 교차 시 실행할 콜백 함수
}
```

### **2. 기본 설정**

```jsx
const useInfiniteScroll = ({
    threshold = 0.5,        // 기본값 50% 교차 시
    rootMargin = '0px',     // 기본 여백 없음
    onIntersect            // 필수 콜백 함수
}: UseInfiniteScrollProps) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    // ...
}
```

### **3. Observer 콜백 설정**

```jsx
const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                onIntersect();  // 교차 시 콜백 실행
            }
        });
    },
    [onIntersect]
);
```

### **4. Observer 설정 및 정리**

```jsx
useEffect(() => {
    // Observer 인스턴스 생성
    const observer = new IntersectionObserver(observerCallback, {
        threshold,
        rootMargin
    });

    // 대상 요소 관찰 시작
    const currentTarget = targetRef.current;
    if (currentTarget) {
        observer.observe(currentTarget);
    }

    // 클린업 함수
    return () => {
        if (currentTarget) {
            observer.unobserve(currentTarget);
        }
    };
}, [observerCallback, threshold, rootMargin]);
```

## **사용 방법**

**1. 기본 사용**

```jsx
function MyComponent() {
    const loadMore = () => {
        // 추가 데이터 로드 로직
    };

    const targetRef = useInfiniteScroll({
        threshold: 0.5,
        onIntersect: loadMore
    });

    return (
        <div>
            {/* 컨텐츠 */}
            <div ref={targetRef} /> {/* 관찰 대상 요소 */}
        </div>
    );
}
```

### **2. 페이지네이션과 함께 사용**

```jsx
function PagedComponent() {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);

    const loadMore = async () => {
        const newItems = await fetchItems(page);
        setItems([...items, ...newItems]);
        setPage(prev => prev + 1);
    };

    const targetRef = useInfiniteScroll({
        onIntersect: loadMore
    });

    return (
        <div>
            {items.map(item => (
                <ItemComponent key={item.id} {...item} />
            ))}
            <div ref={targetRef} />
        </div>
    );
}
```

## **주의사항**

- **메모리 관리**: useEffect의 클린업 함수에서 observer를 정리하여 메모리 누수 방지
- **성능 최적화**:
    - useCallback으로 콜백 함수 메모이제이션
    - 불필요한 리렌더링 방지
- **threshold 설정**:
    - 0: 요소가 1px이라도 보일 때
    - 1: 요소가 완전히 보일 때
    - 0.5: 요소가 50% 보일 때
- **rootMargin 활용**:
    - 미리 로딩을 시작하려면 양수 값 사용
    - 지연 로딩을 원하면 음수 값 사용
- **에러 처리**:
    - observer 생성 실패
    - 대상 요소 없음
    - 네트워크 오류 등 고려

## **브라우저 지원**

- 모던 브라우저에서 지원 (IE 제외)
- 폴리필이 필요한 경우 고려