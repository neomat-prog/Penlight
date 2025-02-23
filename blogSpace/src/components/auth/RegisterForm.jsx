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

      // Successful registration
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.data.userId,
        username: response.data.username,
        name: response.data.name,
      }));

      setUsername(response.data.username);
      setLoggedIn(true);
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
      console.error("Registration Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Create Account</h1>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-black
                      placeholder-gray-400 transition-all"
            placeholder="Enter your full name"
            required
          />
        </div>

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
            placeholder="Choose a username"
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
            placeholder="Create a password"
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-lg 
                    hover:bg-gray-800 transition-colors font-medium
                    focus:outline-none focus:ring-2 focus:ring-gray-400
                    disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registering...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
