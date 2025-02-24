import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostList from "../PostList";
import useFetchPosts from "../../hooks/useFetchPosts";
import useFollow from "../../hooks/useFollow"; // Import the new hook
import { Button } from "@/components/ui/button";

const UserProfile = ({ loggedIn }) => {
  const { id } = useParams();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { posts, loading: postsLoading, error: postsError } = useFetchPosts(id);
  const currentUser = JSON.parse(localStorage.getItem("user"))?.id;

  // Use the follow hook
  const { isFollowing, setIsFollowing, followerCount, setFollowerCount, handleFollow } = useFollow(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:3001/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data;
        setUser(userData);
        setIsFollowing(userData.followers.includes(currentUser));
        setFollowerCount(userData.followerCount); // Initialize follower count
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-gray-300 mx-auto mb-4" />
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2" />
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg max-w-md mx-4">
          <h3 className="text-red-800 font-semibold">Error loading profile:</h3>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">User not found</div>
      </div>
    );
  }

  const isOwnProfile = currentUser === id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-800 text-2xl font-bold">
            {user.username[0].toUpperCase()}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
        <p className="text-gray-600">{user.name}</p>
        {loggedIn && !isOwnProfile && (
          <Button className="mt-5" onClick={handleFollow}>
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="text-gray-900 font-bold text-xl">{user.postCount}</div>
          <div className="text-gray-500 text-sm">Posts</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="text-gray-900 font-bold text-xl">{followerCount}</div>
          <div className="text-gray-500 text-sm">Followers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="text-gray-900 font-bold text-xl">{user.followingCount}</div>
          <div className="text-gray-500 text-sm">Following</div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Latest Posts</h2>
        <PostList
          posts={posts}
          loading={postsLoading}
          error={postsError}
          emptyMessage="No posts yet"
        />
      </div>
    </div>
  );
};

export default UserProfile;