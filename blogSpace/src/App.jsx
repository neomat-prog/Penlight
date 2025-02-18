import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import PostList from "./components/PostList";
import LogInForm from "./components/auth/LogInForm";
import RegisterForm from "./components/functionality/RegisterForm";
import LogOut from "./components/auth/LogOut";
import CreatePost from "./components/functionality/CreatePost";
import PostDetail from "./components/PostDetail";
import Navbar from "./components/Navbar";

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
        />
        
        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="space-y-12">
                  {!loggedIn && (
                    <Card className="max-w-md mx-auto bg-background hover:shadow-lg transition-shadow">
                      <CardHeader className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-center">
                          {showRegister ? "Join BlogWave" : "Welcome Back"}
                        </h2>
                        <p className="text-muted-foreground text-center">
                          {showRegister
                            ? "Create your account to start sharing"
                            : "Sign in to continue your journey"}
                        </p>
                      </CardHeader>
                      <CardContent className="grid gap-4">
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
                      </CardContent>
                      <CardFooter className="flex flex-col">
                        <Separator className="mb-4" />
                        <Button
                          variant="link"
                          className="text-primary font-medium"
                          onClick={() => setShowRegister(!showRegister)}
                        >
                          {showRegister
                            ? "Existing user? Sign in"
                            : "New user? Create account"}
                        </Button>
                      </CardFooter>
                    </Card>
                  )}

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
              path="/posts/:postId"
              element={<PostDetail loggedIn={loggedIn} />}
            />
          </Routes>
        </main>

        <footer className="border-t bg-muted/50 mt-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-sm text-muted-foreground">
              {`© ${new Date().getFullYear()} BlogWave. Crafted with `}
              <span className="text-primary">❤️</span>
              {` for great stories`}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};



export default App;