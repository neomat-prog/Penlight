import { useState } from "react";
import axios from "axios";

const PostComment = ({ postId, onNewComment }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:3001/add-comment/${postId}`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onNewComment(response.data.comment);
      setComment(""); // Reset input
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        rows="3"
        required
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default PostComment;
