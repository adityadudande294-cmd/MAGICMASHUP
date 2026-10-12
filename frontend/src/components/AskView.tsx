import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Columns2,
  Copy,
  Check
} from 'lucide-react';
import { AVAILABLE_MODELS, type ModelDef } from '../utils/models';
import { BACKEND_URL } from '../utils/constants';

interface AskViewProps {
  onNavigateToCompare: () => void;
  onSendToCompare: (prompt: string) => void;
}

interface SingleChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  modelName: string;
}

export const AskView: React.FC<AskViewProps> = ({
  onNavigateToCompare,
  onSendToCompare
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt4o');
  const [messages, setMessages] = useState<SingleChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const currentModel: ModelDef =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = inputPrompt.trim();
    if (!trimmed || isSubmitting) return;

    const userMsg: SingleChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      modelName: 'User'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          models: [selectedModelId]
        })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();
      const modelResult = data.results?.[0];

      const assistantMsg: SingleChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: modelResult?.text || 'No response generated.',
        timestamp: Date.now(),
        modelName: currentModel.name
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: SingleChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Failed to connect to backend. Please ensure server is running.',
        timestamp: Date.now(),
        modelName: currentModel.name
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col bg-[#070B12] text-slate-100">
      {/* Top Header */}
      <header className="h-16 px-6 border-b border-slate-800 bg-[#0B0F17]/95 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">Ask Focused Mode</span>
            <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-indigo-950 border border-indigo-700 text-indigo-300 rounded uppercase">
              Single LLM
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Model picker */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {AVAILABLE_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModelId(m.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedModelId === m.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{m.avatar}</span>
                <span className="hidden sm:inline">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onNavigateToCompare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs font-medium text-slate-200 hover:text-cyan-300 transition-colors"
        >
          <Columns2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Switch to Split Compare Studio</span>
        </button>
      </header>

      {/* Messages View */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner"
              style={{
                backgroundColor: `${currentModel.color}20`,
                border: `1px solid ${currentModel.color}40`
              }}
            >
              {currentModel.avatar}
            </div>
            <h3 className="font-semibold text-base text-white mb-1">
              Chat with {currentModel.name}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              Ask deep questions, generate code, or explore solutions. You can also benchmark this question across all models anytime.
            </p>

            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {[
                'Explain how garbage collection works in Python',
                'Write a resilient REST API client in TypeScript',
                'Compare microservices vs monolith trade-offs'
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => setInputPrompt(starter)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  "{starter}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="bg-[#1E293B] border border-slate-700 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] text-xs font-sans whitespace-pre-wrap">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full bg-[#151D2A] border border-slate-800 text-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-md space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{currentModel.avatar}</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {currentModel.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyText(msg.content, msg.id)}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onSendToCompare(messages[messages.indexOf(msg) - 1]?.content || msg.content)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 hover:brightness-125 text-[10px] font-semibold"
                        title="Compare this question across all models"
                      >
                        <Columns2 className="w-2.5 h-2.5" />
                        <span>Compare in Studio</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-[#0B0F17]/95">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-[#131C2E] border border-slate-700/80 rounded-2xl p-2 focus-within:border-cyan-500">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSubmitting}
            placeholder={`Ask ${currentModel.name} anything... (Press Enter)`}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 px-3 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputPrompt.trim() || isSubmitting}
            className={`h-9 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              inputPrompt.trim() && !isSubmitting
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Ask</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
