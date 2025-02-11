import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showMobileTags, setShowMobileTags] = useState(false);

  useEffect(() => {
    // 임시 데이터. 실제로는 API에서 받아올 수 있음
    const postsData = [
      {
        postId: "Module",
        title: "모듈에 대한 이해",
        desc: "자바스크립트 모듈 시스템의 동작 방식과 활용법에 대해 알아봅니다.",
        createdAt: "2024-03-20",
        tags: ["JavaScript", "Module", "ES6"],
        category: "JavaScript",
      },
      {
        postId: "Selector",
        title: "CSS 선택자 완벽 가이드",
        desc: "CSS 선택자의 다양한 사용법과 우선순위에 대해 상세히 다룹니다.",
        createdAt: "2024-03-19",
        tags: ["CSS", "Frontend"],
        category: "CSS",
      },
    ];

    setPosts(postsData);
    
    // 모든 태그 추출 및 중복 제거
    const tags = [...new Set(postsData.flatMap(post => post.tags))];
    setAllTags(tags);
  }, []);

  // 태그 토글 함수
  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  // 선택된 태그에 따라 포스트 필터링
  const filteredPosts = posts.filter(post => 
    selectedTags.size === 0 || 
    post.tags.some(tag => selectedTags.has(tag))
  );

  return (
    <div>
      <div 
        className="w-full h-20 rounded-xl bg-cover bg-center md:h-40"
        style={{ backgroundImage: 'url("/Nature.jpg")' }}
      />
      
      {/* 선택된 태그 표시 (작은 화면) */}
      {selectedTags.size > 0 && (
        <div className="lg:hidden mt-4 flex flex-wrap gap-2">
          {Array.from(selectedTags).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-2 py-1 text-sm bg-orange-100 text-orange-600 rounded-xl"
            >
              #{tag}
              <span className="ml-1 font-medium">×</span>
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-8 lg:grid lg:grid-cols-[1fr,250px] lg:gap-8">
        {/* 포스트 목록 */}
        <div className="grid gap-8">
          {filteredPosts.map((post) => (
            <Link 
              key={post.postId}
              to={`/post/${post.postId}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {/* <span className="px-2.5 py-0.5 text-sm font-medium bg-gray-100 text-gray-800 rounded">
                  {post.category}
                </span> */}
                {/* <span className="text-sm text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span> */}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 my-2 line-clamp-2">
                {post.desc}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-xl"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* 태그 목록 (큰 화면에서만 표시) */}
        <div className="hidden lg:block border-l p-4">
          <div className="sticky top-8">
            <h2 className="text-sm text-gray-500 mb-4">태그</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-sm rounded-xl transition-colors ${
                    selectedTags.has(tag)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 태그 선택 버튼 (작은 화면) */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <button 
          onClick={() => setShowMobileTags(true)}
          className="bg-white shadow-lg rounded-full p-4 text-gray-600 hover:text-gray-900"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
        </button>
      </div>

      {/* 모바일 태그 선택 모달 */}
      {showMobileTags && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">태그 선택</h2>
              <button 
                onClick={() => setShowMobileTags(false)}
                className="text-gray-500"
              >
                닫기
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-sm rounded-xl transition-colors ${
                    selectedTags.has(tag)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;