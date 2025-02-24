import { useState } from "react";
import axios from "axios";

const useFollow = (targetUserId) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found—please log in!");
      }

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
      console.error("Follow error:", error.response?.data || error.message);
      alert("Couldn't follow them!");
    }
  };

  return { isFollowing, setIsFollowing, followerCount, setFollowerCount, handleFollow };
};

export default useFollow;