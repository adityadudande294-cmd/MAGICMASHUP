import React, { useState, useRef, useEffect } from 'react';
import {
  Columns2,
  Columns3,
  Columns4,
  Trash2,
  Download,
  Sparkles,
  ChevronDown,
  Check,
  Bot
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../utils/models';

interface HeaderProps {
  splitMode: 2 | 3 | 4;
  setSplitMode: (mode: 2 | 3 | 4) => void;
  activeModelIds: string[];
  setActiveModelIds: React.Dispatch<React.SetStateAction<string[]>>;
  onClearChat: () => void;
  onExportSession: () => void;
  isGenerating: boolean;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  splitMode,
  setSplitMode,
  activeModelIds,
  setActiveModelIds,
  onClearChat,
  onExportSession,
  isGenerating,
  messageCount
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleModel = (modelId: string) => {
    if (activeModelIds.includes(modelId)) {
      if (activeModelIds.length > 1) {
        const next = activeModelIds.filter((id) => id !== modelId);
        setActiveModelIds(next);
        if (splitMode > next.length) {
          setSplitMode(next.length as 2 | 3 | 4);
        }
      }
    } else {
      const next = [...activeModelIds, modelId];
      setActiveModelIds(next);
    }
  };

  return (
    <header className="h-16 w-full border-b border-slate-800 bg-[#0B0F17]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Sleek Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-amber-500 p-[1px] shadow-sm">
            <div className="h-full w-full rounded-[11px] bg-[#0F172A] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white font-sans">
                MagicMashup
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wider bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 rounded uppercase">
                Split Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Multi-LLM Split-Screen Comparative Chat
            </p>
          </div>
        </div>

        {/* Model Selector Dropdown */}
        <div className="relative ml-2 sm:ml-4" ref={dropdownRef}>
          <button
            onClick={() => setModelDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 hover:text-white hover:border-slate-600 transition-all shadow-sm"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">
              {activeModelIds.length} Models Selected
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                modelDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {modelDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#111827] border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                ACTIVE MODEL COMPARISON
              </div>
              <div className="mt-1 space-y-1">
                {AVAILABLE_MODELS.map((model) => {
                  const isChecked = activeModelIds.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      onClick={() => toggleModel(model.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        isChecked
                          ? 'bg-slate-800/90 text-white font-medium'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{model.avatar}</span>
                        <div className="text-left">
                          <div className="text-xs text-slate-100">{model.name}</div>
                          <div className="text-[10px] text-slate-400">{model.provider}</div>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-cyan-500 border-cyan-400 text-black'
                            : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center/Right: Split Mode Selector & Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Split Mode Selector (2 / 3 / 4 Models) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 hidden lg:inline">
            Split Mode:
          </span>
          <button
            onClick={() => setSplitMode(2)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              splitMode === 2
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split into 2 parallel columns"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>2 Models</span>
          </button>

          <button
            onClick={() => setSplitMode(3)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              splitMode === 3
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split into 3 parallel columns"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>3 Models</span>
          </button>

          <button
            onClick={() => setSplitMode(4)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              splitMode === 4
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split into 4 parallel columns"
          >
            <Columns4 className="w-3.5 h-3.5" />
            <span>4 Models</span>
          </button>
        </div>

        {/* Action: Clear Chat */}
        <button
          onClick={onClearChat}
          disabled={isGenerating || messageCount === 0}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            messageCount > 0 && !isGenerating
              ? 'border-slate-700/80 bg-slate-900 text-slate-300 hover:text-rose-400 hover:border-rose-900/60'
              : 'border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed'
          }`}
          title="Clear all column chat histories"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>

        {/* Action: Export Session */}
        <button
          onClick={onExportSession}
          disabled={messageCount === 0}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            messageCount > 0
              ? 'border-slate-700/80 bg-slate-900 text-slate-300 hover:text-cyan-400 hover:border-cyan-800'
              : 'border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed'
          }`}
          title="Export session comparison as Markdown"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Session</span>
        </button>

        {/* Live Status indicator */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono"
          title="Engine operational - Broadcast ready"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>
    </header>
  );
};
