import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef, useState, useEffect } from "react";
import Message from "../components/Message";
import ContactList from "../components/ContactList";
import { User, ChatMessage, MessageContainers } from "../types";
import { useUser } from "../context/useUser";
import { debounce } from "../utils/debounce";

export default function ChatMessages() {
  // Refs
  const textAreaMessage = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const debouncedFetchUsersRef = useRef<(...args: unknown[]) => void>(() => {}); // Initialize with an empty function

  // State

  const [searchValue, setSearchValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedUserAvatar, setSelectedUserAvatar] = useState("");
  const { user } = useUser(); // Assuming you have a user context or prop
  const [messageContainer, setMessageContainer] = useState<MessageContainers[]>(
    []
  );
  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentChatUser, setCurrentChatUser] = useState("");
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
  const handleMessageSend = async () => {
    console.log("Sending message:", messageValue);
    console.log("Current user ID:", user?.Id);
    console.log("Current chat user:", currentChatUser);

    if (!messageValue.trim()) return;

    setMessageValue("");
    try {
      const url = new URL(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/PrivateChats/Messages`
      );
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user?.Id,
          receiverId: currentChatUser,
          content: messageValue,
          status: "sending",
        }),
      });
      const result = await response.json();
      console.log("Message sent:", result);

      if (result.success) {
        setMessageValue("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setAutoScroll(true);
  };

  const handleContactInbox = async (query: string[]) => {
    try {
      const url = new URL(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/PrivateChats/SearchInbox`
      );

      // Add participants to URL
      query.forEach((id) => url.searchParams.append("participants", id));

      const response = await fetch(url.toString());
      const result = await response.json();

      if (response.ok) {
        const messageHistory: MessageContainers[] = result.InboxSearch.map(
          (msg: {
            Id: string;
            content: string;
            participants: string[];
            sender: string;
            status: string;
          }) => ({
            Id: msg.Id,
            content: msg.content,
            participants: msg.participants,
            sender: msg.sender,
            status: msg.status,
          })
        );

        const transformedMessages = messageHistory.map((msg) => ({
          id: msg.Id, // Convert id to number
          text: msg.content,
          timestamp: new Date().toISOString(), // Adjust this as needed
          sender: msg.sender,
          senderName: selectedUserName,
          senderAvatar: selectedUserAvatar,
          status: msg.status, // Placeholder, replace with actual logic to get avatar
        }));
        setMessageContainer(messageHistory);
        console.log("Current messages:", messages);
        setMessages(transformedMessages); // Log the new messages directly

        return messages;
      } else {
        console.error("Server error:", result.message || result.error);
        return [];
      }
    } catch (err) {
      console.error("Network error:", err);
      return [];
    }
  };
  useEffect(() => {}, [selectedUserAvatar, selectedUserName]);

  useEffect(() => {
    console.log("Updated messageContainer:", messageContainer);
  }, [messageContainer]); // This will log whenever messageContainer changes

  const handleSearchSelect = (User: User) => {
    setSearchValue(User.name);
    setCurrentChatUser(User.Id);
    setSelectedUserName(User.name);
    setSelectedUserAvatar(User.avatar);
    console.log("Selected user:", currentChatUser, User.Id);
    console.log("User ID:", User.Id);
    handleContactInbox([user?.Id || "", User.Id]);
  };

  // Debounced search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
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
      url.searchParams.append("myusername", user?.name || "");

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setSearchOptions(result.users); // depending on your API shape
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Conversation with..."
              />
            </div>
          </div>
          <h3 className="mt-3 mb-3">Inbox</h3>
        </div>

        {/* Contact list */}
        <ContactList
          users={searchOptions}
          currentChatUser={selectedUserName}
          onSelect={handleSearchSelect}
          avatarSize="md"
        />
      </div>

      {/* Right chat area */}
      <div className="w-full flex flex-col shadow-2xl rounded-4xl">
        <div className="my-2 p-2 border-b-3 flex items-center">
          {(() => {
            const chatUser = searchOptions.find(
              (u) => u.name === selectedUserName
            );
            const avatar =
              chatUser?.avatar ||
              "https://www.mediafire.com/view/rl67eqkychubthq";

            return (
              <img
                src={avatar}
                alt={currentChatUser}
                className="rounded-full w-8 h-8 mr-2"
              />
            );
          })()}

          <h3>{selectedUserName}</h3>
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
              isSent={msg.sender === user?.Id}
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
