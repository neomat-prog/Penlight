import { MdDelete } from "react-icons/md";

const PostDelete = ({ postId }) => {
  const handleDelete = async () => {
    let token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        console.error("Failed to delete post:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>
        <MdDelete />
      </button>
    </div>
  );
};

export default PostDelete;