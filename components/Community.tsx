
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_CHAT_MESSAGES, COMMUNITY_LINKS } from '../constants';

const Community: React.FC = () => {
  const [messages, setMessages] = useState(MOCK_CHAT_MESSAGES);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = MOCK_CHAT_MESSAGES[Math.floor(Math.random() * MOCK_CHAT_MESSAGES.length)];
      setMessages(prev => {
        const newMsgs = [...prev, { ...randomMsg, id: Date.now() }];
        if (newMsgs.length > 20) newMsgs.shift();
        return newMsgs;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      {/* Hero Section */}
      <div className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-violet-500"></div>
        <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-800 dark:text-white">
          Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">$CHONK ARMY</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          We are the roundest, loudest, and most bullish community on Solana. 
          Vibe with us, post memes, and watch the charts pump.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Social Links */}
        <div className="space-y-4">
          <a 
            href={COMMUNITY_LINKS.TELEGRAM} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block glass-panel p-6 rounded-3xl hover:bg-blue-500 hover:border-blue-400 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-white/20 flex items-center justify-center text-blue-500 group-hover:text-white text-3xl transition-colors">
                  <i className="fa-brands fa-telegram"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-xl text-slate-800 dark:text-white group-hover:text-white">Telegram Group</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-100">Official Chat • 24/7 Vibes</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 group-hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-white">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </a>

          <a 
            href={COMMUNITY_LINKS.TWITTER} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block glass-panel p-6 rounded-3xl hover:bg-black hover:border-slate-700 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-white/20 flex items-center justify-center text-slate-800 dark:text-white group-hover:text-white text-3xl transition-colors">
                  <i className="fa-brands fa-x-twitter"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-xl text-slate-800 dark:text-white group-hover:text-white">Twitter / X</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-300">Latest Updates & Memes</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 group-hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-white">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </a>

           <a 
            href={COMMUNITY_LINKS.DISCORD} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block glass-panel p-6 rounded-3xl hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-white/20 flex items-center justify-center text-indigo-600 group-hover:text-white text-3xl transition-colors">
                  <i className="fa-brands fa-discord"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-xl text-slate-800 dark:text-white group-hover:text-white">Discord</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-100">Voice Chat & Raids</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/20 group-hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-white">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </a>
        </div>

        {/* Live Chat Simulator */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[400px] border border-violet-100 dark:border-slate-700 shadow-xl">
           <div className="bg-white/80 dark:bg-slate-800/80 p-4 border-b border-violet-100 dark:border-slate-700 flex justify-between items-center backdrop-blur-md">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
               <span className="font-bold text-slate-700 dark:text-white text-sm">LIVE FEED</span>
             </div>
             <span className="text-xs font-bold text-slate-400">4,206 Online</span>
           </div>
           
           <div 
             ref={chatContainerRef}
             className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-black/20"
           >
              {messages.map((msg, idx) => (
                <div key={idx} className="flex gap-3 animate-[fadeIn_0.3s_ease-out]">
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm ${idx % 2 === 0 ? 'bg-violet-400' : 'bg-pink-400'}`}>
                    {msg.user[0]}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                       <span className={`text-xs font-bold ${msg.color}`}>{msg.user}</span>
                       <span className="text-[10px] text-slate-400 opacity-60">Just now</span>
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-r-xl rounded-bl-xl shadow-sm inline-block">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
           </div>
           
           <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
             <div className="flex gap-2">
               <input 
                 disabled
                 placeholder="Join Telegram to chat..." 
                 className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
               />
               <button disabled className="bg-violet-200 dark:bg-slate-700 text-violet-400 dark:text-slate-500 px-4 rounded-xl font-bold text-sm cursor-not-allowed">
                 <i className="fa-solid fa-paper-plane"></i>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
