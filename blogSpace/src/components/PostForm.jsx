import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onNewPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Both title and content are required.");
      return;
    }

    // Get the auth token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("You must be logged in to post.");
      return;
    }

    try {
      // Send post data to backend API
      const response = await axios.post(
        'http://localhost:3001/create-post',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the Authorization header
          }
        }
      );

      // Handle new post submission
      onNewPost(response.data);

      // Clear input fields after successful submission
      setTitle('');
      setContent('');
      setError('');
    } catch (error) {
      setError("Failed to create post. Please try again later.");
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-4">Create a New Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter the title of your post"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg" htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter the content of your post"
            rows="6"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-lg">Submit Post</button>
      </form>
    </div>
  );
};

export default PostForm;
