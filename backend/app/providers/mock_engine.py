import asyncio
import random
import time
from typing import AsyncGenerator
from app.config import SUPPORTED_MODELS
from app.models import ModelMetric


def generate_heuristic_response(
    model_id: str,
    prompt: str,
    is_debate: bool = False,
    prior_context: str | None = None
) -> str:
    lower_prompt = prompt.lower()
    
    # Prompt type detection
    is_code = any(kw in lower_prompt for kw in ["code", "refactor", "function", "api", "typescript", "python", "bug", "architecture", "docker", "sql", "backend", "frontend"])
    is_legal = any(kw in lower_prompt for kw in ["contract", "clause", "legal", "compliance", "liability", "terms", "nda", "gdpr", "sox"])
    is_exec = any(kw in lower_prompt for kw in ["executive", "summary", "roi", "strategy", "budget", "cost", "business", "briefing", "market"])
    is_fact_check = any(kw in lower_prompt for kw in ["fact", "check", "truth", "verify", "benchmark", "accuracy", "divergence", "compare"])

    # If in Debate Mode
    if is_debate and prior_context:
        return _build_debate_response(model_id, prompt, prior_context)

    # Model specific persona content
    if model_id == "gemini-1.5-pro":
        return _build_gemini_response(prompt, is_code, is_legal, is_exec, is_fact_check)
    elif model_id == "gpt-4o":
        return _build_gpt4o_response(prompt, is_code, is_legal, is_exec, is_fact_check)
    elif model_id == "claude-3-5-sonnet":
        return _build_claude_response(prompt, is_code, is_legal, is_exec, is_fact_check)
    elif model_id == "perplexity-sonar-deep":
        return _build_perplexity_response(prompt, is_code, is_legal, is_exec, is_fact_check)
    elif model_id == "llama-3.3-70b-groq":
        return _build_groq_response(prompt, is_code, is_legal, is_exec, is_fact_check)
    else:
        return _build_generic_response(model_id, prompt)


def _build_debate_response(model_id: str, prompt: str, prior_context: str) -> str:
    speakers = {
        "gemini-1.5-pro": ("Gemini 1.5 Pro", "Computational Systems Perspective"),
        "gpt-4o": ("GPT-4o Omniscience", "Regulatory & Enterprise Risk Perspective"),
        "claude-3-5-sonnet": ("Claude 3.5 Sonnet", "Nuanced Cognitive Ergonomics & Architecture"),
        "perplexity-sonar-deep": ("Perplexity Sonar Deep", "Empirical Web Evidence & Real-Time Auditing"),
        "llama-3.3-70b-groq": ("Llama 3.3 70B (Groq)", "High-Throughput Algorithmic Pragmatism")
    }
    name, role = speakers.get(model_id, (model_id, "Analyst"))
    truncated_prompt = prompt[:80]
    
    return f"""### 🎙️ Debate Rebuttal & Cross-Examination: {name}
*Perspective: {role}*

> **Prior Consensus Evaluated:** Reviewing prior deliberations regarding "{truncated_prompt}..."

#### 1. Critical Analysis of Prior Arguments
While the preceding models established a solid foundational thesis, their analysis exhibits several critical blind spots:
- **Architectural Trade-Offs:** The previous recommendations assume uniform latency SLAs without accounting for cold-start spikes and token rate-limit penalties.
- **Hidden Cost Vectors:** When scaling to 10M+ daily events, operational expenditure escalates non-linearly if dynamic token caching is omitted.

#### 2. Key Counter-Proposal & Value Augmentation
To reconcile divergent opinions, I propose a **hybrid convergence matrix**:
1. **Tiered Execution Strategy:** Enforce strict asynchronous worker separation to decouple compute-intensive transformations from live UI threads.
2. **Defensive Validation Boundary:** Inject strict runtime boundary assertions rather than relying purely on client-side type inference.

```typescript
// Proposed Consensus Convergence Hook
export interface ConsensusDirective {{
  directiveId: string;
  confidenceScore: number;
  validationLayer: 'kernel' | 'runtime' | 'audit';
  executionCostMs: number;
}}
```

#### 3. Decisive Verdict
We should endorse a bifurcated approach: prioritize deterministic throughput for core pipelines, and reserve high-reasoning models for edge arbitration and anomaly resolution.
"""


def _build_gemini_response(prompt: str, is_code: bool, is_legal: bool, is_exec: bool, is_fact_check: bool) -> str:
    if is_code:
        return """### ⚡ Architectural Analysis & Implementation (Gemini 1.5 Pro)

Leveraging multi-modal contextual reasoning, here is an enterprise-grade solution engineered for high-concurrency resilience.

#### 1. System Topology & Data Flow
- **Decoupled Event Streaming:** Utilizes non-blocking asynchronous generators with zero-backpressure buffering.
- **Fail-Safe Circuit Breaker:** Implements exponential backoff with jitter to eliminate thundering herd failures.

```typescript
/**
 * Production-grade Concurrent Worker Streamer
 * Optimized for Gemini 1.5 Pro 2M Token Context Window
 */
export class DistributedStreamEngine<T> {
  private activeStreams = new Map<string, AbortController>();

  async executeConcurrentPipeline(
    tasks: Array<() => Promise<T>>,
    concurrencyLimit: number = 5
  ): Promise<T[]> {
    const results: T[] = [];
    const pool = new Set<Promise<void>>();

    for (const task of tasks) {
      const promise = task().then(res => {
        results.push(res);
      }).finally(() => pool.delete(promise));

      pool.add(promise);
      if (pool.size >= concurrencyLimit) {
        await Promise.race(pool);
      }
    }
    await Promise.all(pool);
    return results;
  }
}
```

#### 2. Benchmark & Resource Footprint
| Metric | Baseline | Gemini 1.5 Pro Target | Delta |
| :--- | :--- | :--- | :--- |
| **Max Context Depth** | 128k Tokens | **2,000,000 Tokens** | +1,460% |
| **Throughput (TPS)** | 48 tps | **85-110 tps** | +129% |
| **P99 Latency** | 420ms | **265ms** | -36.9% |

**Recommendation:** Deploy with distributed caching layers enabled for maximum operational efficiency.
"""

    if is_legal:
        return f"""### ⚖️ Enterprise Regulatory & Governance Analysis (Gemini 1.5 Pro)

*Target Inquiry:* `{prompt}`

#### 1. Legal Risk Taxonomy
1. **Contractual Indemnification & Liability Limits:**
   - Standard liability caps must explicitly exclude deliberate breach and gross negligence.
   - Cross-border data residency provisions must comply with EU Standard Contractual Clauses (SCCs).
2. **Intellectual Property Safeguards:**
   - Ensure an unambiguous non-encumbrance warranty on all synthesized deliverables.

#### 2. Executive Action Checklist
- [x] Integrate SOC 2 Type II audit trail telemetry into all automated pipelines.
- [ ] Establish mutual dispute arbitration forums under neutral legal jurisdictions.
- [ ] Review annual aggregate liability ceiling (recommend capping at 12 months trailing fees).
"""

    return f"""### 🌐 Comprehensive Solution Blueprint (Gemini 1.5 Pro)

Addressing your query: **"{prompt}"**

#### 1. Executive Synopsis
From a high-dimensional systems perspective, the core requirements can be deconstructed into three interdependent pillars:
1. **Algorithmic Scalability:** Designing for unbounded horizontal expansion without state bottlenecking.
2. **Context Preservation:** Capitalizing on long-context retention to maintain institutional memory across distributed teams.
3. **Deterministic Governance:** Establishing transparent telemetry metrics at every juncture.

#### 2. Strategic Implementation Matrix
- **Phase 1 (Immediate - 30 Days):** Consolidate redundant pipelines into unified orchestration buses.
- **Phase 2 (Medium Term - 90 Days):** Deploy automated heuristic evaluation agents to quantify divergence.
- **Phase 3 (Enterprise Scale):** Enable continuous multi-model benchmarking against corporate KPIs.

```json
{{
  "orchestration_status": "OPTIMAL",
  "recommended_architecture": "Decoupled Async SSE",
  "concurrency_ceiling": 50,
  "cost_efficiency_rating": "A+"
}}
```

*Gemini 1.5 Pro computational verification completed successfully.*
"""


def _build_gpt4o_response(prompt: str, is_code: bool, is_legal: bool, is_exec: bool, is_fact_check: bool) -> str:
    if is_code:
        return """### 🛡️ Enterprise Engineering Standards & Reference Code (GPT-4o)

Here is a hardened, production-grade implementation compliant with ISO 27001 and enterprise architectural patterns.

#### 1. Design Principles
- **Strict Defensive Validation:** Validates all ingress payloads via compile-time and runtime schemas.
- **Structured Error Containment:** Gracefully handles unexpected stream interruptions without leaking stack traces.

```python
import asyncio
from typing import AsyncGenerator, Dict, Any
from pydantic import BaseModel, Field

class PayloadContract(BaseModel):
    transaction_id: str = Field(..., description="Unique UUIDv4 idempotency key")
    batch_size: int = Field(default=100, ge=1, le=1000)
    strict_mode: bool = True

class ResilientOrchestrator:
    \"\"\"Production-grade asynchronous orchestrator adhering to zero-trust standards.\"\"\"
    
    def __init__(self, timeout_seconds: float = 30.0):
        self.timeout = timeout_seconds

    async def execute_safe_dispatch(self, payload: PayloadContract) -> Dict[str, Any]:
        try:
            async with asyncio.timeout(self.timeout):
                # Simulated high-availability compute task
                await asyncio.sleep(0.05)
                return {
                    "status": "SUCCESS",
                    "transaction_id": payload.transaction_id,
                    "records_processed": payload.batch_size,
                    "compliance_verified": True
                }
        except asyncio.TimeoutError:
            return {"status": "TIMEOUT", "error": "Operation exceeded SLA threshold"}
```

#### 2. Enterprise Quality Verification
- **Test Coverage:** Unit and integration coverage targeted at **98.4%**.
- **Security Posture:** Zero third-party unvetted dependencies; zero unsafe deserialization vectors.
"""

    return f"""### 📋 Executive Institutional Briefing (GPT-4o)

**Analysis of Request:** *"{prompt}"*

#### 1. Core Findings & Strategic Assessment
Organizations seeking institutional resilience must prioritize verifiable consistency over speculative velocity:
- **Structural Governance:** Standard operating procedures must be programmatically enforced rather than culturally assumed.
- **Cost Allocation Intelligence:** Every compute or cognitive transaction must carry an auditable cost center tag to avert budget leakage.

#### 2. Risk Mitigation Framework
| Risk Dimension | Probability | Enterprise Impact | Compensating Control |
| :--- | :--- | :--- | :--- |
| **API Provider Outage** | Medium | Critical | Real-time multi-provider automated fallback |
| **Cost Runway Spikes** | High | Severe | Dynamic token rate-limiting & budgetary tripwires |
| **Data Ingestion Leak** | Low | Catastrophic | In-flight zero-knowledge masking & audit logs |

#### 3. Recommended Operational Directive
Proceed with standardized containerized deployments and lock API contract versions to ensure backward compatibility across client SDKs.
"""


def _build_claude_response(prompt: str, is_code: bool, is_legal: bool, is_exec: bool, is_fact_check: bool) -> str:
    if is_code:
        return """### 🌿 Architectural Formulation & Implementation (Claude 3.5 Sonnet)

Here is a thoughtfully composed solution designed for cognitive clarity, developer ergonomics, and rock-solid system reliability.

#### 1. Architectural Philosophy
Rather than adding unnecessary layers of abstraction, this design honors the principle of **cohesive simplicity**:
- Every component owns a singular, well-articulated responsibility.
- Type definitions are expressive, making illegal system states unrepresentable.

```typescript
// Clean Architectural Boundary Interface
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

export interface ServiceDispatcher<TInput, TOutput> {
  dispatch(input: TInput): Promise<Result<TOutput>>;
  readonly healthCheck: () => Promise<boolean>;
}

export function createResilientPipeline<T, R>(
  processor: (item: T) => Promise<R>
) {
  return async function execute(items: readonly T[]): Promise<readonly Result<R>[]> {
    return Promise.all(
      items.map(async (item) => {
        try {
          const data = await processor(item);
          return { success: true, data } as const;
        } catch (err) {
          return { 
            success: false, 
            error: err instanceof Error ? err : new Error(String(err)) 
          } as const;
        }
      })
    );
  };
}
```

#### 2. Nuanced Considerations
1. **Developer Experience (DX):** Notice how error handling is lifted into the type domain, eliminating uncaught promise rejections.
2. **Cognitive Load:** By keeping interfaces concise, onboarding engineers can understand the execution topology in under ten minutes.
"""

    return f"""### 🧭 Comprehensive Strategic Discourse (Claude 3.5 Sonnet)

Regarding: **"{prompt}"**

#### 1. Deep Contextual Framing
When evaluating complex technological or strategic dilemmas, it is helpful to look past superficial trade-offs to the underlying dynamics at play:
- **Velocity vs. Craft:** Fast iterations are only beneficial if the accrued architectural debt does not compromise foundational integrity.
- **Human-Centric Interface:** Software is ultimately an amplifier of human cognition. Workflows that require excessive context switching degrade executive decision quality.

#### 2. Key Synthesis Points
- **Unifying Disparate Data Streams:** Strive for cohesive, predictable formats rather than bespoke point-to-point couplings.
- **Empathy in Systems Design:** Design failure states that inform and empower users rather than presenting opaque error codes.

#### 3. Concluding Guidance
Invest in shared semantic schemas early. The clarity achieved at the foundational layer will yield compounding velocity gains throughout the project lifecycle.
"""


def _build_perplexity_response(prompt: str, is_code: bool, is_legal: bool, is_exec: bool, is_fact_check: bool) -> str:
    return f"""### 🔍 Verified Research & Live Synthesis (Perplexity Sonar Deep)

**Real-Time Live Web Query:** `"{prompt}"`  
*Data refreshed with real-time industry indexing & verified source citations.*

#### 1. Key Industry Findings & Empirical Data
According to recent 2025/2026 enterprise cloud reports and market intelligence [1]:
- **Adoption Trajectory:** 78% of Fortune 500 engineering teams have moved from single-vendor LLM contracts to multi-provider orchestrators to hedge against downtime and vendor price hikes [2].
- **Cost Realities:** The price per 1M input tokens for flagship models dropped by over 60% year-over-year, while specialized inference chips (such as Groq LPUs) reduced Time-To-First-Token (TTFT) down to sub-100ms thresholds [3].

#### 2. Comparative Benchmark Index
| Dimension | Industry Benchmark | Best-in-Class Target | Source Citation |
| :--- | :--- | :--- | :--- |
| **Enterprise TTFT** | 450ms - 800ms | **< 150ms** | *Gartner AI Infrastructure (2025)* [1] |
| **Availability SLA** | 99.5% | **99.99% (Multi-Cloud)** | *Cloudflare Tech Radar* [2] |
| **Token Cost / 1k Queries**| $0.12 - $0.45 | **$0.024 (Tiered Routing)** | *Stanford AI Index 2025* [4] |

#### 3. Citations & References
- **[1]** *Enterprise Generative AI Adoption & Latency Index (2025 Update)*, TechReview Analytics.
- **[2]** *Mitigating Vendor Lock-in with Hybrid Model Gateways*, Cloud Architecture Quarterly.
- **[3]** *Groq LPU Architecture Whitepaper & Sub-Second Inference Benchmarks (2025)*.
- **[4]** *Stanford AI Index Report: Cost Dynamics and Throughput Evolution*.
"""


def _build_groq_response(prompt: str, is_code: bool, is_legal: bool, is_exec: bool, is_fact_check: bool) -> str:
    truncated = prompt[:30]
    return f"""### ⚡ High-Throughput Tactical Output (Llama 3.3 70B via Groq LPU)

*Execution Metric: Instantaneous token streaming (~310 tokens/sec, TTFT < 95ms)*

#### 1. Immediate Execution Directives
Answering prompt directly without unnecessary preamble:

```bash
# High-Efficiency Execution Script
echo "Executing high-speed parallel task for: {truncated}..."
time curl -s -X POST "http://localhost:8000/api/v1/orchestrate" \\
  -H "Content-Type: application/json" \\
  -d '{{"prompt": "Benchmark test", "mode": "sandbox"}}' | head -n 20
```

#### 2. Key Actionable Takeaways
1. **Zero-Latency Path:** Remove intermediate proxy layers; direct stream over HTTP/2 or WebSockets.
2. **Minimalist Memory Footprint:** Keep payload allocations pre-sized in memory to avoid garbage collection pause spikes.
3. **Throughput Math:** 
   - 100 queries * 500 tokens = 50,000 tokens.
   - At 300 tps on Groq LPUs = **166.6ms total compute time**.
   - Total Cost: **$0.039** (compared to $0.50+ on legacy cloud models).

**Verdict:** For latency-critical enterprise automation, Groq-accelerated Llama 3.3 delivers the optimal speed-to-cost ratio.
"""


def _build_generic_response(model_id: str, prompt: str) -> str:
    return f"""### 🚀 Model Output: {model_id}

**Prompt Evaluated:** {prompt}

#### Core Analysis
- Successfully processed across enterprise infrastructure.
- High-fidelity streaming response with verified system integrity.
- Token metrics and throughput measured in real-time.
"""


async def stream_heuristic_tokens(
    model_id: str,
    prompt: str,
    is_debate: bool = False,
    prior_context: str | None = None
) -> AsyncGenerator[dict, None]:
    start_time = time.time()
    
    full_text = generate_heuristic_response(model_id, prompt, is_debate, prior_context)
    
    if model_id == "llama-3.3-70b-groq":
        ttft_delay = random.uniform(0.04, 0.09)
        chunk_delay_range = (0.005, 0.015)
        chunk_word_size = random.randint(3, 7)
    elif model_id == "gemini-1.5-pro":
        ttft_delay = random.uniform(0.15, 0.28)
        chunk_delay_range = (0.015, 0.035)
        chunk_word_size = random.randint(2, 4)
    elif model_id == "claude-3-5-sonnet":
        ttft_delay = random.uniform(0.18, 0.32)
        chunk_delay_range = (0.018, 0.038)
        chunk_word_size = random.randint(2, 4)
    elif model_id == "gpt-4o":
        ttft_delay = random.uniform(0.20, 0.38)
        chunk_delay_range = (0.02, 0.04)
        chunk_word_size = random.randint(2, 4)
    else:
        ttft_delay = random.uniform(0.25, 0.45)
        chunk_delay_range = (0.02, 0.045)
        chunk_word_size = random.randint(2, 5)

    await asyncio.sleep(ttft_delay)
    first_token_time = time.time()
    ttft_ms = int((first_token_time - start_time) * 1000)

    words = full_text.split(" ")
    accumulated_text = ""
    idx = 0

    while idx < len(words):
        chunk_words = words[idx : idx + chunk_word_size]
        delta = (" " if idx > 0 else "") + " ".join(chunk_words)
        accumulated_text += delta
        idx += chunk_word_size

        yield {
            "type": "chunk",
            "model_id": model_id,
            "delta": delta,
            "accumulated_length": len(accumulated_text),
            "ttft_ms": ttft_ms
        }

        delay = random.uniform(chunk_delay_range[0], chunk_delay_range[1])
        await asyncio.sleep(delay)

    total_duration_sec = round(time.time() - start_time, 3)
    
    input_tokens = max(1, int(len(prompt.split()) * 1.3))
    output_tokens = max(1, int(len(full_text.split()) * 1.3))
    total_tokens = input_tokens + output_tokens
    tokens_per_sec = round(output_tokens / max(0.01, total_duration_sec), 1)

    spec = SUPPORTED_MODELS.get(model_id)
    input_cost_m = spec.input_cost_per_m if spec else 2.5
    output_cost_m = spec.output_cost_per_m if spec else 10.0
    cost_usd = round((input_tokens / 1e6 * input_cost_m) + (output_tokens / 1e6 * output_cost_m), 6)

    metric = ModelMetric(
        model_id=model_id,
        ttft_ms=ttft_ms,
        total_duration_sec=total_duration_sec,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=total_tokens,
        tokens_per_sec=tokens_per_sec,
        estimated_cost_usd=cost_usd,
        is_live_api=False
    )

    yield {
        "type": "done",
        "model_id": model_id,
        "metric": metric
    }
