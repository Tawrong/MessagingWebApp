import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef, useState, useEffect, useCallback } from "react";
import { userSearch } from "../types";
import { useUser } from "../context/useUser";

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  senderName: string;
  senderAvatar: string;
}

interface SearchUsersResponse {
  users: userSearch[];
}

export default function ChatMessages() {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // State
  const { user } = useUser();
  const [isSent2, setIsSent2] = useState(false);
  const [conversations, setConversations] = useState([]);
  // const [showmessages, setshowmessages] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState<userSearch[]>([]);
  const [messageValue, setMessageValue] = useState("");
  const [selectedUserAvatar, setSelectedUserAvatar] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll events
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100;
    setAutoScroll(isNearBottom);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  // Search users function
  const SearchUsers = useCallback(
    async (query: string) => {
      try {
        const url = new URL(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/auth/PrivateMessages/searchuser`
        );
        url.searchParams.append("name", query);
        url.searchParams.append("myname", user?.name || "");
        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const result: SearchUsersResponse = await response.json();
        setSearchUsers(result.users);
      } catch (err) {
        console.error(err);
      }
    },
    [user?.name]
  );

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim()) {
      SearchUsers(value);
    } else {
      setSearchUsers([]);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!messageValue.trim() || !user?.Id || !selectedUserId) return;
    setIsSent2(false);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/PrivateMessages/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: user?.Id || "",
            recipientId: selectedUserId,
            content: messageValue,
            messageType: "text",
          }),
        }
      );
      if (response.ok) {
        setMessageValue("");
        setAutoScroll(true);
        setIsSent2(true);
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }, [messageValue, user?.Id, selectedUserId]);

  const getConversations = useCallback(async () => {
    try {
      if (!user?.Id) return;

      const url = new URL(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/PrivateMessages/getConversation`
      );
      url.searchParams.append("userId", user.Id);

      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.data);
      setConversations(result.data || []); // Use result.data instead of result.Conversation
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]); // Reset to empty array on error
    }
  }, [user?.Id]);

  // Handle sending messages
  const handleMessageSend = () => {
    // if (messageValue.trim() && selectedUserName) {
    //   const newMessage: ChatMessage = {
    //     id: Date.now().toString(),
    //     text: messageValue,
    //     timestamp: new Date(),
    //     isSent: true,
    //     senderName: "You",
    //     senderAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
    //   };
    //   setMessages([...messages, newMessage]);
    //   setMessageValue("");
    //   setAutoScroll(true);
    // }
    sendMessage();
  };

  // Handle selecting a user from search results
  const handleSearchSelect = (user: userSearch) => {
    setSelectedUserName(user.name);
    setSelectedUserAvatar(user.avatar);
    setSelectedUserId(user.Id);
    setMessages([
      {
        id: "1",
        text: `Hello there! This is the start of your conversation with ${user.name}`,
        timestamp: new Date(),
        isSent: false,
        senderName: user.name,
        senderAvatar: user.avatar,
      },
    ]);
    setAutoScroll(true);
    setSearchUsers([]);
    setSearchValue("");
  };

  // Render contact list
  const renderContactList = () => (
    <div className="overflow-y-auto">
      {searchUsers.map((user) => (
        <div
          key={user.Id}
          className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSearchSelect(user)}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="rounded-full w-10 h-10 mr-3"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Render individual message
  const renderMessage = (msg: ChatMessage) => (
    <div
      className={`flex my-2 ${msg.isSent ? "justify-end" : "justify-start"}`}
      key={msg.id}
    >
      {!msg.isSent && (
        <img
          src={msg.senderAvatar}
          alt={msg.senderName}
          className="rounded-full w-8 h-8 mr-2"
        />
      )}
      <div className={`max-w-[70%]`}>
        {!msg.isSent && (
          <span className="text-xs text-gray-500 mb-1">{msg.senderName}</span>
        )}
        <div
          className={`rounded-2xl p-3 break-words ${
            msg.isSent ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {msg.text} {isSent2 ? "sent" : "Error"}
        </div>
        <div
          className={`flex items-center mt-1 text-xs ${
            msg.isSent ? "justify-end" : "justify-start"
          }`}
        >
          <span className={msg.isSent ? "text-blue-300" : "text-gray-500"}>
            {msg.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-row flex-1">
      {/* Left sidebar */}
      <button onClick={getConversations}>HelloWorld</button>
      <div className="flex flex-col h-full w-1/4 overflow-hidden shadow-2xl rounded-4xl">
        <div className="flex-shrink-0 p-4">
          <div className="flex flex-row space-x-2 relative">
            <label
              className="flex flex-col justify-center"
              htmlFor="userSearchBar"
            >
              <FaSearch />
            </label>
            <input
              id="userSearchBar"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start Conversation with..."
            />
          </div>
          <h3 className="mt-3 mb-3">Inbox</h3>
        </div>
        {renderContactList()}
      </div>

      {/* Right chat area */}
      <div className="w-full flex flex-col shadow-2xl rounded-4xl">
        <div
          className={`my-2 p-2 flex items-center ${
            selectedUserAvatar ? "border-b-3" : ""
          }`}
        >
          <img
            src={
              selectedUserAvatar ||
              "https://i0.wp.com/port2flavors.com/wp-content/uploads/2022/07/placeholder-614.png?fit=1200%2C800&ssl=1"
            }
            alt={selectedUserName}
            className="rounded-full w-8 h-8 mr-2"
          />
          <h3>{selectedUserName || "Select a conversation"}</h3>
        </div>

        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="no-scrollbar flex flex-col flex-[4] rounded-2xl p-4 overflow-y-auto "
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.length > 0 ? (
            messages.map(renderMessage)
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Select a conversation to start chatting
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="w-full flex-[1] flex flex-row space-x-6 p-4 relative">
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessageSend();
              }
            }}
            disabled={!selectedUserName}
            className="w-full h-full p-2 border-2 border-solid border-amber-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
            placeholder={
              selectedUserName
                ? "Type a message..."
                : "Select a conversation to chat"
            }
          />
          <button
            onClick={handleMessageSend}
            disabled={!selectedUserName}
            className="grid place-items-center h-12 w-12 bg-blue-500 rounded-2xl cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosSend className="text-2xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
