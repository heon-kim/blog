import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Post() {
  const { postId } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/posts/${postId}.md`) // public 폴더에서 Markdown 파일 불러오기
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [postId]);

  return (
    <div>
      <h1>{postId}</h1>
      <Markdown
        className="prose prose-slate max-w-none font-firacode"
        options={{
          overrides: {
            code: {
              component: ({ className, children }) => {
                // className이 없는 경우는 인라인 코드로 처리
                if (!className) {
                  return (
                    <code className="bg-gray-200 rounded px-1 text-sm text-red-500">{children}</code>
                  );
                }
                // className이 있는 경우는 코드 블록으로 처리
                const language = className.replace("lang-", "");
                return (
                  <SyntaxHighlighter language={language} style={atomDark}>
                    {children}
                  </SyntaxHighlighter>
                );
              },
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

export default Post;
