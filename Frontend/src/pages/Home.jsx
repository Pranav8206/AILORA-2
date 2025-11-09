// src/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Activity,
  Brain,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Heart,
  Stethoscope,
  Loader2,
  BotMessageSquare,
} from "lucide-react";
import DisclaimerBox from "../components/DisclaimerBox";
import ConfirmationModal from "../components/ConfirmationModal";
import { Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import api from "../api/axios";

const Home = () => {
  const [tab, setTab] = useState("feelings");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState("");
  const [resultModal, setResultModal] = useState(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const stored = localStorage.getItem("familyMembers");
      const members = stored ? JSON.parse(stored) : [];
      setFamilyMembers(members);
    } catch (err) {
      console.error("Failed to parse family members:", err);
      setFamilyMembers([]);
    }
  }, []);

  // Speech-to-Text Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("")
          .trim();
        setInput(text);
      };
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const startSpeech = () => {
    if (!recognitionRef.current) return;
    setInput("");
    setListening(true);
    recognitionRef.current.start();
  };

  const stopSpeech = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  };

  const handleFeelingSubmit = async () => {
    if (!input.trim()) {
      setError("Please describe your feelings or symptoms.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingMessage("Extracting symptoms...");

    try {
      const { data } = await api.post("/api/extract-symptoms", {
        condition: input,
      });

      if (!data.success) throw new Error(data.message || "Extraction failed.");

      if (data.has_valid_symptoms === "false")
        throw new Error(
          data.message || "No valid symptoms found in provided input."
        );

      setInput(data.extracted_symptoms.join(", "));
      setResultModal({
        stage: "extracted",
        input: input,
        extractedSymptoms: data.extracted_symptoms,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleConditionSubmit = async () => {
    if (tab === "conditions" && !input.trim()) {
      setError("Please describe your condition.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingMessage("Analyzing condition...");

    try {
      let profile = null;
      if (selectedMember) {
        profile = familyMembers.find((m) => m.id === selectedMember) || null;
      }

      const { data } = await api.post("/api/predict", {
        symptoms: input,
        user_profile: profile || {},
      });

      if (!data.success) throw new Error("Prediction failed here.");
      if (data.has_valid_symptoms === "false")
        throw new Error(
          data.message || "No valid symptoms found in provided input."
        );

      navigate("/prediction", { state: { predictionData: data } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-gray-50 to-green-100 relative overflow-hidden font-sans">
      {loading && <LoadingOverlay message={loadingMessage} />}
      {resultModal && (
        <ConfirmationModal
          result={resultModal}
          onClose={() => setResultModal(null)}
          onContinue={() => {
            handleConditionSubmit();
            setResultModal(null);
          }}
        />
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/50 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/50 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-200/50 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse -translate-x-1/2 -translate-y-1/2"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-6 border border-slate-200">
            <Sparkles className="text-green-600" size={20} />
            <span className="text-sm font-semibold text-slate-700">
              AI-Powered Health Intelligence
            </span>
          </div>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Advanced symptom analysis powered by AI for preliminary health
            insights
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center rounded-2xl bg-white/80 backdrop-blur-sm py-1 px-1.5 shadow-xl border border-slate-200">
              <button
                onClick={() => {
                  setTab("feelings");
                  setInput("");
                  setError("");
                  if (listening) stopSpeech();
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer group ${
                  tab === "feelings"
                    ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg scale-105"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Heart size={18} className={`${tab === "conditions" && "group-hover:text-green-700 transition-all duration-1000"}`} />
                <span>Share Feelings</span>
              </button>
              <button
                onClick={() => {
                  setTab("conditions");
                  setInput("");
                  setError("");
                  if (listening) stopSpeech();
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer group ${
                  tab === "conditions"
                    ? "bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg scale-105"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Stethoscope size={18} className={`${tab === "feelings" && "group-hover:text-green-700 transition-all duration-1000"} `} />
                <span>Share Conditions</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-2 rounded-2xl border-l-4 border-red-400 bg-red-50 px-3 py-1 text-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <p className="font-semibold text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-8 mb-8">
            <div className="space-y-6">
              {familyMembers.length === 0 ? (
                <div className="text-center">
                  <p className="text-slate-900 mb-3">
                    No family members found.
                  </p>
                  <Link
                    to="/profile"
                    className="text-green-600 hover:underline font-semibold"
                  >
                    Add a family member
                  </Link>
                </div>
              ) : (
                <div>
                  <label className="block text-lg font-bold text-slate-900 mb-3">
                    Select Person
                  </label>
                  <select
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/50 cursor-pointer"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                  >
                    <option value="">Select a family member</option>
                    {familyMembers.map((member) => (
                      <option key={member.id} value={member.id} className="cursor-pointer">
                        {member.id} ({member.age}, {member.gender})
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-500 pl-2">
                    *Don't select for general use cases!
                  </span>
                </div>
              )}
              {tab === "feelings" ? (
                <div className="relative">
                  <label className="block text-lg font-bold text-slate-900 mb-3">
                    Describe Your Feelings
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={listening ? stopSpeech : startSpeech}
                      disabled={!supported}
                      className={`px-2 py-2 flex items-center text-sm font-semibold transition-all duration-300 cursor-pointer ${
                        listening
                          ? "bg-red-100 gap-1 text-red-700 hover:bg-red-200 rounded-full"
                          : "bg-green-100 text-green-700 hover:bg-green-200 rounded-full"
                      } disabled:opacity-50`}
                    >
                      {listening ? (
                        <MicOff size={20} className="animate-pulse" />
                      ) : (
                        <Mic size={26} />
                      )}
                      {listening ? "Listening..." : ""}
                    </button>
                    <p className="text-xs text-slate-500">
                      💡 Tip: Speak naturally, as if talking to a friend
                    </p>
                  </div>
                  <textarea
                    rows={5}
                    placeholder="e.g., I've been feeling really tired lately and have this constant headache. I also feel a bit dizzy when I stand up..."
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-white/50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === "Enter") {
                        e.preventDefault();
                        if (tab === "feelings") handleFeelingSubmit();
                        else handleConditionSubmit();
                      }
                    }}
                  />
                  <div className="absolute bottom-2 right-1 text-xs text-gray-400 rounded-full">Ctl + Enter</div>
                </div>
              ) : (
                <div>
                  <label className="block text-lg font-bold text-slate-900 mb-3">
                    Describe Your Symptoms
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={listening ? stopSpeech : startSpeech}
                      disabled={!supported}
                      className={`px-2 py-2 flex items-center text-sm font-semibold transition-all duration-300 ${
                        listening
                          ? "bg-red-100 gap-1 text-red-700 hover:bg-red-200 rounded-full"
                          : "bg-green-100 text-green-700 hover:bg-green-200 rounded-full"
                      } disabled:opacity-50`}
                    >
                      {listening ? (
                        <MicOff size={20} className="animate-pulse" />
                      ) : (
                        <Mic size={26} />
                      )}
                      {listening ? "Listening..." : ""}
                    </button>
                    <p className="text-xs text-slate-500">
                      💡 Tip: Include intensity, patterns...
                    </p>
                  </div>
                  <textarea
                    rows={5}
                    placeholder="e.g., persistent headache, fever, fatigue, difficulty breathing, chest pain..."
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-white/50"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              )}

              <button
                onClick={() =>
                  tab === "feelings"
                    ? handleFeelingSubmit()
                    : handleConditionSubmit()
                }
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center py-3 bg-green-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 gap-1 duration-300 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Brain size={24} />
                    <span>
                      {tab === "feelings"
                        ? "Extract symptoms & Analyze"
                        : "Analyze with AI"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Activity className="text-green-600" size={20} />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="text-green-600" size={20} />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-lime-600" size={20} />
              <span>Instant Results</span>
            </div>
          </div>

          <DisclaimerBox />

          <Link to={"/chat"}>
            <div className="fixed bottom-4 right-4 z-50 cursor-pointer">
              <button className="p-3 rounded-full shadow-lg bg-white hover:shadow-xl transition-all transform hover:-translate-y-1 outline-none ring-2 ring-green-500 ring-offset-2 cursor-pointer">
                <BotMessageSquare className="w-6 h-6 text-black" />
              </button>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
