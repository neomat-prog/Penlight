import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PostDelete from "./functionality/PostDelete";
import PostEdit from "./functionality/PostEdit";

const PostList = ({ posts, loading, error, onDelete, loggedIn, onEdit }) => {
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  if (loading) {
    return (
      <div className="flex justify-center py-12">
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
    <div className="space-y-12">
      {posts.length > 0 ? (
        posts.map((post) => (
          <article
            key={post._id}
            className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow"
          >
            <div className="mb-6">
              <Link to={`/posts/${post._id}`}>
                <h3 className="text-3xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-lg text-gray-600 mt-4">{post.content}</p>
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <Link
                to={`/posts/${post._id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Read more
              </Link>
              <span className="text-sm text-gray-500">
                Posted by @{post.author?.username || "Anonymous"}
              </span>
              {loggedIn && currentUser.username === post.author?.username && (
                <div className="flex gap-2">
                  <PostEdit
                    postId={post._id}
                    initialTitle={post.title}
                    initialContent={post.content}
                    onEdit={onEdit}
                  />
                  <PostDelete onDelete={onDelete} postId={post._id} />
                </div>
              )}
            </div>
          </article>
        ))
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
