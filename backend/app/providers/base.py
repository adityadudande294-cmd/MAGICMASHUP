import time
from abc import ABC, abstractmethod
from typing import AsyncGenerator
from app.config import SUPPORTED_MODELS, ModelSpec
from app.models import ModelMetric


class BaseLLMProvider(ABC):
    def __init__(self, model_id: str):
        self.model_id = model_id
        self.spec: ModelSpec = SUPPORTED_MODELS.get(
            model_id,
            ModelSpec(
                id=model_id,
                name=model_id,
                provider="Unknown",
                version="v1",
                color_hex="#8B5CF6",
                glow_color="rgba(139, 92, 246, 0.35)",
                tagline="Dynamic Engine",
                tier="Tier 3",
                input_cost_per_m=2.00,
                output_cost_per_m=8.00,
                typical_latency_ms=300,
                context_window_k=128,
                strengths=[]
            )
        )

    def calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        input_cost = (input_tokens / 1_000_000.0) * self.spec.input_cost_per_m
        output_cost = (output_tokens / 1_000_000.0) * self.spec.output_cost_per_m
        return round(input_cost + output_cost, 6)

    def estimate_tokens(self, text: str) -> int:
        # Approximate 1 token ~= 4 characters or 0.75 words for standard English
        words = len(text.split())
        chars = len(text)
        return max(1, int((words * 1.3 + chars / 4.0) / 2))

    @abstractmethod
    async def stream_response(
        self,
        prompt: str,
        system_instruction: str | None = None,
        is_debate: bool = False,
        prior_context: str | None = None,
        force_sandbox: bool = False
    ) -> AsyncGenerator[dict, None]:
        """
        Yields dictionaries with format:
        {"type": "chunk", "delta": "...", "ttft_ms": ...}
        and finishes with:
        {"type": "done", "metric": ModelMetric(...)}
        """
        pass
