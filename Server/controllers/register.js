const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerRouter = require('express').Router();
const User = require('../models/user');
require('dotenv').config();

registerRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  // Check if all fields are provided
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Username, name, and password are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      name,
      passwordHash,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate JWT token for the new user
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

    // Respond with the new user and the token
    res.status(201).json({
      token,
      username: savedUser.username,
      name: savedUser.name,
    });

  } catch (error) {
    console.error('Error during registration:', error); // Log the specific error
    res.status(500).json({ error: 'Internal server error', details: error.message }); // Send the error details
  }
});

module.exports = registerRouter;
