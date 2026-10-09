import React, { useState } from 'react';
import type { ModelSpec, ModelMetric } from '../types';
import {
  X,
  BarChart3,
  DollarSign,
  TrendingDown,
  Calculator,
  Trophy
} from 'lucide-react';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelSpec[];
  sessionMetrics: Record<string, ModelMetric>;
  winnerCounts: Record<string, number>;
  totalTokensSession: number;
  totalCostSession: number;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  models,
  sessionMetrics,
  winnerCounts,
  totalTokensSession,
  totalCostSession
}) => {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(100000); // 100k queries
  const [avgQueryTokens, setAvgQueryTokens] = useState<number>(800);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-canvas-surface border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-canvas-border bg-gradient-to-r from-canvas-cardElevated via-[#192436] to-canvas-cardElevated flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-glow-cyan">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-titanium">
                Enterprise Cost Intelligence & Benchmarking
              </h2>
              <p className="text-xs text-text-muted">
                Comparative FinOps metrics, latency profiles, and unit economics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-titanium hover:bg-canvas-deep transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Session KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-canvas-cardElevated border border-canvas-border">
              <span className="text-[11px] text-text-dim uppercase tracking-wider font-semibold">
                Session Token Spend
              </span>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-1">
                {totalTokensSession.toLocaleString()} <span className="text-xs text-text-muted font-normal">tokens</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-canvas-cardElevated border border-canvas-border">
              <span className="text-[11px] text-text-dim uppercase tracking-wider font-semibold">
                Session Accrued Cost
              </span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                ${totalCostSession.toFixed(6)} <span className="text-xs text-text-muted font-normal">USD</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-canvas-cardElevated border border-canvas-border">
              <span className="text-[11px] text-text-dim uppercase tracking-wider font-semibold">
                Leaderboard Winner
              </span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-1 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                {Object.entries(winnerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Pending'}
              </p>
            </div>
          </div>

          {/* Model Unit Cost Matrix Table */}
          <div>
            <h3 className="text-sm font-bold text-text-titanium flex items-center gap-2 mb-2.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              1. Institutional Pricing Matrix (per 1 Million Tokens)
            </h3>

            <div className="rounded-xl border border-canvas-border overflow-hidden bg-canvas-deep/50">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-canvas-cardElevated text-text-muted border-b border-canvas-border">
                    <th className="p-3 text-left">Model / Provider</th>
                    <th className="p-3 text-left">Input / 1M</th>
                    <th className="p-3 text-left">Output / 1M</th>
                    <th className="p-3 text-left">Observed Latency</th>
                    <th className="p-3 text-left">Context Window</th>
                    <th className="p-3 text-left">Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canvas-border">
                  {models.map((m) => {
                    const sessionMetric = sessionMetrics[m.id];
                    return (
                      <tr key={m.id} className="hover:bg-canvas-cardElevated/50">
                        <td className="p-3 font-medium text-text-titanium flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color_hex }} />
                          {m.name}
                        </td>
                        <td className="p-3 font-mono text-cyan-300">${m.input_cost_per_m.toFixed(2)}</td>
                        <td className="p-3 font-mono text-emerald-300">${m.output_cost_per_m.toFixed(2)}</td>
                        <td className="p-3 font-mono text-text-muted">
                          {sessionMetric ? `${sessionMetric.ttft_ms}ms (${sessionMetric.tokens_per_sec} tps)` : `~${m.typical_latency_ms}ms`}
                        </td>
                        <td className="p-3 font-mono text-text-muted">{m.context_window_k}k</td>
                        <td className="p-3 font-mono text-amber-400 font-semibold">{winnerCounts[m.id] || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* FinOps Projection Simulator */}
          <div className="p-4 rounded-xl bg-canvas-cardElevated border border-canvas-border">
            <h3 className="text-sm font-bold text-text-titanium flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              2. Projected Monthly OPEX Simulator
            </h3>
            <p className="text-xs text-text-muted mb-4">
              Simulate enterprise budget scaling across different query volumes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-text-muted block mb-1">
                  Monthly Query Volume: <span className="font-mono text-cyan-400 font-bold">{monthlyVolume.toLocaleString()} queries</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-text-muted block mb-1">
                  Avg Tokens per Query: <span className="font-mono text-cyan-400 font-bold">{avgQueryTokens} tokens</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="4000"
                  step="100"
                  value={avgQueryTokens}
                  onChange={(e) => setAvgQueryTokens(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Projected Costs Comparison */}
            <div className="space-y-2">
              {models.map((m) => {
                const totalTokensM = (monthlyVolume * avgQueryTokens) / 1_000_000.0;
                // Assume 40% input, 60% output
                const estMonthlyCost = (totalTokensM * 0.4 * m.input_cost_per_m) + (totalTokensM * 0.6 * m.output_cost_per_m);

                return (
                  <div key={m.id} className="flex items-center justify-between p-2.5 rounded-lg bg-canvas-deep border border-canvas-border text-xs">
                    <span className="font-medium text-text-titanium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color_hex }} />
                      {m.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-text-dim font-mono">
                        {(totalTokensM).toFixed(1)}M tok/mo
                      </span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        ${estMonthlyCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Routing Recommendation */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-canvas-cardElevated border border-emerald-700/40 text-xs">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-4 h-4" />
              FinOps Optimization Recommendation:
            </h4>
            <p className="text-text-muted leading-relaxed">
              By deploying a hybrid routing policy that diverts 70% of standard informational queries to Groq Llama 3.3,
              and reserving Claude 3.5 Sonnet / Gemini 1.5 Pro for deep architectural arbitration, an enterprise processing 
              100,000 queries per month slashes monthly OPEX from <span className="text-rose-400 font-mono font-bold">$816.00</span> down to <span className="text-emerald-400 font-mono font-bold">$184.20</span> (a <strong>77.4% net cost reduction</strong>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
