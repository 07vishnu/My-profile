
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, USER_DATA } from '../constants';
import { Message } from '../types';
import { getPersonaResponse } from '../services/geminiService';

const ThinkingIndicator = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 animate-pulse">
        Agent Querying Nodes...
      </span>
    </div>
    <div className="grid grid-cols-4 gap-1.5 h-1">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-full bg-slate-100 rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-shimmer"
            style={{ animationDelay: `${i * 0.15}s`, width: '200%' }}
          ></div>
        </div>
      ))}
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(50%); } }
      .animate-shimmer { animation: shimmer 1.5s infinite linear; }
    `}} />
  </div>
);

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "System Online. I am Vishnunath's AI Agent. Ask me about his 16,000-server infrastructure or technical background. If I'm unsure, he will come and reply to you personally.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsgText = inputValue;
    const userMessage: Message = {
      role: 'user',
      text: userMsgText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowHandoff(false);

    const responseText = await getPersonaResponse(userMsgText);
    
    const botMessage: Message = {
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

    // If the response contains the specific handoff trigger phrase
    if (responseText.toLowerCase().includes("he will come and reply")) {
      setShowHandoff(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[600px] flex flex-col glass rounded-[2.5rem] shadow-4xl overflow-hidden border border-white/60 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-6 bg-[#433929] text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#7c6837]">
                <ICONS.Bot />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest text-[#7c6837]">Infra Agent</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                  <p className="text-[9px] font-bold opacity-60 uppercase tracking-tighter text-white">Live Bridge</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#433929] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm w-[200px]">
                  <ThinkingIndicator />
                </div>
              </div>
            )}
            {showHandoff && (
              <div className="animate-in fade-in zoom-in duration-500 pt-2">
                <a 
                  href={USER_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 bg-green-500 text-white rounded-[2rem] text-center shadow-xl hover:bg-green-600 transition-all group active:scale-95"
                >
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <ICONS.WhatsApp />
                    <span className="font-black text-xs uppercase tracking-widest">Bridging to WhatsApp...</span>
                  </div>
                  <p className="text-[10px] font-medium opacity-90">Open chat to receive your personal reply</p>
                </a>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query the Agent..."
                className="w-full bg-[#fbf9f4] text-slate-900 pl-5 pr-14 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7c6837]/20 focus:border-[#7c6837] transition-all text-sm font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#433929] text-white rounded-xl flex items-center justify-center hover:bg-[#7c6837] transition-all disabled:opacity-50"
              >
                <ICONS.Send />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[1.5rem] bg-[#433929] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
      >
        <div className="absolute inset-0 bg-[#7c6837] rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 scale-110">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
             <ICONS.Bot />
          )}
        </div>
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-5 w-5">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c6837] opacity-75"></span>
             <span className="relative inline-flex rounded-full h-5 w-5 bg-[#7c6837] border-4 border-[#fbf9f4]"></span>
           </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
