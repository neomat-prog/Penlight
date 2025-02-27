import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogInForm = ({ setLoggedIn, setUsername, setCurrentUserId }) => {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/users/login", {
        username,
        password,
      });

      console.log("Login response:", response.data);

      const { user, token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          username: user.username,
          name: user.name,
        })
      );

      setLoggedIn(true);
      setUsername(user.username); // Fixed: use user.username
      setCurrentUserId(user.id); // Added: set currentUserId
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
      console.error("Login error:", err.response?.data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Welcome Back
        </h1>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-black
                      placeholder-gray-400 transition-all"
            placeholder="Enter your username"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-black
                      placeholder-gray-400 transition-all"
            placeholder="Enter your password"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-lg 
                    hover:bg-gray-800 transition-colors font-medium
                    focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LogInForm;

LogInForm.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  setCurrentUserId: PropTypes.func.isRequired, // Added
};