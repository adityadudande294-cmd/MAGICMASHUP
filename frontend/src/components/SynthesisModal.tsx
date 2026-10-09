import React, { useState } from 'react';
import type { SynthesizeResponse } from '../types';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  CheckCircle2,
  AlertTriangle,
  Award,
  Compass,
  FileText
} from 'lucide-react';

interface SynthesisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SynthesizeResponse | null;
  isLoading: boolean;
  prompt: string;
}

export const SynthesisModal: React.FC<SynthesisModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
  prompt
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'briefing' | 'full'>('briefing');

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.synthesized_full_report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([data.synthesized_full_report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexusAI_Executive_Synthesis_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-canvas-surface border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-canvas-border bg-gradient-to-r from-canvas-cardElevated via-[#192436] to-canvas-cardElevated flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/30 border border-violet-500/40 flex items-center justify-center shadow-glow-violet">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-titanium">
                  Executive Consensus & Synthesis Briefing
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-violet-950/70 border border-violet-800/80 text-violet-300">
                  MULTI-MODEL CONSENSUS
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Synthesized across all active AI nodes into a cohesive corporate directive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-canvas-deep border border-canvas-border text-text-muted hover:text-text-titanium transition-colors"
                  title="Copy full synthesis report"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-canvas-deep border border-canvas-border text-text-muted hover:text-text-titanium transition-colors"
                  title="Download report as Markdown"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium hover:bg-canvas-deep transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        {data && (
          <div className="px-6 pt-3 bg-canvas-cardElevated/40 border-b border-canvas-border flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('briefing')}
              className={`pb-2.5 font-semibold transition-colors border-b-2 ${
                activeTab === 'briefing'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-text-muted hover:text-text-titanium'
              }`}
            >
              Structured Executive Briefing
            </button>
            <button
              onClick={() => setActiveTab('full')}
              className={`pb-2.5 font-semibold transition-colors border-b-2 ${
                activeTab === 'full'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-text-muted hover:text-text-titanium'
              }`}
            >
              Full Formatted Document
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-text-titanium">
                Synthesizing Multi-Model Output Streams...
              </p>
              <p className="text-xs text-text-dim">
                Extracting consensus points, weighing architectural trade-offs, and calculating decision matrix
              </p>
            </div>
          ) : data ? (
            activeTab === 'briefing' ? (
              <>
                {/* Subject banner */}
                <div className="p-3.5 rounded-xl bg-canvas-deep border border-canvas-border text-xs">
                  <span className="text-text-dim uppercase tracking-wider font-semibold">Subject Evaluated:</span>
                  <p className="text-text-titanium font-medium mt-1">{prompt}</p>
                  <div className="mt-2 text-[11px] text-text-dim font-mono">
                    Corpus analyzed: {data.tokens_analyzed.toLocaleString()} tokens
                  </div>
                </div>

                {/* 1. Executive Summary */}
                <div>
                  <h3 className="text-sm font-bold text-text-titanium flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    1. Executive Summary
                  </h3>
                  <div className="p-4 rounded-xl bg-canvas-cardElevated/70 border border-canvas-border text-sm text-[#E2E8F0] leading-relaxed">
                    {data.executive_summary}
                  </div>
                </div>

                {/* 2. Consensus Matrix */}
                <div>
                  <h3 className="text-sm font-bold text-text-titanium flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    2. Universal Consensus Points
                  </h3>
                  <div className="space-y-2">
                    {data.consensus_matrix.map((point, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-200 flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Divergences & Trade-offs */}
                <div>
                  <h3 className="text-sm font-bold text-text-titanium flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    3. Key Divergences & Model Specializations
                  </h3>
                  <div className="space-y-2">
                    {data.divergences_and_tradeoffs.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200 flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Superlatives Matrix */}
                <div>
                  <h3 className="text-sm font-bold text-text-titanium flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-violet-400" />
                    4. Model Superlative Matrix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {Object.entries(data.model_superlatives).map(([modelId, desc]) => (
                      <div
                        key={modelId}
                        className="p-3 rounded-xl bg-canvas-cardElevated/80 border border-canvas-border text-xs"
                      >
                        <span className="font-bold text-text-titanium font-mono block">
                          {modelId}
                        </span>
                        <span className="text-cyan-300 mt-1 block">
                          {desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Decisive Recommendation */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-cyan-950/40 to-slate-900 border border-cyan-500/40 shadow-glow-cyan">
                  <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-1.5">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    5. Strategic Directive & Recommendation
                  </h3>
                  <p className="text-xs text-[#E2E8F0] leading-relaxed">
                    {data.decisive_recommendation}
                  </p>
                </div>
              </>
            ) : (
              <MarkdownRenderer content={data.synthesized_full_report} />
            )
          ) : (
            <div className="text-center py-12 text-text-dim text-xs">
              No synthesis data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
