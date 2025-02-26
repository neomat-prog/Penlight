import { useState, useEffect } from "react";
import axios from "axios";

const useFollow = (targetUserId, currentUserId) => { // Add currentUserId as a parameter
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!targetUserId) {
        setError("No target user ID provided");
        setLoading(false);
        return;
      }
      if (!currentUserId) {
        setError("No current user ID provided");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No auth token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3001/users/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data;
        console.log("Target User Data:", userData);
        console.log("Current User ID:", currentUserId);
        console.log("Is Following:", userData.followers.includes(currentUserId));
        setIsFollowing(userData.followers.includes(currentUserId));
        setFollowerCount(userData.followerCount || 0);
      } catch (error) {
        console.error("Error fetching follow status:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Failed to fetch follow status");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [targetUserId, currentUserId]); // Add currentUserId as a dependency

  const handleFollow = async () => {
    if (!targetUserId || !currentUserId || followActionLoading) return;

    try {
      setFollowActionLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found—please log in!");

      if (isFollowing) {
        await axios.post(
          `http://localhost:3001/users/unfollow/${targetUserId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowerCount((prev) => prev - 1);
        setIsFollowing(false);
      } else {
        await axios.post(
          `http://localhost:3001/users/follow/${targetUserId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowerCount((prev) => prev + 1);
        setIsFollowing(true);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error("Follow error:", message);
      if (message === "You are already following them!") {
        setIsFollowing(true);
      } else if (message === "You are not following this user!") {
        setIsFollowing(false);
      } else {
        setError("Couldn’t complete the action");
      }
    } finally {
      setFollowActionLoading(false);
    }
  };

  return {
    isFollowing,
    setIsFollowing,
    followerCount,
    setFollowerCount,
    handleFollow,
    loading,
    followActionLoading,
    error,
  };
};

export default useFollow;