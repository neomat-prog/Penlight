import { useState, useEffect } from "react";
import axios from "axios";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3001/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;