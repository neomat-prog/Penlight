import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // shadcn dropdown
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // shadcn avatar
import { LogOut } from "lucide-react"; // Logout icon
import { useNavigate } from "react-router-dom";
import CreatePost from "./functionality/CreatePost";

const Navbar = ({ loggedIn, username, onLogOut, onNewPost }) => {
  const navigate = useNavigate();
  const [avatarColor, setAvatarColor] = useState("");

  // Function to generate a random color for the avatar
  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Load avatar color from localStorage or generate a new one
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

  // Get the first letter of the username and capitalize it
  const getInitial = () => {
    return username ? username.charAt(0).toUpperCase() : "";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* BlogWave Title */}
          <button
            onClick={() => navigate("/")}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            BlogWave
          </button>

          {/* Right Side: Avatar and Dropdown */}
          {loggedIn && (
            <div className="flex items-center gap-4">
              {/* Create Post Button */}
              <CreatePost onNewPost={onNewPost} />

              {/* Avatar and Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="" /> {/* Add a profile image URL if available */}
                    <AvatarFallback className={avatarColor}>
                      {getInitial()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={onLogOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
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
