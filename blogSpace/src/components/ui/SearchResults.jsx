import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { debounce } from "lodash";
import PostList from "../PostList"; 

const SearchResults = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract the query parameter from the URL
  const query = new URLSearchParams(location.search).get("q");

  // Fetch posts based on the query
  useEffect(() => {
    const fetchPosts = debounce(async () => {
      if (!query) return;

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
    }, 500); // Wait 500ms after user stops typing before fetching

    fetchPosts();

    return () => {
      fetchPosts.cancel();
    };
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">
        Search Results for "{query}"
      </h1>
      <PostList
        posts={posts}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default SearchResults;
