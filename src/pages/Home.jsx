import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CATEGORIES = {
  'Frontend': {
    name: '프론트엔드',
    subcategories: {
      'JavaScript': {
        name: '자바스크립트'
      },
      'CSS': {
        name: 'CSS'
      },
      'React': {
        name: '리액트'
      }
    }
  },
  'Backend': {
    name: '백엔드',
    subcategories: {
      'Node.js': {
        name: '노드'
      },
      'Database': {
        name: '데이터베이스'
      }
    }
  },
  'DevOps': {
    name: '데브옵스',
    subcategories: {
      'Docker': {
        name: '도커'
      },
      'AWS': {
        name: 'AWS'
      }
    }
  }
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showMobileTags, setShowMobileTags] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    // 임시 데이터. 실제로는 API에서 받아올 수 있음
    const postsData = [
      {
        postId: "Module",
        title: "모듈에 대한 이해",
        desc: "자바스크립트 모듈 시스템의 동작 방식과 활용법에 대해 알아봅니다.",
        createdAt: "2024-03-20",
        category: "Frontend",
        subcategory: "JavaScript",
        tags: ["ES6", "Module"],
      },
      {
        postId: "Selector",
        title: "CSS 선택자 완벽 가이드",
        desc: "CSS 선택자의 다양한 사용법과 우선순위에 대해 상세히 다룹니다.",
        createdAt: "2024-03-19",
        category: "Frontend",
        subcategory: "CSS",
        tags: ["Layout", "Tailwind"],
      },
      {
        postId: "React-State",
        title: "React 상태 관리의 모든 것",
        desc: "React의 다양한 상태 관리 방법과 각각의 장단점을 알아봅니다.",
        createdAt: "2024-03-18",
        category: "Frontend",
        subcategory: "React",
        tags: ["Hooks", "State"],
      },
      {
        postId: "Express-Middleware",
        title: "Express 미들웨어 심화",
        desc: "Express.js의 미들웨어 시스템을 자세히 알아봅니다.",
        createdAt: "2024-03-17",
        category: "Backend",
        subcategory: "Node.js",
        tags: ["Express", "NestJS"],
      },
      {
        postId: "Docker-Basic",
        title: "Docker 기초부터 실전까지",
        desc: "Docker의 기본 개념과 실제 활용 방법을 알아봅니다.",
        createdAt: "2024-03-16",
        category: "DevOps",
        subcategory: "Docker",
        tags: ["Container", "Compose"],
      }
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

  // 카테고리 토글 함수 추가
  const toggleCategory = (key) => {
    if (selectedCategory === key) {
      setSelectedCategory(null);
      setSelectedSubcategory(null); // 카테고리 해제시 서브카테고리도 해제
    } else {
      setSelectedCategory(key);
      setSelectedSubcategory(null); // 새 카테고리 선택시 서브카테고리 초기화
    }
  };

  // 서브카테고리 토글 함수 추가
  const toggleSubcategory = (key) => {
    setSelectedSubcategory(selectedSubcategory === key ? null : key);
  };

  // 카테고리와 태그에 따라 포스트 필터링
  const filteredPosts = posts.filter(post => {
    // 카테고리 필터
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }
    if (selectedSubcategory && post.subcategory !== selectedSubcategory) {
      return false;
    }
    // 태그 필터
    if (selectedTags.size > 0 && !post.tags.some(tag => selectedTags.has(tag))) {
      return false;
    }
    return true;
  });

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

        {/* 사이드바 */}
        <div className="hidden lg:block border-l p-4">
          <div className="sticky top-8">
            {/* 카테고리 목록 */}
            <div className="mb-6">
              <h2 className="text-sm text-gray-500 mb-2">카테고리</h2>
              <div className="space-y-2">
                {Object.entries(CATEGORIES).map(([key, category]) => (
                  <div key={key}>
                    <button
                      onClick={() => toggleCategory(key)}
                      className={`text-sm font-medium ${
                        selectedCategory === key
                          ? 'text-orange-600'
                          : 'text-gray-900 hover:text-orange-600'
                      }`}
                    >
                      {category.name}
                      {selectedCategory === key && (
                        <span className="ml-1 font-medium">×</span>
                      )}
                    </button>
                    {selectedCategory === key && (
                      <div className="ml-4 mt-1 space-y-1">
                        {Object.entries(category.subcategories).map(([subKey, subCategory]) => (
                          <button
                            key={subKey}
                            onClick={() => toggleSubcategory(subKey)}
                            className={`block text-sm ${
                              selectedSubcategory === subKey
                                ? 'text-orange-600'
                                : 'text-gray-600 hover:text-orange-600'
                            }`}
                          >
                            {subCategory.name}
                            {selectedSubcategory === subKey && (
                              <span className="ml-1 font-medium">×</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 태그 목록 */}
            <div>
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