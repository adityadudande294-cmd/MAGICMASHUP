# NexusAI Orchestrator (MAGICMASHUP)

> **Enterprise-Grade AI Aggregator & Benchmarking Web Platform**  
> Inspired by AIfiesta and Monica AI, engineered for institutional corporate productivity, real-time concurrent streaming, and FinOps cost intelligence.

---

## 🏛️ System Architecture Overview

```
                                  +------------------------------------+
                                  |       Executive Web Client         |
                                  |    (React 18 + Vite + Tailwind)   |
                                  +-----------------+------------------+
                                                    |
                                            SSE Stream (HTTP/2)
                                                    |
                                  +-----------------v------------------+
                                  |      Nexus Orchestrator Core       |
                                  |      (FastAPI + AsyncIO Queue)     |
                                  +--------+--------+--------+---------+
                                           |        |        |
                  +------------------------+        |        +------------------------+
                  |                                 |                                 |
        +---------v---------+             +---------v---------+             +---------v---------+
        |   Tier 1: Gemini  |             |   Tier 2: Groq    |             |  Tier 3: Sandbox  |
        |  (Google GenAI)   |             | (Llama 3.3 70B)   |             |  (Claude/GPT-4o/  |
        |  Live / Fallback  |             |  Sub-100ms TTFT   |             |    Perplexity)    |
        +-------------------+             +-------------------+             +-------------------+
```

---

## 🎨 Cognitive Color System & Psychological Ergonomics

- **Base Canvas:** Deep Slate `#0B0F17` (avoids harsh OLED glare and mitigates prolonged optical strain during executive audits).
- **Card Surfaces / Grid Panels:** Elevated Charcoal `#151D2A` with 1px border `#1E293B` and smooth micro-interactions.
- **Model Identity Palette:**
  - **Google Gemini 1.5 Pro:** Ambient Electric Cyan (`#06B6D4` / `#22D3EE`) - computational depth & 2M token context.
  - **OpenAI GPT-4o:** Deep Botanical Emerald (`#10B981` / `#34D399`) - compliance, ISO 27001 validation, and structural determinism.
  - **Anthropic Claude 3.5 Sonnet:** Warm Cognitive Amber (`#F59E0B` / `#D97706`) - human nuance, modular elegance, and system architecture.
  - **Perplexity Sonar Deep:** Cobalt Indigo (`#6366F1`) - real-time web retrieval, live citations `[1]`, and empirical evidence.
  - **Groq Llama 3.3 70B:** Cyber Tangerine (`#F97316`) - sub-second instantaneous LPU throughput (~300 tps).
- **Active Focus Ring:** Subdued Slate Violet (`#8B5CF6`) ring on active prompt input.

---

## 🚀 Key Functional Capabilities

1. **High-Concurrency Multiplexed SSE Streaming:**
   - Broadcasts prompts simultaneously across selected model nodes via non-blocking asynchronous event multiplexing.
   - Provider failures are isolated with circuit breakers: an error in one provider will **never** block or degrade other streams.
2. **Sequential Debate Mode:**
   - Instead of broadcast, models critically examine, audit, and provide counter-proposals to arguments established by preceding models.
3. **Enterprise Telemetry Badges:**
   - Real-time TTFT (Time-To-First-Token in ms).
   - Total generation duration in seconds.
   - Output throughput (Tokens/second).
   - Accurate cost calculation per query based on exact input/output 1M token tier pricing.
4. **"Pick Best Answer" Benchmarking:**
   - Allows executives to pick winning responses, updates continuous win-rate stats, and triggers confetti feedback.
5. **"Synthesize All" Executive Briefing:**
   - Merges multiple model outputs into an executive brief containing:
     - Executive Summary
     - Universal Consensus Matrix
     - Divergences & Trade-Offs
     - Model Superlative Matrix
     - Decisive Strategic Directive
6. **Monica-Style Enterprise Copilot Drawer:**
   - Sliding right-docked drawer with pre-configured quick prompts:
     - *Corporate Contract Clause Extraction*
     - *Clean Code Architecture Refactoring*
     - *C-Suite Strategic Synthesis*
     - *Empirical Benchmark Fact-Checking*
     - *FinOps Cost Optimization Audit*
     - *Zero-Trust Security & ISO 27001 Review*
7. **FinOps & Benchmarking Intelligence Dashboard:**
   - Interactive monthly OPEX simulator based on enterprise query volume and token length.
   - Comparative unit cost tables and hybrid routing recommendations to save up to 77% on LLM spend.

---

## 🛠️ Quick Start & Running Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
# Optional: Add your API keys to .env
# GEMINI_API_KEY=your_key
# GROQ_API_KEY=your_key
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📁 Repository Structure

```
MAGICMASHUP/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI server & SSE streaming router
│   │   ├── config.py                 # Model definitions, pricing tiers & colors
│   │   ├── models.py                 # Pydantic schemas for requests, metrics & synthesis
│   │   ├── orchestrator.py           # Concurrency multiplexer & debate coordinator
│   │   └── providers/
│   │       ├── base.py               # Abstract provider interface
│   │       ├── gemini_provider.py    # Google Gemini 1.5 Pro live + fallback
│   │       ├── groq_provider.py      # Groq LPU high-speed streaming
│   │       ├── openai_provider.py    # GPT-4o live API + fallback
│   │       ├── anthropic_provider.py # Claude 3.5 Sonnet live API + fallback
│   │       ├── perplexity_provider.py# Perplexity Sonar live API + fallback
│   │       └── mock_engine.py        # Enterprise Sandbox heuristic engine
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx            # Navigation, mode selectors & export
│   │   │   ├── ModelSelectorBar.tsx  # Sticky model pills with latency tags
│   │   │   ├── PromptInputArea.tsx   # Textarea with Slate Violet focus ring
│   │   │   ├── ModelCard.tsx         # Real-time metrics & markdown card
│   │   │   ├── MonicaSidebar.tsx     # Monica-style quick enterprise prompts
│   │   │   ├── SynthesisModal.tsx    # Executive consensus briefing
│   │   │   ├── AnalyticsModal.tsx    # FinOps simulator & pricing table
│   │   │   └── FullScreenCardModal.tsx # Focused full-screen model view
│   │   ├── utils/
│   │   │   ├── constants.ts          # Models, quick prompts & configuration
│   │   │   └── markdownRenderer.tsx  # Markdown with syntax highlighted code
│   │   ├── types/
│   │   │   └── index.ts              # Data contracts
│   │   ├── App.tsx                   # Central state & SSE event processor
│   │   └── index.css                 # Cognitive styling tokens & animations
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
└── README.md
```
