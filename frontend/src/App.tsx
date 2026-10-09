import './index.css';
import { useState, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { CompareStudio } from './components/CompareStudio';
import { AskView } from './components/AskView';
import { VerifyAndFilesView } from './components/VerifyAndFilesView';
import { AVAILABLE_MODELS, type NavTab } from './utils/models';
import { type ChatMessage } from './components/ChatColumn';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  // Navigation tab state: 'Home' is the default landing hub
  const [currentTab, setCurrentTab] = useState<NavTab>('Home');

  // Compare Studio settings
  const [splitMode, setSplitMode] = useState<2 | 3 | 4>(4);
  const [activeModelIds, setActiveModelIds] = useState<string[]>([
    'gpt4o',
    'claude',
    'gemini',
    'groq'
  ]);

  // Persistent messages per model ID across tab switches
  const [columnMessages, setColumnMessages] = useState<Record<string, ChatMessage[]>>({
    gpt4o: [],
    claude: [],
    gemini: [],
    groq: []
  });

  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [winnerModelId, setWinnerModelId] = useState<string | null>(null);

  // Recent history titles
  const [recentSessions, setRecentSessions] = useState<string[]>([
    'Python Calculator Benchmark',
    'Microservices Architecture',
    'SQL Query Optimization',
    'React Counter Patterns'
  ]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const animationFrameRefs = useRef<Record<string, number>>({});

  // Pick winner
  const handlePickWinner = (messageId: string, modelId: string) => {
    setWinnerModelId(modelId);
    setColumnMessages((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((mId) => {
        next[mId] = next[mId].map((msg) => ({
          ...msg,
          isWinner: mId === modelId && msg.id === messageId
        }));
      });
      return next;
    });
  };

  // Fast typewriter streaming
  const streamText = (
    modelId: string,
    messageId: string,
    fullText: string,
    onComplete?: () => void
  ) => {
    let index = 0;
    const chunkSize = 6;

    const step = () => {
      index = Math.min(index + chunkSize, fullText.length);
      const currentChunk = fullText.slice(0, index);

      setColumnMessages((prev) => {
        const currentList = prev[modelId] || [];
        return {
          ...prev,
          [modelId]: currentList.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  displayedContent: currentChunk,
                  isStreaming: index < fullText.length
                }
              : msg
          )
        };
      });

      if (index < fullText.length) {
        animationFrameRefs.current[modelId] = requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationFrameRefs.current[modelId] = requestAnimationFrame(step);
  };

  // Broadcast prompt across all active models in Compare view
  const handleBroadcast = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    setWinnerModelId(null);
    setPrompt('');

    // Add to recent sessions if unique
    const shortTitle = trimmed.length > 30 ? `${trimmed.slice(0, 30)}...` : trimmed;
    setRecentSessions((prev) => [shortTitle, ...prev.filter((t) => t !== shortTitle)].slice(0, 6));

    const timestamp = Date.now();
    const userMsgId = `user-${timestamp}`;
    const assistantMsgId = `assistant-${timestamp}`;

    const displayedModels = AVAILABLE_MODELS.filter((m) =>
      activeModelIds.includes(m.id)
    ).slice(0, splitMode);
    const targetModelIds = displayedModels.map((m) => m.id);

    // 1. Immediately append user bubble & assistant placeholder to all displayed columns
    setColumnMessages((prev) => {
      const next = { ...prev };
      targetModelIds.forEach((mId) => {
        const existing = next[mId] || [];
        next[mId] = [
          ...existing,
          {
            id: `${userMsgId}-${mId}`,
            role: 'user',
            content: trimmed,
            timestamp
          },
          {
            id: `${assistantMsgId}-${mId}`,
            role: 'assistant',
            content: '',
            displayedContent: '',
            isStreaming: true,
            timestamp: timestamp + 1
          }
        ];
      });
      return next;
    });

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          models: targetModelIds
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const results: Array<{
        model_id: string;
        text: string;
        latency: string;
        cost: string;
        tokens: number;
        status: 'live' | 'sandbox';
      }> = data.results || [];

      // 2. Stream responses concurrently
      let completedStreams = 0;
      const totalStreams = results.length;

      if (totalStreams === 0) {
        setIsGenerating(false);
      }

      results.forEach((res) => {
        const targetModelId = res.model_id;
        const fullResponse = res.text || 'No response generated.';

        setColumnMessages((prev) => {
          const list = prev[targetModelId] || [];
          return {
            ...prev,
            [targetModelId]: list.map((msg) =>
              msg.id === `${assistantMsgId}-${targetModelId}`
                ? {
                    ...msg,
                    content: fullResponse,
                    stats: {
                      latency: res.latency,
                      tokens: res.tokens,
                      cost: res.cost,
                      status: res.status
                    }
                  }
                : msg
            )
          };
        });

        streamText(targetModelId, `${assistantMsgId}-${targetModelId}`, fullResponse, () => {
          completedStreams++;
          if (completedStreams >= totalStreams) {
            setIsGenerating(false);
          }
        });
      });
    } catch (err: unknown) {
      setIsGenerating(false);
      if ((err as Error)?.name === 'AbortError') {
        console.log('Broadcast generation cancelled.');
      } else {
        console.error('Broadcast request error:', err);
        targetModelIds.forEach((mId) => {
          setColumnMessages((prev) => {
            const list = prev[mId] || [];
            return {
              ...prev,
              [mId]: list.map((msg) =>
                msg.id === `${assistantMsgId}-${mId}`
                  ? {
                      ...msg,
                      content: `⚠️ Failed to fetch response: ${
                        (err as Error)?.message || 'Check backend connection'
                      }`,
                      displayedContent: `⚠️ Failed to fetch response. Please ensure backend is running at ${API_BASE}.`,
                      isStreaming: false
                    }
                  : msg
              )
            };
          });
        });
      }
    }
  }, [prompt, isGenerating, activeModelIds, splitMode]);

  // Stop Generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    Object.values(animationFrameRefs.current).forEach((id) =>
      cancelAnimationFrame(id)
    );
    setIsGenerating(false);

    setColumnMessages((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((mId) => {
        next[mId] = next[mId].map((msg) =>
          msg.isStreaming ? { ...msg, isStreaming: false } : msg
        );
      });
      return next;
    });
  };

  // Clear Chat History
  const handleClearChat = () => {
    handleStop();
    setColumnMessages({
      gpt4o: [],
      claude: [],
      gemini: [],
      groq: []
    });
    setWinnerModelId(null);
  };

  // New Conversation Action
  const handleNewConversation = () => {
    handleClearChat();
    setPrompt('');
    setCurrentTab('Compare');
  };

  // Export Session to Markdown
  const handleExportSession = () => {
    let md = `# MagicMashup Comparative Session Export\n`;
    md += `Exported: ${new Date().toLocaleString()}\n\n`;

    const displayedModels = AVAILABLE_MODELS.filter((m) =>
      activeModelIds.includes(m.id)
    ).slice(0, splitMode);

    displayedModels.forEach((model) => {
      md += `## 🤖 ${model.name} (${model.provider})\n\n`;
      const msgs = columnMessages[model.id] || [];
      if (msgs.length === 0) {
        md += `*No messages recorded.*\n\n`;
      } else {
        msgs.forEach((msg) => {
          if (msg.role === 'user') {
            md += `### 👤 User:\n${msg.content}\n\n`;
          } else {
            md += `### ✦ Assistant`;
            if (msg.isWinner) md += ` 🏆 [WINNER]`;
            if (msg.stats) {
              md += ` (${msg.stats.latency} • ${msg.stats.tokens} tokens • ${msg.stats.cost})`;
            }
            md += `:\n${msg.content}\n\n`;
          }
        });
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MagicMashup_session_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B12] text-slate-100 font-sans antialiased">
      {/* ── Persistent Left Sidebar (Dark Navy Enterprise Nav) ── */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onNewConversation={handleNewConversation}
        recentSessions={recentSessions}
        onSelectRecentSession={(title) => {
          setPrompt(title);
          setCurrentTab('Compare');
        }}
      />

      {/* ── Main Dynamic View Area ── */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        {currentTab === 'Home' && (
          <DashboardHome
            onNavigate={(tab) => setCurrentTab(tab)}
            onLaunchPrompt={(promptText) => {
              setPrompt(promptText);
              setCurrentTab('Compare');
            }}
          />
        )}

        {currentTab === 'Compare' && (
          <CompareStudio
            onBackToHome={() => setCurrentTab('Home')}
            splitMode={splitMode}
            setSplitMode={setSplitMode}
            activeModelIds={activeModelIds}
            setActiveModelIds={setActiveModelIds}
            columnMessages={columnMessages}
            onPickWinner={handlePickWinner}
            winnerModelId={winnerModelId}
            prompt={prompt}
            setPrompt={setPrompt}
            onBroadcast={handleBroadcast}
            isGenerating={isGenerating}
            onStop={handleStop}
            onClearChat={handleClearChat}
            onExportSession={handleExportSession}
          />
        )}

        {currentTab === 'Ask' && (
          <AskView
            onNavigateToCompare={() => setCurrentTab('Compare')}
            onSendToCompare={(question) => {
              setPrompt(question);
              setCurrentTab('Compare');
            }}
          />
        )}

        {(currentTab === 'Verify' || currentTab === 'Files') && (
          <VerifyAndFilesView
            viewType={currentTab}
            onNavigateToCompare={() => setCurrentTab('Compare')}
          />
        )}
      </div>
    </div>
  );
}
