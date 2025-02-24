import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import Navbar from "./components/Navbar";
import AuthPage from "./components/auth/AuthPage";
import SearchResults from "./components/search/SearchResults";
import UserProfile from "./components/user/UserProfile";
import UserList from "./components/UserList";
import useFetchPosts from "./hooks/useFetchPosts"; // Adjust the import path as needed

const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    if (authToken && user) {
      setLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const logOut = () => {
    setLoggedIn(false);
    setUsername("");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return { loggedIn, username, setLoggedIn, setUsername, logOut };
};

const App = () => {
  const { loggedIn, username, setLoggedIn, setUsername, logOut } = useAuth();
  const { posts, loading, error } = useFetchPosts(); 

  const [localPosts, setLocalPosts] = useState(posts);

  
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleDeletePost = useCallback((postId) => {
    setLocalPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  }, []);

  const handleNewPost = useCallback((response) => {
    const newPost = response.post;
    setLocalPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  const handleEdit = useCallback(() => {
    
    setLocalPosts(posts); 
  }, [posts]);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Navbar
          loggedIn={loggedIn}
          username={username}
          onLogOut={logOut}
          onNewPost={handleNewPost}
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
                      posts={localPosts}
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
            <Route path="/profile/:id" element={<UserProfile loggedIn={loggedIn} />} />
            <Route path="/users" element={<UserList />} />
          </Routes>
        </main>

        <footer className="border border-gray-200 bg-muted/50 mt-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm text-muted-foreground">
              {`© ${new Date().getFullYear()} BlogWave. For great stories`}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;