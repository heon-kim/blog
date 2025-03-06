---
title: 연금저축 상품 Entity 구조 개선 및 성능 최적화
desc: 연금저축 상품의 Entity 구조를 개선하고 JPA N+1 문제를 해결하여 성능을 240ms까지 최적화한 경험을 공유합니다.
createdAt: 2025-02-27
category: Backend
subcategory: JPA
tags:
  - JPA
  - 성능 최적화
  - N+1 문제
  - Entity 설계
  - 쿼리 최적화
---

#  연금저축 상품 Entity 구조 개선 및 성능 최적화

## 1. 문제 상황

연금저축 상품 데이터를 처리하는 과정에서 다음과 같은 성능 이슈가 발생했습니다:

- 상품 조회 시 N+1 문제 발생
- 대량의 상품 데이터 처리 시 2초 이상 소요
- 복잡한 데이터 구조로 인한 처리 지연

## 2. 해결 방법

### 2.1 Entity 구조 개선

기존의 `Map<String, Object>` 구조를 Entity 관계로 변경했습니다:
```java
// Before
@Entity
public class PensionSavingsProductEntity {
@Convert(converter = JsonListConverter.class)
private List<Map<String, Object>> productDetail;
}

// After
// 엔티티1
@Entity
public class PensionSavingsProductEntity {
  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProductDetailEntity> productDetails = new ArrayList<>();

    // 연관관계 편의 메서드 추가
    public void addProductDetail(ProductDetailEntity detail) {
        this.productDetails.add(detail);
        detail.setProduct(this);
    }
}

// 엔티티2
@Entity
@Table(name = "product_detail")
public class ProductDetailEntity {
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "product_id")
private PensionSavingsProductEntity product;
private Double earnRate;
private Double earnRate1;
private Double avgEarnRate3;
// ... 기타 필드들
}

```


### 2.2 🔥 Fetch Join 적용 (2초 -> 240ms)

N+1 문제는 JPA에서 발생하는 대표적인 성능 이슈입니다. 연금저축 상품의 경우 다음과 같은 상황에서 발생했습니다:

```java
// N+1 문제가 발생하는 코드
@Transactional(readOnly = true)
public List<PensionSavingsProductEntity> findAllProducts() {
    List<PensionSavingsProductEntity> products = productRepository.findAll(); // 1번 쿼리
    products.forEach(product -> {
        product.getProductDetails().size(); // N번의 추가 쿼리 발생
    });
    return products;
}
```

실제 실행되는 쿼리:
```sql
-- 1번째 쿼리: 상품 목록 조회
SELECT * FROM pension_savings_product;

-- N번의 추가 쿼리: 각 상품별 상세 정보 조회
SELECT * FROM product_detail WHERE product_id = ?;
SELECT * FROM product_detail WHERE product_id = ?;
SELECT * FROM product_detail WHERE product_id = ?;
...
```

**N+1 문제가 발생하는 이유**
1. 지연 로딩(LAZY) 설정으로 인해 연관 엔티티를 실제 사용할 때 추가 쿼리 발생
2. 컬렉션을 조회할 때 개별 엔티티마다 추가 쿼리 실행
3. 연관 관계에 있는 데이터를 즉시 로딩(EAGER)으로 설정해도 문제 해결되지 않음

**해결: Fetch Join 사용**
```java
@Query("SELECT DISTINCT p FROM PensionSavingsProductEntity p LEFT JOIN FETCH p.productDetails")
List<PensionSavingsProductEntity> findAllWithDetails();
```


### 2.3 전략별 최적화된 쿼리 도입

각 투자 전략별로 최적화된 쿼리를 개별 구현:
```java
// 안정형 전략
@Query("""
    SELECT DISTINCT p, 
        (d.avgEarnRate5 * 0.4 + d.avgEarnRate3 * 0.4 - d.feeRate1 * 0.2) as score 
    FROM PensionSavingsProductEntity p 
    LEFT JOIN FETCH p.productDetails d 
    WHERE d.guarantees = 'Y' 
    ORDER BY score DESC 
    LIMIT 10
""")
List<PensionSavingsProductEntity> findStableProducts();
```
### 2.4 서비스 로직 개선

RecommendService의 로직을 전략별로 분리하여 최적화:
```java
@Cacheable(value = "recommendProducts", key = "'all'")
@Transactional(readOnly = true)
public List<RecommendProductResponseDto> recommendProduct() {
    List<RecommendProductResponseDto> recommendations = new ArrayList<>();
    recommendations.addAll(getAggressiveRecommendations());
    recommendations.addAll(getStableRecommendations());
    // ... 다른 전략들
    return recommendations;
}
```

## 3. 성능 개선 결과
- 기존: 2초 이상
- 개선 후: 평균 240ms

## 4. 주요 개선 포인트

1. **Entity 구조 최적화**
   - 타입 안정성 확보
   - JPA의 장점 활용
   - 데이터 접근 효율성 향상

2. **쿼리 최적화**
   - Fetch Join 사용
   - 불필요한 조회 제거
   - 인덱스 활용
   - 전략별 로직 분리

3. **비즈니스 로직 개선**
   - 계산 로직 모듈화
   - 캐시 활용
   - 병렬 처리 적용

## 5. 향후 개선 계획

1. **캐싱 전략 도입**
   - Redis 활용
   - 자주 조회되는 데이터 캐싱

2. **배치 처리 최적화**
   - 대용량 데이터 처리 개선
   - 비동기 처리 도입

3. **모니터링 강화**
   - 성능 메트릭 수집
   - 병목 지점 분석

## 6. 결론

Entity 구조 개선과 쿼리 최적화를 통해 데이터 처리 성능을 크게 향상시켰습니다. 특히 N+1 문제 해결과 타입 안정성 확보를 통해 안정적이고 빠른 데이터 처리가 가능해졌습니다.

## 참고 자료

- [JPA N+1 문제와 해결방안](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods)
- [Hibernate 성능 최적화](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html)
- [Spring Data JPA 레퍼런스](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#reference)