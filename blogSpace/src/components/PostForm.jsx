import PropTypes from "prop-types";

const PostForm = ({ posts, post, setPosts, setPost }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (post.trim() !== "") {
      setPosts([...posts, post]);
      setPost("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setPost(e.target.value)}
          placeholder="Anything on your mind?"
          value={post}
          className="border rounded p-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post It!
        </button>
      </form>
    </div>
  );
};

PostForm.propTypes = {
  posts: PropTypes.array.isRequired, 
  post: PropTypes.string.isRequired, 
  setPosts: PropTypes.func.isRequired, 
  setPost: PropTypes.func.isRequired, 
};

export default PostForm;
