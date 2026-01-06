
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, USER_DATA } from '../constants';
import { Message } from '../types';
import { getPersonaResponse, GeminiResult } from '../services/geminiService';

const ThinkingIndicator = ({ type = 'thinking' }: { type?: 'thinking' | 'searching' }) => {
  const isThinking = type === 'thinking';
  const accentColor = isThinking ? 'bg-indigo-500' : 'bg-blue-500';
  const textColor = isThinking ? 'text-indigo-600' : 'text-blue-600';
  
  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
           <div className={`absolute inset-0 rounded-full ${accentColor} opacity-10 animate-ping`}></div>
           <div className={`relative z-10 w-4 h-4 rounded-full ${accentColor} shadow-[0_0_15px_rgba(0,0,0,0.1)] flex items-center justify-center`}>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
           </div>
           <div className="absolute inset-0 animate-spin-slow">
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${accentColor} opacity-40 blur-[1px]`}></div>
           </div>
           <div className="absolute inset-0 animate-spin-reverse-slow">
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${accentColor} opacity-30 blur-[1px]`}></div>
           </div>
           <div className={`absolute inset-0 border border-dashed rounded-full ${isThinking ? 'border-indigo-200' : 'border-blue-200'} opacity-50 animate-spin-very-slow`}></div>
        </div>
        
        <div className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${textColor} drop-shadow-sm`}>
            {isThinking ? 'Pro Deep Reasoning' : 'Global Web Retrieval'}
          </span>
          <div className="flex items-center gap-2 mt-1">
             <div className="flex gap-0.5">
                <span className={`w-1 h-1 rounded-full ${accentColor} animate-bounce`} style={{ animationDelay: '0s' }}></span>
                <span className={`w-1 h-1 rounded-full ${accentColor} animate-bounce`} style={{ animationDelay: '0.1s' }}></span>
                <span className={`w-1 h-1 rounded-full ${accentColor} animate-bounce`} style={{ animationDelay: '0.2s' }}></span>
             </div>
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
               {isThinking ? 'Processing Infrastructure Logic' : 'Accessing External Tech Nodes'}
             </span>
          </div>
        </div>
      </div>

      <div className="relative h-10 w-full bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group">
         <div className="absolute inset-0 flex items-center justify-around px-6">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
               <div 
                  key={i} 
                  className={`w-1 rounded-full ${isThinking ? 'bg-indigo-400' : 'bg-blue-400'} opacity-20 animate-data-packet`}
                  style={{ 
                    height: `${15 + Math.random() * 40}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1.5s'
                  }}
               />
            ))}
         </div>
         <div className={`absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent ${isThinking ? 'via-indigo-500/10' : 'via-blue-500/10'} to-transparent animate-scan-fast`}></div>
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
      </div>
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<(Message & { chunks?: any[] })[]>([
    {
      role: 'model',
      text: `System Online. I am the Gemini 3 Pro Intelligence Agent. You can ask me about Vishnunath's experience with 16k+ servers, VMware virtualization, or his role at HCLTech. How can I help?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'thinking' | 'searching' | null>(null);
  const [handoffContext, setHandoffContext] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsgText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsgText, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);
    setHandoffContext(null);
    
    setActiveMode(/latest|current|news|today|recent|documentation|vs|compare/i.test(userMsgText) ? 'searching' : 'thinking');

    const result: GeminiResult = await getPersonaResponse(userMsgText);
    
    setMessages(prev => [...prev, {
      role: 'model',
      text: result.text,
      chunks: result.groundingChunks,
      timestamp: new Date()
    }]);

    setIsLoading(false);
    setActiveMode(null);

    if (result.needsHandoff) {
      setHandoffContext(userMsgText);
    }
  };

  const getDynamicWhatsAppUrl = () => {
    const baseUrl = `https://wa.me/${USER_DATA.phoneNumber.replace(/[^0-9]/g, '')}`;
    const text = `${USER_DATA.aiConfig.waTemplate}"${handoffContext || 'General Professional Inquiry'}"`;
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  };

  const getStatusColor = () => {
    switch(USER_DATA.aiConfig.availabilityStatus) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-orange-400';
      case 'away': return 'bg-red-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[450px] h-[650px] flex flex-col glass rounded-[2.5rem] shadow-4xl overflow-hidden border border-white/60 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-6 bg-[#433929] text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#7c6837]">
                  <ICONS.Bot />
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-[#7c6837]">Gemini 3 Pro</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Enterprise Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 rounded-full py-1.5 px-3 flex items-center justify-center gap-2 border border-white/10">
                <span className={`w-1.5 h-1.5 ${getStatusColor()} rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-80">
                  Vishnu: {USER_DATA.aiConfig.availabilityStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#433929] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                  {m.text}
                </div>
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 max-w-[90%]">
                    {m.chunks.map((chunk, idx) => (
                      chunk.web && (
                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1.5 truncate max-w-full font-medium">
                          <ICONS.ExternalLink />
                          {chunk.web.title || "Technical Doc"}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm w-[300px] animate-in slide-in-from-left-2">
                  <ThinkingIndicator type={activeMode || 'thinking'} />
                </div>
              </div>
            )}
            {handoffContext && (
              <div className="animate-in fade-in zoom-in-95 duration-700 pt-2 px-2">
                <div className="p-1 bg-gradient-to-br from-green-400 to-green-600 rounded-[2.2rem] shadow-2xl">
                   <a 
                    href={getDynamicWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 bg-white rounded-[2rem] text-center transition-all group active:scale-95"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="text-green-500 scale-125"><ICONS.WhatsApp /></div>
                      <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-800">Professional Bridge</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                      {USER_DATA.aiConfig.availabilityStatus === 'online' ? "Start Direct Chat Now" : "Send Priority Message"}
                    </p>
                  </a>
                </div>
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
                placeholder="Ask about skills or infrastructure..."
                className="w-full bg-[#fbf9f4] text-slate-900 pl-5 pr-14 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7c6837]/20 focus:border-[#7c6837] transition-all text-sm font-medium"
              />
              <button onClick={handleSend} disabled={isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#433929] text-white rounded-xl flex items-center justify-center hover:bg-[#7c6837] transition-all disabled:opacity-50 shadow-lg">
                <ICONS.Send />
              </button>
            </div>
            <p className="text-[8px] text-center text-slate-400 mt-4 uppercase tracking-[0.3em] font-black">Secure AI Pipeline Powered by Gemini 3 Pro</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[1.5rem] bg-[#433929] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7c6837] to-[#433929] opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
             <span className={`relative inline-flex rounded-full h-5 w-5 ${getStatusColor()} border-4 border-[#fbf9f4]`}></span>
           </span>
        )}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        
        @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 5s linear infinite; }
        
        @keyframes spin-very-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-very-slow { animation: spin-very-slow 10s linear infinite; }

        @keyframes data-packet {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-5px); opacity: 0.5; }
        }
        .animate-data-packet { animation: data-packet 2s ease-in-out infinite; }

        @keyframes scan-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-scan-fast { animation: scan-fast 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}} />
    </div>
  );
};

export default ChatWidget;
