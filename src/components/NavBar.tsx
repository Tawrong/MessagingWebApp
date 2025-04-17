// filepath: c:\Users\jjten\OneDrive\Desktop\Codes\Vite\Messenger\src\components\NavBar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaComments,
  FaGlobe,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";
import { useUser } from "../context/useUser";

function NavBar({ name, avatar }: { name: string; avatar: string }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUser();
  const toggleNavBar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogout = () => {
    console.log("User logged out");
    logout();
    navigate("/"); // Redirect to the login page
  };
  return (
    <div
      className={`bg-blue-500 text-white h-screen p-4 ${
        isMinimized ? "w-16" : "w-64"
      } transition-all duration-300 flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between mb-4 space-x-2">
          {avatar && (
            <img
              className="overflow-hidden rounded-full w-18"
              src={avatar}
              alt="User Avatar"
            />
          )}
          {!isMinimized && <span className="text-sm font-medium">{name}</span>}
          <button
            onClick={toggleNavBar}
            className="text-white hover:bg-blue-600 p-2 rounded"
          >
            {isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/PrivateChats"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-600"
                }`
              }
            >
              <FaComments />
              {!isMinimized && <span>Private Chats</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/GlobalChats"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-600"
                }`
              }
            >
              <FaGlobe />
              {!isMinimized && <span>Global Chats</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/GroupChats"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-600"
                }`
              }
            >
              <FaUsers />
              {!isMinimized && <span>Group Chats</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ProfileSettings"
              className={({ isActive }) =>
                `flex items-center space-x-2 p-2 rounded ${
                  isActive ? "bg-blue-700" : "hover:bg-blue-600"
                }`
              }
            >
              <FaUserEdit />
              {!isMinimized && <span>Profile Settings</span>}
            </NavLink>
          </li>
        </ul>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600 w-full"
        >
          <FaSignOutAlt />
          {!isMinimized && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}

export default NavBar;
