import { Loader2 } from "lucide-react";
import React from "react";

const LoadingOverlay = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center">
        <div className="mb-6">
          {/* Accent color changed to green */}
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{message}</h3>
        <p className="text-slate-600">
          Please wait while we process your information...
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {/* Dots color changed to green */}
          <div
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
