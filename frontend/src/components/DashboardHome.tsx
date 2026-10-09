import React from 'react';
import {
  Search,
  MessageSquare,
  FileText,
  PenTool,
  Compass,
  Columns2,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import type { NavTab } from '../utils/models';

interface DashboardHomeProps {
  onNavigate: (tab: NavTab) => void;
  onLaunchPrompt: (promptText: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigate,
  onLaunchPrompt
}) => {
  const quickActions = [
    {
      title: 'Ask a Question',
      desc: 'Get quick and accurate answers from your choice of model',
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
      action: () => onNavigate('Ask')
    },
    {
      title: 'Analyze Document',
      desc: 'Upload files and extract structured insights',
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      action: () => onNavigate('Files')
    },
    {
      title: 'Write Content',
      desc: 'Create, edit, and optimize code & technical specs',
      icon: PenTool,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      action: () => {
        onLaunchPrompt('Write clean, production-ready code with documentation');
        onNavigate('Compare');
      }
    },
    {
      title: 'Research',
      desc: 'Cross-reference and verify consensus across models',
      icon: Compass,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100',
      action: () => onNavigate('Verify')
    },
    {
      title: 'Compare Models',
      desc: 'See multiple AI responses side by side in real-time',
      icon: Columns2,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 border-cyan-200 ring-2 ring-cyan-500/20',
      badge: 'Core Feature',
      action: () => onNavigate('Compare')
    }
  ];

  const benchmarkTemplates = [
    {
      title: 'Calculator Implementation Comparison',
      desc: 'Compare OOP vs Functional vs CLI patterns across GPT-4o, Claude 3.5, Gemini, & Groq.',
      prompt: 'python code for calculator',
      category: 'Code Architecture'
    },
    {
      title: 'Distributed Microservices Architecture',
      desc: 'Analyze design trade-offs, consensus points, and fault-tolerance patterns.',
      prompt: 'explain microservices architecture with pros and cons',
      category: 'System Design'
    },
    {
      title: 'SQL Performance & Indexing Strategy',
      desc: 'Benchmark complex queries and execution plans simultaneously.',
      prompt: 'Write an optimized SQL query to find the top 5 highest earners in each department',
      category: 'Database'
    }
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* ── Top Search & Global Bar ── */}
      <header className="h-16 px-6 lg:px-10 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3 w-full max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations, models, benchmarks..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Engine Status:</span> Online (4 Models)
          </div>
          <button
            onClick={() => onNavigate('Compare')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Studio Settings</span>
          </button>
        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 space-y-8">
        {/* Greeting Banner */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
              Hello, Developer 👋
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            What would you like to benchmark today? Run parallel queries or test model capabilities.
          </p>
        </div>

        {/* ── 5 Quick-Action Cards Grid ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {quickActions.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  onClick={card.action}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group bg-white ${
                    card.bgColor
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 ${card.color}`}
                      >
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      {card.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-cyan-600 text-white rounded-md shadow-xs">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-xs text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-cyan-600 transition-colors">
                    <span>Open</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── "Recommended for you" Hero Banner ── */}
        <section>
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#101D42] to-[#1C2541] text-white shadow-xl relative overflow-hidden">
            {/* Subtle backdrop accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RECOMMENDED FOR YOU</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  Multi-LLM Split-Screen Benchmark Studio
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Eliminate guesswork by broadcasting a single prompt to{' '}
                  <strong className="text-white">Gemini 1.5 Pro</strong>,{' '}
                  <strong className="text-white">ChatGPT GPT-4o</strong>,{' '}
                  <strong className="text-white">Claude 3.5 Sonnet</strong>, and{' '}
                  <strong className="text-white">Groq Llama 3</strong> simultaneously. Compare response quality, code syntax, token cost, and latency side-by-side.
                </p>

                {/* Model Badges */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {[
                    { name: 'Gemini 1.5 Pro', color: '#0EA5E9' },
                    { name: 'GPT-4o', color: '#10B981' },
                    { name: 'Claude 3.5 Sonnet', color: '#F59E0B' },
                    { name: 'Groq Llama 3.3', color: '#F97316' }
                  ].map((m, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700/80 text-slate-200 flex items-center gap-1.5"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      <span>{m.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Prominent Launch Button */}
              <div className="shrink-0">
                <button
                  onClick={() => onNavigate('Compare')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-indigo-500 hover:brightness-110 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-slate-950" />
                  <span>Launch Studio →</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick Starter Benchmarks ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Benchmark Templates</span>
            </h3>
            <span className="text-xs text-slate-500">Click any card to broadcast</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benchmarkTemplates.map((template, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onLaunchPrompt(template.prompt);
                  onNavigate('Compare');
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-md text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">
                    {template.category}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-900 mt-2 group-hover:text-cyan-700 transition-colors">
                    {template.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                    {template.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[200px]">"{template.prompt}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
