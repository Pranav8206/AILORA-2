import React from "react";

const Message = ({ message }) => {
  const isUser = message.sender === "user";

  const bubbleClasses = isUser
    ? "bg-[#E2F7CB] self-end ml-12"
    : "bg-white self-start mr-10";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } w-full max-w-full`}
    >
      <div
        className={`relative max-w-sm md:max-w-md lg:max-w-lg rounded-sm border-gray-400 shadow py-1 px-3 m-1 ${bubbleClasses}`}
      >
        <p className="text-xs sm:text-sm text-gray-800 wrap-break-word whitespace-pre-wrap ">
          {message.text}
          <span className="absolute right-1 bottom-0.5 text-[11px] text-gray-400">
            {message.timestamp}
          </span>
          <span className="opacity-0 text-[11px] text-gray-400">
            {message.timestamp}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Message;
