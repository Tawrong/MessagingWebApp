// filepath: c:\Users\jjten\OneDrive\Desktop\Codes\Vite\Messenger\src\components\NavBar.tsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaComments, FaGlobe, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NavBar() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleNavBar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`bg-blue-500 text-white h-screen p-4 ${
        isMinimized ? "w-16" : "w-64"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        {!isMinimized && <span className="text-sm font-medium">UserName</span>}
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
      </ul>
    </div>
  );
}

export default NavBar;