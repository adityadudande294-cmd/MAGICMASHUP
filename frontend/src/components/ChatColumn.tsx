import React, { useState, useRef, useEffect } from 'react';
import {
  Trophy,
  Copy,
  Check,
  Zap,
  Clock,
  ChevronRight,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ModelDef } from '../utils/models';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  displayedContent?: string;
  isStreaming?: boolean;
  timestamp: number;
  stats?: {
    latency: string;
    tokens: number;
    cost: string;
    status: 'live' | 'sandbox';
  };
  isWinner?: boolean;
}

interface ChatColumnProps {
  model: ModelDef;
  messages: ChatMessage[];
  onPickWinner: (messageId: string, modelId: string) => void;
  winnerModelId: string | null;
  onSelectPromptSuggestion: (prompt: string) => void;
  isGenerating: boolean;
}

export const ChatColumn: React.FC<ChatColumnProps> = ({
  model,
  messages,
  onPickWinner,
  winnerModelId,
  onSelectPromptSuggestion,
  isGenerating
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-scroll to bottom of thread when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWinnerClick = (msgId: string, e: React.MouseEvent) => {
    onPickWinner(msgId, model.id);
    // Fire festive confetti
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: [model.color, '#F59E0B', '#10B981', '#0EA5E9']
    });
  };

  const isModelWinner = winnerModelId === model.id;

  return (
    <div
      className={`flex flex-col h-full bg-[#0F172A]/70 border rounded-2xl overflow-hidden transition-all duration-300 relative shadow-lg ${
        isModelWinner
          ? 'border-amber-400/80 ring-2 ring-amber-400/30 bg-[#0F172A]'
          : 'border-slate-800/90 hover:border-slate-700/80'
      }`}
    >
      {/* ── Top Column Header ── */}
      <div className="px-3.5 py-2.5 border-b border-slate-800 bg-[#111C2E]/90 backdrop-blur-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-sm shrink-0 font-medium"
            style={{ backgroundColor: `${model.color}25`, border: `1px solid ${model.color}50` }}
          >
            {model.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs text-slate-100 truncate font-sans">
                {model.name}
              </h3>
              {isModelWinner && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-bold bg-amber-400 text-slate-950 rounded-full shadow-sm animate-pulse">
                  <Trophy className="w-2.5 h-2.5 fill-current" /> Winner
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>{model.provider}</span>
              <span>•</span>
              <span className="text-slate-500 font-mono">{model.badge}</span>
            </div>
          </div>
        </div>

        {/* Column Stats / Live Tag */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: model.color }}
          />
        </div>
      </div>

      {/* ── Messages Container (Independent Scroll) ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-4 scroll-smooth focus:outline-none"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 select-none">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner"
              style={{ backgroundColor: `${model.color}15`, border: `1px solid ${model.color}30` }}
            >
              {model.avatar}
            </div>
            <h4 className="font-medium text-xs text-slate-200 mb-1">
              {model.name} Thread
            </h4>
            <p className="text-[11px] text-slate-400 max-w-[220px] mb-4">
              Send a prompt below to see how {model.name} compares in real-time.
            </p>

            <div className="w-full max-w-[260px] space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                Try asking:
              </span>
              {[
                'Python code for calculator',
                'React counter component with reset',
                'SQL query to find top 5 highest earners'
              ].map((sug, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => onSelectPromptSuggestion(sug)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 hover:border-slate-700 hover:bg-slate-800/70 transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{sug}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Render Messages */
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {msg.role === 'user' ? (
                /* User Bubble: Clean dark navy pill on right */
                <div className="bg-[#1E293B] border border-slate-700/80 text-slate-100 px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[90%] text-xs shadow-sm font-sans whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
              ) : (
                /* Assistant Bubble: Clean white card on left */
                <div
                  className={`w-full bg-[#182335] text-slate-100 border rounded-2xl rounded-tl-sm p-3.5 shadow-md transition-all ${
                    msg.isWinner
                      ? 'border-amber-400/70 ring-1 ring-amber-400/40'
                      : 'border-slate-700/70'
                  }`}
                >
                  {/* Assistant Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{model.avatar}</span>
                      <span className="text-[11px] font-semibold text-slate-200">
                        {model.name}
                      </span>
                      {msg.stats?.status === 'live' && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-950 border border-emerald-700 text-emerald-300 rounded">
                          LIVE API
                        </span>
                      )}
                    </div>

                    {msg.stats && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-0.5" title="Latency">
                          <Clock className="w-2.5 h-2.5 text-cyan-400" />
                          {msg.stats.latency}
                        </span>
                        <span className="flex items-center gap-0.5" title="Token count">
                          <Zap className="w-2.5 h-2.5 text-amber-400" />
                          {msg.stats.tokens}t
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Text with Markdown formatting */}
                  <div className="text-xs leading-relaxed text-slate-200 space-y-2">
                    <MarkdownRenderer
                      text={msg.displayedContent ?? msg.content}
                      isStreaming={msg.isStreaming}
                    />
                  </div>

                  {/* Footer Action Icons */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {/* Pick Winner Button */}
                      <button
                        onClick={(e) => handleWinnerClick(msg.id, e)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                          msg.isWinner
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700/80'
                        }`}
                        title="Pick this model as the winner for this prompt"
                      >
                        <Trophy className="w-3 h-3" />
                        <span>{msg.isWinner ? 'Winner' : 'Pick Winner'}</span>
                      </button>

                      {/* Copy Full Answer */}
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition-all"
                        title="Copy full response text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {msg.stats?.cost && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {msg.stats.cost}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Markdown & Code Block Formatter ─────────────────────────────────────────

interface MarkdownRendererProps {
  text: string;
  isStreaming?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ text, isStreaming }) => {
  // Parse code blocks vs regular paragraphs
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // It's a code block
          const lines = part.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = !firstLine.includes(' ') && firstLine.length > 0;
          const language = hasLang ? firstLine : 'code';
          const codeBody = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <CodeSnippet
              key={index}
              language={language}
              code={codeBody}
            />
          );
        }

        // Standard markdown text
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: renderRichText(part) }}
          />
        );
      })}
      {isStreaming && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 animate-pulse align-middle" />
      )}
    </div>
  );
};

interface CodeSnippetProps {
  language: string;
  code: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-xl border border-slate-700/80 bg-[#0B0F17] overflow-hidden text-xs shadow-inner">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#111827] border-b border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase text-[10px] text-cyan-300 font-semibold tracking-wider">
            {language}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-slate-200 whitespace-pre">
        <code>{code}</code>
      </div>
    </div>
  );
};

function renderRichText(raw: string): string {
  if (!raw) return '';

  return raw
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px]">$1</code>')
    // Bold **text**
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-xs font-bold text-cyan-300 mt-2 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-sm font-bold text-slate-100 mt-2.5 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-base font-bold text-white mt-3 mb-1.5">$1</h1>')
    // Bullet list items
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-300 my-0.5">$1</li>')
    // Numbered list items
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-300 my-0.5">$1</li>')
    // Newlines
    .replace(/\n/g, '<br/>');
}
