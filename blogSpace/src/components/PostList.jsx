import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PostDelete from "./PostDelete";

const PostList = ({ posts, loading, error, onDelete }) => {
  if (loading) {
    return <p className="text-center py-12 text-gray-500 text-xl">Loading...</p>;
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
              <span>
                <PostDelete postId={post._id} onDelete={onDelete} />
              </span>
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
};

export default PostList;