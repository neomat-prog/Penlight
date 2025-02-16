import PropTypes from "prop-types";
import { useState } from "react";
import { MdEdit } from "react-icons/md";

const PostEdit = ({ postId, initialTitle, initialContent, onEdit }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error("Failed to update post");

      onEdit(); // Refresh posts list
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="ml-2">
      {!isEdit ? (
        <button
          onClick={() => setIsEdit(true)}
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          <MdEdit size={20} />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEdit(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostEdit;

PostEdit.propTypes = {
  postId: PropTypes.string.isRequired,
  initialTitle: PropTypes.string.isRequired,
  initialContent: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};