import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PostDelete from "./functionality/PostDelete";
import PostEdit from "./functionality/PostEdit";

const PostList = ({ posts, loading, error, onDelete, loggedIn, onEdit }) => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  if (loading) {
    return (
      <div className="flex justify-center py-12 ">
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.span
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          />
          <motion.span
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
          <motion.span
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              ease: "easeInOut",
              delay: 0.4,
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center py-12 text-red-500 text-xl">
        Error fetching posts. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {posts.length > 0 ? (
        posts.map((post) => {
          // console.log("Rendering Post:", post._id); // Debugging
          return (
            <article key={post._id}
              className="bg-white p-6 hover:bg-gray-100 transition-colors duration-200 shadow-sm hover:shadow-md hover:shadow-gray-300"
            >
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 space-x-2 mb-3">
                  <span className="font-medium">
                    {post.author?.name || "Anonymous"}
                  </span>
                  <span>·</span>
                  <span>{post.date || "1 day ago"}</span>
                  <span>·</span>
                  <span>{post.readTime || "4 min read"}</span>
                </div>

                <Link to={`/posts/${post._id}`} className="block">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-serif">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed font-serif line-clamp-3">
                    {post.content}
                  </p>
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  to={`/posts/${post._id}`}
                  className="text-gray-500 text-sm hover:text-gray-700 flex items-center"
                >
                  <span className="mr-1">Continue reading</span>
                  <span className="text-gray-400 mx-1">-</span>
                  <span>{post.readTime || "4 min read"}</span>
                </Link>
              </div>
            </article>
          );
        })
      ) : (
        <p className="text-center py-12 text-gray-500 text-xl">
          Nothing to show yet. Be the first to share something!
        </p>
      )}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default PostList;
