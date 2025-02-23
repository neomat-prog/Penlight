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
import { Link } from "react-router-dom";

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

        <div className="flex items-center ">
          {post.image && (
            <div className="relative w-screen max-w-none -mx-4 md:-mx-8 lg:-mx-16 my-12">
              {/* Image with full width */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="font-serif text-xl leading-8 text-gray-800 space-y-6">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className="mb-8">
              {line}
            </p>
          ))}
        </div>

        {/* Author Section */}
        <div className="flex items-center gap-3 mt-16 pt-8 border-t">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                {post.author?.username?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </Link>
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
        <div className="pt-12">
          <div className="flex flex-col items-start gap-4 mb-8">
            {" "}
            {/* Changed to column layout */}
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Responses ({comments.length})
            </h2>
            {loggedIn && (
              <div className="w-full">
                {" "}
                {/* Added container for full width */}
                <PostComment postId={postId} onNewComment={handleNewComment} />
              </div>
            )}
          </div>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <Card
                  key={comment._id || `comment-${index}`}
                  className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative"
                >
                  <div className="flex gap-3">
                    <Link to={`/profile/${comment.author?._id}`}>
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium">
                          {comment.author?.username?.charAt(0).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.author?.username || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-[15px]">
                        {comment.content}
                      </p>
                    </div>

                    {loggedIn &&
                      currentUser.username === comment.author?.username && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteComment
                            commentId={comment._id}
                            onDelete={handleDeleteComment}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DeleteComment>
                        </div>
                      )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border rounded-xl bg-gray-50">
              <p className="text-gray-500 text-sm">
                No comments yet. Be the first to share your thoughts.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail;
