export type NavTab = 'Home' | 'Ask' | 'Compare' | 'Verify' | 'Files';

export interface ModelDef {
  id: string;
  name: string;
  provider: string;
  color: string;
  avatar: string;
  badge: string;
}

export const AVAILABLE_MODELS: ModelDef[] = [
  {
    id: 'gpt4o',
    name: 'ChatGPT (GPT-4o)',
    provider: 'OpenAI',
    color: '#10B981',
    avatar: '🤖',
    badge: 'Enterprise'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    color: '#F59E0B',
    avatar: '🧠',
    badge: 'Cognitive'
  },
  {
    id: 'gemini',
    name: 'Gemini (Live API)',
    provider: 'Google DeepMind',
    color: '#0EA5E9',
    avatar: '✨',
    badge: 'Live Key'
  },
  {
    id: 'groq',
    name: 'Llama 3.3 (Groq)',
    provider: 'Groq / Meta',
    color: '#F97316',
    avatar: '⚡',
    badge: 'Ultra-Fast'
  }
];
