import Giscus from "@giscus/react";

function Guest() {
  return (
    <div className="max-w-none">
      {/* 방명록 헤더 */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          방명록
        </h1>
        <p className="text-gray-600">
          방문해 주셔서 감사합니다. 자유롭게 글을 남겨주세요! 💬
        </p>
      </header>

      {/* 방명록 설명 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          📝 방명록 작성 안내
        </h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>GitHub 계정으로 로그인하여 글을 작성할 수 있습니다.</li>
          <li>마크다운 문법을 지원합니다.</li>
          <li>방명록은 GitHub Discussions에서도 확인할 수 있습니다.</li>
        </ul>
      </div>

      {/* Giscus 방명록 */}
      <div className="mt-8">
        <Giscus
          repo="heon-kim/blog-comments"
          repoId="R_kgDOLEjyDQ"
          category="Comments"
          categoryId="DIC_kwDOLEjyDc4Cm419"
          mapping="url"           // specific 대신 url 사용
          term="guestbook"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="ko"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default Guest;
