const LogOut = ({ onLogOut }) => {
  const handleLogOut = () => {
    localStorage.removeItem("user"); 
    onLogOut(); 
  };

  return (
    <div className="mt-4">
      <button 
        onClick={handleLogOut}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </button>
    </div>
  );
};

export default LogOut;