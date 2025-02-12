const bcrypt = require("bcrypt");
const User = require("../models/user");

const registerUser = async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, name, and password" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      name,
      passwordHash,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
};
