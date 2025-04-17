// src/components/ContactList.tsx
import { FC } from "react";
import { User, Message } from "../types"; // Make sure to import Message type

interface ContactListProps {
  users: User[];
  currentChatUser: string;
  onSelect: (user: User) => void;
  avatarSize?: "sm" | "md" | "lg";
  conversations?: Message[]; // Add this new prop
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
  conversations = [], // Default empty array
}) => {
  // Combine both users and conversation participants
  const allContacts = [
    ...users,
    ...conversations.map((conv) => ({
      Id: conv.Id,
      name: conv.name,
      email: conv.email,
      avatar: conv.avatar,
    })),
  ];

  // Remove duplicates (in case a user appears in both)
  const uniqueContacts = allContacts.filter(
    (contact, index, self) =>
      index === self.findIndex((c) => c.Id === contact.Id)
  );

  return (
    <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
      {uniqueContacts.map((contact) => (
        <div
          key={contact.Id}
          className={`py-3 flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors ${
            currentChatUser === contact.name ? "bg-blue-200" : ""
          }`}
          onClick={() =>
            onSelect({
              Id: contact.Id,
              name: contact.name,
              avatar: contact.avatar,
              username: "Hello",
            })
          }
        >
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className={`rounded-full ${sizeClasses[avatarSize]} mr-3 object-cover`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h4 className="font-medium truncate">{contact.name}</h4>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 truncate">
                {"lastMessage" in contact ? contact.lastMessage : ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
