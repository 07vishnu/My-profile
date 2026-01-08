
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { ICONS } from '../constants';
import { Message } from '../types';
import { getPersonaResponse, GeminiResult } from '../services/geminiService';
import { ConfigContext } from '../App';

const ChatWidget: React.FC = () => {
  const { config } = useContext(ConfigContext);
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
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Focus management: Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Accessibility: Close on Escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsgText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsgText, timestamp: new Date() }]);
    setInputValue('');
    setIsLoading(true);

    const result: GeminiResult = await getPersonaResponse(userMsgText, config);
    
    setMessages(prev => [...prev, {
      role: 'model',
      text: result.text,
      chunks: result.groundingChunks,
      timestamp: new Date()
    }]);

    setIsLoading(false);
  };

  const statusColors = {
    online: 'text-[#34a853]',
    busy: 'text-[#fbbc04]',
    away: 'text-[#ea4335]'
  };

  const statusBg = {
    online: 'bg-[#34a853]',
    busy: 'bg-[#fbbc04]',
    away: 'bg-[#ea4335]'
  };

  return (
    <aside 
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[150]" 
      onKeyDown={handleKeyDown}
      aria-label="Infrastructure Support Chat"
    >
      {isOpen && (
        <div 
          ref={dialogRef}
          className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[75vh] sm:h-[600px] flex flex-col bg-white dark:bg-google-surface rounded-[24px] md:rounded-[28px] shadow-2xl overflow-hidden border border-[#dadce0] dark:border-[#3c4043] animate-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
        >
          {/* Header */}
          <div className="px-5 py-4 md:p-6 bg-white dark:bg-google-surface border-b border-[#dadce0] dark:border-[#3c4043] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#e8f0fe] dark:bg-google-blue/10 flex items-center justify-center text-[#1a73e8]" aria-hidden="true">
                <ICONS.Bot />
              </div>
              <div>
                <h2 id="chat-title" className="font-semibold text-xs md:text-sm text-[#202124] dark:text-[#e8eaed]">AI Assistant</h2>
                <p className={`text-[9px] md:text-[10px] ${statusColors[config.availabilityStatus]} font-medium flex items-center gap-1`}>
                  <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${statusBg[config.availabilityStatus]} animate-pulse`}></span> 
                  <span className="sr-only">Status:</span> {config.availabilityStatus.toUpperCase()}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-[#f1f3f4] dark:hover:bg-google-bg p-1.5 md:p-2 rounded-full transition-colors text-[#5f6368] dark:text-[#9aa0a6]"
              aria-label="Close chat window"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-white dark:bg-google-surface no-scrollbar"
            aria-live="polite"
            aria-atomic="false"
            role="log"
          >
            {config.availabilityStatus !== 'online' && (
              <div className="p-3 md:p-4 bg-[#fff8e1] dark:bg-[#3e2723] border border-[#ffe082] dark:border-[#5d4037] rounded-2xl text-[10px] md:text-[11px] text-[#795548] dark:text-[#d7ccc8] font-medium leading-relaxed mb-4">
                ⚠️ Note: {config.awayMessage}
              </div>
            )}
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                role="article"
              >
                <div 
                  className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-[18px] md:rounded-[20px] text-xs md:text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-[#1a73e8] text-white rounded-tr-none shadow-sm' 
                      : 'bg-[#f1f3f4] dark:bg-google-bg text-[#202124] dark:text-[#e8eaed] rounded-tl-none'
                  }`}
                >
                  <span className="sr-only">{m.role === 'user' ? 'You said: ' : 'AI said: '}</span>
                  {m.text}
                </div>
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 md:gap-2" aria-label="Reference links">
                    {m.chunks.map((chunk, idx) => chunk.web && (
                      <a 
                        key={idx} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[9px] md:text-[10px] bg-[#e8f0fe] dark:bg-google-blue/20 text-[#1a73e8] px-2.5 py-1.5 rounded-full border border-[#d2e3fc] dark:border-google-blue/30 hover:bg-[#d2e3fc] dark:hover:bg-google-blue/40 transition-colors flex items-center gap-1 font-medium"
                      >
                        <ICONS.ExternalLink aria-hidden="true" /> 
                        {chunk.web.title || "Ref"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-label="AI is thinking...">
                <div className="bg-[#f1f3f4] dark:bg-google-bg px-3 md:px-4 py-2 md:py-3 rounded-[18px] md:rounded-[20px] rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#9aa0a6] animate-bounce"></div>
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#9aa0a6] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#9aa0a6] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-4 py-4 md:p-6 bg-white dark:bg-google-surface border-t border-[#dadce0] dark:border-[#3c4043]">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything..."
                aria-label="Write a message"
                aria-disabled={isLoading}
                className="w-full bg-[#f8f9fa] dark:bg-google-bg text-[#202124] dark:text-[#e8eaed] pl-4 pr-12 md:pl-5 md:pr-14 py-2.5 md:py-3.5 rounded-full border border-[#dadce0] dark:border-[#3c4043] focus:outline-none focus:border-[#1a73e8] focus:bg-white dark:focus:bg-google-surface focus:ring-1 focus:ring-[#1a73e8] transition-all text-xs md:text-sm placeholder:text-[#9aa0a6]"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !inputValue.trim()} 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-[#1a73e8] text-white rounded-full flex items-center justify-center hover:bg-[#1557b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <ICONS.Send aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Chat with AI"}
        aria-expanded={isOpen}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white dark:bg-google-surface text-[#1a73e8] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group border border-[#dadce0] dark:border-[#3c4043]"
      >
        <div className="scale-110 md:scale-125">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          ) : (
             <ICONS.Bot aria-hidden="true" />
          )}
        </div>
        <div className={`absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3.5 h-3.5 md:w-4 md:h-4 ${statusBg[config.availabilityStatus]} rounded-full border-2 border-white dark:border-google-surface animate-pulse`} aria-hidden="true"></div>
      </button>
    </aside>
  );
};

export default ChatWidget;
