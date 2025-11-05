// Header.jsx
import React from "react";
import { BotMessageSquare, MoreVertical } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-linear-to-r from-emerald-600 to-emerald-700 sticky top-0 h-16 z-50 flex items-center justify-between px-4 py-3 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 bg-white border-black/80 shadow-md cursor-pointer flex items-center justify-center">
          <BotMessageSquare className="w-7 h-7 text-black" />
        </div>

        <div>
          <h1 className="text-white font-semibold text-lg">Ailora</h1>
          <p className="text-emerald-100 text-xs flex items-center space-x-1">
            <span className="inline-block w-2 h-2 z-10 bg-green-400 rounded-full animate-pulse"></span>
            <span>Online</span>
          </p>
        </div>
      </div>

      <div className="relative">
        <MoreVertical className="w-6 h-6 text-white hover:text-emerald-200" />
      </div>
    </header>
  );
};

export default Header;
