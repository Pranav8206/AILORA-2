import React from "react";
import { ShieldCheck, Brain, HeartPulse } from "lucide-react";

const AboutUs = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-5 sm:py-16 font-sans text-gray-800">
      {/* Hero Section */}
      <section className="text-center mb-10 sm:mb-20">
        <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-green-600 to-cyan-500 bg-clip-text text-transparent mb-4">
          AILORA: AI for a Healthier Future
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering individuals with intelligent health insights for proactive
          wellness and a healthier global community.
        </p>
      </section>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* How it Works */}
        <section className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-green-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-green-600 mb-4">
            <Brain size={48} />
          </div>
          <h3 className="text-2xl font-semibold mb-3">How It Works</h3>
          <p className="text-gray-700 mb-6">
            AILORA uses advanced machine learning to analyze your symptoms and
            history, offering early and accurate disease predictions.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-semibold">1.</span> Input
              Data
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-semibold">2.</span> AI
              Analysis
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-semibold">3.</span> Insights
              & Predictions
            </li>
          </ul>
        </section>

        {/* Vision */}
        <section className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-green-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-green-600 mb-4">
            <HeartPulse size={48} />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Our Moto</h3>
          <p className="text-gray-700 mb-6">
            To make preventive health intelligence accessible to everyone,
            ensuring early detection and informed wellness decisions.
          </p>
          <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600">
            “Early awareness leads to stronger health and brighter futures.”
          </blockquote>
        </section>

        {/* Privacy & Ethics */}
        <section className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-green-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-green-600 mb-4">
            <ShieldCheck size={48} />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Privacy & Ethics</h3>
          <p className="text-gray-700 mb-6">
            Your data is safe with us. AILORA follows strict privacy protocols
            and transparent AI ethics to maintain trust and confidentiality.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span> Data
              Anonymization
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span> End-to-End
              Encryption
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span> Global Privacy
              Compliance
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;
