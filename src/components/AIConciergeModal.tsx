import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ExternalLink,
  Compass
} from 'lucide-react';
import { AIConciergeMessage, DestinationCity } from '../types';
import { isGroundingSource, isRecord } from '../utils';
import { askGeminiConcierge } from '../gemini';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinationCity: DestinationCity;
  destinationName?: string;
  traveler1Origin?: string;
  traveler2Origin?: string;
  selectedDate: string;
  initialPrompt?: string;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  destinationCity,
  destinationName,
  traveler1Origin,
  traveler2Origin,
  selectedDate,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<AIConciergeMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello there! 👋 I'm your Flight Rendezvous Concierge. I help travelers flying from two different departure cities synchronize their flights, coordinate arrival times, and plan effortless meetups.\n\nWhether you're comparing destination hubs, coordinating airport meeting points and city transfers, checking airline baggage policies, or looking for the best travel dates, ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: AIConciergeMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await askGeminiConcierge(
        [...messages, userMsg].map((message) => ({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: message.text,
        })),
        {
          destinationCity,
          destinationName,
          traveler1Origin,
          traveler2Origin,
          selectedDate,
        },
      );
      if (isRecord(data) && data.success === true && typeof data.reply === 'string') {
        const assistantMsg: AIConciergeMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          groundingSources: Array.isArray(data.sources)
            ? data.sources.filter(isGroundingSource)
            : [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMessage =
          isRecord(data) && typeof data.error === 'string' ? data.error : 'Check API key';
        const errorMsg: AIConciergeMessage = {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `I had trouble connecting to the flight assistant. (${errorMessage}). In the meantime, you can explore the synchronized flight options in the Flight Matches tab!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error) {
      const errorMsg: AIConciergeMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: error instanceof Error
          ? error.message
          : 'Gemini request failed. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickQuestions = [
    'How do we synchronize flights when departing from two different cities?',
    'What is the best way to meet at the airport if we land 45 minutes apart?',
    'How do we choose the best destination hub for a weekend getaway?',
    'What are the cabin baggage size rules on major European airlines?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif flex items-center gap-2">
                AI Rendezvous Concierge
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Smart flight synchronization &amp; travel advisor for dual-origin trips
              </p>
            </div>
          </div>

          <button
            id="close-concierge-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white font-bold'
                    : 'bg-amber-600 text-white font-bold'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-stone-800 rounded-tl-xs border border-stone-200/80 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line prose prose-stone text-xs sm:text-sm">
                  {msg.text}
                </div>

                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-600 block mb-1">Grounding References:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.groundingSources.slice(0, 3).map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5 text-stone-400" />
                          <span className="truncate max-w-[140px]">{s.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-stone-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>Analyzing flight schedules and rendezvous logistics...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
            Suggestions:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              id={`quick-question-${idx}`}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3.5 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            id="concierge-message-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask about flights, airports, schedules, luggage or meeting spots..."
            className="flex-1 px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
          <button
            id="send-concierge-message-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
