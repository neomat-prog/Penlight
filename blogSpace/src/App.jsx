import { useState } from "react";
import "./App.css";
import PostForm from "./components/PostForm";

const App = () => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);

  return (
    <div>
      <h1 className="text-blue-500 font-bold">BlogSpace</h1>
      <PostForm post={post} posts={posts} setPost={setPost} setPosts={setPosts}/>
      <div>
        <h2>Your Posts:</h2>
        {posts.length > 0  ? (
          <ul>{posts.map((n, index) => (
            <li key={index}>{n}</li>
           
         ))}</ul>
        ) : (
          <p className="text-gray-500 mt-2">No posts yet. Share your thoughts!</p>
        )} 
        
      </div>
    </div>
  );
};

export default App;
