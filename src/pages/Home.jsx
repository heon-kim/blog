import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);

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

  return (
    <div>
      <div 
        className="w-full h-20 rounded-xl bg-cover bg-center md:h-40"
        style={{ backgroundImage: 'url("/Nature.jpg")' }}
      />
      
      <div className="mt-8 lg:grid lg:grid-cols-[1fr,250px] lg:gap-8">
        {/* 포스트 목록 */}
        <div className="grid gap-8">
          {posts.map((post) => (
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
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;