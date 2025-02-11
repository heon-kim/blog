import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";

function App() {
  return (
    <div className="app-content min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:postId" element={<Post />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
