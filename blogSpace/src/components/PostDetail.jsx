// PostDetail.jsx
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${postId}`);
        setPost(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 rounded-lg text-red-700 border border-red-200">
      ⚠️ Error loading post: {error}
    </div>
  );
  
  if (!post) return (
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
          {post.content.split('\n').map((line, i) => (
            <p key={i} className="mb-4">{line}</p>
          ))}
        </div>
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500">
            Posted by @{post.author?.username || "Anonymous"}
          </p>
        </div>
      </article>
    </motion.div>
  );
};

export default PostDetail;