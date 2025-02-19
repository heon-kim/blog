import { Link } from "react-router-dom";

function PostList({ posts }) {
  if (!posts) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-gray-500">게시글이 없습니다.</div>
    </div>
  );
  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <Link 
          key={post.postId}
          to={`/post/${post.postId}`}
        >
          <div className="flex items-center gap-2 mb-2" />
          
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
  );
}

export default PostList; 