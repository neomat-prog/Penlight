import { useState } from "react";
import { MdDelete } from "react-icons/md";

const PostDelete = ({ postId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete(postId); 
      } else {
        const errorData = await response.json();
        console.error("Failed to delete post:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
      aria-label="Delete post"
    >
      {isDeleting ? (
        <span className="animate-pulse">Deleting...</span>
      ) : (
        <MdDelete className="w-5 h-5" />
      )}
    </button>
  );
};

export default PostDelete;