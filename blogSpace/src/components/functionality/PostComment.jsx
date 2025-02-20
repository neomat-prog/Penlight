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
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="relative group">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full p-4 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-none transition-colors placeholder:text-gray-400 placeholder:font-light resize-none"
          rows="3"
          required
        />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200 scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform" />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Posting...
            </>
          ) : (
            <>
              Respond
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostComment;
