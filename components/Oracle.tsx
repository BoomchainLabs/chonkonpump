import React, { useState, useRef, useEffect } from 'react';
import { getOracleResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Oracle: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Greetings, seeker of gains! I am the Chonk Oracle. Ask me about the future, the pump, or show me respect.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getOracleResponse(input);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "The ether is cloudy...", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto glass-panel rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-violet-600 text-xl font-bold">
          <i className="fa-solid fa-crystal-ball"></i>
        </div>
        <div>
          <h2 className="font-bold text-lg">Chonk Oracle</h2>
          <p className="text-xs opacity-80">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-violet-600 text-white rounded-br-none' 
                : 'bg-white border border-violet-100 text-slate-700 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-violet-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-2 items-center">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/80 border-t border-violet-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask if it will pump..."
            className="flex-1 px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Oracle;