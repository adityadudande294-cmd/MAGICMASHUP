import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env file from backend root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class ModelSpec(BaseModel):
    id: str
    name: str
    provider: str
    version: str
    color_hex: str
    glow_color: str
    tagline: str
    tier: str  # "Tier 1: High Agility", "Tier 2: Ultra-Fast", etc.
    input_cost_per_m: float   # Cost in USD per 1M input tokens
    output_cost_per_m: float  # Cost in USD per 1M output tokens
    typical_latency_ms: int
    context_window_k: int
    strengths: list[str]


SUPPORTED_MODELS: dict[str, ModelSpec] = {
    "gemini-1.5-pro": ModelSpec(
        id="gemini-1.5-pro",
        name="Gemini 1.5 Pro",
        provider="Google DeepMind",
        version="v1.5-pro-preview",
        color_hex="#06B6D4",
        glow_color="rgba(6, 182, 212, 0.35)",
        tagline="Ambient Electric Cyan • 2M Context & Multimodal Depth",
        tier="Tier 1 (Real API / Hybrid)",
        input_cost_per_m=3.50,
        output_cost_per_m=10.50,
        typical_latency_ms=280,
        context_window_k=2000,
        strengths=["Long-context synthesis", "Multimodal comprehension", "Complex code architectures"]
    ),
    "gpt-4o": ModelSpec(
        id="gpt-4o",
        name="GPT-4o Omniscience",
        provider="OpenAI",
        version="2024-11-20",
        color_hex="#10B981",
        glow_color="rgba(16, 185, 129, 0.35)",
        tagline="Botanical Emerald • Institutional Rigor & Compliance",
        tier="Tier 3 (Enterprise Sandbox Fallback)",
        input_cost_per_m=2.50,
        output_cost_per_m=10.00,
        typical_latency_ms=390,
        context_window_k=128,
        strengths=["Structured enterprise schemas", "Compliance analysis", "Deterministic logic"]
    ),
    "claude-3-5-sonnet": ModelSpec(
        id="claude-3-5-sonnet",
        name="Claude 3.5 Sonnet",
        provider="Anthropic",
        version="20241022",
        color_hex="#F59E0B",
        glow_color="rgba(245, 158, 11, 0.35)",
        tagline="Warm Cognitive Amber • Superior Nuance & System Architecture",
        tier="Tier 3 (Enterprise Sandbox Fallback)",
        input_cost_per_m=3.00,
        output_cost_per_m=15.00,
        typical_latency_ms=310,
        context_window_k=200,
        strengths=["Nuanced human communication", "Full-stack code generation", "Philosophical reasoning"]
    ),
    "perplexity-sonar-deep": ModelSpec(
        id="perplexity-sonar-deep",
        name="Perplexity Sonar Deep",
        provider="Perplexity AI",
        version="sonar-pro-v2",
        color_hex="#6366F1",
        glow_color="rgba(99, 102, 241, 0.35)",
        tagline="Cobalt Indigo • Deep Live Web Grounding & Real-Time Citations",
        tier="Tier 3 (Enterprise Sandbox Fallback)",
        input_cost_per_m=3.00,
        output_cost_per_m=15.00,
        typical_latency_ms=450,
        context_window_k=128,
        strengths=["Real-time fact checking", "Academic citation linking", "Current-year data retrieval"]
    ),
    "llama-3.3-70b-groq": ModelSpec(
        id="llama-3.3-70b-groq",
        name="Llama 3.3 70B (Groq LPU)",
        provider="Groq / Meta",
        version="Versatile-LPUSpeed",
        color_hex="#F97316",
        glow_color="rgba(249, 115, 22, 0.35)",
        tagline="Cyber Tangerine • Blazing Instantaneous LPU Throughput (~300 tps)",
        tier="Tier 2 (Ultra-fast Real API / Groq)",
        input_cost_per_m=0.59,
        output_cost_per_m=0.79,
        typical_latency_ms=95,
        context_window_k=128,
        strengths=["Ultra-low TTFT (<100ms)", "High concurrency pipelining", "Cost-efficient bulk inference"]
    ),
}

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "").strip()

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
_raw_cors = os.getenv("CORS_ORIGINS", "*").strip()
CORS_ORIGINS = ["*"] if _raw_cors == "*" else [
    origin.strip()
    for origin in _raw_cors.split(",")
    if origin.strip()
]
