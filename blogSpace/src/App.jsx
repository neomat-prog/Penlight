import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import PostList from "./components/PostList";

import PostDetail from "./components/PostDetail";
import Navbar from "./components/Navbar";
import AuthPage from "./components/auth/AuthPage";
import SearchResults from "./components/ui/SearchResults";
import UserProfile from "./components/user/UserProfile";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar
          loggedIn={loggedIn}
          username={username}
          onLogOut={handleLogOut}
          onNewPost={handleNewPost}
          setLoading={setLoading} 
          setPosts={setPosts}
          setError={setError} 
        />

        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-12">
                  <section className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tight">
                        Latest Stories
                      </h2>
                      <Separator className="w-24 h-1 bg-primary" />
                    </div>
                    <PostList
                      posts={posts}
                      loading={loading}
                      error={error}
                      onDelete={handleDeletePost}
                      loggedIn={loggedIn}
                      onEdit={handleEdit}
                    />
                  </section>
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <AuthPage
                  loggedIn={loggedIn}
                  setLoggedIn={setLoggedIn}
                  setUsername={setUsername}
                />
              }
            />
            <Route
              path="/posts/:postId"
              element={<PostDetail loggedIn={loggedIn} />}
            />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:id" element={<UserProfile />} />
          </Routes>
        </main>

        <footer className="border border-gray-200 bg-muted/50 mt-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm text-muted-foreground">
              {`© ${new Date().getFullYear()} BlogWave.  `}
              {` for great stories`}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
