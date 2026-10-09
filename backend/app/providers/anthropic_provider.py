import time
import json
from typing import AsyncGenerator
import httpx
from app.config import ANTHROPIC_API_KEY
from app.providers.base import BaseLLMProvider
from app.providers.mock_engine import stream_heuristic_tokens
from app.models import ModelMetric


class AnthropicProvider(BaseLLMProvider):
    def __init__(self, model_id: str = "claude-3-5-sonnet"):
        super().__init__(model_id)
        self.api_key = ANTHROPIC_API_KEY
        self.endpoint = "https://api.anthropic.com/v1/messages"

    async def stream_response(
        self,
        prompt: str,
        system_instruction: str | None = None,
        is_debate: bool = False,
        prior_context: str | None = None,
        force_sandbox: bool = False
    ) -> AsyncGenerator[dict, None]:
        if force_sandbox or not self.api_key:
            async for chunk in stream_heuristic_tokens(self.model_id, prompt, is_debate, prior_context):
                yield chunk
            return

        start_time = time.time()
        first_token_time = None
        accumulated_text = ""
        ttft_ms = 0

        user_content = prompt
        if is_debate and prior_context:
            user_content = f"Previous debate context:\n{prior_context}\n\nPlease critically analyze and offer your perspective on: {prompt}"

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        body = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 2048,
            "system": system_instruction or "You are Claude 3.5 Sonnet, an enterprise AI assistant known for exceptional nuance, code craftsmanship, and reasoned architectural depth.",
            "messages": [{"role": "user", "content": user_content}],
            "stream": True
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                async with client.stream("POST", self.endpoint, headers=headers, json=body) as response:
                    if response.status_code != 200:
                        raise Exception(f"Anthropic API status {response.status_code}")

                    async for line in response.aiter_lines():
                        if not line or not line.startswith("data: "):
                            continue
                        data_str = line[6:].strip()
                        try:
                            data_json = json.loads(data_str)
                            event_type = data_json.get("type")
                            if event_type == "content_block_delta":
                                delta = data_json.get("delta", {}).get("text", "")
                                if delta:
                                    if first_token_time is None:
                                        first_token_time = time.time()
                                        ttft_ms = int((first_token_time - start_time) * 1000)
                                    accumulated_text += delta
                                    yield {
                                        "type": "chunk",
                                        "model_id": self.model_id,
                                        "delta": delta,
                                        "accumulated_length": len(accumulated_text),
                                        "ttft_ms": ttft_ms
                                    }
                        except Exception:
                            continue

            total_duration_sec = round(time.time() - start_time, 3)
            input_tokens = self.estimate_tokens(user_content)
            output_tokens = self.estimate_tokens(accumulated_text)
            total_tokens = input_tokens + output_tokens
            tokens_per_sec = round(output_tokens / max(0.01, total_duration_sec), 1)
            cost_usd = self.calculate_cost(input_tokens, output_tokens)

            metric = ModelMetric(
                model_id=self.model_id,
                ttft_ms=ttft_ms or int((total_duration_sec * 1000) / 3),
                total_duration_sec=total_duration_sec,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                total_tokens=total_tokens,
                tokens_per_sec=tokens_per_sec,
                estimated_cost_usd=cost_usd,
                is_live_api=True
            )

            yield {
                "type": "done",
                "model_id": self.model_id,
                "metric": metric
            }

        except Exception as e:
            print(f"[AnthropicProvider Live Error - Falling back to Sandbox]: {e}")
            async for chunk in stream_heuristic_tokens(self.model_id, prompt, is_debate, prior_context):
                yield chunk
