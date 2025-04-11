import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef, useState, useEffect } from "react";
import Message from "../components/Message";
import ContactList from "../components/ContactList";
import { User, ChatMessage } from "../types";
import { useUser } from "../context/useUser";
import { debounce } from "../utils/debounce";

export default function ChatMessages() {
  // Refs
  const textAreaMessage = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const debouncedFetchUsersRef = useRef<(...args: unknown[]) => void>(() => {}); // Initialize with an empty function

  // State

  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const { user } = useUser(); // Assuming you have a user context or prop
  const [currentChatUser, setCurrentChatUser] = useState("");
  const userData = user?.name;
  const [searchOptions, setSearchOptions] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Scroll handling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setAutoScroll(atBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [autoScroll, messages]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Message handling
  const handleMessageSend = () => {
    if (!messageValue.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: messageValue,
      timestamp: new Date().toISOString(),
      sender: "me",
    };

    setMessages([...messages, newMessage]);
    setMessageValue("");
    setAutoScroll(true);

    // Auto-reply simulation
    if (Math.random() > 0.3) {
      setTimeout(() => {
        const replies = [
          "That's interesting!",
          "I see what you mean.",
          "Tell me more about that.",
          "Thanks for letting me know!",
          "I agree with you.",
        ];
        const replyMessage: ChatMessage = {
          id: messages.length + 2,
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toISOString(),
          sender: "other",
          senderName: currentChatUser,
          senderAvatar: searchOptions.find((u) => u.name === currentChatUser)
            ?.avatar,
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  // Contact selection
  const handleSearchSelect = (user: User) => {
    setSearchValue(user.name);
    setCurrentChatUser(user.name);
    setShowSearchOptions(false);

    console.log("Selected user:", currentChatUser, user.Id);
    console.log("Selected user:", user.name);
    console.log("User avatar:", user.avatar);
    console.log("User ID:", user.Id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setShowSearchOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setShowSearchOptions(true);
    if (debouncedFetchUsersRef.current) {
      debouncedFetchUsersRef.current(value); // Use the ref to call the debounced function
    }
  };

  // Function to fetch users
  const fetchUsers = async (query: string) => {
    try {
      const url = new URL(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/PrivateChats/searchUser`
      );

      // Add query parameters
      url.searchParams.append("username", query);
      url.searchParams.append("myusername", userData || "");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setSearchOptions(result.users); // depending on your API shape

      console.log("Fetched users:", result.users);
      console.log("Fetching users with query:", user?.name);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Initialize debounce effect
  useEffect(() => {
    if (user?.name) {
      debouncedFetchUsersRef.current = debounce((...args: unknown[]) => {
        const query = args[0] as string; // Cast the first argument to string
        fetchUsers(query);
      }, 1000); // Delay of 1 second
    }
  }, []);

  return (
    <div className="h-full flex flex-row flex-1">
      {/* Left sidebar */}
      <div className="flex flex-col h-full w-1/4 overflow-hidden shadow-2xl rounded-4xl">
        {/* Search header */}
        <div className="flex-shrink-0 p-4">
          <div className="flex flex-row space-x-2 relative">
            <label
              className="flex flex-col justify-center"
              htmlFor="userSearchBar"
            >
              <FaSearch />
            </label>

            <div className="flex flex-col flex-1">
              <input
                name="userSearchBar"
                id="userSearchBar"
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onClick={() => setShowSearchOptions(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Conversation with..."
              />
              {showSearchOptions && Array.isArray(searchOptions) && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dropdown">
                  {searchOptions
                    .filter((option) =>
                      option.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((option) => (
                      <div
                        key={option.Id}
                        className="p-2 hover:bg-gray-200 cursor-pointer flex items-center"
                        onClick={() => handleSearchSelect(option)}
                      >
                        <img
                          src={option.avatar}
                          alt={option.name}
                          className="rounded-full w-8 h-8 mr-2"
                        />
                        <span>{option.name}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <h3 className="mt-3 mb-3">Inbox</h3>
        </div>

        {/* Contact list */}
        <ContactList
          users={searchOptions}
          currentChatUser={currentChatUser}
          onSelect={handleSearchSelect}
          avatarSize="md"
        />
      </div>

      {/* Right chat area */}
      <div className="w-full flex flex-col shadow-2xl rounded-4xl">
        <div className="my-2 p-2 border-b-3 flex items-center">
          {(() => {
            const chatUser = searchOptions.find(
              (u) => u.name === currentChatUser
            );
            const avatar =
              chatUser?.avatar ||
              "https://randomuser.me/api/portraits/men/1.jpg";

            return (
              <img
                src={avatar}
                alt={currentChatUser}
                className="rounded-full w-8 h-8 mr-2"
              />
            );
          })()}

          <h3>{currentChatUser}</h3>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="no-scrollbar flex flex-col flex-[4] rounded-2xl p-4 overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((msg) => (
            <Message
              key={msg.id}
              text={msg.text}
              timestamp={new Date(msg.timestamp)}
              isSent={msg.sender === "me"}
              senderName={msg.senderName}
              senderAvatar={msg.senderAvatar}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="w-full flex-[1] flex flex-row space-x-6 p-4 relative">
          <div className="flex-[4] relative">
            <textarea
              ref={textAreaMessage}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleMessageSend();
                }
              }}
              className="w-full h-full p-2 border-2 border-solid border-amber-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Type a message..."
            />
          </div>
          <div
            onClick={handleMessageSend}
            className="grid place-items-center h-12 w-12 bg-blue-500 rounded-2xl cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <IoIosSend className="text-2xl text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
