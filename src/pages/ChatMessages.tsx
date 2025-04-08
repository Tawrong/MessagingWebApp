import { FaSearch } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { useRef } from "react";
export default function ChatMessages() {
  const textAreaMessage = useRef<HTMLTextAreaElement>(null);
  const handleMessageSend = () => {
    console.log("Message Sent", textAreaMessage.current?.value);
  };
  return (
    <div className="h-full flex flex-row flex-1">
      <div className="flex flex-col h-full w-1/4 bg-emerald-500 overflow-hidden">
        {/* Fixed header section */}
        <div className="flex-shrink-0 p-4">
          <div className="flex flex-row space-x-2">
            <label
              className="flex flex-col justify-center"
              htmlFor="userSearchBar"
            >
              <FaSearch />
            </label>
            <input
              name="userSearchBar"
              id="userSearchBar"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start Conversation with..."
            />
          </div>
          <h3 className="mt-3 mb-3">Inbox</h3>
        </div>

        {/* Scrollable content area */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-4">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="py-2">
              Name image {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col ">
        {/* Conversation Messages */}
        <div className="no-scrollbar flex flex-col flex-[4] rounded-2xl p-4 overflow-y-scroll ">
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
        {/* Message Send input */}
        <div className="w-full flex-[1]  flex flex-row space-x-6">
          <textarea className="flex-[4] flex items-start resize-none border-2 border-solid border-amber-600" />
          <div
            onClick={handleMessageSend}
            className="grid place-items-center h-12 w-12 bg-blue-500 rounded-2xl cursor-pointer"
          >
            <IoIosSend className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
