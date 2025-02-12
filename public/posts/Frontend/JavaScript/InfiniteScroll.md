---
title: 무한 스크롤 구현 가이드
desc: Intersection Observer API을 이용하여 무한 스크롤을 구현하는 방법에 대해 알아봅니다.
createdAt: 2024-03-20
category: Frontend
subcategory: JavaScript
tags:
  - IntersectionObserver
---
인스타그램이나 페이스북 같은 앱에서 아래로 계속 스크롤하면 새로운 게시물들이 계속해서 나타납니다.
이것이 바로 '무한 스크롤'입니다.

### 무한 스크롤이 왜 좋을까요?

1. 편리해요!

- 다음 페이지 버튼을 누를 필요 없이 그냥 스크롤만 하면 돼요
- 특히 휴대폰으로 볼 때 손가락으로 쓱쓱 넘기기가 훨씬 편하죠

2. 재미있어요!

- 계속 새로운 내용이 나타나서 보는 재미가 있어요
- 마치 끝없는 책을 읽는 것처럼 계속 새로운 이야기를 발견할 수 있어요

3. 똑똑해요!

- 우리가 실제로 보려고 하는 내용만 가져와요
- 한 번에 너무 많은 내용을 가져오지 않아서 휴대폰이나 컴퓨터가 덜 힘들어해요

### 무한 스크롤은 어떻게 동작할까요?

1. 우리가 페이지를 아래로 스크롤해요
2. 특별한 감시자(Observer)가 우리가 페이지 끝부분에 가까워졌는지 지켜보고 있어요
3. 끝부분에 가까워지면, 새로운 내용을 더 가져와서 보여줘요

마치 책을 읽다가 마지막 페이지에 거의 다다랐을 때, 누군가가 새로운 페이지를 슥 끼워넣는 것처럼 동작한다고 생각하면 됩니다.

이런 무한 스크롤 기능은 Intersection Observer API를 사용해서 만듭니다. 

<hr />
### 기존 스크롤 방식 VS Intersection Observer API

1. 기존 스크롤 방식 (동기)

- 마치 경찰관이 도로에 서서 지나가는 모든 차를 일일이 체크하는 것처럼 작동해요
- 스크롤할 때마다 계속해서 위치를 확인하느라 컴퓨터가 매우 바빠져요
- 화면에 보이는지 확인하기 위해 요소의 위치를 계속 계산해야 해서 느려질 수 있어요
- 마치 매초마다 "여기 왔니? 여기 왔니?" 하고 계속 물어보는 것과 같아요

2. Intersection Observer API (비동기)

- CCTV처럼 특정 지점을 지켜보다가 무언가 지나가면 알려주는 방식이에요
- 컴퓨터에게 "이 부분이 화면에 보이면 알려줘!"라고 한 번만 말해두면 돼요
- 다른 일을 하면서도 동시에 관찰할 수 있어서 훨씬 효율적이에요
- 위치 계산을 특별한 방법으로 해서 컴퓨터가 덜 힘들어해요

실생활의 예시로 설명하면:

- 전통적인 방식: 친구를 기다리면서 매 초마다 창밖을 확인하는 것
- Intersection Observer: 현관 센서등을 달아두고 누가 지나가면 자동으로 알려주는 것

결과적으로:

- 전통적인 방식은 계속해서 확인하느라 컴퓨터도 힘들고 웹사이트도 느려질 수 있어요
- Intersection Observer는 필요할 때만 알려주기 때문에 웹사이트가 더 빠르고 부드럽게 동작해요


<hr />
## **구현 방법**

**1. 커스텀 훅 생성**

```jsx
interface UseInfiniteScrollProps {
    threshold?: number;      // 교차 지점 비율 (0~1)
    rootMargin?: string;     // 관찰 영역의 여백
    onIntersect: () => void; // 교차 시 실행할 콜백 함수
}
```

**2. 기본 설정**
- **threshold 설정**:
    - 0: 요소가 1px이라도 보일 때
    - 1: 요소가 완전히 보일 때
    - 0.5: 요소가 50% 보일 때
- **rootMargin 활용**:
    - 미리 로딩을 시작하려면 양수 값 사용
    - 지연 로딩을 원하면 음수 값 사용

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

**3. Observer 콜백 설정**
- **성능 최적화**:
    - useCallback으로 콜백 함수 메모이제이션
    - 불필요한 리렌더링 방지

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


**4. Observer 설정 및 정리**

- **메모리 관리**: useEffect의 클린업 함수에서 observer를 정리하여 메모리 누수 방지
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

<hr />
## **사용 방법**

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

 **2. 페이지네이션과 함께 사용**

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
<hr />
### 참고자료
https://velog.io/@khy226/intersection-observer%EB%9E%80-feat-%EB%AC%B4%ED%95%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EB%A7%8C%EB%93%A4%EA%B8%B0#%EA%B8%B0%EC%A1%B4-scroll-%EC%9D%98-%EB%AC%B8%EC%A0%9C%EC%A0%90