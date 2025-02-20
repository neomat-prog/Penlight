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
      className="max-w-2xl mx-auto px-4 py-8"
    >
      {/* Post Content */}
      <article className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-10 text-gray-900">
          {post.title}
        </h1>

        <div className="font-serif text-xl leading-8 text-gray-800 space-y-6">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className="mb-8">
              {line}
            </p>
          ))}
        </div>

        {/* Author Section */}
        <div className="flex items-center gap-3 mt-16 pt-8 border-t">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
              {post.author?.username?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {post.author?.username || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <Button
            variant="outline"
            className="ml-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 px-3"
          >
            Follow
          </Button>
        </div>
      </article>

      {/* Comment Section */}
      <div className="mt-16">
        <div className="border-t pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Responses ({comments.length})
            </h2>
            {loggedIn && (
              <PostComment postId={postId} onNewComment={handleNewComment} />
            )}
          </div>

          {comments.length > 0 ? (
            <div className="space-y-8">
              {comments.map((comment, index) => (
                <div
                  key={comment._id || `comment-${index}`}
                  className="pb-8 border-b last:border-b-0 group"
                >
                  <div className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                        {comment.author?.username?.charAt(0).toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {comment.author?.username || "Anonymous"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {comment.content}
                      </p>

                      {loggedIn &&
                        currentUser.username === comment.author?.username && (
                          <DeleteComment
                            commentId={comment._id}
                            onDelete={handleDeleteComment}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 px-0 -ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DeleteComment>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                No comments yet. Be the first to respond.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail;
