// Input.jsx
import React from "react";
import { Send, Smile } from "lucide-react";

const Input = ({ input, setInput, onSend, isLoading }) => {
  return (
    <div className="px-3 py-3 flex items-center justify-center border-t border-emerald-200">
      <div className="w-[80%] flex items-center bg-white rounded-full px-4 py-2 shadow-sm ring-1 ring-emerald-200 focus-within:ring-2 focus-within:ring-emerald-600 transition">
        <Smile className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isLoading && onSend()}
          placeholder="Ask about your health..."
          className="flex-1 focus:outline-none text-sm sm:text-base ml-3 text-gray-700 placeholder:text-gray-400"
        />
      </div>
      <button
        onClick={() => !isLoading && onSend()}
        disabled={isLoading || !input.trim()}
        className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 cursor-pointer text-white rounded-full p-3 ml-2 disabled:bg-emerald-900 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Input;
