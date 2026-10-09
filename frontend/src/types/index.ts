export interface ModelSpec {
  id: string;
  name: string;
  provider: string;
  version: string;
  color_hex: string;
  glow_color: string;
  tagline: string;
  tier: string;
  input_cost_per_m: number;
  output_cost_per_m: number;
  typical_latency_ms: number;
  context_window_k: number;
  strengths: string[];
}

export interface ModelMetric {
  model_id: string;
  ttft_ms: number;
  total_duration_sec: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  tokens_per_sec: number;
  estimated_cost_usd: number;
  is_live_api: boolean;
}

export interface ModelState {
  id: string;
  spec: ModelSpec;
  status: 'idle' | 'streaming' | 'completed' | 'error';
  content: string;
  error?: string;
  metric?: ModelMetric;
  isWinner?: boolean;
}

export interface OrchestrationSummary {
  total_models_evaluated?: number;
  fastest_model?: string;
  fastest_ttft_ms?: number;
  cheapest_model?: string;
  cheapest_cost_usd?: number;
  total_tokens_generated?: number;
  total_cost_usd?: number;
  total_wall_time_sec?: number;
  debate_mode?: boolean;
  rounds_completed?: number;
}

export interface SynthesizeResponse {
  executive_summary: string;
  consensus_matrix: string[];
  divergences_and_tradeoffs: string[];
  model_superlatives: Record<string, string>;
  decisive_recommendation: string;
  synthesized_full_report: string;
  tokens_analyzed: number;
}

export interface QuickPrompt {
  id: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  iconName: string;
}
