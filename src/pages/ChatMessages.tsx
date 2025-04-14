import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Message from "../components/Message";
import ContactList from "../components/ContactList";
import { User, ChatMessage, Participants } from "../types";
import { useUser } from "../context/useUser";
import { debounce } from "../utils/debounce";

export default function ChatMessages() {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [searchValue, setSearchValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedUserAvatar, setSelectedUserAvatar] = useState("");
  const [participantsConvo, setParticipantsConvo] = useState<Participants[]>(
    []
  );
  const { user } = useUser();
  const [selectedUserName, setSelectedUserName] = useState("");
  const [currentChatUser, setCurrentChatUser] = useState("");
  const [searchOptions, setSearchOptions] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Scroll handling
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    setAutoScroll(scrollHeight - scrollTop <= clientHeight + 10);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Message handling
  const handleMessageSend = useCallback(async () => {
    if (!messageValue.trim() || !user?.Id || !currentChatUser) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/PrivateChats/Messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: user.Id,
            receiverId: currentChatUser,
            content: messageValue,
            status: "sending",
          }),
        }
      );

      if (response.ok) {
        setMessageValue("");
        setAutoScroll(true);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }, [messageValue, user?.Id, currentChatUser]);

  const handleContactInbox = useCallback(
    async (participantIds: string[]) => {
      try {
        const url = new URL(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/auth/PrivateChats/SearchInbox`
        );
        participantIds.forEach((id) =>
          url.searchParams.append("participants", id)
        );

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch inbox");

        const result = await response.json();
        type InboxMessage = {
          Id: string;
          content: string;
          sender: string;
          status: string;
        };

        const transformedMessages = result.InboxSearch.map(
          (msg: InboxMessage) => ({
            id: msg.Id,
            text: msg.content,
            timestamp: new Date().toISOString(),
            sender: msg.sender,
            senderName: selectedUserName,
            senderAvatar: selectedUserAvatar,
            status: msg.status,
          })
        );

        setMessages(transformedMessages);
      } catch (err) {
        console.error("Error fetching inbox:", err);
      }
    },
    [selectedUserName, selectedUserAvatar]
  );

  const handleSearchSelect = useCallback(
    (selectedUser: User) => {
      if (!user?.Id) return;

      setSearchValue(selectedUser.name);
      setCurrentChatUser(selectedUser.Id);
      setSelectedUserName(selectedUser.name);
      setSelectedUserAvatar(selectedUser.avatar);
      handleContactInbox([user.Id, selectedUser.Id]);
    },
    [user?.Id, handleContactInbox]
  );

  const fetchUsers = useCallback(
    async (query: string) => {
      if (!user?.name) return;

      try {
        const url = new URL(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/PrivateChats/searchUser`
        );
        url.searchParams.append("username", query);
        url.searchParams.append("myusername", user.name);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch users");

        const result = await response.json();
        setSearchOptions(result.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    [user?.name]
  );

  // Properly typed debounced function
  const debouncedFetchUsers = useMemo(
    () => debounce(fetchUsers, 1000),
    [fetchUsers]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      debouncedFetchUsers(value);
    },
    [debouncedFetchUsers]
  );

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [autoScroll, messages, scrollToBottom]);

  const Inbox = useCallback(async (query: string) => {
    try {
      const url = new URL(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/PrivateChats/OnstartInbox`
      );
      url.searchParams.append("userId", query);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        const userData = result.InboxSearch.map((msg: Participants) => ({
          Id: msg.Id,
          content: msg.content,
          sender: msg.sender,
          participants: msg.participants,
          status: msg.status,
          createdAt: msg.createdAt,
        }));
        setParticipantsConvo(userData);
        console.log("Updated convo:", userData); // Log here instead
      } else {
        console.log("No Message Found");
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }, []);

  useEffect(() => {
    if (user?.Id) {
      Inbox(user.Id);
    }
  }, [user?.Id, Inbox]); // Remove participantsConvo from dependencies
  return (
    <div className="h-full flex flex-row flex-1">
      {/* Left sidebar */}
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

        <ContactList
          users={searchOptions}
          currentChatUser={selectedUserName}
          onSelect={handleSearchSelect}
          avatarSize="md"
          conversations={participantsConvo} // Pass your conversation data here
        />
      </div>

      {/* Right chat area */}
      <div className="w-full flex flex-col shadow-2xl rounded-4xl">
        <div className="my-2 p-2 border-b-3 flex items-center">
          <img
            src={
              selectedUserAvatar ||
              "https://www.mediafire.com/view/rl67eqkychubthq"
            }
            alt={currentChatUser}
            className="rounded-full w-8 h-8 mr-2"
          />
          <h3>{selectedUserName}</h3>
        </div>

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
            className="w-full h-full p-2 border-2 border-solid border-amber-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Type a message..."
          />
          <button
            onClick={handleMessageSend}
            className="grid place-items-center h-12 w-12 bg-blue-500 rounded-2xl cursor-pointer hover:bg-blue-600 transition-colors"
          >
            <IoIosSend className="text-2xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
