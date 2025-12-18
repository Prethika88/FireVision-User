import React, { useState, useEffect, useRef } from "react";

function FireSafetyChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: " Hi! I am FireVision AI Assistant. Ask me anything about fire safety."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            " AI service is currently unavailable.\nPlease follow basic fire safety:\n• Evacuate immediately\n• Call fire service\n• Use extinguisher if safe"
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4
      bg-gradient-to-br from-black via-[#0b0b0b] to-[#1a0c05]">

      <div className="w-full max-w-4xl h-[85vh]
        rounded-3xl flex flex-col
        bg-gradient-to-b from-[#0f0f0f] to-[#090909]
        border border-orange-500/20 shadow-[0_0_30px_rgba(255,90,0,0.35)]">

        {/*  Header */}
        <div className="px-6 py-4 rounded-t-3xl
          bg-gradient-to-r from-orange-500 to-red-600
          text-white font-bold text-lg shadow-lg">
           FireVision AI – Fire Safety Assistant
        </div>

        {/*  Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-5 py-4 rounded-2xl
                text-sm leading-relaxed whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-[#121212] text-gray-200 border border-orange-500/20"
                }`}
            >
              {msg.text}
            </div>
          ))}

          {/*  Typing */}
          {loading && (
            <div className="flex items-center gap-2 text-orange-400">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200" />
              <span className="text-sm ml-2">AI is analyzing…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/*  Input */}
        <div className="p-4 flex gap-3 border-t border-orange-500/20 bg-[#0d0d0d]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Ask about fire safety, emergencies, precautions..."
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-xl
              bg-[#121212] text-white placeholder-gray-400
              border border-orange-500/30
              focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-7 py-3 rounded-xl font-bold text-white
              bg-gradient-to-r from-orange-500 to-red-600
              shadow-[0_0_20px_rgba(255,90,0,0.6)]
              hover:scale-105 transition-all disabled:opacity-50">
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/*  Footer */}
        <div className="text-center text-xs py-3 text-gray-400 border-t border-orange-500/20">
           Powered by FireVision Backend AI
        </div>
      </div>
    </div>
  );
}

export default FireSafetyChatbot;
