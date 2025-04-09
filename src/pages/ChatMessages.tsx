import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef, useState, useEffect } from "react";

export default function ChatMessages() {
  const textAreaMessage = useRef<HTMLTextAreaElement>(null);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  const searchOptions = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
  ];

  const handleMessageSend = () => {
    console.log("Message Sent", messageValue);
    setMessageValue("");
  };

  const handleSearchSelect = (option: string) => {
    setSearchValue(option);
    setShowSearchOptions(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown")) {
        setShowSearchOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={() => setShowSearchOptions(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Conversation with..."
              />
              {showSearchOptions && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg dropdown">
                  {searchOptions
                    .filter((option) =>
                      option.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((option) => (
                      <div
                        key={option}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleSearchSelect(option)}
                      >
                        {option}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <h3 className="mt-3 mb-3">Inbox</h3>
        </div>

        {/* Contact list */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="py-2">
              Name image {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Right chat area */}
      <div className="w-full flex flex-col shadow-2xl rounded-4xl">
        <div className="my-2 p-2 border-b-3">Image Username</div>

        {/* Messages */}
        <div className="no-scrollbar flex flex-col flex-[4] rounded-2xl p-4 overflow-y-scroll">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`flex my-2 ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={
                  i % 2 === 0
                    ? "bg-pink-300 rounded-2xl p-2 max-w-[40%] break-words"
                    : "bg-blue-300 rounded-2xl p-2 max-w-[40%] break-words"
                }
              >
                Hello putang ina mo ka hayop kang animal ka letche ka burat
                puking ina mo kang hayop ka i need trabaho na hahahahahahahha{" "}
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="w-full flex-[1] flex flex-row space-x-6 p-4 relative">
          <div className="flex-[4] relative">
            <textarea
              ref={textAreaMessage}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="w-full h-full p-2 border-2 border-solid border-amber-600 rounded-lg resize-none"
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
