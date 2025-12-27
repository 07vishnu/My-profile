
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
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
        Querying 16k Node Grid...
      </span>
    </div>
    <div className="grid grid-cols-4 gap-1.5 h-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-full bg-slate-100 rounded-full overflow-hidden relative"
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-shimmer"
            style={{ animationDelay: `${i * 0.15}s`, width: '200%' }}
          ></div>
        </div>
      ))}
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(50%); }
      }
      .animate-shimmer {
        animation: shimmer 1.5s infinite linear;
      }
    `}} />
  </div>
);

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi! I'm Vishnu's AI twin. Want to know about his system admin experience, technical certifications, or how he manages enterprise infrastructure?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await getPersonaResponse(inputValue);
    
    const botMessage: Message = {
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col glass rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-5 bg-indigo-600 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <ICONS.Bot />
              </div>
              <div>
                <p className="font-bold text-sm">Vishnu's AI Twin</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Infra Node: Active</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-2 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm w-[200px]">
                  <ThinkingIndicator />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-5 bg-white border-t border-slate-100">
            <div className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Vishnu's twin a question..."
                className="w-full bg-slate-50 text-slate-900 pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-50"
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
        className="w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 scale-110">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
             <ICONS.Bot />
          )}
        </div>
        
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-white"></span>
           </span>
        )}
        
        {!isOpen && (
           <div className="absolute right-20 bg-slate-900 text-white py-2.5 px-5 rounded-2xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pointer-events-none font-bold text-xs uppercase tracking-widest border border-slate-800">
             Infrastructure Brain Online
           </div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
