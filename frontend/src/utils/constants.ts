import type { ModelSpec, QuickPrompt } from '../types';

export const DEFAULT_MODELS: ModelSpec[] = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google DeepMind',
    version: 'v1.5-pro-preview',
    color_hex: '#06B6D4',
    glow_color: 'rgba(6, 182, 212, 0.35)',
    tagline: 'Ambient Electric Cyan • 2M Context & Multimodal Depth',
    tier: 'Tier 1 (Real API / Hybrid)',
    input_cost_per_m: 3.50,
    output_cost_per_m: 10.50,
    typical_latency_ms: 280,
    context_window_k: 2000,
    strengths: ['Long-context synthesis', 'Multimodal comprehension', 'Complex code architectures']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omniscience',
    provider: 'OpenAI',
    version: '2024-11-20',
    color_hex: '#10B981',
    glow_color: 'rgba(16, 185, 129, 0.35)',
    tagline: 'Botanical Emerald • Institutional Rigor & Compliance',
    tier: 'Tier 3 (Enterprise Sandbox Fallback)',
    input_cost_per_m: 2.50,
    output_cost_per_m: 10.00,
    typical_latency_ms: 390,
    context_window_k: 128,
    strengths: ['Structured enterprise schemas', 'Compliance analysis', 'Deterministic logic']
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    version: '20241022',
    color_hex: '#F59E0B',
    glow_color: 'rgba(245, 158, 11, 0.35)',
    tagline: 'Warm Cognitive Amber • Superior Nuance & System Architecture',
    tier: 'Tier 3 (Enterprise Sandbox Fallback)',
    input_cost_per_m: 3.00,
    output_cost_per_m: 15.00,
    typical_latency_ms: 310,
    context_window_k: 200,
    strengths: ['Nuanced human communication', 'Full-stack code generation', 'Philosophical reasoning']
  },
  {
    id: 'perplexity-sonar-deep',
    name: 'Perplexity Sonar Deep',
    provider: 'Perplexity AI',
    version: 'sonar-pro-v2',
    color_hex: '#6366F1',
    glow_color: 'rgba(99, 102, 241, 0.35)',
    tagline: 'Cobalt Indigo • Deep Live Web Grounding & Real-Time Citations',
    tier: 'Tier 3 (Enterprise Sandbox Fallback)',
    input_cost_per_m: 3.00,
    output_cost_per_m: 15.00,
    typical_latency_ms: 450,
    context_window_k: 128,
    strengths: ['Real-time fact checking', 'Academic citation linking', 'Current-year data retrieval']
  },
  {
    id: 'llama-3.3-70b-groq',
    name: 'Llama 3.3 70B (Groq LPU)',
    provider: 'Groq / Meta',
    version: 'Versatile-LPUSpeed',
    color_hex: '#F97316',
    glow_color: 'rgba(249, 115, 22, 0.35)',
    tagline: 'Cyber Tangerine • Blazing Instantaneous LPU Throughput (~300 tps)',
    tier: 'Tier 2 (Ultra-fast Real API / Groq)',
    input_cost_per_m: 0.59,
    output_cost_per_m: 0.79,
    typical_latency_ms: 95,
    context_window_k: 128,
    strengths: ['Ultra-low TTFT (<100ms)', 'High concurrency pipelining', 'Cost-efficient bulk inference']
  }
];

export const ENTERPRISE_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'executive-summary',
    category: 'Strategy & Leadership',
    title: 'Executive Summary',
    description: 'Compresses complex findings into an actionable C-suite briefing with key risks and strategic milestones.',
    prompt: 'Please draft an authoritative Executive Summary for a Fortune 500 board: synthesize the strategic problem, quantify economic trade-offs, detail risk mitigation steps, and provide a 90-day execution roadmap.',
    iconName: 'Briefcase'
  },
  {
    id: 'contract-clause',
    category: 'Legal & Compliance',
    title: 'Contract Clause Extraction',
    description: 'Audits indemnification caps, IP ownership, liability exclusions, and compliance obligations.',
    prompt: 'Act as a Senior Corporate General Counsel. Audit the following commercial clause: identify indemnity ambiguities, uncapped liability traps, cross-border GDPR/data residency non-compliance, and draft an enforceable counter-clause.',
    iconName: 'FileCheck2'
  },
  {
    id: 'refactor-clean-code',
    category: 'Engineering Architecture',
    title: 'Refactor Clean Code',
    description: 'Transforms code into hardened, zero-backpressure, type-safe production architecture with high concurrency.',
    prompt: 'Refactor this implementation into production-grade, zero-backpressure architecture. Apply defensive boundary validation, strict TypeScript/Python typing, circuit breaker patterns, and benchmark theoretical time/space complexity.',
    iconName: 'Code2'
  },
  {
    id: 'fact-check-divergences',
    category: 'Research & Verification',
    title: 'Fact-Check Divergences',
    description: 'Cross-examines conflicting vendor claims, empirical benchmarks, and isolates source provenance.',
    prompt: 'Conduct a rigorous empirical fact-check on current industry benchmarks: cross-reference throughput, TTFT latency claims, verify source provenance with academic/industry citations, and isolate conflicting divergences.',
    iconName: 'CheckCircle2'
  },
  {
    id: 'cost-optimization-audit',
    category: 'FinOps & Infrastructure',
    title: 'FinOps Cost Audit',
    description: 'Calculates unit economics, token consumption curves, and model routing strategies to cut OPEX by 60%.',
    prompt: 'Provide a FinOps Cost Intelligence Audit for high-scale LLM inference (10M requests/month): compare cost-per-token curves across frontier models vs Groq LPUs, and outline a tiered routing architecture to minimize monthly OPEX.',
    iconName: 'DollarSign'
  },
  {
    id: 'security-zero-trust',
    category: 'Cybersecurity',
    title: 'Zero-Trust Security Review',
    description: 'Analyzes prompt injection vulnerabilities, data leakage vectors, and SOC 2 Type II controls.',
    prompt: 'Perform a comprehensive Zero-Trust Security Review: evaluate vulnerabilities against prompt injection, memory poisoning, PII leakage, and outline an automated audit trail policy compliant with SOC 2 Type II and ISO 27001.',
    iconName: 'ShieldAlert'
  }
];

export const BACKEND_URL = 'http://127.0.0.1:8000';
