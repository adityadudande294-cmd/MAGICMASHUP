/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          deep: "#0B0F17",
          surface: "#151D2A",
          border: "#1E293B",
          hover: "#1E293B80",
          cardElevated: "#182232",
        },
        text: {
          titanium: "#F8FAFC",
          muted: "#94A3B8",
          dim: "#64748B",
        },
        model: {
          gemini: "#06B6D4",
          geminiLight: "#22D3EE",
          openai: "#10B981",
          openaiLight: "#34D399",
          claude: "#F59E0B",
          claudeLight: "#D97706",
          perplexity: "#6366F1",
          groq: "#F97316",
        },
        accent: {
          violet: "#8B5CF6",
          indigo: "#6366F1",
          cyan: "#06B6D4",
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-tangerine': '0 0 25px -5px rgba(249, 115, 22, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
