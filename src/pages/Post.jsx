import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { posts } from "../data/posts";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState({
    title: "",
    desc: "",
    createdAt: "",
    content: "",
    tags: [],
    category: "",
    subcategory: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // posts 데이터에서 현재 postId와 일치하는 포스트 찾기
        const postData = posts.find(p => p.postId === postId);
        
        if (!postData) {
          throw new Error('Post not found');
        }

        // Markdown 파일 불러오기
        const res = await fetch(`/posts/${postId}.md`);
        if (!res.ok) {
          throw new Error('Failed to fetch markdown content');
        }
        const content = await res.text();

        // 포스트 데이터와 마크다운 내용 합치기
        setPost({ ...postData, content });
      } catch (error) {
        console.error("Failed to fetch post:", error);
        // 여기에 에러 처리 UI를 추가할 수 있습니다
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <article className="max-w-none">
      {/* 포스트 헤더 */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 text-sm font-medium bg-orange-100 text-orange-800 rounded">
            {post.category} / {post.subcategory}
          </span>
          {/* <span className="text-sm text-gray-600">
            {post.createdAt && new Date(post.createdAt).toLocaleDateString()}
          </span> */}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

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
      </header>

      {/* 포스트 내용 */}
      <div className="prose prose-slate max-w-none font-firacode">
        <Markdown
          options={{
            overrides: {
              pre: {
                component: ({ children }) => children,
              },
              code: {
                component: ({ className, children, inline }) => {
                  if (inline || !className) {
                    return (
                      <code className="bg-gray-200 rounded px-1 text-red-500">
                        {children}
                      </code>
                    );
                  }
                  const language = className.replace("lang-", "");
                  return (
                    <SyntaxHighlighter 
                      language={language} 
                      style={atomDark}
                      customStyle={{ 
                        borderRadius: '0.75rem',  // 8px
                      }}
                    >
                      {children}
                    </SyntaxHighlighter>
                  );
                },
              },
            },
          }}
        >
          {post.content}
        </Markdown>
      </div>
    </article>
  );
}

export default Post;
