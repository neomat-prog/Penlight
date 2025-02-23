import { useEffect, useState } from "react";
import axios from "axios";

const useFetchPosts = (userId = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const url = userId
          ? `http://localhost:3001/posts/user/${userId}` 
          : "http://localhost:3001/posts"; 

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]); 
  return { posts, loading, error };
};

export default useFetchPosts;