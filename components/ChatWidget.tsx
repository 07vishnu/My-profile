
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, USER_DATA } from '../constants';
import { Message } from '../types';
import { getPersonaResponse, GeminiResult } from '../services/geminiService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<(Message & { chunks?: any[] })[]>([
    {
      role: 'model',
      text: `Hello! I'm Vishnunath's AI Assistant. How can I help with your infrastructure queries today?`,
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

    const userMsgText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsgText, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);

    const result: GeminiResult = await getPersonaResponse(userMsgText);
    
    setMessages(prev => [...prev, {
      role: 'model',
      text: result.text,
      chunks: result.groundingChunks,
      timestamp: new Date()
    }]);

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150]">
      {isOpen && (
        <div 
          className="mb-4 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] flex flex-col bg-white dark:bg-dark-surface rounded-[28px] shadow-2xl overflow-hidden border border-[#dadce0] dark:border-dark-border animate-in slide-in-from-bottom-4 duration-300 transition-colors duration-300"
          role="dialog"
          aria-label="AI Chat Assistant"
        >
          <div className="p-6 bg-white dark:bg-dark-surface border-bottom border-[#dadce0] dark:border-dark-border flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-blue-900/30 flex items-center justify-center text-[#1a73e8] dark:text-blue-400" aria-hidden="true">
                <ICONS.Bot />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#202124] dark:text-white">AI Assistant</p>
                <p className="text-[10px] text-[#34a853] dark:text-green-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34a853] dark:bg-green-400"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-[#f1f3f4] dark:hover:bg-dark-border p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#5f6368] dark:text-gray-400" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#ffffff] dark:bg-dark-bg/50 no-scrollbar transition-colors duration-300"
            aria-live="polite"
            role="log"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[20px] text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#1a73e8] text-white rounded-tr-none shadow-sm' : 'bg-[#f1f3f4] dark:bg-dark-border text-[#202124] dark:text-gray-100 rounded-tl-none'}`}>
                  {m.text}
                </div>
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2" aria-label="Reference links">
                    {m.chunks.map((chunk, idx) => chunk.web && (
                      <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-[#e8f0fe] dark:bg-blue-900/30 text-[#1a73e8] dark:text-blue-300 px-3 py-1.5 rounded-full border border-[#d2e3fc] dark:border-blue-900/50 hover:bg-[#d2e3fc] dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1.5 font-medium">
                        <ICONS.ExternalLink aria-hidden="true" /> {chunk.web.title || "Ref"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-label="Thinking">
                <div className="bg-[#f1f3f4] dark:bg-dark-border px-4 py-3 rounded-[20px] rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] dark:bg-gray-500 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-dark-surface border-t border-[#dadce0] dark:border-dark-border">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                aria-label="Ask a question to AI assistant"
                className="w-full bg-[#f8f9fa] dark:bg-dark-bg text-[#202124] dark:text-white pl-5 pr-14 py-3.5 rounded-full border border-[#dadce0] dark:border-dark-border focus:outline-none focus:border-[#1a73e8] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0b0e14] focus:ring-1 focus:ring-[#1a73e8] transition-all text-sm placeholder:text-[#9aa0a6] dark:placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading} 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a73e8] text-white rounded-full flex items-center justify-center hover:bg-[#1557b0] transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <ICONS.Send aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
        className="w-16 h-16 rounded-full bg-white dark:bg-dark-surface text-[#1a73e8] dark:text-blue-400 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group border border-[#dadce0] dark:border-dark-border"
      >
        <div className="scale-125">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
             <ICONS.Bot aria-hidden="true" />
          )}
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#34a853] dark:bg-green-500 rounded-full border-2 border-white dark:border-dark-bg animate-pulse" aria-label="Assistant online status indicator"></div>
      </button>
    </div>
  );
};

export default ChatWidget;
