import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef, useState, useEffect, useCallback } from "react";
import { Conversation, Messages, userSearch } from "../types";
import { useUser } from "../context/useUser";
import { io } from "socket.io-client";
interface SearchUsersResponse {
  users: userSearch[];
}

export default function ChatMessages() {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const ConversationRef = useRef(false);
  const messagesRef = useRef(true);
  const [showmessages, setshowmessages] = useState<boolean>(false);

  const useClickOutside = (
    ref: React.RefObject<HTMLDivElement | null>,
    callback: () => void
  ) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };

  // Close search when clicking outside
  useClickOutside(searchRef, () => {
    if (isSearch) {
      setisSearch(false);
      setSearchValue(""); // Optional: clear search input
      setSearchUsers([]); // Optional: clear search results
    }
  });
  // State
  const { user } = useUser();
  const [resultConverstaion, setresultConversation] = useState<Conversation[]>(
    []
  );
  const [isSearch, setisSearch] = useState<boolean>(false);
  // const [showmessages, setshowmessages] = useState("");
  const [selectedConversation, setSelectedConversation] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState<userSearch[]>([]);
  const [messageValue, setMessageValue] = useState("");
  const [selectedUserAvatar, setSelectedUserAvatar] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
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

  const getMessage = useCallback(async (query: string) => {
    // Check before making the request
    if (!query || query.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(query)) {
      console.warn("Invalid conversationId, skipping fetch:", query);
      return;
    }

    try {
      const url = new URL(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/auth/PrivateMessages/getMessage`
      );
      url.searchParams.append("conversationId", query);
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorBody = await response.json();
        console.warn("Backend rejected request:", errorBody.message);
        return;
      }

      const result = await response.json();
      setMessages(result.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  const sendMessage = useCallback(async () => {
    if (!messageValue.trim() || !user?.Id || !selectedUserId) return;

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
        // getMessage(selectedConversation);
        setAutoScroll(true);
      }
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }, [messageValue, user?.Id, selectedUserId]);

  useEffect(() => {
    if (user?.Id) {
      if (ConversationRef.current === false) {
        const getConversations = async () => {
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
            if (response.ok) {
              console.log(result.data);
              return result.data;
            }
          } catch (error) {
            console.error("Error fetching conversations:", error);
          }
        };

        getConversations().then(setresultConversation);
      }
    }
    return () => {
      ConversationRef.current = true;
    };
  }, [user?.Id]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.trim().length === 24) {
      getMessage(selectedConversation);
    }
  }, [selectedConversation, getMessage]);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:5000", {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    // Debug connection handlers
    const onConnect = () => {
      console.log("Connected:", socket.id);
      if (user?.Id !== null) {
        socket.emit("test", { userId: user?.Id });
      }
    };

    const test = (data: []) => {
      console.log(data);
    };

    const onDisconnect = (reason: string) => {
      console.log("Disconnected:", reason);
    };

    const onConnectError = (err: Error) => {
      console.error("Connection error:", err);
    };

    const updatedInbox = (updatedConvo: Conversation) => {
      console.log("updated-inbox", updatedConvo);

      setresultConversation((prev) => {
        // Check if conversation already exists
        const existingIndex = prev.findIndex((c) => c.Id === updatedConvo.Id);

        // Create updated conversations array
        const updatedConversations =
          existingIndex >= 0
            ? prev.map((conv, index) =>
                index === existingIndex ? updatedConvo : conv
              )
            : [...prev, updatedConvo];

        // Sort by updatedAt (newest first) and lastMessage time
        return updatedConversations.sort((a, b) => {
          // Get most recent activity time (updatedAt or lastMessage time)
          const aTime = Math.max(
            new Date(a.updatedAt).getTime(),
            a.lastMessage ? new Date(a.updatedAt).getTime() : 0
          );

          const bTime = Math.max(
            new Date(b.updatedAt).getTime(),
            b.lastMessage ? new Date(b.updatedAt).getTime() : 0
          );

          return bTime - aTime; // Descending order (newest first)
        });
      });
    };

    const onNewMessage = (msg: Messages) => {
      setMessages((prev) => [...prev, msg]);
    };

    // Set up listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("new-message", onNewMessage);
    socket.on("updated-inbox", updatedInbox);
    socket.on("test-data-result", test);

    return () => {
      // Clean up all listeners
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("new-message", onNewMessage);
      socket.off("updated-inbox", updatedInbox);
      socket.off("test-data-result", test);

      // Only disconnect if socket is connected
      if (socket.connected) {
        socket.disconnect();
      }
    };
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
  const handleInboxSelect = (c: Conversation) => {
    setshowmessages(true);
    const otherUser = c.participants.find((p) => p._id !== user?.Id);
    setMessages([]);
    setSelectedUserName(otherUser?.name || "Unknown User");
    setSelectedUserAvatar(otherUser?.avatar || "");
    setSelectedUserId(otherUser?._id || "");
    setSelectedConversation(c.Id);
    if (messagesRef.current === false) {
      getMessage(selectedConversation);
    }

    // setMessages([
    //   {
    //     id: "1",
    //     text: `Hello there! This is the start of your conversation with ${user.participants[1].name}`,
    //     timestamp: new Date(),
    //     isSent: false,
    //     senderName: user.participants[1].name,
    //     senderAvatar: user.participants[1].avatar,
    //   },
    // ]);
    setAutoScroll(true);
    setSearchUsers([]);
    setSearchValue("");
    return () => {
      messagesRef.current = true;
    };
  };

  const handleSearchSelect = (user: userSearch) => {
    setSelectedUserName(user.name);
    setSelectedUserAvatar(user.avatar);
    setSelectedUserId(user.Id);
    setshowmessages(true);
    setMessages([]);
    setAutoScroll(true);
    setSearchUsers([]);
    setSearchValue("");
  };

  // Render contact list
  const renderContactList = () => {
    // Check if resultConversation is null or empty
    if (!resultConverstaion || resultConverstaion.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
          <FaSearch className="text-2xl mb-2" />
          <p>Search to start a conversation with someone</p>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto">
        {resultConverstaion.map((c: Conversation) => {
          const otherUser = c.participants.find((p) => p._id !== user?.Id);

          return (
            <div
              key={c.Id}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleInboxSelect(c)}
            >
              <img
                src={otherUser?.avatar || "/default-avatar.png"}
                alt={otherUser?.name || "User"}
                className="rounded-full w-10 h-10 mr-3 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {otherUser?.name || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  @{otherUser?.username || "unknown"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render contact list
  const renderSearchList = () => (
    <div className="overflow-y-auto">
      {searchUsers && searchUsers.length > 0 ? (
        searchUsers.map((user) => (
          <div
            key={user.Id}
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              handleSearchSelect(user);
              setisSearch((prev) => !prev);
            }}
          >
            <img
              src={user.avatar || "/default-avatar.png"} // Fallback for missing avatar
              alt={user.name}
              className="rounded-full w-10 h-10 mr-3 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
            <div className="min-w-0">
              {" "}
              {/* Prevent text overflow */}
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">@{user.username}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No results found</div>
      )}
    </div>
  );

  // Render individual message
  const renderMessage = (msg: Messages) => (
    <div
      className={`flex my-2 ${
        msg.sender === user?.Id ? "justify-end" : "justify-start"
      }`}
      key={msg.Id}
    >
      {!(msg.sender === user?.Id) && (
        <img
          src={selectedUserAvatar}
          alt={selectedUserName}
          className="rounded-full w-8 h-8 mr-2"
        />
      )}
      <div className={`max-w-[70%]`}>
        {!(msg.sender === user?.Id) && (
          <span className="text-xs text-gray-500 mb-1">{selectedUserName}</span>
        )}
        <div
          className={`rounded-2xl p-3 break-words ${
            msg.sender === user?.Id
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {msg.content}
        </div>
        <div
          className={`flex items-center mt-1 text-xs ${
            msg.sender === user?.Id ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={
              msg.sender === user?.Id ? "text-blue-300" : "text-gray-500"
            }
          >
            {new Date(msg.createdAt).toLocaleTimeString([], {
              day: "2-digit",
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
      <div
        className="flex flex-col h-full w-1/4 overflow-hidden shadow-2xl rounded-4xl"
        ref={searchRef}
      >
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
              autoComplete="off"
              onClick={() => setisSearch((prev) => !prev)}
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start Conversation with..."
            />
          </div>
          <h3 className="mt-3 mb-3">Inbox</h3>
        </div>
        {isSearch ? renderSearchList() : renderContactList()}
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
          {messages.length > 0 && showmessages ? (
            messages.map((msg) => renderMessage(msg))
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
