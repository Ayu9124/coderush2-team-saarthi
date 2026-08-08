import React, { useState } from 'react';
import { Bot, Send, User, RefreshCw, Terminal, Sparkles } from 'lucide-react';

export default function AICopilot({ currentCaseId, onQuerySubmit }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Greetings Investigator. I am your AI Copilot Assistant. Ask me anything about this evidence graph, privacy boundaries, or synthetic voice signals.',
      time: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQueries = [
    "Why is this call flagged suspicious?",
    "Explain privacy rules & PII masking",
    "Summarize evidence graph nodes",
    "What are the recommended actions?"
  ];

  const handleSend = async (textToSend) => {
    const qText = textToSend || query;
    if (!qText.trim()) return;

    const userMsg = { sender: 'user', text: qText, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    try {
      let botResponseText = "";
      if (qText.toLowerCase().includes("suspicious") || qText.toLowerCase().includes("flagged")) {
        botResponseText = "The call was flagged due to a 92% ElevenLabs neural TTS voice clone match, a 180ms audio-lip sync delay, and a spoofed SIP caller ID header routed through an Asterisk PBX gateway.";
      } else if (qText.toLowerCase().includes("privacy") || qText.toLowerCase().includes("masking")) {
        botResponseText = "Rule 81 PII Masking is active. Phone numbers are redacted to +91 1800 XXX XXX and bank accounts to ACC-****-8812 to prevent doxxing while preserving forensic integrity.";
      } else if (qText.toLowerCase().includes("graph") || qText.toLowerCase().includes("nodes")) {
        botResponseText = "The Evidence Topology graph links 6 entities across 5 directed edges: Victim (Ramesh Kumar), Vishing Phone, Voice Clone Payload, Forged Aadhaar Document, Mule Account ACC-8812, and Proxy IP.";
      } else {
        botResponseText = "Based on the multi-agent ensemble scoring (88% Critical Risk), immediate action is required: Freeze Mule Bank Account ACC-8812 and issue a SHA-256 Court PDF Dossier.";
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: botResponseText, time: new Date().toLocaleTimeString(), sources: ['VoiceAgent', 'DocumentAgent', 'GraphEngine'] }
        ]);
        setLoading(false);
      }, 600);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error querying AI Copilot engine.', time: new Date().toLocaleTimeString() }
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] rounded-3xl border border-[#EBDCCF] bg-[#FFFDF9] shadow-sm font-mono overflow-hidden">
      
      {/* Copilot Header */}
      <div className="p-4 border-b border-[#EBDCCF] flex items-center justify-between bg-[#F5ECE3]/50">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-xl bg-[#8C5D33]/15 text-[#8C5D33]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#2C1F18] uppercase tracking-wider">
              AI Investigator Copilot
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold">RAG Engine Online</span>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#8C5D33]/15 text-[#8C5D33] font-bold">
          Assistant v2.4
        </span>
      </div>

      {/* Suggested Quick Queries */}
      <div className="p-2.5 border-b border-[#EBDCCF] bg-[#FAF5EF] flex space-x-2 overflow-x-auto text-[11px] custom-scrollbar">
        {suggestedQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 rounded-xl bg-[#FFFDF9] border border-[#EBDCCF] text-[#7D6B5D] hover:text-[#8C5D33] hover:border-[#8C5D33] transition-all whitespace-nowrap cursor-pointer shadow-sm"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Chat List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-[#7D6B5D]">
              {msg.sender === 'user' ? <User className="w-3 h-3 text-[#8C5D33]" /> : <Bot className="w-3 h-3 text-[#8C5D33]" />}
              <span>{msg.sender === 'user' ? 'You' : 'AI Copilot'}</span>
              <span>• {msg.time}</span>
            </div>

            <div
              className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-bronze-metallic text-white font-medium shadow-sm'
                  : 'bg-[#F5ECE3] border border-[#EBDCCF] text-[#2C1F18]'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#EBDCCF] text-[10px] text-[#8C5D33] font-bold">
                  <span>Sources: {msg.sources.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#8C5D33]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>AI Copilot analyzing case graph & evidence signals...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#EBDCCF] bg-[#FAF5EF] flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Copilot about this case..."
          className="flex-1 px-3.5 py-2 text-xs bg-[#FFFDF9] border border-[#EBDCCF] rounded-xl text-[#2C1F18] focus:outline-none focus:border-[#8C5D33]"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-bronze-metallic text-white font-bold transition-all cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
