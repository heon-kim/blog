import { useState, useEffect } from "react";
import { posts as postsData } from "../data/posts";
import { extractAllTags, filterPosts, toggleSetItem } from "../utils/postUtils";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import MobileTagModal from "../components/MobileTagModal";
import frontMatter from 'front-matter';

function Home() {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showMobileTags, setShowMobileTags] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postMetadata = await Promise.all(
          postsData.map(async (postId) => {
            const res = await fetch(`/posts/${postId}.md`);
            const rawContent = await res.text();
            const { attributes: metadata } = frontMatter(rawContent);
            return { ...metadata, postId };
          })
        );
        setPosts(postMetadata);
        setAllTags(extractAllTags(postMetadata));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // 태그 토글 함수
  const toggleTag = (tag) => {
    setSelectedTags(prev => toggleSetItem(prev, tag));
  };

  // 카테고리 토글 함수
  const toggleCategory = (key) => {
    if (selectedCategory === key) {
      setSelectedCategory(null);
      setSelectedSubcategory(null); // 카테고리 해제시 서브카테고리도 해제
    } else {
      setSelectedCategory(key);
      setSelectedSubcategory(null); // 새 카테고리 선택시 서브카테고리 초기화
    }
  };

  // 서브카테고리 토글 함수
  const toggleSubcategory = (key) => {
    setSelectedSubcategory(selectedSubcategory === key ? null : key);
  };

  // 포스트 필터링
  const filteredPosts = filterPosts({
    posts,
    selectedCategory,
    selectedSubcategory,
    selectedTags
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
        <PostList posts={filteredPosts} />
        <Sidebar
          allTags={allTags}
          selectedTags={selectedTags}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onTagToggle={toggleTag}
          onCategoryToggle={toggleCategory}
          onSubcategoryToggle={toggleSubcategory}
        />
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

      <MobileTagModal
        showMobileTags={showMobileTags}
        onClose={() => setShowMobileTags(false)}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
      />
    </div>
  );
}

export default Home;