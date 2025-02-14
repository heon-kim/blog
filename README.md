# Heonlog

![heonlog](https://amzn-s3-posts-bucket.s3.ap-northeast-2.amazonaws.com/GIFMaker_me+(1).gif)

## 📝 프로젝트 소개
Heonlog는 개발자의 기술 블로그 웹사이트입니다. React를 기반으로 제작되었으며, 마크다운 형식의 게시물을 지원합니다.

## 🛠 기술 스택
- React
- JavaScript
- Markdown
- CSS

## 🚀 주요 기능
- 마크다운 기반의 블로그 포스팅
- 카테고리별 게시물 분류
- 반응형 디자인
- 방명록 기능
- 업데이트 현황 페이지


## 🏃‍♂️ 실행 방법

1. 저장소 클론
```
bash
git clone https://github.com/heon-kim/blog.git
```

2. 의존성 설치
```
bash
pnpm install
```

3. 카테고리 설정
```
bash
pnpm run prebuild
```

4. 개발 서버 실행
```
bash
pnpm run dev
```

## 📁 프로젝트 구조
```
heonlog/
├── public/
│ └── posts/ # 마크다운 게시물
├── src/
│ ├── components/ # 재사용 가능한 컴포넌트
│ ├── pages/ # 페이지 컴포넌트
│ └── data/ # 데이터 관리
└── package.json
```


## 📝 게시물 작성 가이드
1. `public/posts` 디렉토리에 마크다운 파일 생성
2. 게시물 메타데이터 작성 (제목, 날짜, 카테고리 등)
3. 마크다운 형식으로 내용 작성

## 📝 블로그 설정
1. `src/data/posts.js`에 게시물 목록 관리
2. `src/components/PostList.jsx`에 게시물 목록 컴포넌트 구현
3. `src/pages/Post.jsx`에 게시물 상세 페이지 구현

## 📝 방명록 설정
1. `src/components/Guestbook.jsx`에 방명록 컴포넌트 구현
2. `src/pages/Guestbook.jsx`에 방명록 페이지 구현


## 👨‍💻 제작자
- Heonlog ([@heon-kim](https://github.com/heon-kim))