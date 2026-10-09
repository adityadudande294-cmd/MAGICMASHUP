import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  accentColor?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  isStreaming,
  accentColor = '#8B5CF6'
}) => {
  if (!content) {
    return isStreaming ? (
      <div className="flex items-center gap-2 text-text-muted py-6">
        <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
        <span className="text-sm font-medium animate-pulse">Initializing inference stream...</span>
      </div>
    ) : null;
  }

  // Split code blocks from regular text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-body space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return <CodeBlock key={index} codeChunk={part} />;
        }
        return <FormattedText key={index} text={part} />;
      })}
      {isStreaming && (
        <span
          className="streaming-cursor"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
};

const CodeBlock: React.FC<{ codeChunk: string }> = ({ codeChunk }) => {
  const [copied, setCopied] = useState(false);

  // Extract language and code
  const match = codeChunk.match(/^```(\w+)?\n([\s\S]*?)```$/);
  const language = match ? match[1] || 'plaintext' : 'plaintext';
  const code = match ? match[2] : codeChunk.slice(3, -3);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-canvas-border bg-[#0D131F] group">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#121B2B] border-b border-canvas-border/80 text-xs font-mono text-text-muted">
        <span className="text-cyan-400 font-semibold uppercase text-[10px] tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-text-muted hover:text-text-titanium hover:bg-canvas-surface transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-[#E2E8F0]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Headers
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-sm font-semibold text-text-titanium mt-3 mb-1">
              {parseInlineMarkdown(trimmed.replace('#### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base font-bold text-text-titanium mt-4 mb-1.5 flex items-center gap-1.5">
              {parseInlineMarkdown(trimmed.replace('### ', ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg font-bold text-text-titanium mt-5 mb-2 pb-1 border-b border-canvas-border">
              {parseInlineMarkdown(trimmed.replace('## ', ''))}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl font-extrabold text-text-titanium mt-6 mb-2">
              {parseInlineMarkdown(trimmed.replace('# ', ''))}
            </h1>
          );
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-2 border-accent-violet pl-3 my-2 text-text-muted italic bg-canvas-cardElevated/40 py-1 rounded-r">
              {parseInlineMarkdown(trimmed.replace('> ', ''))}
            </blockquote>
          );
        }

        // Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-0.5 text-sm text-[#E2E8F0]">
              <span className="text-accent-cyan mt-1 text-xs">•</span>
              <span className="flex-1">{parseInlineMarkdown(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-0.5 text-sm text-[#E2E8F0]">
              <span className="text-text-muted font-mono text-xs mt-0.5">{numMatch[1]}.</span>
              <span className="flex-1">{parseInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }

        // Table lines
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (trimmed.includes('---')) {
            return null; // separator row handled implicitly
          }
          const cells = trimmed
            .split('|')
            .filter((_, i, arr) => i > 0 && i < arr.length - 1)
            .map(c => c.trim());

          const isHeader = idx > 0 && lines[idx + 1]?.trim().includes('---');

          return (
            <div key={idx} className={`grid grid-flow-col auto-cols-fr gap-2 px-3 py-1.5 text-xs border-b border-canvas-border ${isHeader ? 'bg-canvas-cardElevated font-semibold text-text-titanium' : 'text-text-muted hover:bg-canvas-surface/50'}`}>
              {cells.map((cell, cIdx) => (
                <div key={cIdx} className="truncate">
                  {parseInlineMarkdown(cell)}
                </div>
              ))}
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-sm leading-relaxed text-[#E2E8F0] my-1">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </>
  );
};

// Helper to parse inline markdown: **bold**, *italic*, `code`, and links
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-text-titanium">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith('*') && tok.endsWith('*')) {
      return (
        <em key={i} className="italic text-text-muted">
          {tok.slice(1, -1)}
        </em>
      );
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code
          key={i}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-[#1C2638] text-cyan-300 border border-slate-700/60"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return tok;
  });
}
