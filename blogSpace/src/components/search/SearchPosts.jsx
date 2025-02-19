import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const SearchPosts = ({ setLoading, setPosts, setError }) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Synchronize query from URL on component mount and navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentQuery = searchParams.get("q") || "";
    setQuery(currentQuery);
    if (currentQuery) {
      setIsActive(true);
    }
  }, [location.search]);


  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/posts", {
        params: { q: query },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    navigate(value.trim() ? `/search?q=${value}` : "/");
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 bg-white">
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
  );
};

export default SearchPosts;
