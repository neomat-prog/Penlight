import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';



const LogInForm = ({ setLoggedIn, setUsername }) => {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users/login", {
        username,
        password,
      });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.userId,
          username: response.data.username,
          name: response.data.name,
        })
      );

      setLoggedIn(true);
      setUsername(response.data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
      console.error("Login error:", err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter your password"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Sign In
      </button>
    </form>
  );
};

export default LogInForm;

LogInForm.PropTypes = {
  setLoggedIn: PropTypes.bool.isRequired,
  setUsername: PropTypes.string.isRequired,
};
