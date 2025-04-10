import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";

export default function GlobalChats() {
  const [message, setMessage] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setAutoScroll(atBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [autoScroll, message]); // Added message as dependency

  useEffect(() => {
    scrollToBottom();
  }, []);

  const clickme = () => {
    alert(message);
    setMessage(""); // Clear input after sending
    setAutoScroll(true); // Force scroll to bottom on new message
  };

  return (
    <div className="flex flex-col w-1/2 h-full justify-self-center shadow-2xl p-4">
      <h2 className="my-2">Global Chats</h2>

      {/* Messages Container - Ref goes here! */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-[10] p-4 overflow-y-auto no-scrollbar"
      >
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`flex my-4 space-x-2`}>
            <img
              className="rounded-full w-8 h-8 flex"
              src="https://scontent.xx.fbcdn.net/v/t39.30808-6/450870282_1933803097108677_2440805029072456058_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGT0WjemAj51V1sPQNNryQhSqGrJVENwH9KoaslUQ3Af24SA4hZ7Ahl3y3-4Z8m1Ij4_ofepVOu6JzvbeesRq6s&_nc_ohc=h1gOon8H068Q7kNvwER1trR&_nc_oc=AdkWmjI5M9-Y3Mi84Q8txRnRho9p8n52NnDQhtayHvenO0L_iP60teDhkiaWnPMJYMw&_nc_zt=23&_nc_ht=scontent.xx&_nc_gid=5Il0uh1GibgQTOpqmZN1Gw&oh=00_AfGt9BnE_rf4TaiNSBU94UvR6rppPJAKTXw_Kq52ZAThAg&oe=67FB2853"
              alt=""
            />
            <span
              className={`flex flex-row rounded-2xl p-2 max-w-[70%] text-sm break-words ${
                i % 2 === 0 ? "bg-pink-300 " : "bg-blue-300"
              }`}
            >
              Hello putang ina mo ka hayop kang animal ka letche ka burat puking
              ina mo kang hayop ka i need trabaho na hahahahahahahha {i + 1}
            </span>
          </div>
        ))}
        {/* Scroll anchor - must be inside container at the end */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Send input */}
      <div className="flex-[2] flex flex-row p-4 shadow-2xl">
        <textarea
          className="flex-[8] resize-none"
          name="InputMessage"
          id="InputMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && clickme()}
          placeholder="Type a message..."
        ></textarea>
        <div
          className="flex-[1] cursor-pointer flex items-center justify-center rounded-full resize-none bg-blue-500"
          onClick={clickme}
        >
          <IoIosSend className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );
}
