import { FC } from "react";

interface MessageProps {
  text: string;
  timestamp: Date;
  isSent: boolean;
  senderName?: string;
  senderAvatar?: string;
}

const Message: FC<MessageProps> = ({
  text,
  timestamp,
  isSent,
  senderName,
  senderAvatar,
}) => {
  const timeString = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex my-2 ${isSent ? "justify-end" : "justify-start"}`}>
      {!isSent && senderAvatar && (
        <img
          src={senderAvatar}
          alt={senderName || "Sender"}
          className="rounded-full w-8 h-8 mr-2"
        />
      )}

      <div className={`flex flex-col max-w-[70%]`}>
        {!isSent && senderName && (
          <span className="text-xs text-gray-500 mb-1">{senderName}</span>
        )}

        <div
          className={`rounded-2xl p-3 break-words ${
            isSent ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {text} {/* Changed from content to text */}
        </div>

        <div
          className={`flex items-center mt-1 text-xs ${
            isSent ? "justify-end" : "justify-start"
          }`}
        >
          <span className={isSent ? "text-blue-300" : "text-gray-500"}>
            {timeString}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
