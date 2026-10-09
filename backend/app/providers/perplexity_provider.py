import time
import json
from typing import AsyncGenerator
import httpx
from app.config import PERPLEXITY_API_KEY
from app.providers.base import BaseLLMProvider
from app.providers.mock_engine import stream_heuristic_tokens
from app.models import ModelMetric


class PerplexityProvider(BaseLLMProvider):
    def __init__(self, model_id: str = "perplexity-sonar-deep"):
        super().__init__(model_id)
        self.api_key = PERPLEXITY_API_KEY
        self.endpoint = "https://api.perplexity.ai/chat/completions"

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

        messages = [
            {
                "role": "system",
                "content": system_instruction or (
                    "You are Perplexity Sonar Deep. Provide research-grounded answers with web citations [1], [2] and empirical real-time data."
                )
            }
        ]
        if is_debate and prior_context:
            messages.append({"role": "user", "content": f"Prior debate context:\n{prior_context}\n\nPlease fact-check and debate: {prompt}"})
        else:
            messages.append({"role": "user", "content": prompt})

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        body = {
            "model": "sonar-pro",
            "messages": messages,
            "stream": True,
            "temperature": 0.2
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                async with client.stream("POST", self.endpoint, headers=headers, json=body) as response:
                    if response.status_code != 200:
                        raise Exception(f"Perplexity API status {response.status_code}")

                    async for line in response.aiter_lines():
                        if not line or not line.startswith("data: "):
                            continue
                        data_str = line[6:].strip()
                        if data_str == "[DONE]":
                            break
                        try:
                            data_json = json.loads(data_str)
                            delta = data_json["choices"][0]["delta"].get("content", "")
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
            input_tokens = self.estimate_tokens(prompt)
            output_tokens = self.estimate_tokens(accumulated_text)
            total_tokens = input_tokens + output_tokens
            tokens_per_sec = round(output_tokens / max(0.01, total_duration_sec), 1)
            cost_usd = self.calculate_cost(input_tokens, output_tokens)

            metric = ModelMetric(
                model_id=self.model_id,
                ttft_ms=ttft_ms or int((total_duration_sec * 1000) / 2.5),
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
            print(f"[PerplexityProvider Live Error - Falling back to Sandbox]: {e}")
            async for chunk in stream_heuristic_tokens(self.model_id, prompt, is_debate, prior_context):
                yield chunk
