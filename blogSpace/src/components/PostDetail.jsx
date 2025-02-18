import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostComment from "./PostComment";
import DeleteComment from "./DeleteComment";

const PostDetail = ({ loggedIn }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  // Get the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/posts/${postId}`
        );
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]); // Add new comment to state
  };

  const handleDeleteComment = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 rounded-lg text-red-700 border border-red-200">
        ⚠️ Error loading post: {error}
      </div>
    );

  if (!post)
    return (
      <div className="p-6 bg-yellow-50 rounded-lg text-yellow-700 border border-yellow-200">
        Post not found
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4"
    >
      <article className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
        <div className="prose-lg text-gray-600 mb-8">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className="mb-4">
              {line}
            </p>
          ))}
        </div>
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500">
            Posted by @{post.author?.username || "Anonymous"}
          </p>
        </div>
      </article>

      {/* Comment Form */}
     { loggedIn && <PostComment postId={postId} onNewComment={handleNewComment} />}

      {/* Render Comments */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li
                key={comment._id || `comment-${index}`}
                className="bg-gray-50 p-4 rounded-lg shadow"
              >
                <p className="text-gray-700">{comment.content}</p>

                {/* Show DeleteComment button if the logged-in user is the comment author */}
                {loggedIn && currentUser.username === comment.author?.username && (
                  <DeleteComment
                    commentId={comment._id}
                    onDelete={handleDeleteComment}
                  />
                )}

                <span className="text-sm text-gray-500">
                  — @{comment.author?.username || "Anonymous"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PostDetail;