import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Markdown 파일 목록을 불러오는 API (수동 리스트)
    setPosts(["Module.md", "Selector.md"]); // 실제로는 API에서 받아올 수도 있음
  }, []);

  return (
    <div>
      <h1>기술 블로그</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <Link to={`/post/${post.replace(".md", "")}`}>{post}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;