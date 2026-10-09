import React, { useState } from 'react';
import type { ModelState } from '../types';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import {
  Maximize2,
  Copy,
  Check,
  Trophy,
  Code,
  Eye,
  Clock,
  Coins,
  Gauge,
  Zap,
  AlertTriangle,
  Sparkles,
  Layers,
  Brain,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModelCardProps {
  modelState: ModelState;
  onPickBest: (modelId: string) => void;
  onExpand: (modelId: string) => void;
  isDebateActiveRound?: boolean;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelState,
  onPickBest,
  onExpand,
  isDebateActiveRound
}) => {
  const { spec, status, content, error, metric, isWinner } = modelState;
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'markdown' | 'raw'>('markdown');

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePickBest = () => {
    onPickBest(modelState.id);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [spec.color_hex, '#F59E0B', '#10B981', '#06B6D4']
    });
  };

  const getProviderIcon = (id: string) => {
    switch (id) {
      case 'gemini-1.5-pro':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'gpt-4o':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'claude-3-5-sonnet':
        return <Brain className="w-4 h-4 text-amber-400" />;
      case 'perplexity-sonar-deep':
        return <Search className="w-4 h-4 text-indigo-400" />;
      case 'llama-3.3-70b-groq':
        return <Zap className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const isStreaming = status === 'streaming';

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-canvas-surface border transition-all duration-200 overflow-hidden group shadow-lg ${
        isWinner
          ? 'border-amber-400/80 shadow-glow-amber ring-1 ring-amber-400/50'
          : isDebateActiveRound
          ? 'border-cyan-400/80 shadow-glow-cyan ring-1 ring-cyan-400/40'
          : 'border-canvas-border hover:border-slate-700/80'
      }`}
      style={{
        boxShadow: isStreaming ? `0 0 20px -5px ${spec.glow_color}` : undefined
      }}
    >
      {/* Top Accent Strip with Model Color */}
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: spec.color_hex,
          opacity: isStreaming || isWinner ? 1 : 0.6
        }}
      />

      {/* Card Header */}
      <div className="p-3.5 border-b border-canvas-border bg-canvas-cardElevated/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-slate-700"
            style={{ backgroundColor: `${spec.color_hex}15` }}
          >
            {getProviderIcon(spec.id)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-titanium truncate font-sans">
                {spec.name}
              </h3>
              {isWinner && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  WINNER
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted truncate">
              {spec.provider} • <span className="font-mono text-text-dim">{spec.version}</span>
            </p>
          </div>
        </div>

        {/* Card Utility Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Raw / Markdown Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'markdown' ? 'raw' : 'markdown')}
            className="p-1.5 rounded-md text-text-dim hover:text-text-muted hover:bg-canvas-deep transition-colors"
            title={viewMode === 'markdown' ? 'View raw text' : 'View formatted markdown'}
          >
            {viewMode === 'markdown' ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          {/* Copy Response */}
          <button
            onClick={handleCopy}
            disabled={!content}
            className="p-1.5 rounded-md text-text-dim hover:text-text-muted hover:bg-canvas-deep transition-colors disabled:opacity-40"
            title="Copy response markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Expand Fullscreen */}
          <button
            onClick={() => onExpand(modelState.id)}
            className="p-1.5 rounded-md text-text-dim hover:text-text-muted hover:bg-canvas-deep transition-colors"
            title="Focus expansion view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Enterprise Metrics Badges Strip */}
      <div className="px-3.5 py-2 bg-[#0E1522] border-b border-canvas-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3 text-text-muted">
          {/* TTFT & Duration */}
          <div className="flex items-center gap-1 text-[11px]" title="Time to first token / Total duration">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>
              {metric ? (
                <>
                  <span className="text-text-titanium font-semibold">{metric.ttft_ms}ms</span> TTFT (
                  {metric.total_duration_sec}s)
                </>
              ) : isStreaming ? (
                <span className="text-cyan-400 animate-pulse">Streaming...</span>
              ) : (
                <span className="text-text-dim">-- ms</span>
              )}
            </span>
          </div>

          {/* Throughput */}
          <div className="flex items-center gap-1 text-[11px]" title="Throughput in tokens per second">
            <Gauge className="w-3 h-3 text-orange-400" />
            <span>
              {metric ? (
                <>
                  <span className="text-text-titanium font-semibold">{metric.tokens_per_sec}</span> tps
                </>
              ) : (
                <span className="text-text-dim">-- tps</span>
              )}
            </span>
          </div>

          {/* Token count & Cost */}
          <div className="flex items-center gap-1 text-[11px]" title="Tokens & calculated query cost">
            <Coins className="w-3 h-3 text-emerald-400" />
            <span>
              {metric ? (
                <>
                  <span className="text-text-titanium font-semibold">{metric.total_tokens}</span> toks •{' '}
                  <span className="text-emerald-400 font-semibold">${metric.estimated_cost_usd.toFixed(6)}</span>
                </>
              ) : (
                <span className="text-text-dim">-- toks</span>
              )}
            </span>
          </div>
        </div>

        {/* API Tier indicator */}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-canvas-deep border border-canvas-border/70 text-text-dim">
          {metric?.is_live_api ? 'LIVE API' : 'SANDBOX HEURISTIC'}
        </span>
      </div>

      {/* Body Content Area */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[500px] min-h-[220px] bg-canvas-surface/70">
        {error ? (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Provider Communication Notice</p>
              <p className="text-rose-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        ) : content ? (
          viewMode === 'markdown' ? (
            <MarkdownRenderer
              content={content}
              isStreaming={isStreaming}
              accentColor={spec.color_hex}
            />
          ) : (
            <pre className="text-xs font-mono text-[#E2E8F0] whitespace-pre-wrap leading-relaxed">
              {content}
            </pre>
          )
        ) : (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-6 text-text-dim">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 opacity-60"
              style={{ backgroundColor: `${spec.color_hex}10` }}
            >
              {getProviderIcon(spec.id)}
            </div>
            <p className="text-xs font-medium text-text-muted">Awaiting Dispatch</p>
            <p className="text-[11px] text-text-dim max-w-[240px] mt-1">
              {spec.tagline}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Pick Best Answer */}
      {content && (
        <div className="p-2.5 border-t border-canvas-border bg-canvas-cardElevated/40 flex items-center justify-between gap-2">
          <button
            onClick={handlePickBest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isWinner
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                : 'bg-canvas-deep border border-canvas-border text-text-muted hover:text-amber-400 hover:border-amber-500/40 hover:bg-canvas-surface'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{isWinner ? 'Marked as Best Response' : 'Pick Best Answer'}</span>
          </button>

          <span className="text-[11px] text-text-dim font-mono">
            Context: {spec.context_window_k}k
          </span>
        </div>
      )}
    </div>
  );
};
