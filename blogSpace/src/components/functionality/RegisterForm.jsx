import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ setLoggedIn, setUsername }) => {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3001/users/register", {
        username,
        password,
        name,
      });
  
      console.log("Server Response:", response.data); // Log the response
  
      if (response.data.success) {
        setUsername(username);
        setLoggedIn(true);
        navigate('/');
      } else {
        setError(response.data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
      console.error("Registration Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;