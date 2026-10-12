import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, Square, CornerDownLeft } from 'lucide-react';
import { AVAILABLE_MODELS } from '../utils/models';

interface BottomDockProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  onStop: () => void;
  activeModelIds: string[];
  onToggleModel: (modelId: string) => void;
  onSelectPromptSuggestion: (prompt: string) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isGenerating,
  onStop,
  activeModelIds,
  onToggleModel,
  onSelectPromptSuggestion
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && prompt.trim()) {
        onSubmit();
      }
    }
  };

  const activeModels = AVAILABLE_MODELS.filter((m) =>
    activeModelIds.includes(m.id)
  );

  return (
    <div className="w-full shrink-0 border-t border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-md px-4 py-3 z-30">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Active Model Pill Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 select-none">
              Broadcasting to:
            </span>
            {AVAILABLE_MODELS.map((model) => {
              const isActive = activeModelIds.includes(model.id);
              return (
                <button
                  key={model.id}
                  onClick={() => onToggleModel(model.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all select-none border ${
                    isActive
                      ? 'bg-slate-800/90 text-white border-slate-600 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-300'
                  }`}
                  title={isActive ? `Disable ${model.name}` : `Enable ${model.name}`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isActive ? model.color : '#64748B' }}
                  />
                  <span>{model.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 select-none">
            <CornerDownLeft className="w-3 h-3 text-slate-400" />
            <span>Enter to broadcast</span>
          </div>
        </div>

        {/* Input Dock Bar */}
        <div className="relative flex items-end gap-2 bg-[#131C2E] border border-slate-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-cyan-500/70 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder="Type your message to compare responses across all models simultaneously..."
            className="flex-1 max-h-36 bg-transparent text-sm text-slate-100 placeholder:text-slate-400 resize-none px-2 py-1.5 focus:outline-none scroll-smooth"
            style={{ scrollbarWidth: 'thin' }}
          />

          {/* Send / Stop Button */}
          {isGenerating ? (
            <button
              onClick={onStop}
              className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all shrink-0 cursor-pointer"
              title="Stop Generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={!prompt.trim() || activeModels.length === 0}
              className={`h-10 px-4 rounded-xl flex items-center gap-1.5 text-xs font-semibold shadow-md transition-all shrink-0 ${
                prompt.trim() && activeModels.length > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white shadow-cyan-500/20 cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700/50'
              }`}
              title="Broadcast prompt to all active models"
            >
              <span>Broadcast</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto py-0.5 select-none text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400 font-medium shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Quick ideas:
          </span>
          {[
            'Python calculator code',
            'React counter component',
            'SQL top 5 earners',
            'Explain microservices',
            'Where is China'
          ].map((idea, i) => (
            <button
              key={i}
              onClick={() => onSelectPromptSuggestion(idea)}
              disabled={isGenerating}
              className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              {idea}
            </button>
          ))}
        </div>

        {/* Sleek Ampexweb Footer Branding */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <img
              src="/ampexweb-logo.png"
              alt="Ampexweb Logo"
              className="h-4.5 w-4.5 rounded object-contain bg-white/95 p-0.5 shadow-2xs shrink-0"
            />
            <span className="font-medium text-slate-300">
              Powered by <strong className="text-white font-semibold">Ampexweb</strong> · An Ampexweb Product
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            Enterprise Multi-LLM Studio
          </span>
        </div>
      </div>
    </div>
  );
};
