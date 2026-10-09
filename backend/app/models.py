from typing import Optional, Literal
from pydantic import BaseModel, Field


class OrchestrateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="Prompt to broadcast or debate across models")
    selected_models: list[str] = Field(
        default=["gemini-1.5-pro", "gpt-4o", "claude-3-5-sonnet", "llama-3.3-70b-groq", "perplexity-sonar-deep"],
        description="IDs of models to query"
    )
    mode: Literal["live", "sandbox", "auto"] = Field(
        default="auto",
        description="live requires API keys; sandbox runs realistic heuristic emulation; auto degrades gracefully"
    )
    is_debate_mode: bool = Field(
        default=False,
        description="If True, runs sequential debate where models cross-examine and critique prior responses"
    )
    system_instruction: Optional[str] = Field(
        default=None,
        description="Optional custom system role instruction"
    )


class ModelMetric(BaseModel):
    model_id: str
    ttft_ms: int
    total_duration_sec: float
    input_tokens: int
    output_tokens: int
    total_tokens: int
    tokens_per_sec: float
    estimated_cost_usd: float
    is_live_api: bool


class StreamChunkPayload(BaseModel):
    type: Literal["model_start", "model_chunk", "model_done", "model_error", "orchestration_summary", "debate_round"]
    model_id: Optional[str] = None
    delta: Optional[str] = None
    accumulated_length: Optional[int] = None
    metric: Optional[ModelMetric] = None
    error: Optional[str] = None
    round_index: Optional[int] = None
    summary: Optional[dict] = None


class SynthesizeRequest(BaseModel):
    prompt: str
    model_responses: dict[str, str]  # model_id -> full markdown response text


class SynthesizeResponse(BaseModel):
    executive_summary: str
    consensus_matrix: list[str]
    divergences_and_tradeoffs: list[str]
    model_superlatives: dict[str, str]
    decisive_recommendation: str
    synthesized_full_report: str
    tokens_analyzed: int
