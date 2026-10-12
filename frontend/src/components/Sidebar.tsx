import React from 'react';
import {
  Home,
  MessageSquare,
  Columns2,
  ShieldCheck,
  FolderOpen,
  Plus,
  Clock,
  Settings,
  UserCheck
} from 'lucide-react';
import type { NavTab } from '../utils/models';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  onNewConversation: () => void;
  recentSessions?: string[];
  onSelectRecentSession?: (sessionTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onNewConversation,
  recentSessions = [
    'Python Calculator Benchmark',
    'Microservices Architecture',
    'SQL Query Optimization',
    'React Counter Patterns'
  ],
  onSelectRecentSession
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Ask', label: 'Ask', icon: MessageSquare },
    { id: 'Compare', label: 'Compare', icon: Columns2, badge: 'Split Studio' },
    { id: 'Verify', label: 'Verify', icon: ShieldCheck },
    { id: 'Files', label: 'Files', icon: FolderOpen }
  ];

  return (
    <aside className="w-64 h-screen bg-[#0B132B] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-40 text-slate-200">
      {/* ── Top Header & Branding ── */}
      <div>
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/ampexweb-logo.png"
              alt="Ampexweb Logo"
              className="h-7 w-7 rounded-lg object-contain bg-white/95 p-0.5 shadow-sm ring-1 ring-white/20 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  MagicMashup
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-cyan-400">
                  By Ampexweb
                </span>
                <span className="text-[10px] text-slate-500">•</span>
                <span className="text-[10px] text-slate-400">AI Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Primary Action: + New Conversation ── */}
        <div className="p-3">
          <button
            onClick={onNewConversation}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* ── Navigation Tabs ── */}
        <nav className="px-3 py-1.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 rounded uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Recent Conversations Section ── */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <span>Recent History</span>
            <button
              onClick={() => setCurrentTab('Compare')}
              className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-1">
            {recentSessions.map((session, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onSelectRecentSession) onSelectRecentSession(session);
                  setCurrentTab('Compare');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors text-left truncate group"
              >
                <Clock className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                <span className="truncate">{session}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Section: User Profile & Plan ── */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080E20] space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
              MM
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  Enterprise User
                </span>
                <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                Enterprise Tier
              </span>
            </div>
          </div>
          <button
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Ampexweb Footer Branding */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <img
            src="/ampexweb-logo.png"
            alt="Ampexweb"
            className="h-4 w-4 rounded-sm object-contain bg-white/90 p-0.5 shrink-0"
          />
          <span>Powered by <strong className="text-slate-300">Ampexweb</strong></span>
        </div>
      </div>
    </aside>
  );
};
