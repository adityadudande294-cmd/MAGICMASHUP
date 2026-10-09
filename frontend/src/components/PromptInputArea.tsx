import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  SlidersHorizontal,
  Sparkles,
  Command,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PromptInputAreaProps {
  prompt: string;
  setPrompt: (p: string) => void;
  systemInstruction: string;
  setSystemInstruction: (s: string) => void;
  isStreaming: boolean;
  onSubmit: () => void;
  onStop: () => void;
  isDebateMode: boolean;
  selectedCount: number;
}

export const PromptInputArea: React.FC<PromptInputAreaProps> = ({
  prompt,
  setPrompt,
  systemInstruction,
  setSystemInstruction,
  isStreaming,
  onSubmit,
  onStop,
  isDebateMode,
  selectedCount,
}) => {
  const [showSystemConfig, setShowSystemConfig] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(220, Math.max(72, textareaRef.current.scrollHeight))}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isStreaming && prompt.trim() && selectedCount > 0) {
        onSubmit();
      }
    }
  };

  const sampleQuickPrompts = [
    {
      label: 'Corporate Contract Audit',
      text: 'Analyze this enterprise software licensing agreement: identify uncapped indemnification liabilities, verify IP non-infringement covenants, and propose revised protective clauses for the customer.'
    },
    {
      label: 'Refactor High-Concurrency Engine',
      text: 'Provide a production-grade, zero-backpressure asynchronous streaming implementation in TypeScript/Python. Include circuit breakers, retry logic with exponential jitter, and rigorous type schemas.'
    },
    {
      label: 'C-Suite Strategy Briefing',
      text: 'Draft an executive briefing comparing a single-vendor frontier AI contract versus an enterprise multi-model router. Break down risk mitigation, unit cost curves per 10M tokens, and a 90-day deployment roadmap.'
    },
    {
      label: 'Empirical Benchmark Fact-Check',
      text: 'Cross-examine the latest 2025/2026 enterprise inference speed and cost claims across flagship LLMs and specialized LPU accelerators. Cite specific empirical figures and trade-offs.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-2">
      <div className="relative rounded-2xl bg-canvas-surface border border-canvas-border shadow-2xl p-3.5 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent-violet/60 focus-within:border-accent-violet">
        {/* Optional System Prompt Drawer */}
        {showSystemConfig && (
          <div className="mb-3 p-3 rounded-xl bg-canvas-cardElevated border border-canvas-border text-xs">
            <div className="flex items-center justify-between mb-1.5 text-text-muted">
              <span className="font-semibold text-text-titanium flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent-violet" />
                Global System Instruction (Role & Constraint Directive):
              </span>
              <button
                onClick={() => setSystemInstruction('')}
                className="text-text-dim hover:text-text-titanium text-[11px]"
              >
                Reset to Default
              </button>
            </div>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="e.g., Act as a Principal AI Infrastructure Architect. Be ruthlessly objective, emphasize concrete code and verified benchmarks, and omit conversational fluff."
              rows={2}
              className="w-full bg-canvas-deep border border-canvas-border rounded-lg p-2.5 text-xs text-text-titanium placeholder:text-text-dim focus:outline-none focus:border-accent-violet"
            />
          </div>
        )}

        {/* Main Prompt Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isDebateMode
                ? "Enter an executive dilemma or technical premise for models to debate, critique, and synthesize..."
                : "Enter an enterprise prompt to broadcast concurrently across all active AI nodes..."
            }
            className="w-full bg-transparent text-text-titanium placeholder:text-text-dim text-sm md:text-base leading-relaxed resize-none focus:outline-none pr-10"
            style={{ minHeight: '68px' }}
          />

          {prompt && (
            <button
              onClick={() => setPrompt('')}
              className="absolute top-1 right-1 p-1 text-text-dim hover:text-text-muted rounded-md transition-colors"
              title="Clear input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Utility Bar */}
        <div className="mt-2.5 pt-2 border-t border-canvas-border/60 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSystemConfig(!showSystemConfig)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                showSystemConfig || systemInstruction
                  ? 'bg-accent-violet/10 border-accent-violet/40 text-accent-violet'
                  : 'bg-canvas-deep/80 border-canvas-border text-text-muted hover:text-text-titanium'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>System Role</span>
              {showSystemConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <span className="hidden sm:flex items-center gap-1 text-[11px] text-text-dim font-mono">
              <Command className="w-3 h-3" />
              <span>Ctrl + Enter to dispatch</span>
            </span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-all cursor-pointer shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-rose-300" />
                <span>Abort Inference</span>
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!prompt.trim() || selectedCount === 0}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-lg ${
                  prompt.trim() && selectedCount > 0
                    ? isDebateMode
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-110 shadow-glow-amber'
                      : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 text-white hover:brightness-110 shadow-glow-cyan'
                    : 'bg-canvas-border text-text-dim cursor-not-allowed shadow-none'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isDebateMode
                    ? `Initiate Sequential Debate (${selectedCount} Nodes)`
                    : `Broadcast to ${selectedCount} Nodes`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Enterprise Presets Chips */}
        <div className="mt-2.5 pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] text-text-dim font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Quick Samples:
          </span>
          {sampleQuickPrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sample.text)}
              className="px-2.5 py-1 rounded-lg bg-canvas-deep border border-canvas-border/80 text-text-muted hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-canvas-surface whitespace-nowrap text-[11px] transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
