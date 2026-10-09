import time
import asyncio
from typing import AsyncGenerator
import google.generativeai as genai
from app.config import GEMINI_API_KEY
from app.providers.base import BaseLLMProvider
from app.providers.mock_engine import stream_heuristic_tokens
from app.models import ModelMetric


class GeminiProvider(BaseLLMProvider):
    def __init__(self, model_id: str = "gemini-1.5-pro"):
        super().__init__(model_id)
        self.api_key = GEMINI_API_KEY
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
            except Exception as e:
                print(f"[GeminiProvider] Configure error: {e}")

    async def stream_response(
        self,
        prompt: str,
        system_instruction: str | None = None,
        is_debate: bool = False,
        prior_context: str | None = None,
        force_sandbox: bool = False
    ) -> AsyncGenerator[dict, None]:
        # If no key or sandbox requested, seamlessly degrade to heuristic streamer
        if force_sandbox or not self.api_key:
            async for chunk in stream_heuristic_tokens(self.model_id, prompt, is_debate, prior_context):
                yield chunk
            return

        # Attempt Live Gemini Streaming
        start_time = time.time()
        first_token_time = None
        accumulated_text = ""
        ttft_ms = 0

        try:
            # Map model name
            gemini_model_name = "gemini-1.5-pro" if "pro" in self.model_id else "gemini-1.5-flash"
            model = genai.GenerativeModel(
                model_name=gemini_model_name,
                system_instruction=system_instruction or (
                    "You are Gemini 1.5 Pro, an enterprise-grade AI system known for computational depth, long-context analysis, and structured engineering logic."
                )
            )

            full_prompt = prompt
            if is_debate and prior_context:
                full_prompt = f"Previous models said:\n{prior_context}\n\nPlease critically evaluate and debate this prompt: {prompt}"

            # Gemini stream is an iterator, execute in executor or async loop
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(None, lambda: model.generate_content(full_prompt, stream=True))

            for chunk in response:
                if chunk.text:
                    if first_token_time is None:
                        first_token_time = time.time()
                        ttft_ms = int((first_token_time - start_time) * 1000)

                    accumulated_text += chunk.text
                    yield {
                        "type": "chunk",
                        "model_id": self.model_id,
                        "delta": chunk.text,
                        "accumulated_length": len(accumulated_text),
                        "ttft_ms": ttft_ms
                    }
                    await asyncio.sleep(0.005)  # yield control to event loop

            total_duration_sec = round(time.time() - start_time, 3)
            input_tokens = self.estimate_tokens(full_prompt)
            output_tokens = self.estimate_tokens(accumulated_text)
            total_tokens = input_tokens + output_tokens
            tokens_per_sec = round(output_tokens / max(0.01, total_duration_sec), 1)
            cost_usd = self.calculate_cost(input_tokens, output_tokens)

            metric = ModelMetric(
                model_id=self.model_id,
                ttft_ms=ttft_ms or int((total_duration_sec * 1000) / 2),
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
            print(f"[GeminiProvider Live Error - Falling back to Sandbox]: {e}")
            # Seamless fallback to intelligent mock generator
            async for chunk in stream_heuristic_tokens(self.model_id, prompt, is_debate, prior_context):
                yield chunk
