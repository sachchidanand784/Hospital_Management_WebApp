# System Architecture (ARCHITECTURE.md)

## 1. High-Level Architecture Overview

The **Bilingual, AI-Integrated Eye Hospital Management System** is built using Next.js 14+ (App Router) with TypeScript, structured cleanly into explicit frontend components and backend core engines.

```
                  +-----------------------------------+
                  |   Public Visitors & Patients      |
                  |   (Hindi & English UI, No Login)  |
                  +-----------------+-----------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                               FRONTEND                                |
|  +-------------------+  +---------------------+  +-----------------+  |
|  | Public Web Pages  |  | Booking & Live Token|  | Role Dashboards |  |
|  | (Services, Doctors|  | Tracking Wizard     |  | (Owner, Doctor, |  |
|  |  Optical, Emerg.) |  | (PDF/QR/SSE Updates)|  |  Reception, etc)|  |
|  +-------------------+  +---------------------+  +-----------------+  |
+-----------------------------------+-----------------------------------+
                                    |
                            Server Actions / API
                                    |
+-----------------------------------v-----------------------------------+
|                                BACKEND                                |
|  +-----------------------------------------------------------------+  |
|  |                      CORE ENGINES                               |  |
|  |  +--------------------+ +--------------------+ +--------------+ |  |
|  |  | Availability Engine| | Token & Lock Engine| | Smart ETA    | |  |
|  |  +--------------------+ +--------------------+ +--------------+ |  |
|  +-----------------------------------------------------------------+  |
|  +-----------------------------------------------------------------+  |
|  |                   AUTH, RBAC & AUDIT LAYER                      |  |
|  |  - Auth.js / JWT Session with httpOnly Cookies                   |  |
|  |  - Policy Engine (`can(user, action, resource)`)                 |  |
|  |  - Immutable Audit Logger                                       |  |
|  +-----------------------------------------------------------------+  |
|  +-----------------------------------------------------------------+  |
|  |                     AI PROVIDER ADAPTER                         |  |
|  |  - Google Gemini API (Text, Vision, Speech Triage)               |  |
|  |  - Redaction & Safety Guardrails, Automatic Emergency Fallback    |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                         DATABASE & PERSISTENCE                        |
|   PostgreSQL + Prisma ORM (Indexed Schemas, Multi-language Support)   |
+-----------------------------------------------------------------------+
```

## 2. Directory Structure & Logic Separation

To ensure that any developer can understand the codebase at a glance and deploy seamlessly:

```
Hospital/
├── docs/                        # Comprehensive Documentation
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── API.md
│   ├── RBAC.md
│   └── AI.md
├── frontend/                    # FRONTEND UI LAYER
│   ├── components/              # Reusable UI Components
│   │   ├── common/              # Navbar, Footer, Toast, Modal, Skeletons
│   │   ├── a11y/                # High Contrast, Font Resizer, Web Speech TTS
│   │   ├── booking/             # 10-Step Mobile-First Booking Stepper
│   │   ├── token/               # Token Card, Live Status, TV Queue Board
│   │   ├── emergency/           # Red-Flag Emergency Banner & Rapid Request
│   │   └── dashboards/          # Owner, Doctor, Reception, Pharmacy, Optical, OT, Optometry
│   ├── styles/                  # Design Tokens, Tailwind Theme, CSS Variables
│   └── hooks/                   # Client-side Hooks (i18n, SSE, voice input)
├── backend/                     # BACKEND LOGIC LAYER
│   ├── engines/                 # Pure Engine Modules (Unit Tested)
│   │   ├── availability-engine.ts
│   │   ├── token-engine.ts      # Transactional row-locking queue allocator
│   │   ├── eta-engine.ts        # Dynamic rolling-median ETA window
│   │   ├── fee-engine.ts        # Display fee calculation rules
│   │   └── leave-conflict.ts    # Doctor leave rescheduling handler
│   ├── rbac/                    # Security & Permission Matrix
│   │   ├── policies.ts
│   │   └── middleware.ts
│   ├── ai/                      # Provider-Agnostic AI Layer
│   │   ├── provider.ts          # AIProvider Interface
│   │   ├── gemini.ts            # Gemini API Implementation
│   │   └── prompts/             # Versioned Prompt Templates & Schemas
│   └── db/                      # Persistence
│       ├── schema.prisma        # Complete Prisma Database Schema
│       └── seed.ts              # Seed Script with Fictional Hospital Data
├── messages/                    # BILINGUAL STRINGS
│   ├── en.json                  # English Localization Strings
│   └── hi.json                  # Hindi Localization Strings (Devanagari)
└── src/                         # Next.js App Router Entrypoints
    └── app/                     # Route Handlers & Server Actions mapping to frontend/backend
```

## 3. Deployment Strategy
- **Frontend & Backend Unified Execution:** Standard Next.js server runner (`npm run start`) or Docker Container.
- **Docker Compose Setup:** Orchestrates Next.js app container + PostgreSQL database container.
- **Vercel / Render / Railway Deployment:** Pure environment variable configuration (`DATABASE_URL`, `GEMINI_API_KEY`, `SESSION_SECRET`).
