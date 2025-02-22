const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, passwordHash });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user." });
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to log in." });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .select("-passwordHash -__v")
      .populate({
        path: "posts",
        select: "title content createdAt",
        options: { sort: { createdAt: -1 }, limit: 10 },
      })
      .populate({ path: "followers", select: "username name" })
      .populate({ path: "following", select: "username name" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        postCount: user.posts.length,
        latestPosts: user.posts,
        followerCount: user.followers.length,
        followingCount: user.following.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (req.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-passwordHash -__v");

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;