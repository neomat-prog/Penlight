import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12">
      <article className="bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{post.content}</p>
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            Posted by @{post.author?.username || "Anonymous"}
          </p>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;