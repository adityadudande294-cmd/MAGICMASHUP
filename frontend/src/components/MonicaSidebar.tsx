import React, { useState } from 'react';
import { ENTERPRISE_QUICK_PROMPTS } from '../utils/constants';
import {
  X,
  Sparkles,
  Search,
  ArrowRight,
  Briefcase,
  FileCheck2,
  Code2,
  CheckCircle2,
  DollarSign,
  ShieldAlert
} from 'lucide-react';

interface MonicaSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (promptText: string, autoRun?: boolean) => void;
}

export const MonicaSidebar: React.FC<MonicaSidebarProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Strategy & Leadership', 'Legal & Compliance', 'Engineering Architecture', 'Research & Verification', 'FinOps & Infrastructure', 'Cybersecurity'];

  const filteredPrompts = ENTERPRISE_QUICK_PROMPTS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-cyan-400" />;
      case 'FileCheck2':
        return <FileCheck2 className="w-4 h-4 text-emerald-400" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-4 h-4 text-indigo-400" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-orange-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sliding Drawer Container */}
      <div className="relative w-full max-w-md bg-canvas-surface border-l border-canvas-border shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-canvas-border flex items-center justify-between bg-canvas-cardElevated/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-titanium">
                Enterprise Copilot Assistant
              </h2>
              <p className="text-[11px] text-text-muted">
                Pre-configured cognitive prompts for corporate workflows
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium hover:bg-canvas-deep transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-canvas-border bg-canvas-deep/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-dim" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search enterprise prompt templates..."
              className="w-full bg-canvas-surface border border-canvas-border rounded-lg pl-9 pr-3 py-2 text-xs text-text-titanium placeholder:text-text-dim focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-2 pb-1 no-scrollbar text-[11px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-canvas-surface border border-canvas-border text-text-muted hover:text-text-titanium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12 text-text-dim text-xs">
              No matching enterprise prompts found.
            </div>
          ) : (
            filteredPrompts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-canvas-cardElevated/60 border border-canvas-border hover:border-slate-600/80 hover:bg-canvas-cardElevated transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-canvas-surface border border-canvas-border">
                      {getIcon(item.iconName)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-titanium">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-text-dim font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Action buttons */}
                <div className="mt-3 pt-2.5 border-t border-canvas-border/50 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      onSelectPrompt(item.prompt, false);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-canvas-surface border border-canvas-border text-text-muted hover:text-text-titanium hover:border-slate-600 transition-colors"
                  >
                    Insert to Editor
                  </button>
                  <button
                    onClick={() => {
                      onSelectPrompt(item.prompt, true);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                  >
                    <span>Run Immediately</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-canvas-border bg-canvas-deep/80 text-[11px] text-text-dim flex items-center justify-between">
          <span>Enterprise Monica Framework</span>
          <span className="font-mono text-cyan-400">v1.4 Corporate Ready</span>
        </div>
      </div>
    </div>
  );
};
