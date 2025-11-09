import React from "react";

const ConfirmationModal = ({ result, onClose, onContinue }) => {
  if (!result) return null;
  console.log("result", result);

  const { stage } = result;

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center">
        {stage === "extracted" && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Symptoms Extracted
            </h2>
            <p className="text-slate-600">
              <strong>Your Input:</strong> {result.input}
            </p>
            <p className="text-slate-600 mt-2">
              <strong>Extracted Symptoms:</strong>{" "}
              {result.extractedSymptoms.join(", ")}
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-slate-900"
              >
                Close
              </button>
              <button
                onClick={() => onContinue(result.extractedSymptoms)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {stage === "prediction" && (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Prediction Results
            </h2>
            {result.prediction.predictions.map((p, i) => (
              <div key={i} className="mb-2 text-slate-600">
                <p>
                  <strong>{p.disease}</strong> — Confidence:{" "}
                  {(p.confidence * 100).toFixed(2)}%
                </p>
              </div>
            ))}
            <p className="text-slate-600 mt-3">
              <strong>Detailed Analysis:</strong>{" "}
              {result.prediction.detailed_analysis}
            </p>
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;
