import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState({
    title: "",
    desc: "",
    createdAt: "",
    content: "",
    tags: [],
    category: "",
  });

  useEffect(() => {
    // 실제로는 API에서 포스트 데이터를 가져옴
    const fetchPost = async () => {
      try {
        // 임시 메타데이터
        const metadata = {
          title: postId === "Module" ? "모듈에 대한 이해" : "CSS 선택자 완벽 가이드",
          desc: postId === "Module" 
            ? "자바스크립트 모듈 시스템의 동작 방식과 활용법에 대해 알아봅니다."
            : "CSS 선택자의 다양한 사용법과 우선순위에 대해 상세히 다룹니다.",
          createdAt: postId === "Module" ? "2024-03-20" : "2024-03-19",
          tags: postId === "Module" 
            ? ["JavaScript", "Module", "ES6"]
            : ["CSS", "Frontend"],
          category: postId === "Module" ? "JavaScript" : "CSS",
        };

        // Markdown 파일 불러오기
        const res = await fetch(`/posts/${postId}.md`);
        const content = await res.text();

        setPost({ ...metadata, content });
      } catch (error) {
        console.error("Failed to fetch post:", error);
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
            {post.category}
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
