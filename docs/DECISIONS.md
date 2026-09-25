# Architectural Decisions & Technical Log (DECISIONS.md)

## ADR-001: Next.js App Router with Modular Frontend/Backend Architecture
- **Date:** 2026-09-25
- **Status:** Accepted
- **Context:** The application requires a production-grade, bilingual, AI-integrated hospital management system with smooth deployment capabilities on platforms like Vercel, Render, Railway, or Docker containers. The user requested clear separation between frontend and backend logic.
- **Decision:** Utilize Next.js 14+ (App Router) organized into clean, explicit directory modules:
  - `frontend/`: UI components, design system tokens, page views, dashboards, accessibility widgets, and client-side hooks.
  - `backend/`: Core logic engines (Availability/Slot Engine, Concurrency-Safe Token Engine, Smart ETA Engine, Fee Display Engine), Prisma ORM data access models, server routes/actions, AI provider adapters, and RBAC authorization guards.
- **Consequences:** Provides instant folder-level clarity, high performance with SSR/ISR, simple single-repo deployment, and full TypeScript type safety across client and server.

## ADR-002: Dual-Language (Bilingual Hindi + English) System
- **Date:** 2026-09-25
- **Status:** Accepted
- **Context:** Must support natural Hindi and English across all public pages, forms, PDFs, TV displays, notifications, and AI responses with zero hardcoded strings.
- **Decision:** Implement `next-intl` locale middleware (`/hi`, `/en`) with fallback mechanisms, cookie/localStorage persistence, and database schema translations (`_en` and `_hi` columns for dynamic entities).

## ADR-003: Concurrency-Safe Token Allocation
- **Date:** 2026-09-25
- **Status:** Accepted
- **Context:** High patient volume at peak hours requires strict guarantees against duplicate token sequence allocation under parallel booking requests.
- **Decision:** Use PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) inside atomic database transactions with composite unique constraints `(queueId, tokenSeq)` and request idempotency keys.

## ADR-004: Provider-Agnostic AI Integration with Google Gemini
- **Date:** 2026-09-25
- **Status:** Accepted
- **Context:** AI features (Eye-Care Assistant, Dictation/Scribe, Prescription Explainer, Emergency Triage Tagger, Optical Vision Assist) must be resilient, privacy-preserving, and fallback gracefully if AI services are disabled or offline.
- **Decision:** Implement a clean `AIProvider` interface with Google Gemini API as default implementation, server-side execution only, PII redaction, strict Zod schema parsing, and automatic Emergency escalation for red-flag symptoms.
