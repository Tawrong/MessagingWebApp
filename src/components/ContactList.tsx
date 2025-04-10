// src/components/ContactList.tsx
import { FC } from "react";
import { User } from "../types";

interface ContactListProps {
  users: User[];
  currentChatUser: string;
  onSelect: (user: User) => void;
  showStatus?: boolean;
  showTime?: boolean;
  avatarSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
  busy: "bg-red-500",
};

const ContactList: FC<ContactListProps> = ({
  users,
  currentChatUser,
  onSelect,
  showStatus = true,
  showTime = true,
  avatarSize = "md",
}) => {
  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {users.map((user) => (
        <div
          key={user.id}
          className={`py-3 flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors ${
            currentChatUser === user.name ? "bg-blue-200" : ""
          }`}
          onClick={() => onSelect(user)}
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className={`rounded-full ${sizeClasses[avatarSize]} mr-3 object-cover`}
            />
            {showStatus && user.status && (
              <div
                className={`absolute bottom-0 right-3 w-3 h-3 ${
                  statusColors[user.status]
                } rounded-full border-2 border-white`}
              ></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h4 className="font-medium truncate">{user.name}</h4>
              {showTime && user.lastMessageTime && (
                <span className="text-xs text-gray-400 ml-2">
                  {user.lastMessageTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 truncate">
                {user.lastMessage || user.status || "Available"}
              </p>
              {user.unreadCount && user.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                  {user.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
