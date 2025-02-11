import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Tech Blog</h1>
      <Link to="/">홈</Link>
      <Link to="/write">글 작성</Link>
    </nav>
  );
}

export default Navbar;
