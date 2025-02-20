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

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    // Find the user creating the post
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create the new post
    const newPost = new Post({
      title,
      content,
      image: image || null, // Set image if provided, otherwise null
      author: user._id,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Add the post to the user's posts array
    user.posts.push(savedPost._id);
    await user.save();

    // Populate the author details in the response
    const postWithAuthor = await Post.findById(savedPost._id)
      .populate("author", "username") // Include only the username of the author
      .exec();

    // Send the response
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

app.patch("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const updates = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true,
    }).populate("author", "username");

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
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
    if (post.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(postId);
    await User.findByIdAndUpdate(req.userId, { $pull: { posts: postId } });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json(message, "Failed to delete post");
  }
});

app.get("/posts", async (req, res) => {
  const { q } = req.query; // Get the search query from the request

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

app.delete("/comments/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;

    // Validate the comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    // Find the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the authenticated user is the author of the comment
    if (comment.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Remove the comment ID from the associated post's comments array
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
  const { content } = req.body;
  const postId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    // Find the authenticated user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      content,
      author: user._id,
      post: post._id,
      createdAt: new Date(),
    });

    // Save the comment
    const savedComment = await newComment.save();

    // Add the comment to the post
    post.comments.push(savedComment._id);
    await post.save();

    // Add the comment to the user's comments list
    user.comments.push(savedComment._id);
    await user.save();

    // Populate the comment details before sending response
    await savedComment.populate("author", "username");

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

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

module.exports = app;
