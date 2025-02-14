import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Header from "./components/Header";
import Guest from "./pages/Guest";
import Update from "./pages/Update";
function App() {
  return (
    <div className="app-content min-h-screen bg-white">
      <Router>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/update" element={<Update />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
