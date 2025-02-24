import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "lodash/debounce";

const SearchPosts = () => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); // Local state
  const [posts, setPosts] = useState([]);       // Local state
  const [error, setError] = useState(null);     // Local state
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentQuery = searchParams.get("q") || "";
    setQuery(currentQuery);
    if (currentQuery) {
      setIsActive(true);
      fetchPosts(currentQuery);
    }
  }, [location.search]);

  const fetchPosts = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/posts", {
        params: { q: searchQuery },
      });
      setPosts(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsActive(!!value.trim());

    const trimmedValue = value.trim();
    navigate(trimmedValue ? `/search?q=${encodeURIComponent(trimmedValue)}` : "/");
    fetchPosts(trimmedValue);
  };

  useEffect(() => {
    return () => {
      fetchPosts.cancel();
    };
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        className={`flex items-center border rounded-full px-3 py-2 bg-white transition-all duration-200 ${
          isActive ? "border-blue-500 shadow-sm" : "border-gray-300"
        }`}
      >
        <Search className="w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={handleSearch}
          className="ml-2 w-full bg-transparent outline-none placeholder:text-gray-400 text-sm"
        />
        
      </div>
      {/* Optional: Render results here if standalone
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {posts.length > 0 && (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>{post.title}</li> // Adjust based on your post structure
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default SearchPosts;