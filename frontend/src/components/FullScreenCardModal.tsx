import React, { useState } from 'react';
import type { ModelState } from '../types';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import {
  Copy,
  Check,
  Minimize2,
  Clock,
  Coins,
  Gauge,
  Trophy,
  Code,
  Eye,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FullScreenCardModalProps {
  modelState: ModelState | null;
  onClose: () => void;
  onPickBest: (modelId: string) => void;
}

export const FullScreenCardModal: React.FC<FullScreenCardModalProps> = ({
  modelState,
  onClose,
  onPickBest,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'markdown' | 'raw'>('markdown');

  if (!modelState) return null;

  const { spec, status, content, metric, isWinner } = modelState;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec.name}_Response.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePickBest = () => {
    onPickBest(modelState.id);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [spec.color_hex, '#F59E0B', '#10B981']
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Expanded Modal Box */}
      <div
        className="relative w-full max-w-5xl h-[92vh] bg-canvas-surface border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
        style={{
          borderColor: isWinner ? '#F59E0B' : spec.color_hex,
          boxShadow: `0 0 30px -5px ${spec.glow_color}`
        }}
      >
        {/* Top Accent line */}
        <div className="h-1.5 w-full" style={{ backgroundColor: spec.color_hex }} />

        {/* Modal Header */}
        <div className="p-4 border-b border-canvas-border bg-canvas-cardElevated flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: spec.color_hex }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-titanium">
                  {spec.name}
                </h2>
                {isWinner && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    BEST RESPONSE
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted">{spec.tagline}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePickBest}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isWinner
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                  : 'bg-canvas-deep border border-canvas-border text-text-muted hover:text-amber-400'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{isWinner ? 'Winner' : 'Pick as Best'}</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'markdown' ? 'raw' : 'markdown')}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium bg-canvas-deep border border-canvas-border transition-colors"
              title="Toggle Markdown / Raw text"
            >
              {viewMode === 'markdown' ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium bg-canvas-deep border border-canvas-border transition-colors"
              title="Copy markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium bg-canvas-deep border border-canvas-border transition-colors"
              title="Download markdown"
            >
              <Download className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium bg-canvas-deep border border-canvas-border transition-colors"
              title="Close focus view"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics strip */}
        {metric && (
          <div className="px-6 py-2.5 bg-[#0E1522] border-b border-canvas-border flex flex-wrap items-center justify-between text-xs font-mono text-text-muted">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-text-titanium font-semibold">{metric.ttft_ms}ms</span> TTFT ({metric.total_duration_sec}s)
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-text-titanium font-semibold">{metric.tokens_per_sec}</span> tps
              </span>
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-text-titanium font-semibold">{metric.total_tokens}</span> tokens (${metric.estimated_cost_usd.toFixed(6)})
              </span>
            </div>
            <span className="text-text-dim text-[11px]">
              {metric.is_live_api ? 'VERIFIED LIVE API STREAM' : 'HIGH-FIDELITY HEURISTIC ENGINE'}
            </span>
          </div>
        )}

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1 bg-canvas-surface/90">
          {viewMode === 'markdown' ? (
            <MarkdownRenderer
              content={content}
              isStreaming={status === 'streaming'}
              accentColor={spec.color_hex}
            />
          ) : (
            <pre className="text-xs font-mono text-[#E2E8F0] whitespace-pre-wrap leading-relaxed">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
