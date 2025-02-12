---
title: 시니어 상속 설계 서비스 프로젝트 회고
desc: 🔥한 달 동안 불태웠던 서비스에 대한 KPT 회고를 기록합니다.
createdAt: 2025-02-12
category: Review
subcategory: Service
tags:
  - Frontend
  - React
  - 회고
---
### 주제
디지털 기반 유언대용신탁 및 자산 관리 플랫폼

### 개요
고령화 사회가 진행됨에 따라 증가하는 유언대용신탁 수요에 대응하여 블록체인 기술을 활용한 신뢰성 높은 자산 관리 및 상속 서비스를 제공하고자 합니다.

### 기간
2025.01.08~2025.02.05


### GitHub
* FE: https://github.com/hanaro-team3/ending-credits-front
* BE: https://github.com/hanaro-team3/ending-credits-backend
* 블록체인: https://github.com/hanaro-team3/fabric

---

프로젝트 후 팀원들과 모여 KPT 회고를 했습니다. 아래는 KPT 회고 내용에 개인적인 생각을 합쳐서 개인 회고를 다시 해보았습니다.
### Keep(좋았던 점)
* 복지와 팀문화가 너무 좋았습니다.
	- 무제한 간식 지원에 격려와 긍정, 배려에 늘 힘이 나고 좋았습니다
	- 모두가 적극적으로 참여하고 의지가 넘쳤습니다
	- 좋은 사람들과 좋은 분위기에서 개발 경험을 하게 되어 잊지 못할 경험이 될 것 같습니다.
* 낯선 기술에 도전할 수 있었습니다.
	- 적극적으로 낯선 기술을 공부하고, 토론하고, 구현했습니다.
	- 기술, 지식 공유가 활발하여 많은 인사이트를 얻었습니다.
* 8각형 인재들과 함께 했습니다.
	* 개발 뿐만 아니라 기획, 디자인, 자료정리, 발표까지도 어느 것 하나 부족하지 않았습니다.

### Problem(부족했던 점)
- 짧은 시간동안 많은 화면을 구현하기에 급급하여 설계를 제대로 하지 못한 점이 아쉬웠습니다.
- 기술 구현에 몰두해 테스트 코드를 작성하지 못해 아쉬웠던 것 같습니다.
* 기술을 고도화 하지 못했습니다.
	- 블록체인의 초중급까지는 구현했으나 고급 기술을 구현하지 못했습니다.
	- LLM 관련 기능의 성능을 최적화하지 못했습니다.
* FE와 BE의 구현 알림을 자동화했으면 좋을 것 같습니다.
* 일부에게 업무가 쏠림 현상이 있었던 것 같습니다.
* 구현한 것에 비해 청중에게 다 전달하지 못해 아쉬웠습니다.

### Try(개선할 점)
* 주기적인 회의 시간을 갖자
	- 테스트코드, 코드 컨벤션, 업무분담 등 규칙은 초반에 더 엄격하게 하기
	- 코드 리뷰 짝꿍 정해서 서로 해주기
	- 구현한 것을 빠르게 전달해주기
* 더 시간을 갖고 코드 리팩토링, 테스트 코드 작업
* 기술을 고도화 해서 고급 기능 구현하기


---

이 프로젝트 후 가장 인상깊었던 점은 **"주기적인 회의 시간을 갖기!!"** 입니다. 늘 모여서 함께 개발을 하고 소통을 하는 듯 했지만, 진행을 했는지, 어디에 문제가 있는지를 빠르고 정확하게 전달하기 위해서는 정기적인 회의 시작을 가져야 한다는 것을 깨달았습니다.

또한 코드를 구현하는 것만큼이나 **설계가 중요하다**는 것을 깨닫고 이를 위해 많은 디자인 패턴, 기술들을 평소에 많이 공부하고 사용해보는 것이 좋겠다는 생각이 들었습니다. 이 프로젝트를 계기로 다양한 디자인 패턴들과 기술 트렌드 공부를 하며 블로그에 정리하자는 목표를 만들었습니다.

어느정도 설계 방법들을 공부한 뒤 지금까지 했던 프로젝트들을 리팩토링 할 예정입니다.

소중한 플젝 경험을 하게 되어 좋았습니다!! 881~~💖



아래는 한땀한땀 만들어주신 팀원 사진이 귀여워서 가져왔습니다.
### 팀원
|Backend, Infra|Frontend|Backend|Frontend|Backend, Infra|Backend|Frontend|Backend|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/e64f83d2-711e-4bee-8d97-b969cc3e891b" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/41a7dacc-4060-4c0d-a4cd-319064f69599" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/47ee14cd-1a62-4e43-aacb-c9eba0572626" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/98427347-1a0e-43f6-a0d2-984b27e5d500" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/9bed1740-960e-45eb-a19d-0d5c2ab7ef15" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/a4c22a37-71ac-495c-94b3-b41bebb90d5e" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/1869bcdb-6891-4367-a431-51c7bb325ab3" width="100" height="100"> | <img src="https://github.com/user-attachments/assets/7788456a-14cc-4414-8edf-3a4a2ee4047c" width="100" height="100"> |
|[김인영](https://github.com/kiminyoung0628) |[김해원](https://github.com/heon-kim) |[윤건희](https://github.com/gxxhxx0224) |[이수민](https://github.com/suminjeff) |[이인수](https://github.com/insoo00) |[임수진](https://github.com/suzinlim) |[최혁태](https://github.com/htchoi1006) |[홍소희](https://github.com/soh22h) |

