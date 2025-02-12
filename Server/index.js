require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/auth");
const usersRouter = require("./routes/user");
const Post = require("./models/post");
const User = require("./models/user");

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

// Create post (protected route)
app.post("/create-post", authMiddleware, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new Post({
      title,
      content,
      author: user._id,
    });

    const savedPost = await newPost.save();

    // Add the post to the user's posts array
    user.posts.push(savedPost._id);
    await user.save();

    // Populate the 'author' field with the 'username'
    const postWithAuthor = await Post.findById(savedPost._id)
      .populate("author", "username") // Populating the author field with the username
      .exec();

    // Respond with the populated post
    res.status(201).json(postWithAuthor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
  }
});



// Get all posts with author details
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username name");
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
});

app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

module.exports = app;
