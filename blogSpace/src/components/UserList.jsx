import React from "react";
import { Link } from "react-router-dom";
import useFetchUsers from "../hooks/useFetchUsers";

const UserList = () => {
  const { users, loading, error } = useFetchUsers();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2" />
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg max-w-md mx-4">
          <h3 className="text-red-800 font-semibold">Error loading users:</h3>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id}>
            <Link
              to={`/profile/${user.id}`}
              className="text-blue-600 hover:underline"
            >
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;