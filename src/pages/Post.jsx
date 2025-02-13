import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { posts as postsData } from "../data/posts";
import frontMatter from 'front-matter';
import Giscus from "@giscus/react";

function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // posts 배열에서 현재 postId에 해당하는 포스트 정보 찾기
        const postInfo = postsData.find(post => post.id === postId);
        
        if (!postInfo) {
          console.error('Post not found');
          return;
        }

        // 폴더 구조에 맞는 경로 생성
        const postPath = `${postInfo.category}/${postInfo.subcategory}/${postInfo.id}.md`;
        const res = await fetch(`/posts/${postPath}`);
        const rawContent = await res.text();
        const { attributes: metadata, body } = frontMatter(rawContent);
        
        setPost({ ...metadata, content: body });
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

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

      {/* 댓글 섹션 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Comments</h2>
        <Giscus
          repo="heon-kim/blog-comments"
          repoId="R_kgDOLEjyDQ"
          category="Comments"
          categoryId="DIC_kwDOLEjyDc4Cm419"
          mapping="url"           // pathname 대신 url 사용
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="ko"
          loading="lazy"
        />
      </div>
    </article>
  );
}

export default Post;
