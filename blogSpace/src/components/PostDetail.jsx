import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import PostComment from "./functionality/PostComment";
import DeleteComment from "./functionality/DeleteComment";
import { Alert } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";

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
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="mt-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto">
        ⚠️ Error loading post: {error}
      </Alert>
    );

  if (!post)
    return (
      <Alert variant="default" className="max-w-3xl mx-auto">
        Post not found
      </Alert>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <Card className="p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-8">
          {post.title}
        </h1>
        
        <div className="prose prose-lg max-w-none text-gray-600 mb-12 font-serif">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className="mb-6 leading-7">
              {line}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t pt-6">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
              {post.author?.username?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">
              @{post.author?.username || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Comment Section */}
      <div className="mt-12 space-y-8">
        {loggedIn && (
          <Card className="p-6 rounded-xl">
            <PostComment postId={postId} onNewComment={handleNewComment} />
          </Card>
        )}

        <h2 className="text-3xl font-bold text-gray-900">Responses ({comments.length})</h2>
        
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <Card 
                key={comment._id || `comment-${index}`}
                className="p-6 rounded-xl group hover:bg-indigo-50/50 transition-colors"
              >
                <div className="flex gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {comment.author?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">
                        @{comment.author?.username || "Anonymous"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{comment.content}</p>
                  </div>
                  
                  {loggedIn && currentUser.username === comment.author?.username && (
                    <DeleteComment commentId={comment._id} onDelete={handleDeleteComment}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteComment>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-lg">No comments yet. Start the conversation! 💬</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostDetail;