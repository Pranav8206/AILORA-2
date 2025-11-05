import { AlertCircle, ChevronDown } from "lucide-react";
import React, { useState } from "react";

const DisclaimerBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-12 bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 overflow-hidden shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-amber-100/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={24} />
          <h4 className="text-sm sm:text-lg font-bold text-amber-900">
            Important Medical Disclaimer
          </h4>
        </div>
        <ChevronDown
          className={`text-amber-600 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
          size={24}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 text-sm text-amber-900 space-y-3">
          <p className="leading-relaxed">
            <strong>
              AILORA is an AI-powered preliminary health assessment tool
              designed for informational purposes only.
            </strong>{" "}
            It is NOT a substitute for professional medical advice, diagnosis,
            or treatment.
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Always consult with qualified healthcare professionals for any
                health concerns
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                Do not delay seeking medical attention based on AI predictions
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                In case of emergency, immediately contact emergency services
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>AI analysis may contain errors or inaccuracies</span>
            </li>
          </ul>
          <p className="pt-2 text-xs text-amber-800 font-medium">
            By using this tool, you acknowledge that you understand these
            limitations and will seek appropriate medical care.
          </p>
        </div>
      )}
    </div>
  );
};

export default DisclaimerBox;
