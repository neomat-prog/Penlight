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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="space-y-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-4 text-base bg-white border border-gray-200 rounded-lg shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                    placeholder-gray-400 resize-none transition-all duration-200"
          rows="3"
          required
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium text-black bg-white border border-gray-200 rounded-lg
                      hover:bg-black hover:text-white hover:border-black
                      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                      transition-all duration-200 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Posting...
              </>
            ) : (
              <>
                Post Comment
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostComment;
