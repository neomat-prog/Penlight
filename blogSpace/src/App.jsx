import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import routing components
import "./App.css";
import axios from "axios";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import LogInForm from "./components/LogInForm";
import RegisterForm from "./components/RegisterForm";
import LogOut from "./components/LogOut";
import CreatePost from "./components/createPost";
import PostDetail from "./components/PostDetail"; // Import the new PostDetail component

const App = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogOut = () => {
    setLoggedIn(false);
    setUsername("");
  };

  // Check for logged-in user on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setLoggedIn(true);
      setUsername(userData.username);
    }
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/posts");
        setPosts(response.data); // Store fetched posts in state
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to add a new post to the state
  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Append new post to the existing posts
  };

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen font-serif">
        <nav className="bg-white shadow-md py-6">
          <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-4xl text-black font-bold">BlogSpace</h1>
            <CreatePost />
            <div className="text-gray-500 text-lg">@{username}</div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 mt-12">
          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                <>
                  {loggedIn ? (
                    <div>
                      <PostForm onNewPost={handleNewPost} />
                      <LogOut onLogOut={handleLogOut} />
                    </div>
                  ) : (
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">
                        {showRegister ? "Register to Post" : "Log In to Post"}
                      </h1>
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
                        className="mt-4 text-blue-500 hover:underline"
                        onClick={() => setShowRegister(!showRegister)}
                      >
                        {showRegister
                          ? "Already have an account? Log in"
                          : "Don't have an account? Register"}
                      </button>
                    </div>
                  )}

                  <section className="mt-16">
                    <h2 className="text-4xl font-semibold text-gray-900 mb-8">
                      Latest Posts
                    </h2>
                    {loading ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">Loading...</p>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <p className="text-red-500 text-xl">
                          Error fetching posts. Please try again later.
                        </p>
                      </div>
                    ) : posts.length > 0 ? (
                      <PostList posts={posts} />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">
                          Nothing to show yet. Be the first to share something!
                        </p>
                      </div>
                    )}
                  </section>
                </>
              }
            />

            {/* Post Detail Route */}
            <Route path="/posts/:postId" element={<PostDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;