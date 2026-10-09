import React from 'react';
import type { ModelSpec } from '../types';
import { Zap, Sparkles, Brain, Search, Layers } from 'lucide-react';

interface ModelSelectorBarProps {
  models: ModelSpec[];
  selectedIds: string[];
  onToggleModel: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectPreset: (preset: 'fastest' | 'reasoning' | 'budget') => void;
}

export const ModelSelectorBar: React.FC<ModelSelectorBarProps> = ({
  models,
  selectedIds,
  onToggleModel,
  onSelectAll,
  onClearAll,
  onSelectPreset
}) => {
  const getProviderIcon = (id: string) => {
    switch (id) {
      case 'gemini-1.5-pro':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      case 'gpt-4o':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case 'claude-3-5-sonnet':
        return <Brain className="w-3.5 h-3.5 text-amber-400" />;
      case 'perplexity-sonar-deep':
        return <Search className="w-3.5 h-3.5 text-indigo-400" />;
      case 'llama-3.3-70b-groq':
        return <Zap className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full bg-canvas-deep/80 border-b border-canvas-border px-4 lg:px-8 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Model Pill Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-dim mr-1">
            Active Nodes ({selectedIds.length}/{models.length}):
          </span>

          {models.map((model) => {
            const isSelected = selectedIds.includes(model.id);

            return (
              <button
                key={model.id}
                onClick={() => onToggleModel(model.id)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-canvas-surface border-slate-700 shadow-sm'
                    : 'bg-canvas-deep/60 border-canvas-border text-text-dim hover:border-slate-700 hover:text-text-muted'
                }`}
                style={{
                  borderColor: isSelected ? model.color_hex : undefined,
                  boxShadow: isSelected ? `0 0 12px -2px ${model.glow_color}` : undefined,
                }}
              >
                {/* Provider Icon */}
                <div className="flex items-center justify-center">
                  {getProviderIcon(model.id)}
                </div>

                {/* Model Name */}
                <span className={`font-semibold ${isSelected ? 'text-text-titanium' : 'text-text-muted'}`}>
                  {model.name}
                </span>

                {/* Latency Tag */}
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight"
                  style={{
                    backgroundColor: isSelected ? `${model.color_hex}15` : 'transparent',
                    color: isSelected ? model.color_hex : '#64748B',
                  }}
                >
                  ~{model.typical_latency_ms}ms
                </span>

                {/* Active Status Dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isSelected ? model.color_hex : '#334155',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Quick Selection Presets */}
        <div className="flex items-center gap-1.5 text-xs text-text-muted self-end md:self-center">
          <span className="text-[11px] text-text-dim mr-1">Presets:</span>
          <button
            onClick={onSelectAll}
            className="px-2 py-0.5 rounded bg-canvas-surface border border-canvas-border hover:text-text-titanium hover:border-slate-600 transition-colors"
          >
            All
          </button>
          <button
            onClick={() => onSelectPreset('fastest')}
            className="px-2 py-0.5 rounded bg-canvas-surface border border-canvas-border hover:text-orange-400 hover:border-orange-500/40 transition-colors"
          >
            Fastest
          </button>
          <button
            onClick={() => onSelectPreset('reasoning')}
            className="px-2 py-0.5 rounded bg-canvas-surface border border-canvas-border hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            Reasoning
          </button>
          <button
            onClick={onClearAll}
            className="px-2 py-0.5 rounded bg-canvas-surface border border-canvas-border hover:text-rose-400 hover:border-rose-500/40 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
