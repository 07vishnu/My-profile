
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

    // Use the dynamic config for the Gemini prompt context
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
      className="fixed bottom-6 right-6 z-[150]" 
      onKeyDown={handleKeyDown}
      aria-label="Infrastructure Support Chat"
    >
      {isOpen && (
        <div 
          ref={dialogRef}
          className="mb-4 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] flex flex-col bg-white rounded-[28px] shadow-2xl overflow-hidden border border-[#dadce0] animate-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
        >
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#dadce0] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]" aria-hidden="true">
                <ICONS.Bot />
              </div>
              <div>
                <h2 id="chat-title" className="font-semibold text-sm text-[#202124]">AI Assistant</h2>
                <p className={`text-[10px] ${statusColors[config.availabilityStatus]} font-medium flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusBg[config.availabilityStatus]} animate-pulse`}></span> 
                  <span className="sr-only">Status:</span> {config.availabilityStatus.toUpperCase()}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-[#f1f3f4] p-2 rounded-full transition-colors text-[#5f6368]"
              aria-label="Close chat window"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#ffffff] no-scrollbar"
            aria-live="polite"
            aria-atomic="false"
            role="log"
          >
            {config.availabilityStatus !== 'online' && (
              <div className="p-4 bg-[#fff8e1] border border-[#ffe082] rounded-2xl text-[11px] text-[#795548] font-medium leading-relaxed mb-4">
                ⚠️ System Note: {config.awayMessage}
              </div>
            )}
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                role="article"
              >
                <div 
                  className={`max-w-[85%] p-4 rounded-[20px] text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-[#1a73e8] text-white rounded-tr-none shadow-sm' 
                      : 'bg-[#f1f3f4] text-[#202124] rounded-tl-none'
                  }`}
                >
                  <span className="sr-only">{m.role === 'user' ? 'You said: ' : 'AI said: '}</span>
                  {m.text}
                </div>
                {m.chunks && m.chunks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2" aria-label="Reference links">
                    {m.chunks.map((chunk, idx) => chunk.web && (
                      <a 
                        key={idx} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] bg-[#e8f0fe] text-[#1a73e8] px-3 py-1.5 rounded-full border border-[#d2e3fc] hover:bg-[#d2e3fc] transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <ICONS.ExternalLink aria-hidden="true" /> 
                        {chunk.web.title || "Reference Source"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-label="AI is thinking...">
                <div className="bg-[#f1f3f4] px-4 py-3 rounded-[20px] rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9aa0a6] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-[#dadce0]">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                aria-label="Write a message to the AI assistant"
                aria-disabled={isLoading}
                className="w-full bg-[#f8f9fa] text-[#202124] pl-5 pr-14 py-3.5 rounded-full border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:bg-white focus:ring-1 focus:ring-[#1a73e8] transition-all text-sm placeholder:text-[#9aa0a6]"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !inputValue.trim()} 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a73e8] text-white rounded-full flex items-center justify-center hover:bg-[#1557b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "chat-dialog" : undefined}
        className="w-16 h-16 rounded-full bg-white text-[#1a73e8] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group border border-[#dadce0]"
      >
        <div className="scale-125">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          ) : (
             <ICONS.Bot aria-hidden="true" />
          )}
        </div>
        <div className={`absolute -top-1 -right-1 w-4 h-4 ${statusBg[config.availabilityStatus]} rounded-full border-2 border-white animate-pulse`} aria-hidden="true"></div>
      </button>
    </aside>
  );
};

export default ChatWidget;
