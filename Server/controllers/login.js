const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
require('dotenv').config();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ username });

  // If user doesn't exist
  if (!user) {
    return res.status(401).json({
      error: 'Invalid username or password'
    });
  }

  // Compare password hash
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);


  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'Invalid username or password'
    });
  }

  // Generate JWT token
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  try {
    const token = jwt.sign(
      { id: user._id, username: user.username }, // Payload
      process.env.JWT_SECRET, // Secret
      { expiresIn: "1h" } // Expiration time
    );

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Error generating token" });
  }
});

module.exports = loginRouter;
