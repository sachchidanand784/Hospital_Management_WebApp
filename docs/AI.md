# AI System Architecture & Integration Guide (AI.md)

## 1. Executive Summary & Design Principles

The application embeds **12 distinct AI features** powered by a provider-agnostic interface (`AIProvider`), with **Google Gemini API** as the primary implementation.

### Non-Negotiable AI Rules:
1. **Safety First:** The AI NEVER provides medical diagnosis, medication prescriptions, or dosage advice. All clinical outputs are labeled as draft suggestions that MUST be reviewed and approved by a qualified physician (`aiDraftUsed` audit flag).
2. **Immediate Emergency Escalation:** When a patient describes red-flag symptoms (sudden vision loss, chemical splash, penetrating injury, severe eye pain), the AI assistant instantly interrupts conversation and displays the Emergency contact banner with direct tap-to-call.
3. **Privacy & Redaction:** Personal Identifiable Information (PII) like patient name, mobile number, and address are redacted before passing prompts to external LLM endpoints.
4. **Graceful Fallback:** If AI services are offline or rate-limited, the application seamlessly falls back to rule-based logic without disrupting core appointment booking or hospital operations.

## 2. AI Features Catalog

1. **Bilingual Eye-Care Assistant (Public Chatbot):** Natural Hindi/English symptom categorization, hospital FAQ answering, and booking prefill.
2. **AI Auto-Translate (Admin / CMS / Optical):** Automated draft translations (EN <-> HI) with medical terminology preservation and human review UI.
3. **Smart ETA Predictor:** Statistical rolling median estimation with model adaptability.
4. **Smart General Doctor Matcher:** Ranking doctors based on specialization fit, active load, and earliest availability.
5. **Emergency Triage Tagger:** Automated classification (`HIGH`, `MEDIUM`, `LOW`) for incoming emergency requests.
6. **Doctor AI Scribe:** Voice dictation (Hindi/English/Hinglish) to structured clinical record drafts.
7. **Prescription Explainer:** Plain-language patient instructions derived from structured prescriptions.
8. **Optical AI Product Assist:** Multi-image analysis auto-drafting frame brand, category, tags, and color.
9. **Admin Analytics Assistant:** Text-to-aggregate parameterized SQL query builder with interactive Recharts rendering.
10. **No-Show Risk Scoring:** Predictive heuristic assessing lead time and patient history for reminder optimization.
11. **Smart Semantic Search:** Fault-tolerant search handling typos ("motiyabind", "chashma") in Devanagari and Latin scripts.
12. **Accessibility AI:** Web Speech API TTS read-aloud for token updates and hospital announcements.

## 3. Configuration & Prompts
All prompt templates are versioned inside `backend/ai/prompts/` and strictly validated against Zod schemas.
- Provider selection: `process.env.AI_PROVIDER` (`gemini` | `mock`)
- API Key: `process.env.GEMINI_API_KEY`
