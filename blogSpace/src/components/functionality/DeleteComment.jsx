import { TiDelete } from "react-icons/ti";
import { useState} from 'react'

const DeleteComment = ({onDelete, commentId}) => {
  const [isDeletingComment, setIsDeletingComment] = useState(false);


  const handleDeleteComment = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setIsDeletingComment(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete(commentId); 
      } else {
        const errorData = await response.json();
        console.error("Failed to delete comment:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeletingComment(false);
    }
  };
  return (
    <div>
      <button onClick={handleDeleteComment}>
        <TiDelete />
        {isDeletingComment ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default DeleteComment;
