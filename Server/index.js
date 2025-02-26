require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/auth");
const usersRouter = require("./routes/user");
const Post = require("./models/post");
const User = require("./models/user");
const Comment = require("./models/comment");

const app = express();
const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

app.use(cors());

app.use(express.json());
app.use(express.static('dist'))

mongoose
  .connect(URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Blog API running on PORT 3001");
});



app.post("/create-post", authMiddleware, async (req, res) => {
  const { title, content, image } = req.body; // Extract image from request body

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new Post({
      title,
      content,
      image: image || null,
      author: user._id,
    });

    const savedPost = await newPost.save();

    user.posts.push(savedPost._id);
    await user.save();

    const postWithAuthor = await Post.findById(savedPost._id)
      .populate("author", "username name")
      .exec();

    res.status(201).json({
      message: "Post created successfully",
      post: postWithAuthor,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// Editing Endpoint

app.put("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    await updatedPost.populate("author", "username"); // Fixed

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error.stack);
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
});

// Delete Endpoint

app.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user.id) { // Fixed from req.userId
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(req.user.id, { $pull: { posts: postId } }); // Fixed
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" }); // Fixed syntax
  }
});


app.get("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(postId)
      .populate("author", "username name")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve post" });
  }
});

app.get("/posts", async (req, res) => {
  const { q } = req.query;

  try {
    let posts;
    if (q) {
      const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      posts = await Post.find({ title: { $regex: q, $options: "i" } }).populate(
        "author",
        "username name"
      );
    } else {
      posts = await Post.find().populate("author", "username name");
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

app.get("/search", async (req, res) => {
  const { q } = req.query;

  try {
    let posts;
    if (q) {
      posts = await Post.find({ title: { $regex: q, $options: "i" } }).populate(
        "author",
        "username name"
      );
    } else {
      posts = await Post.find().populate("author", "username name");
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

app.delete("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Use req.user.id instead of req.userId
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

// GET COMMENTS

app.get("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(commentId)
      .populate("author", "username name")
      .populate("post", "title");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({
      message: "Failed to retrieve comment",
    });
  }
});

// Add comment to post

app.post("/add-comment/:id", authMiddleware, async (req, res) => {
  // console.log("Request received at /add-comment/:id");
  // console.log("Post ID:", req.params.id);
  // console.log("Request body:", req.body);

  const { content } = req.body;
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    console.log("Invalid post ID");
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      content,
      author: user._id,
      post: post._id,
      createdAt: new Date(),
    });

    const savedComment = await newComment.save();

    post.comments.push(savedComment._id);
    await post.save();

    user.comments.push(savedComment._id);
    await user.save();

    await savedComment.populate("author", "username");

    console.log("Comment added successfully");
    res.status(201).json({
      message: "Comment added successfully",
      comment: savedComment,
      post,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/posts/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    
    const posts = await Post.find({ author: userId })
      .populate("author", "username name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/users", usersRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

module.exports = app;