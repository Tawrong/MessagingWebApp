// src/components/ContactList.tsx
import { FC } from "react";
import { User } from "../types";

interface ContactListProps {
  users: User[];
  currentChatUser: string;
  onSelect: (user: User) => void;
  avatarSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const ContactList: FC<ContactListProps> = ({
  users,
  currentChatUser,
  onSelect,
  avatarSize = "md",
}) => {
  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {users.map((user) => (
        <div
          key={user.Id}
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
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h4 className="font-medium truncate">{user.name}</h4>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 truncate"></p>
              {/* {user.unreadCount && user.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                  {user.unreadCount}
                </span>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
