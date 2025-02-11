// 태그 관련 유틸리티
export const extractAllTags = (posts) => {
  return [...new Set(posts.flatMap(post => post.tags))];
};

// 포스트 필터링 유틸리티
export const filterPosts = ({ posts, selectedCategory, selectedSubcategory, selectedTags }) => {
  return posts.filter(post => {
    // 카테고리 필터
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }
    // 서브카테고리 필터
    if (selectedSubcategory && post.subcategory !== selectedSubcategory) {
      return false;
    }
    // 태그 필터
    if (selectedTags.size > 0 && !post.tags.some(tag => selectedTags.has(tag))) {
      return false;
    }
    return true;
  });
};

// 태그 토글 유틸리티
export const toggleSetItem = (set, item) => {
  const newSet = new Set(set);
  if (newSet.has(item)) {
    newSet.delete(item);
  } else {
    newSet.add(item);
  }
  return newSet;
}; 