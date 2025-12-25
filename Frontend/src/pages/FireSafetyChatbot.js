import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Download } from "lucide-react";

function FireSafetyChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: " Hi! I am FireVision AI Assistant. Ask me anything about fire safety."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  //  Chat session ID (IMPORTANT)
const sessionIdRef = useRef(
  localStorage.getItem("firevision_session") || crypto.randomUUID()
);

useEffect(() => {
  localStorage.setItem("firevision_session", sessionIdRef.current);
}, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load jsPDF library
  useEffect(() => {
    if (typeof window.jspdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Voice Input Handler
  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  // Text-to-Speech Handler
  const speakText = (text) => {
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[🔥🚨📍🧯🏠📋⚠️✅❌💡🚒👨‍🚒📞🏢🔴🟡🟢⭐]/g, '')
      .replace(/[•·]/g, '. ')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Stop Speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // PDF Export Function
  const exportToPDF = () => {
    try {
      // Check if jsPDF is loaded
      if (typeof window.jspdf === 'undefined') {
        alert('PDF library is loading... Please try again in a moment.');
        // Load jsPDF script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
          console.log('jsPDF loaded successfully');
        };
        document.head.appendChild(script);
        return;
      }
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Header with gradient effect (simulated with color)
      doc.setFillColor(255, 90, 0);
      doc.rect(0, 0, 210, 30, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(' FireVision AI - Chat History', 105, 15, { align: 'center' });
      
      // Subtitle
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
      
      let yPosition = 40;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const maxWidth = 180;
      
      messages.forEach((msg, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Message header
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        
        if (msg.role === 'user') {
          doc.setTextColor(255, 90, 0);
          doc.text('You:', margin, yPosition);
        } else {
          doc.setTextColor(220, 38, 38);
          doc.text('FireVision AI:', margin, yPosition);
        }
        
        yPosition += 7;
        
        // Message content
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(50, 50, 50);
        
        // Clean text for PDF
        const cleanText = msg.text
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        
        // Split text into lines
        const lines = doc.splitTextToSize(cleanText, maxWidth);
        
        lines.forEach(line => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        
        yPosition += 8; // Space between messages
        
        // Add separator line
        if (index < messages.length - 1) {
          doc.setDrawColor(255, 165, 0);
          doc.setLineWidth(0.5);
          doc.line(margin, yPosition - 4, 210 - margin, yPosition - 4);
        }
      });
      
      // Footer on last page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `FireVision AI - Fire Safety Assistant | Page ${i} of ${pageCount}`,
          105,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`FireVision-Chat-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Send Message Function
  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    stopSpeaking();

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        message: messageText,
        sessionId: sessionIdRef.current,
        userId: "anonymous" // optional
        })

      });

      const data = await res.json();

      const assistantMessage = {
        role: "assistant",
        text: data.reply
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (autoSpeak) {
        setTimeout(() => speakText(data.reply), 500);
      }

    } catch {
      const errorMessage = {
        role: "assistant",
        text: " AI service is currently unavailable.\nPlease follow basic fire safety:\n• Evacuate immediately\n• Call fire service\n• Use extinguisher if safe"
      };
      setMessages((prev) => [...prev, errorMessage]);

      if (autoSpeak) {
        setTimeout(() => speakText(errorMessage.text), 500);
      }
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

        {/* Header */}
        <div className="px-6 py-4 rounded-t-3xl
          bg-gradient-to-r from-orange-500 to-red-600
          text-white font-bold text-lg shadow-lg
          flex items-center justify-between">
          <span> FireVision AI – Fire Safety Assistant</span>
          
          <div className="flex items-center gap-2">
            {/* PDF Export Button */}
            <button
              onClick={exportToPDF}
              disabled={messages.length <= 1}
              className="flex items-center gap-2 text-sm font-normal bg-white/20 
                px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
              title="Download chat as PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* Auto-Speak Toggle */}
            <button
              onClick={() => {
                setAutoSpeak(!autoSpeak);
                if (!autoSpeak) {
                  stopSpeaking();
                }
              }}
              className="flex items-center gap-2 text-sm font-normal bg-white/20 
                px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all"
              title={autoSpeak ? "Auto-speak ON" : "Auto-speak OFF"}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{autoSpeak ? "Auto-speak" : "Silent"}</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((msg, i) => (
            <div key={i} className="space-y-2">
              <div
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

              {/* Speak Button for Assistant Messages */}
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                    className="text-xs text-orange-400 hover:text-orange-300 
                      flex items-center gap-1 px-2 py-1 rounded 
                      hover:bg-orange-500/10 transition-all"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3 h-3" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-orange-400">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" 
                style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" 
                style={{ animationDelay: "0.2s" }} />
              <span className="text-sm ml-2">AI is analyzing…</span>
            </div>
          )}

          {/* Listening Indicator */}
          {isListening && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl
              bg-gradient-to-r from-blue-500/20 to-purple-500/20 
              border border-blue-500/50 text-blue-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening... Speak now</span>
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" />
                <div className="w-1 h-6 bg-blue-400 rounded-full animate-pulse" 
                  style={{ animationDelay: "0.1s" }} />
                <div className="w-1 h-5 bg-blue-400 rounded-full animate-pulse" 
                  style={{ animationDelay: "0.2s" }} />
                <div className="w-1 h-7 bg-blue-400 rounded-full animate-pulse" 
                  style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 flex gap-3 border-t border-orange-500/20 bg-[#0d0d0d]">
          
          {/* Voice Input Button */}
          <button
            onClick={startVoiceInput}
            disabled={loading}
            className={`p-3 rounded-xl font-bold text-white transition-all
              ${isListening 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105'
              }
              shadow-[0_0_15px_rgba(168,85,247,0.4)]
              disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? "Stop listening" : "Click to speak"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Ask about fire safety, emergencies, precautions..."
            disabled={loading || isListening}
            className="flex-1 px-5 py-3 rounded-xl
              bg-[#121212] text-white placeholder-gray-400
              border border-orange-500/30
              focus:outline-none focus:ring-2 focus:ring-orange-500
              disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-7 py-3 rounded-xl font-bold text-white
              bg-gradient-to-r from-orange-500 to-red-600
              shadow-[0_0_20px_rgba(255,90,0,0.6)]
              hover:scale-105 transition-all disabled:opacity-50
              disabled:cursor-not-allowed">
            {loading ? "..." : "Send"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs py-3 text-gray-400 border-t border-orange-500/20 
          flex items-center justify-center gap-4 flex-wrap">
          <span> Powered by FireVision AI</span>
          {recognitionRef.current && (
            <span className="flex items-center gap-1">
              <Mic className="w-3 h-3" />
              Voice enabled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default FireSafetyChatbot;

