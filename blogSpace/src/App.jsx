import { useState } from "react";
import "./App.css";

const App = () => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (post.trim() !== "") {
      setPosts([...posts, post]);
      setPost("");
    }

  };

  return (
    <div>
      <h1 className="text-blue-500 font-bold">BlogSpace</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setPost(e.target.value)} placeholder="Anything on your mind?" value={post} className="border rounded p-2 w-full mb-2"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Post It!
        </button>
      </form>
      <div>
        <h2>Your Posts:</h2>
        <ul>{posts.map((n, index) => (
           <li key={index}>{n}</li>
          
        ))}</ul>
      </div>
    </div>
  );
};

export default App;
