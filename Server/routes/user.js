const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();
const userRouter = express.Router();

// Register a new user
userRouter.post("/register", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, passwordHash });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user." });
  }
});

// Login a user and return a JWT
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    const user = await User.findOne({ username });
    const passwordValid = user && (await bcrypt.compare(password, user.passwordHash));

    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in." });
  }
});

module.exports = userRouter;
