import { useState } from "react";
import axios from "axios";

const LogInForm = ({ setLoggedIn, setUsername }) => {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/users/login",
        { username, password }
      );

      // Store token and user data
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify({
        username: response.data.username,
        name: response.data.name
      }));

      setLoggedIn(true);
      setUsername(response.data.username);
    } catch (err) {
      setError("Invalid username or password.");
      console.error("Login error:", err.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsernameInput(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default LogInForm;