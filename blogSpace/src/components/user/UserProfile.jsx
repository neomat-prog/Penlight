import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:3001/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data); // Assuming the response has a `data` field
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Re-fetch when the ID changes

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Name: {user.name}</p>
      <p>Posts: {user.postCount}</p>
      <p>Followers: {user.followerCount}</p>
      <p>Following: {user.followingCount}</p>

      {/* Display latest posts if available */}
      {user.latestPosts && user.latestPosts.length > 0 && (
        <div>
          <h2>Latest Posts</h2>
          {user.latestPosts.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;