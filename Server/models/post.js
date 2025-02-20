const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the URL or file path of the image
    default: null, // Optional: Set a default value if no image is provided
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the update date
  },
});

// Middleware to update the `updatedAt` field before saving
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

mongoose.set("strictQuery", false);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;