import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input"; // Shadcn Input
import { Textarea } from "@/components/ui/textarea"; // Shadcn Textarea
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Shadcn AlertDialog
import PostComment from "./functionality/PostComment";
import DeleteComment from "./functionality/DeleteComment";
import { Alert } from "@/components/ui/alert";
import { Trash2, Pencil, Save } from "lucide-react"; // Icons
import { Link } from "react-router-dom";
import useFollow from "../hooks/useFollow";

const PostDetail = ({ loggedIn }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedTitle, setEditedTitle] = useState(""); // Editable title
  const [editedContent, setEditedContent] = useState(""); // Editable content
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const { isFollowing, setIsFollowing, handleFollow } = useFollow(post?.author?._id);
  


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts/${postId}`);
        const postData = response.data;
        setPost(postData);
        setComments(postData.comments || []);
        setEditedTitle(postData.title); // Initialize editable fields
        setEditedContent(postData.content);

        const token = localStorage.getItem("authToken");
        if (token && postData.author?._id) {
          const userResponse = await axios.get(
            `http://localhost:3001/users/${postData.author._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsFollowing(userResponse.data.data.followers.includes(currentUser.id));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, currentUser.id]);

  const handleNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleDeleteComment = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");
      const updatedPost = { title: editedTitle, content: editedContent };
      // console.log("Sending update:", updatedPost); // DEBUG
      const response = await axios.put(
        `http://localhost:3001/posts/${postId}`,
        updatedPost,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Received update:", response.data);
      setPost(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving post:", err.response?.data || err.message);
      setError(err.response?.status === 401 ? "Unauthorized: Please log in" : "Failed to save changes");
    }
  };

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = "/"; // Redirect to home after deletion
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };

  if (loading) return <SkeletonLoading />;
  if (error) return <Alert variant="destructive" className="max-w-3xl mx-auto">⚠️ Error: {error}</Alert>;
  if (!post) return <Alert variant="default" className="max-w-3xl mx-auto">Post not found</Alert>;

  const isOwnProfile = currentUser.id === post.author?._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <article className="mb-12">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-4xl font-serif font-bold tracking-tight text-gray-900"
            />
          ) : (
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              {post.title}
            </h1>
          )}
          {isOwnProfile && loggedIn && (
            <div className="flex gap-2">
              {isEditing ? (
                <Button onClick={handleSaveEdit} variant="outline" className="h-9 px-3">
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="h-9 px-3">
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="h-9 px-3">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePost}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {post.image && (
          <div className="relative w-screen max-w-none -mx-4 md:-mx-8 lg:-mx-16 my-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
        )}

        <div className="font-serif text-xl leading-8 text-gray-800 space-y-6">
          {isEditing ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[200px] text-lg"
            />
          ) : (
            post.content.split("\n").map((line, i) => (
              <p key={i} className="mb-8">{line}</p>
            ))
          )}
        </div>

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
          {loggedIn && !isOwnProfile && (
            <Button
              variant="outline"
              className="ml-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 px-3"
              onClick={handleFollow}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </article>

      {/* Comments section remains unchanged */}
      <div className="mt-16">
        <div className="pt-12">
          <div className="flex flex-col items-start gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Responses ({comments.length})
            </h2>
            {loggedIn && (
              <div className="w-full">
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
                          {comment.author?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.author?.username || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-[15px]">
                        {comment.content}
                      </p>
                    </div>

                    {loggedIn && currentUser.username === comment.author?.username && (
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

// Skeleton loading component (extracted for clarity)
const SkeletonLoading = () => (
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

export default PostDetail;