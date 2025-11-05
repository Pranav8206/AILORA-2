import React, { useState } from "react";
import Message from "../components/Message";
import Input from "../components/Input";
import Header from "../components/ChatHeader";

const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! Welcome to Ailora, your health companion! 🌿💚",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "ai",
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const currentInput = input;
    setInput("");

    const newMessage = {
      id: Date.now(),
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: currentInput,
          messages: messages.map((msg) => ({
            text: msg.text,
            sender: msg.sender,
          })),
        }),
      });

      const data = await response.json();
      const aiResponse =
        data.message || "Oops! Connection took a nap. Try again! 😴";

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: aiResponse,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sender: "ai",
          },
        ]);
      }, 1000);
    } catch (err) {
      console.error("Backend error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Yikes! Ailora's feeling a bit under the weather. Try again later! 😷",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: "ai",
        },
      ]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-2 sm:px-4 font-sans">
      <div className="w-full max-w-3xl h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="sticky top-0 z-10 bg-emerald-600 text-white">
          <Header />
        </div>
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-emerald-50">
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="self-start">
                <div className="bg-emerald-100 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 bg-emerald-50 p-4 sm:p-6">
          <Input
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default Chat;
