import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreatePost from "./functionality/CreatePost";

const Navbar = ({ loggedIn, username, onLogOut, onNewPost }) => {
  const navigate = useNavigate();
  const [avatarColor, setAvatarColor] = useState("");

  const getRandomColor = () => {
    const colors = [
      "bg-gradient-to-r from-rose-500 to-pink-500",
      "bg-gradient-to-r from-sky-500 to-blue-500",
      "bg-gradient-to-r from-purple-500 to-indigo-500",
      "bg-gradient-to-r from-emerald-500 to-teal-500",
      "bg-gradient-to-r from-amber-500 to-orange-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (username) {
      const storedColor = localStorage.getItem(`avatarColor-${username}`);
      if (storedColor) {
        setAvatarColor(storedColor);
      } else {
        const newColor = getRandomColor();
        localStorage.setItem(`avatarColor-${username}`, newColor);
        setAvatarColor(newColor);
      }
    }
  }, [username]);

  const getInitial = () => {
    return username ? username.charAt(0).toUpperCase() : "";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with subtle animation */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
              BlogWave
            </span>
            <div className="h-2 w-2 bg-indigo-500 rounded-full group-hover:bg-blue-500 transition-colors duration-300" />
          </button>

          {loggedIn && (
            <div className="flex items-center gap-6">
              <CreatePost onNewPost={onNewPost} />
              
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="ring-2 ring-white/10 hover:ring-indigo-100 transition-all duration-300">
                    <AvatarImage src="" />
                    <AvatarFallback className={`${avatarColor} text-white font-medium`}>
                      {getInitial()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="rounded-xl shadow-lg border border-gray-100 mt-2 py-2 w-48"
                >
                  <DropdownMenuItem
                    onClick={onLogOut}
                    className="flex items-center px-4 py-3 hover:bg-gray-50/80 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                    <span className="font-medium">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;