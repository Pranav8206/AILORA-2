// src/Prediction.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Stethoscope,
  Clock,
  Home,
  ReceiptText,
  ListChevronsUpDown,
} from "lucide-react";
import DisclaimerBox from "../components/DisclaimerBox";
import api from "../api/axios";

const Prediction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.predictionData;
  console.log("res", result);

  const [translatedAnalysis, setTranslatedAnalysis] = useState(null);
  const [loadingLang, setLoadingLang] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-green-50 to-cyan-50 px-4">
        <p className="text-slate-700 text-lg font-medium mb-4">
          No result found. Please run an analysis again.
        </p>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-transform duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    );
  }

  const { symptoms, predictions, detailed_analysis } = result;
  const predictionList = (predictions || []).map((p) => p.disease);
  const extractedSymptoms = Array.isArray(symptoms?.extracted)
    ? symptoms.extracted
    : symptoms.split(", ");
  const analysisToShow = translatedAnalysis || detailed_analysis;

  const handleLangChange = async (lang) => {
    if (!lang) return;
    setLoadingLang(true);
    try {
      const data = await api.post("/api/change-lang", {
        detailed_analysis,
        language: lang,
      });
      if (data.success && data.translated_analysis) {
        setTranslatedAnalysis(data.translated_analysis);
      } else {
        alert("Failed to translate. Please try again.");
      }
    } catch (err) {
      console.error("Language change error:", err);
      alert("Something went wrong while translating.");
    } finally {
      setLoadingLang(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="sm:hidden mb-4">
          <button
            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-600 font-medium transition-colors duration-300"
            onClick={() => navigate(-1)}
          >
            Back to Home
          </button>
        </div>

        <section className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            Analysis Completed
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Based on your symptoms, here are the potential conditions and
            recommendations
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6 transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
              Provided Symptoms
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {extractedSymptoms.length > 0 ? (
              extractedSymptoms.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-700">{symptoms}</p>
            )}
          </div>
        </section>

        {predictionList.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6 transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ReceiptText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                Possible Conditions
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {predictionList.map((disease, idx) => (
                <div
                  key={disease + idx}
                  className="relative bg-linear-to-br from-white to-slate-50 rounded-lg border border-slate-200 p-4 hover:border-green-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 hover:text-green-700 transition-colors">
                      {disease}
                    </h4>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-green-500/10 to-cyan-500/10 rounded-bl-full" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6 transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ListChevronsUpDown className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                Detailed Analysis
              </h3>
            </div>
            <select
              className="border border-slate-300 rounded-lg px-3 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              onChange={(e) => handleLangChange(e.target.value)}
              disabled={loadingLang}
              defaultValue=""
            >
              <option value="" disabled>
                {loadingLang ? "Translating..." : "Change Language"}
              </option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>
          {Array.isArray(analysisToShow) && analysisToShow.length > 0 ? (
            <div className="grid gap-4">
              {analysisToShow.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-base font-semibold text-purple-700">
                      {item["Disease Name"] || "Condition"}
                    </h4>
                    {item.Severity && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.Severity.toLowerCase() === "high"
                            ? "bg-red-100 text-red-700"
                            : item.Severity.toLowerCase() === "moderate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.Severity}
                      </span>
                    )}
                  </div>
                  {item.Description && (
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>Description:</strong> {item.Description}
                    </p>
                  )}
                  {item.Treatment && (
                    <p className="text-sm text-slate-700 mb-2">
                      <strong>Treatment:</strong> {item.Treatment}
                    </p>
                  )}
                  {item["Specialist Recommendation"] && (
                    <p className="text-sm text-slate-700 mb-2 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-green-600" />
                      <strong>Specialist:</strong>{" "}
                      {item["Specialist Recommendation"]}
                    </p>
                  )}
                  {item.Urgency && (
                    <p className="text-sm text-slate-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      <strong>Urgency:</strong> {item.Urgency}
                    </p>
                  )}
                  {item.response && (
                    <p className="text-sm text-slate-700">{item.response}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No detailed analysis available.
            </p>
          )}
        </section>

        {Array.isArray(analysisToShow) &&
          analysisToShow.some((item) => item["Home Remedies"]) && (
            <section className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6 transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                  Home Remedies
                </h3>
              </div>
              <div className="grid gap-4">
                {analysisToShow
                  .filter((item) => item["Home Remedies"])
                  .map((item, i) => (
                    <div
                      key={i}
                      className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <h4 className="text-base font-semibold text-green-700 mb-2">
                        {item["Disease Name"] || "Condition"}
                      </h4>
                      <p className="text-sm text-slate-700">
                        {item["Home Remedies"]}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}

        <DisclaimerBox />

        <div className="flex flex-col sm:flex-row gap-4 justify-center my-6">
          <button
            className="bg-linear-to-r from-green-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-cyan-700 transition-transform duration-300 hover:translate-y-0.5 cursor-pointer"
            onClick={() => navigate("/")}
          >
            New Analysis
          </button>
          <button
            className="border-2 border-slate-300 bg-white px-8 py-3 rounded-lg font-semibold text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-transform duration-300 hover:translate-y-0.5 cursor-pointer"
            onClick={() => window.print()}
          >
            Print Results
          </button>
        </div>
      </main>
    </div>
  );
};

export default Prediction;
