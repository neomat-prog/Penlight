// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import axios from "axios";
import PostList from "./components/PostList";
import LogInForm from "./components/LogInForm";
import RegisterForm from "./components/RegisterForm";
import LogOut from "./components/LogOut";
import CreatePost from "./components/CreatePost";
import PostDetail from "./components/PostDetail";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user"));

    if (authToken && userData) {
      setLoggedIn(true);
      setUsername(userData.username);
    }
    setLoading(false);
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogOut = () => {
    setLoggedIn(false);
    setUsername("");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleEdit = () => {
    fetchPosts(); // Now this works because it's in scope
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                BlogWave
              </h1>
              <div className="flex items-center gap-4">
                {loggedIn && <CreatePost onNewPost={handleNewPost} />}
                {loggedIn && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      @{username}
                    </span>
                    <LogOut onLogOut={handleLogOut} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {!loggedIn && (
                    <div className="max-w-md mx-auto mb-12 bg-white rounded-2xl p-8 shadow-lg transition-all hover:shadow-xl">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {showRegister ? "Join BlogWave" : "Welcome Back"}
                        </h2>
                        <p className="text-gray-600">
                          {showRegister
                            ? "Create your account to start sharing"
                            : "Sign in to continue your journey"}
                        </p>
                      </div>
                      {showRegister ? (
                        <RegisterForm
                          setLoggedIn={setLoggedIn}
                          setUsername={setUsername}
                        />
                      ) : (
                        <LogInForm
                          setLoggedIn={setLoggedIn}
                          setUsername={setUsername}
                        />
                      )}
                      <button
                        className="mt-6 w-full text-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                        onClick={() => setShowRegister(!showRegister)}
                      >
                        {showRegister
                          ? "Already have an account? Sign in"
                          : "Don't have an account? Register now"}
                      </button>
                    </div>
                  )}

                  <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                      Latest Stories
                      <div className="w-16 h-1 bg-indigo-600 mt-2 rounded-full" />
                    </h2>
                    <PostList
                      posts={posts}
                      loading={loading}
                      error={error}
                      onDelete={handleDeletePost}
                      loggedIn={loggedIn}
                      onEdit={handleEdit}
                    />
                  </section>
                </>
              }
            />
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </main>

        <footer className="border-t border-gray-200 bg-white mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-600 text-sm">
              {`© ${new Date().getFullYear()} BlogWave. Crafted with ❤️ for great stories`}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
