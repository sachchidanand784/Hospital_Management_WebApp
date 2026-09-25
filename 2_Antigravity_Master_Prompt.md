# MASTER PROMPT — Bilingual, AI-Integrated Eye Hospital Management, Appointment & Digital Token Web App

> You are a senior full-stack architect and lead engineer. Build the COMPLETE, production-grade application described below. Read this entire document before writing any code. Follow it exactly.

---

## 0. NON-NEGOTIABLE EXECUTION RULES (READ FIRST)

Previous attempts by AI agents produced only a folder structure and empty files. **That is a failure. Do not do that.**

1. **Complete every phase fully before starting the next.** A phase is done ONLY when every item in its "Acceptance Criteria" works end-to-end in the running app (UI + API + database + both languages).
2. **No skeletons.** Forbidden in delivered code: `TODO`, `FIXME`, "implement later", empty function bodies, `lorem ipsum`, placeholder pages, fake buttons that do nothing, hard-coded mock responses pretending to be real logic, `console.log`-only handlers.
3. **Only seed/demo data may be fake**, and it must live in the seed script and be clearly marked as demo.
4. **Every screen must be real:** loading state, empty state, error state, success state, form validation, responsive layout (mobile-first), and both Hindi and English.
5. **Every phase ends with verification**, in this order:
   a. `npm run typecheck`, `npm run lint`, `npm run test` pass with zero errors.
   b. Run the app and manually verify each acceptance criterion in the browser (use the browser tool; capture screenshots for the walkthrough).
   c. Test in **both** `hi` and `en`, on **mobile (375px)** and **desktop (1280px)**.
   d. Produce a **Phase Completion Report** (format in Section 16). If anything fails, fix it first. Do not proceed with known failures.
6. **Do not ask me for confirmation between phases** unless truly blocked (missing secret, contradictory requirement). Make reasonable decisions, record them in `docs/DECISIONS.md`, and continue.
7. **Create a task list first** (all phases and sub-tasks), keep it updated, and tick items only after verification.
8. Keep code clean: TypeScript strict, small modules, shared validation schemas (Zod) used on both client and server, no duplicated business logic.
9. **Never hard-code UI text.** All user-visible strings go through the i18n system (Section 4). A CI check must fail if a string is missing in either language.
10. When something in this document is ambiguous, choose the safest, simplest, most patient-friendly option and document it.

---

## 1. PROJECT SUMMARY

A responsive (mobile-first) **bilingual (Hindi + English)** web application for an **Eye Care Hospital** that replaces the manual slip/token process with digital appointments and live tokens, provides role-based dashboards for hospital departments, and is **AI-integrated** wherever it genuinely helps.

**Users / Roles:** Public visitor/patient (no login), Hospital Owner/Admin, Doctor, Reception Staff, Eye Technician/Optometrist, Pharmacy Staff, Optical (Chashma Ghar) Staff, Surgery/OT Staff.

**Hospital services:** eye checkup, vision test, eye examination, eye injury treatment, disease consultation, eye surgery (incl. cataract, lens implantation), medicines, dressing & follow-up, spectacles, frames, glass/lens replacement, optical services, emergency eye care.

### 1.1 Hard scope rules (from SRS)
- **NO patient registration/login.** Patients browse freely; personal details are asked only while booking.
- **NO centralized billing / revenue / payment tracking / Billing Staff.** Payment happens physically at each department counter. The app may only **display** a consultation/service fee.
- **NO doctor document upload.** Doctor verification is manual by the Owner/Admin.
- **Only owner-verified doctors are publicly visible or bookable.**
- Hindi + English everywhere, switchable by a visible button.
- Role-based access control everywhere.

### 1.2 Timezone / locale
Asia/Kolkata (IST), 12-hour time display by default, date format `DD MMM YYYY`. Currency display `₹`. Default language: Hindi for first-time visitors from India, with visible toggle; remember choice.

---

## 2. TECH STACK (use exactly unless a strong reason; record in DECISIONS.md)

- **Framework:** Next.js (App Router) + TypeScript (strict)
- **UI:** Tailwind CSS + shadcn/ui (Radix) + lucide-react icons; Framer Motion for subtle transitions only
- **Forms/validation:** React Hook Form + Zod (shared schemas)
- **DB:** PostgreSQL + Prisma ORM (migrations + seed)
- **Auth:** Auth.js (credentials) or equivalent secure session/JWT with httpOnly cookies; Argon2/bcrypt hashing
- **i18n:** `next-intl` with locale routing (`/hi/...`, `/en/...`)
- **Realtime:** Server-Sent Events (SSE) for live token/queue/emergency updates, with polling fallback
- **Jobs/scheduling:** a lightweight job runner (e.g., `node-cron`/BullMQ if Redis available) for reminders, no-show marking, ETA recompute
- **Charts:** Recharts
- **PDF/QR:** `qrcode` + `@react-pdf/renderer` (or `pdf-lib`) for token card PDF
- **Images:** `sharp` for resize/WebP; storage adapter (local disk in dev; S3/Cloudinary-compatible in prod)
- **AI:** provider-agnostic `AIProvider` interface; default implementation **Google Gemini API** (text + vision + speech-friendly), swappable via env
- **Notifications:** provider interface with implementations: In-app, Email (SMTP), SMS/WhatsApp (adapter; console-logger mock in dev)
- **Testing:** Vitest (unit), Playwright (e2e), plus a concurrency test for token allocation
- **DevOps:** Dockerfile + `docker-compose.yml` (app + postgres [+ redis]), `.env.example`, GitHub Actions CI
- **PWA:** installable, offline-friendly shell, cached token page

Deliver a complete `README.md` (setup in <10 minutes), `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/API.md`, `docs/RBAC.md`, `docs/AI.md`.

---

## 3. DESIGN SYSTEM — "Professional Hospital" Theme

**Feel:** clean, calm, trustworthy, modern, spacious; like a premium multi-specialty hospital. White surfaces, soft blue-tinted background, clear hierarchy, generous spacing, rounded corners (12–16px), soft shadows, high readability. No gimmicky gradients or neon.

### 3.1 Color tokens (define as CSS variables + Tailwind theme)
| Token | Hex | Use |
|---|---|---|
| `--primary` | `#0A5EB0` | Main brand, primary buttons, links |
| `--primary-dark` | `#0B2545` | Headings, navbar text, footer bg |
| `--accent` | `#13A89E` | Secondary CTA, highlights, badges |
| `--bg` | `#F5F9FC` | Page background |
| `--surface` | `#FFFFFF` | Cards |
| `--text` | `#12263A` | Body |
| `--muted` | `#5B7083` | Secondary text |
| `--border` | `#DCE6EE` | Borders |
| `--success` | `#2E9E6B` | Confirmed, completed |
| `--warning` | `#F5A524` | Waiting, low stock |
| `--danger` | `#D64545` | Errors, cancelled |
| `--emergency` | `#C62828` | **Reserved only for Emergency UI** |

All text/background pairs meet **WCAG AA** contrast.

### 3.2 Typography
- Latin: **Inter**. Devanagari: **Noto Sans Devanagari**. Headings may use **Poppins** with Noto Sans Devanagari fallback. Verify Hindi renders with correct matras, and line-height is larger for Devanagari (≥1.6).
- Base size 16px; scale via rem. Provide a **text-size control (A- / A / A+)** in the header.

### 3.3 Accessibility (critical — this is an EYE hospital)
- **High-contrast mode** toggle, **font-size** toggle, large tap targets (≥48px), visible focus rings, full keyboard navigation, ARIA labels (bilingual), reduced-motion support, screen-reader friendly token status announcements (`aria-live`).
- Voice input (browser Web Speech API, `hi-IN`/`en-IN`) on the AI assistant and key search fields where supported.
- Never rely on color alone for status; use icon + text.

### 3.4 Components to build (reusable, documented on a `/dev/ui` page in dev only)
Navbar (with language switch + a11y controls), Footer, Hero, ServiceCard, DoctorCard, StatusBadge, TokenCard, QueueBoard, StepWizard, DatePicker (available dates highlighted), SlotPicker (with capacity), DataTable (sort/filter/paginate/export CSV), StatCard, Charts, Toast, ConfirmDialog, EmptyState, Skeletons, ImageGallery, AIChatWidget, NotificationBell, RoleSidebar layout.

### 3.5 Layout
- Public site: sticky top navbar; mobile bottom-sheet menu; **floating "Emergency" button** (red) and **"Book Appointment" button** (primary) always reachable on mobile.
- Dashboards: left sidebar (collapsible on mobile), top bar with notification bell, language switch, profile menu.

### 3.6 Imagery
Use professional, realistic **generic** imagery (eye exam, equipment, optical shop, lenses, frames, reception). **AI-generated/stock people must never be labeled as real doctors/patients.** Real doctor photos only come from admin-approved uploads. Provide neutral avatar placeholder for doctors without a photo. Every image has bilingual alt text.

---

## 4. BILINGUAL (HINDI / ENGLISH) ARCHITECTURE

Implement language switching as a first-class system.

1. **Language toggle button** in the navbar on every page and dashboard, labeled `हिन्दी | English`. Clicking it switches instantly, keeps the current page and form state where possible, updates `<html lang>`, persists in cookie + `localStorage`, and (for logged-in users) in their profile.
2. **Routing:** `/hi/...` and `/en/...` with locale middleware; SEO `hreflang` links.
3. **Static UI text:** `messages/en.json` and `messages/hi.json`, organized by namespace (`common`, `nav`, `home`, `services`, `doctors`, `booking`, `token`, `emergency`, `optical`, `pharmacy`, `ot`, `admin`, `errors`, `validation`, `notifications`, `ai`, `a11y`). Provide **complete, natural Hindi** (not literal machine-translated; use simple, commonly understood Hindi that rural/semi-urban patients can follow; medical terms may keep common English words in Devanagari, e.g., "मोतियाबिंद (Cataract)").
4. **Dynamic DB content:** every user-facing entity has `*_en` and `*_hi` columns (or a `Translation` table): service names/descriptions, problems, specializations, doctor bio, hospital info, product names/descriptions, announcements, FAQs, instructions, notification templates. Admin forms show **two side-by-side inputs (EN | हिन्दी)**, with an **"AI Translate"** button that fills the other language as a **draft the admin must review**.
5. **Fallback:** if Hindi is missing, show English and log a "missing translation" entry visible in Admin → Content Health.
6. **Validation & error messages, toasts, emails, SMS/WhatsApp templates, PDF token card, QR page, TV queue display, AI chatbot answers** must all follow the selected language.
7. **Formatting:** dates, times, numbers localized (`Intl`). Provide a setting for Devanagari numerals (default off).
8. **Patient name input:** accept Devanagari or Latin; store as typed; provide optional transliteration helper.
9. **Guard rails:** a script `npm run i18n:check` verifies key parity between `en.json` and `hi.json`, unused keys, and fails CI. ESLint rule/regex check for hard-coded JSX strings.
10. **Test:** Playwright suite runs all critical flows in both languages.

---

## 5. ROLES & ACCESS CONTROL (RBAC)

Roles: `OWNER`, `DOCTOR`, `RECEPTION`, `OPTOMETRIST`, `PHARMACY`, `OPTICAL`, `OT`. Patients are anonymous (verified per-appointment by OTP/magic link).

### 5.1 Authentication rules
- Staff & doctors: email or mobile + password. Password policy (min 10 chars), Argon2/bcrypt, login rate-limit + temporary lockout, secure httpOnly session cookies, session timeout with idle warning, "forgot/reset password" via email/SMS OTP, force password change on first login for staff created by Owner, optional TOTP 2FA (mandatory toggle for OWNER).
- **Doctor self-registration** sets own password. Status `PENDING` doctors can log in only to see a "Pending verification" screen (no dashboard, no public visibility). `DECLINED` doctors see reason (if given) and may re-apply. Duplicate email/mobile blocked.
- Owner creates/deactivates other staff accounts and assigns roles/departments.
- Owner account is created by seed/first-run setup wizard.

### 5.2 Permission matrix (enforce in API layer AND UI; deny by default)
| Capability | Owner | Doctor | Reception | Optometrist | Pharmacy | Optical | OT |
|---|---|---|---|---|---|---|---|
| Hospital info, services, specializations, timings, holidays, settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify/decline doctors, manage staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Own profile & schedule | ✅(any) | ✅(own) | ❌ | ❌ | ❌ | ❌ | ❌ |
| All appointments & tokens | ✅ | own only | ✅ | today's assigned | ❌ | ❌ | ❌ |
| Check-in, walk-in booking, queue control | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Patient basic info (name, age, mobile) | ✅ | ✅(own patients) | ✅ | ✅(assigned) | ✅(via Rx only) | ✅(optical requests only) | ✅(OT patients) |
| Eye examination record | view | ✅ view | ❌ | ✅ create/edit | ❌ | view refraction (for glasses) | view |
| Consultation, diagnosis, Rx, surgery/follow-up advice | view | ✅ create/edit (own) | ❌ | ❌ | Rx view only | Glasses Rx view only | surgery advice view |
| Pharmacy stock status & medicine requests | view | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Optical products/orders | view | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Surgery schedule, checklist, post-op | view | view/request | ❌ | ❌ | ❌ | ❌ | ✅ |
| Emergency alerts | ✅ manage | notified | ✅ manage | ❌ | ❌ | ❌ | ✅ notified |
| Reports/analytics | ✅ all | own stats | today ops | ❌ | dept | dept | dept |
| Audit log | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

Doctors **cannot edit administrative** data (appointments' admin fields, patient contact, hospital settings). Implement as centralized policy functions (`can(user, action, resource)`) with unit tests, and a `docs/RBAC.md`.

### 5.3 Patient access without account
- After booking, patient gets an **Appointment ID + a signed magic link + QR**. "My Appointment" page (`/my-appointment`) accessible via magic link OR by entering Appointment ID + mobile with **OTP verification**. Allows: view live token status, download token PDF, cancel, reschedule (within rules), add to calendar, share on WhatsApp.

---

## 6. DATA MODEL (Prisma; all tables have `id`, `createdAt`, `updatedAt`, `hospitalId` for future multi-branch)

Design and implement at least these entities with proper indexes, constraints, enums and relations:

- **Hospital**: name_en/hi, address_en/hi, phones, email, geo, logo, emergency phone, about_en/hi, social links.
- **HospitalTiming**: weekday, open, close, isClosed, emergency24x7 flag. **Holiday**: date/range, reason_en/hi, emergencyAvailable.
- **User**: role, email, mobile, passwordHash, status, language, 2FA fields, lastLogin, mustChangePassword.
- **Department**: reception, optometry, pharmacy, optical, OT, etc. **StaffProfile** linked to user/department.
- **Doctor**: userId, fullName, gender, mobile, email, qualification, experienceYears, consultationFee, bio_en/hi, photoUrl (admin-approved), **verificationStatus** (`PENDING|VERIFIED|DECLINED|SUSPENDED`), verifiedBy, verifiedAt, declineReason, `isPublic` (derived: VERIFIED && active).
- **Specialization** (name_en/hi, icon, active) ↔ **DoctorSpecialization** (many-to-many).
- **Service** (Eye Checkup, Surgery, Optical, etc.; name/desc en/hi, icon, active, feeMode) → **ServiceProblem** (Blurred vision, Eye pain…; name en/hi; maps to recommended specializations; `redFlag` bool).
- **FeeRule**: service/doctor/dayOfWeek → `FREE | FIXED` amount + label (e.g., "Free General Eye Checkup on Tuesday"), effective date range. (Display only.)
- **DoctorWeeklySchedule**: doctorId, weekday, startTime, endTime, slotDurationMin, capacityPerSlot, breakStart/breakEnd, serviceIds, active.
- **DoctorDateOverride**: doctorId, date, startTime, endTime, slot config (overrides weekly).
- **DoctorLeave**: doctorId, date/range, reason. (Blocks booking.)
- **QueueConfig**: per doctor/service: tokenPrefix, slotDuration, patientsPerSlot, allowOverflow, walkInPolicy, priorityRules.
- **Queue**: (doctorId|serviceId|general, date) with `currentServingSeq`, status (`OPEN|PAUSED|CLOSED`).
- **Patient** (created at booking, **no login**): uhid (auto, e.g., `PRY-2026-000123`), name, dob/age, gender, mobile, address, language, consentAt, consentVersion. Match returning patients by mobile + name + DOB. Support multiple patients per mobile (family).
- **Appointment**: appointmentCode (public ID), patientId, serviceId, problemId, doctorId nullable, type (`SPECIFIC|GENERAL|WALKIN|EMERGENCY|FOLLOWUP`), date, slotStart/End, queueId, tokenSeq, tokenLabel (`A-018`), **status** (Booked, Confirmed, Checked-in, Waiting, In consultation, Completed, Cancelled, Rescheduled, No-show), priority, source (`ONLINE|RECEPTION|PHONE`), notes, cancellationReason, rescheduledFromId, checkedInAt, calledAt, consultStartAt, consultEndAt, feeShown snapshot.
- **AppointmentStatusHistory** (who/when/from→to).
- **EyeExamination**: appointmentId, technicianId, right/left distance vision, right/left near vision, refraction (SPH/CYL/AXIS/ADD per eye, PD), IOP right/left, other notes, `sharedWithDoctorAt`.
- **Consultation**: appointmentId, doctorId, notes, findings, diagnosis, treatmentPlan, testsAdvised, surgeryAdvised (bool + type), followUpDate, aiDraftUsed flag (audit).
- **Prescription** + **PrescriptionItem**: medicine, dosage, frequency, duration, instructions, eye (`RIGHT|LEFT|BOTH`), plain-language explanation (en/hi, AI-assisted, doctor-approved). **GlassesPrescription**: from refraction/doctor.
- **Medicine** (catalog): name, form, strength, stockStatus (`IN_STOCK|LOW|OUT`), optional qty, shelf. **MedicineRequest**: prescriptionId, status (`RECEIVED|PREPARING|READY|COLLECTED|UNAVAILABLE`), notes, queue token (pharmacy queue).
- **OpticalProduct**: name/description en/hi, category (`FRAME|LENS|SUNGLASS|CONTACT_LENS|ACCESSORY`), brand, frameType, design, displayPrice (optional), availability (`AVAILABLE|LOW|OUT|COMING_SOON`), tags, active/featured. **OpticalProductImage** (multiple, ordered, altText en/hi). **OpticalRequest/Order**: patient, type (`NEW_GLASSES|FRAME|LENS_REPLACEMENT|FRAME_REPLACEMENT|CONSULTATION|OTHER`), selectedProductId, glassesPrescriptionId, status (`REQUESTED|MEASURED|ORDERED|IN_PROGRESS|READY|DELIVERED|CANCELLED`), notes, promisedDate; optical appointment link + queue token.
- **Surgery**: appointmentId/patientId, type, eye (`RIGHT|LEFT|BOTH`), surgeonId, advisedBy, scheduledDate/time, otRoom, status (`ADVISED|SCHEDULED|PRE_OP_DONE|IN_SURGERY|COMPLETED|POSTPONED|CANCELLED`), **PreOpChecklist** items, consentStatus (tracked as status/date only — no document upload), anesthesiaNotes, postOpInstructions, **FollowUp** schedule (Day 1, Week 1, Month 1 defaults).
- **EmergencyRequest**: name, mobile, problem, incidentInfo, description, optional location/lat-lng, createdAt, **status** (`NEW|ACKNOWLEDGED|CONTACTED|ARRIVED|UNDER_TREATMENT|CLOSED`), aiSeverity (`HIGH|MEDIUM|LOW`) + aiReason, handledBy, timestamps per status, closeNote.
- **Notification** (in-app), **NotificationLog** (channel, template, status), **NotificationTemplate** (en/hi).
- **CMS**: Announcement, FAQ, Testimonial(optional, admin-approved), EyeProblemArticle (en/hi), **ContentHealth** (missing translations).
- **Feedback**: appointmentId, rating, comment (optional).
- **AuditLog**: actor, role, action, entity, entityId, before/after (redacted), ip, userAgent, at. **Immutable** (append-only).
- **AIInteractionLog**: feature, userRole, promptHash, redacted input summary, output summary, model, latency, flagged, at (no raw PII).
- **Setting**: key/value (JSON) for all configurable rules.
- **ConsentRecord**: type, version, patient/mobile, at.

Write realistic migrations, and a **seed script** (Section 13).

---

## 7. CORE ENGINES (implement as pure, unit-tested modules in `/src/server/engines`)

### 7.1 Availability & Slot Engine
Given `(doctorId?, serviceId, date)` compute bookable slots.
**Precedence (highest → lowest):** `DoctorLeave` (blocks) > `HospitalHoliday`/hospital closed > `DoctorDateOverride` > `DoctorWeeklySchedule`.
- Split working window into slots by `slotDurationMin`, subtract breaks.
- Each slot has `capacity` = `patientsPerSlot`; remaining = capacity − active bookings.
- Hide past slots; apply `minLeadMinutes` and `maxAdvanceDays` (configurable, default booking window 30 days).
- Return per-date availability summary (for calendar highlighting) and per-slot detail.
- Unverified/suspended doctors return **nothing**.

### 7.2 Token Engine
- **Queue key:** `(hospitalId, doctorId | serviceId | "GENERAL", date)`. Each queue has a prefix (default: doctor code letter(s), e.g., `A`, `B`; `G` general; `P` pharmacy; `O` optical; `E` emergency; `W` walk-in overflow) and a zero-padded sequence (`A-018`).
- **Slot-mapped ranges (per SRS):** with `patientsPerSlot = N`, slot k owns tokens `(k−1)N+1 … kN`. Booking assigns the **lowest free number in the chosen slot's range**. Values are **never hard-coded**; they come from admin config.
- **Concurrency safety:** allocate inside a DB transaction with row-level lock (`SELECT … FOR UPDATE` on the queue row) + unique constraint `(queueId, tokenSeq)`. Idempotency key on booking requests. Provide a **concurrency test** that fires 50 parallel bookings for a 10-capacity slot and asserts exactly 10 succeed with unique tokens.
- **Walk-ins (reception):** next free token in earliest slot with capacity from "now"; if the day is full and `allowOverflow` is on, issue `W-` overflow tokens; else show "Day full".
- **Emergency/priority insertion:** priority patients (emergency-to-OPD, senior, pregnant, disabled — configurable) get **served next** without renumbering existing tokens (use a `servingOrder` distinct from `tokenSeq`).
- **Serving order** = priority first, then checked-in patients by tokenSeq. Patients not yet arrived are **skipped** when called (status `Booked/Confirmed` → remain, marked "Skipped, can rejoin"); reception may **Recall**. Grace period (default 15 min after being called, configurable) then **No-show**.
- **Queue controls (Reception/Doctor):** Call next, Call specific, Skip, Recall, Pause queue, Resume, Close, Reassign to another doctor (with notification).
- **Status machine** (validate transitions on server): `Booked → Confirmed → Checked-in → Waiting → In consultation → Completed`; `Cancelled` from Booked/Confirmed/Checked-in; `Rescheduled` (creates new appointment, links old); `No-show` from Waiting/Checked-in. All transitions logged in `AppointmentStatusHistory`.

### 7.3 Estimated Arrival (ETA) Engine
Compute a **window**, never a single time.
- `avgConsult` = rolling median of last N (default 20) completed consultation durations for that doctor/queue (fallback: configured slot duration ÷ patientsPerSlot).
- `ahead` = active appointments with `servingOrder` lower than the patient's (excluding cancelled/no-show/completed).
- `center = max(now, currentConsultStart) + ahead × avgConsult`.
- Window = `center ± max(10 min, 20% of (center − now))`, clamped to not start before the booked slot start when ordering is on schedule.
- Before the day begins, show the booked slot window.
- Recompute on every status change; push via SSE.
- UI must always show: *"This is an estimate and may change due to consultation duration or emergency cases."* (bilingual).
- Show: Your Token, Currently Serving, Patients Ahead, Estimated Arrival window.

### 7.4 General Appointment assignment
Admin selects a strategy (Setting): `LEAST_LOADED`, `EARLIEST_AVAILABLE`, `SPECIALIZATION_MATCH_THEN_LEAST_LOADED` (default). Assign at booking (show "Doctor will be confirmed at check-in" or the assigned doctor, per setting). Reception can reassign. AI may suggest but strategy engine decides.

### 7.5 Doctor leave conflict handler
When a leave/date-override is saved and appointments exist in the affected window: show the doctor a **conflict list**, block silent save, and on confirm: notify Owner/Reception, mark affected appointments `NEEDS_RESCHEDULE`, offer patients (SMS/WhatsApp/email with magic link) options: reschedule to another slot/doctor, or cancel. Reception gets a "Needs rescheduling" worklist.

### 7.6 Fee Display Engine
Resolve display text for a doctor/service/date from `FeeRule` (e.g., "Free General Eye Checkup — every Tuesday", else "Consultation fee ₹X"). Show label "Payable at hospital counter" (bilingual). No payment gateway, ever.

---

## 8. FEATURE MODULES — DETAILED SPECIFICATION

### 8.1 Public Website (no login)
**Navigation:** Home, About Hospital, Services, Eye Problems, Doctors, Eye Checkup, Eye Surgery, Lens, Optical / Chashma Ghar, Medicines, Emergency, Appointment, Contact, Language toggle. Prominent **Book Appointment** and **Emergency** buttons. Footer with timings, address, map link, phone, quick links, disclaimer.

**Pages (all fully built, SEO meta, structured data for MedicalOrganization):**
1. **Home:** hero ("Complete Eye Care Under One Roof" / "एक ही छत के नीचे सम्पूर्ण नेत्र देखभाल"), hospital name/location/contact, live **"Open now / Closed" badge** computed from timings & holidays, two big CTAs, service cards (Eye Checkup, Vision Test, Consultation, Injury Treatment, Surgery, Lens, Cataract care, Medicines, Spectacles, Frames, Glass/Lens replacement, Dressing, Follow-up, Emergency), "How it works" (Book → Get Token → Track → Visit), featured doctors, new optical arrivals, today's free-checkup banner (if FeeRule says so), announcements, FAQs, contact/map, AI assistant launcher.
2. **About Hospital:** story, mission, facilities, timings, gallery.
3. **Services** + **service detail** pages (from DB, bilingual).
4. **Eye Problems:** searchable list (blurred vision, pain, redness, watering, dryness, injury, infection, cataract, glaucoma, etc.) with plain-language explanation, "when to seek emergency care", and **"Find a doctor / Book"** CTA. Educational only.
5. **Doctors:** filters (specialization, day available, service, search by name), cards with photo, name, qualification, specialization, experience, consultation info, available days/time, location, **Book Appointment**. Doctor detail page with bio and next available slots. **Only VERIFIED & active doctors.**
6. **Eye Checkup / Eye Surgery / Lens / Medicines** landing pages with relevant info, doctors, FAQs, CTA.
7. **Optical / Chashma Ghar:** product catalog (grid, filters by category/brand/frame type/availability, search), product detail with **multi-image gallery**, description, availability, price if enabled, **"Book optical appointment"** & contact/WhatsApp buttons. "New arrivals" ribbon for recent uploads.
8. **Emergency:** big instruction banner (call hospital / emergency services first — see 8.6), request form.
9. **Appointment:** the booking wizard (8.3).
10. **Contact:** address, map embed link, phone, email, timings, enquiry form (stored + notified to admin).
11. **Track Appointment / My Appointment**, **Privacy Policy**, **Terms**, **Consent** pages (bilingual).
12. Custom 404/500 pages (bilingual, helpful).

### 8.2 Doctor Registration & Verification
- **Registration form** (`/doctor/register`): full name, mobile, email, gender, qualification, specialization (multi-select from admin list + "Other, please specify"), experience, consultation fee (optional), preferred working days, preferred working hours, short bio (en; hi optional, AI-translate assist), password. **No document upload.** Validate duplicates. OTP verify mobile/email.
- On submit: `PENDING`, doctor sees confirmation; **Owner gets in-app alert (real-time), email, and optional SMS/WhatsApp**: "New Doctor Registration Request — Dr. ABC".
- **Owner Doctor Requests page:** list with filters; detail view shows submitted info; **Confirm** and **Decline** buttons (decline asks for optional reason). Confirm → `VERIFIED`, doctor account activated, doctor notified, default schedule seeded from preferred days/hours (editable), becomes public. Decline → stays inactive; doctor notified; may re-apply.
- Owner can later **suspend/reactivate** a doctor (removes from public; affected appointments handled per 7.5).
- Owner may edit doctor's public profile and upload/approve the **doctor photo** (real photo only).
- Success/decline messages exactly as SRS ("Doctor successfully verified and activated." / "Doctor registration request declined."), bilingual.
- Test: unverified doctor is absent from public list, search, slots, and booking APIs (API-level enforcement, not just UI).

### 8.3 Appointment Booking Wizard (public, 10 steps per SRS)
Mobile-first stepper with progress bar, back/next, autosave draft (sessionStorage), and clear errors.
1. **Select service** (cards). 2. **Select problem/reason** (list from `ServiceProblem`; includes "Other"). *Red-flag problems trigger an emergency notice with link to Emergency page.* 3. **Choose:** "I want a specific doctor" (list filtered by service/problem/specialization) OR **"General Appointment"** (hospital assigns). 4. **Select date** (calendar with available dates highlighted; show free-checkup days badge). 5. **Select time slot** (with remaining capacity; unavailable disabled with reason). 6. **Patient details** (configurable required fields: name, age/DOB, gender, mobile, address; consent checkbox; language preference; "Booking for someone else / family member" option). 7. **Review & confirm** with **mobile OTP verification** (anti-spam). 8. Generate **Appointment ID**. 9. Generate **Token** (per 7.2). 10. Show **estimated arrival window** (per 7.3).

**Confirmation page:** patient name, Appointment ID, Token (e.g., A-018), doctor, service, date, time, estimated arrival window, hospital name/address/map, instructions (bring old prescriptions/glasses, arrive 15 min early, etc. — configurable bilingual), fee info (display only), **QR code** (for check-in), buttons: Download PDF, Share on WhatsApp, Add to Calendar, Track Live, Cancel/Reschedule. Also send SMS/WhatsApp/email with the magic link.
**Admin configurable:** which fields mandatory, min lead time, max advance days, cancellation cutoff, max active bookings per mobile per day, instructions text.
**Rules:** duplicate booking guard (same patient + same service + same day), block after N no-shows (configurable, with Reception override), rate limit + CAPTCHA on OTP requests.

### 8.4 Live Token & Patient Tracking
`/track/[code]` (magic link) and `/my-appointment`: shows **Your Token**, **Currently Serving**, **Patients Ahead**, **Estimated Arrival**, status timeline, and updates in real time (SSE, polling fallback, `aria-live`). Notify (SMS/WhatsApp/push) when patients-ahead ≤ configurable threshold (default 3) and when called. Cancel/reschedule flow with rules and confirmation.

### 8.5 Reception Dashboard
- **Today's board:** all queues (by doctor/service), counts by status, search by name/mobile/token/appointment ID.
- **QR scan & manual check-in** (camera QR scanner in browser) → `Checked-in` → `Waiting`.
- **Walk-in booking** (fast form, same engine, `source=RECEPTION`).
- **Phone-booking** support.
- Queue controls (call next/skip/recall/pause/reassign), priority flag, no-show marking.
- Needs-reschedule worklist, emergency alerts panel, patient basic info view/edit (contact only), reprint token (PDF/thermal-friendly print CSS).
- **Public TV Display** `/display/[queue|all]`: large-font, high-contrast, auto-refreshing "Now Serving / Next" board, bilingual, optional speech announcement ("Token A-012, कृपया डॉक्टर के कक्ष में आएं") via Web Speech API.

### 8.6 Emergency Module
- **Public:** prominent red button (floating on mobile). Page starts with a bilingual **safety banner**: *"If this is an emergency that needs immediate medical attention, call the hospital / emergency services now. Do not rely only on this online request."* with tap-to-call buttons.
- **Form:** name, mobile, problem type (chemical splash, blunt injury, sharp object, sudden vision loss, severe pain, other…), incident info, short description, optional location/details (optional GPS "share my location"), consent. No login. OTP not required (never delay emergencies) but rate-limited.
- **On submit:** create `EmergencyRequest`, instant real-time alert (SSE + in-app sound + email + SMS/WhatsApp) to Owner + authorized Reception/OT/on-call doctor. AI triage tags severity (never blocks delivery; falls back gracefully).
- **Admin/Reception dashboard:** red **"URGENT EMERGENCY REQUEST"** cards (name, mobile with tap-to-call, problem, time elapsed, status, AI severity + reason). Status flow: **New → Acknowledged → Contacted → Arrived → Under Treatment → Closed**, each timestamped and audit-logged; SLA timer highlights unacknowledged requests (> configurable minutes) with escalation notification.
- Patient gets confirmation: "Request received. The hospital will contact you." plus emergency numbers.
- Hospital timing: if outside hours and `emergency24x7` is false, show the alternate emergency instruction configured by admin.

### 8.7 Doctor Dashboard
- **Overview:** today's appointments, current queue, next patient, quick stats.
- **My Appointments:** by date/status; call next; patient basic info; view eye examination from optometrist; view past history (own patients only).
- **Consultation screen:** notes, clinical findings, diagnosis, treatment recommendation, medicine prescription builder (medicine autocomplete from catalog, dosage, frequency, duration, eye side, instructions; Rx templates), tests advised, surgery recommendation (creates OT request), follow-up date (creates follow-up appointment/reminder). **AI Scribe** (voice dictation + draft assist) — always doctor-reviewed. Save → status `Completed`, prescription instantly visible to Pharmacy; glasses Rx visible to Optical.
- **Schedule management:** weekly recurring schedule editor (day, start–end, slot duration, capacity, break, service, hospital/branch), **specific-date override**, **leave/unavailable dates** with conflict handler (7.5), calendar preview of resulting availability. Changes to schedule take effect for future bookings only.
- **Profile:** edit bio/qualification/experience (public changes may require Owner re-approval — setting), specializations.
- Cannot edit unrelated administrative data.

### 8.8 Eye Technician / Optometrist Dashboard
Assigned/today's patients (from check-in). **Examination form:** right/left distance vision, near vision, refraction (SPH/CYL/AXIS/ADD, PD), IOP right/left, other observations. Validation ranges, unit hints, Snellen/decimal option. **"Send to Doctor"** action marks ready and notifies the doctor; patient token status becomes "With Optometrist". History of past examinations for returning patients.

### 8.9 Pharmacy Dashboard
- Incoming **prescriptions/medicine requests** (from consultations) with patient token, medicines, dosage; statuses `Received → Preparing → Ready → Collected / Unavailable`; pharmacy queue with token & ETA; patients notified when **Ready**.
- **Medicine catalog & availability:** add/edit medicines (bilingual name), stock status (In stock/Low/Out), optional quantity, search; public "Medicines" page shows availability status only for listed items (admin toggles visibility).
- **Medicine appointment/request** (public): request pickup for a prescription by Appointment ID (OTP) or general enquiry.
- Payment note: "Pay at medicine counter" — **no billing features.**

### 8.10 Optical / Chashma Ghar Dashboard
- **Product management:** create/edit/archive product with fields: name (en/hi), category, brand, frame type, design, description (en/hi), display price (optional, toggle), availability, tags, featured, **multiple images** (drag-drop, reorder, set cover, auto-resize to WebP with thumbnails, alt text). **AI Product Assist:** upload image → AI drafts bilingual name/description/tags/category; staff edits before publish. Publish/unpublish → immediately visible on public Optical page ("New Arrival" badge for N days).
- **Optical appointments queue** (own tokens `O-xxx`, ETA, check-in).
- **Optical requests/orders** with lifecycle `Requested → Measured → Ordered → In progress → Ready → Delivered`; link to patient's glasses prescription (view-only); notify patient when ready (bilingual SMS/WhatsApp).
- Lens/glass and replacement request handling; stock status per product.
- Patient booking types: New glasses, Frame, Lens/glass replacement, Frame replacement, Optical consultation, Other.
- Public "Enquire / Book optical appointment" from any product page (prefills product).

### 8.11 Surgery / OT Dashboard
- **Surgery list:** advised (from doctors) → schedule (date, time, OT room, surgeon, eye side, type), calendar + day view, conflict detection (surgeon/room double-booking).
- **Pre-op:** configurable checklist (fasting instructions given, tests done, BP/sugar noted, consent obtained — status/date only, no upload), patient notified with bilingual pre-op instructions.
- **Day-of status:** `Scheduled → Pre-op done → In surgery → Completed / Postponed / Cancelled`, live status shown to reception.
- **Post-op:** notes, medicines (creates Rx), instructions (bilingual), **auto follow-up schedule** (Day 1, Week 1, Month 1 — configurable) with reminders.

### 8.12 Owner / Admin Dashboard
- **Overview:** today's appointments, live queues, emergency alerts, pending doctor requests, no-shows, wait-time averages, quick actions.
- **Doctor management:** requests (Confirm/Decline), verified list, suspend/reactivate, edit profile/photo, view schedules.
- **Staff & department management:** create users, assign roles/departments, reset passwords, deactivate.
- **Hospital info & timings:** bilingual profile, weekly timings, holidays, emergency availability; public site auto-reflects.
- **Services/problems/specializations CRUD** (bilingual, with AI Translate), fee/free-day rules, queue configs (opening time, slot duration, patients per slot, prefixes, walk-in/overflow, grace period), general-assignment strategy, booking rules.
- **Appointments & token monitoring** (all queues, override tools).
- **Emergency center** (8.6).
- **Website content (CMS):** announcements, FAQs, eye-problem articles, about, gallery, banners — bilingual with AI Translate; **Content Health** for missing translations.
- **Notification templates** (bilingual editable, with variables).
- **Reports (non-revenue only):** patients per day/week/month, by service/doctor, wait-time & consult-duration, no-show/cancellation rate, doctor utilization, peak hours heatmap, emergency response time, optical requests by status, pharmacy request turnaround, OT volume. Date filters, **CSV/PDF export**. **Explicitly no revenue/payment reports.**
- **AI Analytics Assistant** (9.6).
- **Audit log viewer**, **system settings** (feature flags, AI on/off per feature, notification providers, data retention), backup status, health check.
- **Data requests:** patient data access/deletion/correction request handling (DPDP-style).

### 8.13 Notifications (all bilingual, template-driven, logged)
Events: OTP, booking confirmed, reminder (D-1 and 2h before), patients-ahead threshold, called now, rescheduled/cancelled, needs-reschedule (doctor leave), doctor registration request (to owner), doctor verified/declined, emergency new/escalation, prescription ready at pharmacy, optical order ready, surgery scheduled/pre-op instructions, follow-up reminder, feedback request. Channels: in-app bell (real-time), email, SMS, WhatsApp — user's language used; retry with backoff; provider failure never breaks the main flow.

### 8.14 Feedback
Optional 1–5 rating + comment after completed visit, via link; Owner sees aggregated results; low ratings flagged.

---

## 9. AI INTEGRATION (a core requirement — build for real, not mock)

### 9.1 Architecture
- `AIProvider` interface (`generateText`, `generateStructured(schema)`, `vision`, `classify`), default **Gemini**; config via env (`AI_PROVIDER`, `AI_API_KEY`, model names). Server-side only; keys never reach the browser.
- Every feature has a **feature flag**, timeout, retries, **graceful fallback** (feature hides or falls back to rule-based logic; core booking must work with AI fully disabled).
- **Privacy:** redact PII (names, mobile, address) before sending to the model where not essential; log only redacted summaries in `AIInteractionLog`; no patient data used for training; document in `docs/AI.md`.
- **Safety:** system prompts enforce: *no diagnosis, no medication advice, no dosage advice to patients, always recommend seeing a doctor, escalate red flags to Emergency.* Output validated against Zod schemas. Bilingual responses in the user's selected language. Prompt-injection defense (treat user text as data; ignore instructions inside it). Content filter and rate limit per IP/session.
- Label all AI output in UI: *"AI-generated suggestion. Not a medical diagnosis."* (bilingual). Anything clinical requires human review before saving.

### 9.2 Features (all to be implemented)
1. **AI Eye-Care Assistant (public chat widget, Hindi/English, text + voice input):** helps patients describe symptoms in their own words and suggests the right **service, problem category, and specialization**, then deep-links into the booking wizard with fields prefilled. Answers hospital FAQs (timings, location, services, how token works) grounded in DB content (RAG over Hospital/Service/FAQ data). **Red-flag detection** (sudden vision loss, chemical exposure, penetrating injury, severe pain, flashes/curtain, etc.) → immediately shows the Emergency banner with tap-to-call and Emergency form link. Never diagnoses.
2. **AI Auto-Translate (Admin/Doctor/Optical forms):** EN↔हिन्दी drafts for any bilingual field; preserves medical terms; shows a diff/preview; requires human confirm.
3. **Smart ETA:** statistical model (rolling medians by doctor/service/hour/day-of-week); design so an ML model can be swapped in; expose accuracy metric on the admin report (predicted vs actual).
4. **Smart General Appointment suggestion:** rank doctors by specialization fit, load, earliest availability (rule engine + optional AI reason text).
5. **Emergency Triage Tagger:** classify incoming emergency requests (severity + reason + suggested first questions), shown to staff as an aid only.
6. **Doctor AI Scribe:** voice/text dictation (Hindi/English/Hinglish) → structured consultation draft (notes, findings, diagnosis suggestions marked "suggestion", plan, follow-up). Doctor edits and approves; `aiDraftUsed` audit flag.
7. **Prescription Explainer:** generate simple Hindi/English patient instructions from the doctor's structured prescription; doctor approves; included in PDF/notification. Never alters the prescription.
8. **Optical AI Product Assist:** vision model drafts product name/description/tags/category/color from uploaded frame image (bilingual). Also "similar frames" suggestions on product page (tag-based + embeddings if available).
9. **Admin Analytics Assistant:** natural-language questions ("आज कितने no-show हुए?", "Which doctor has the longest waiting time this week?") → converted to **whitelisted, read-only, parameterized aggregate queries** (no raw SQL from the model, no patient-identifiable output unless role allows) → answer + chart.
10. **No-show Risk Score:** simple model/heuristic (lead time, history, day, weather-free) to prioritize reminders and suggest safe overbooking (admin toggle).
11. **Smart Search:** semantic search across services/problems/doctors in Hindi/English/Hinglish (handles typos, e.g., "motiyabind", "chashma").
12. **Accessibility AI:** "Read aloud" (TTS via browser/provider) for key pages and token status in Hindi/English.

Each AI feature needs: UI, API route, prompt templates (versioned in `/src/ai/prompts`), validation schema, tests with mocked provider, fallback path, and documentation.

---

## 10. SECURITY, PRIVACY & COMPLIANCE

- HTTPS-only assumptions, secure headers (CSP, HSTS, X-Frame-Options, Referrer-Policy), CSRF protection, strict CORS, input validation everywhere (Zod), output encoding, parameterized queries (Prisma), file upload validation (type sniffing, size limit, re-encode images, strip EXIF), rate limiting (login, OTP, booking, emergency, AI), bot protection (CAPTCHA on public forms), brute-force lockout.
- **RBAC enforced server-side** on every route/action + row-level checks (doctor sees only own patients). Automated RBAC test suite for every endpoint.
- **Encrypt sensitive fields at rest** (mobile, address, clinical notes) via field-level encryption or DB-level encryption; TLS in transit; secrets only in env.
- **Consent** captured at booking (versioned) and for AI usage where patient data is involved; privacy policy & terms pages (bilingual).
- **Audit log** for all reads of clinical records by staff and all writes; immutable.
- Data retention setting, patient **data access/correction/deletion request** workflow, aligned with India's DPDP Act 2023 principles (state this is a technical aid, not legal advice, in docs).
- Session security, idle timeout, device/session list for staff, forced logout on role change.
- Daily automated DB backup script + restore instructions; health-check endpoint; structured JSON logs; error tracking hook (Sentry-compatible).
- Dependency audit in CI.

---

## 11. NON-FUNCTIONAL REQUIREMENTS

- **Performance:** Lighthouse mobile ≥ 90 on public pages (Perf/Accessibility/Best Practices/SEO); LCP < 2.5s on 4G; image optimization, lazy-loading, code-splitting, caching (ISR for public content), skeleton loaders. Works acceptably on low-end Android and slow networks.
- **PWA:** manifest, icons, service worker (offline shell, cached "My Token" last known state with "last updated" time).
- **Responsive:** 360px → 1920px. Dashboards usable on tablets (reception/OT use).
- **Reliability:** graceful degradation when SMS/AI/realtime fails; optimistic UI with rollback; idempotent APIs.
- **Scalability:** stateless app, indexes on hot queries, pagination everywhere, SSE fan-out via Redis pub/sub when configured.
- **Browser support:** latest Chrome, Edge, Firefox, Safari (iOS 15+), Android WebView.
- **Observability:** request IDs, metrics endpoint, admin health page.

---

## 12. API & ROUTE INVENTORY (implement and document in `docs/API.md`)

Use typed route handlers/server actions with Zod. At minimum:
- Public: `GET services, problems, specializations, doctors, doctors/:id, availability, optical/products, optical/products/:id, hospital, timings, faqs, announcements`; `POST appointments (idempotent), otp/send, otp/verify, emergency, contact, feedback, doctor/register, medicine-requests, ai/assistant`; `GET appointments/:code (magic link/OTP), token-status SSE`; `POST appointments/:code/cancel|reschedule`.
- Auth: login, logout, refresh, forgot/reset password, 2FA, change password.
- Owner: doctors (requests, confirm, decline, suspend), staff CRUD, settings, services/problems/specializations CRUD, CMS CRUD, reports, audit, AI analytics.
- Doctor: schedule (weekly/override/leave + conflict check), appointments, consultation, prescription, follow-up, surgery advise.
- Reception: check-in, walk-in, queue controls, reschedule worklist, emergency status updates.
- Optometrist: examination CRUD, send-to-doctor.
- Pharmacy: requests status, catalog CRUD.
- Optical: products CRUD + images, requests/orders status, optical queue.
- OT: surgeries CRUD/schedule, checklist, post-op, follow-ups.
- Realtime (SSE): `queue/:id`, `appointment/:code`, `emergency`, `notifications`.
- Health: `/api/health`.

---

## 13. SEED / DEMO DATA (clearly marked `DEMO`)

Provide `npm run db:seed` that creates: 1 hospital (fictional name in Prayagraj, Uttar Pradesh — configurable), timings (Mon–Sat 9–5, Sun closed), 3 holidays, 8 specializations, 6 services with 25+ problems (bilingual), 6 verified doctors (generic avatar, **no fake real-person photos**) + 2 pending requests + 1 declined, weekly schedules, one leave, one date override, fee rules (Free General Checkup on Tuesday), 1 user per role with demo credentials printed in README (**must be changed in production; seed refuses to run with demo passwords when `NODE_ENV=production`**), 40 optical products with placeholder images (generic), 60 medicines, 100 sample appointments across statuses, sample emergencies, sample surgeries, FAQs, announcements, notification templates in both languages. Everything must render nicely in both languages.

---

## 14. TESTING REQUIREMENTS

- **Unit (Vitest):** slot engine (precedence: leave > override > weekly > holiday), token allocation, status machine, ETA, fee resolver, RBAC policies, i18n key parity, Zod schemas.
- **Concurrency:** 50 parallel bookings on a 10-capacity slot → exactly 10 unique tokens.
- **Integration:** API + DB (test container/DB), including unverified-doctor exclusion, OTP flows, magic-link access, doctor-leave conflict flow.
- **E2E (Playwright), each in `hi` and `en`, mobile + desktop:** (1) browse → book specific doctor → token → track; (2) general appointment; (3) doctor register → owner confirm → doctor appears publicly; (4) owner decline → doctor stays hidden; (5) doctor schedule + leave blocks booking; (6) reception check-in + call next → patient's live status updates; (7) emergency submit → admin alert → status flow; (8) doctor consultation → prescription → pharmacy sees it → Ready notification; (9) optical product upload with images → appears publicly; optical order lifecycle; (10) OT scheduling → follow-up; (11) language switch persists across pages; (12) AI assistant red-flag → emergency banner; (13) RBAC negative tests.
- **Accessibility:** axe checks in CI on key pages.
- All tests wired into `npm run test:all` and GitHub Actions.

---

## 15. PHASED BUILD PLAN (STRICT ORDER — finish & verify each phase fully)

**Phase 0 — Foundation & Design System**
Repo, tooling, strict TS, ESLint/Prettier, Tailwind theme (Section 3), fonts, shadcn components, layout shells (public + dashboard), i18n infrastructure with language toggle working on real pages, a11y controls (font size, contrast), env/config, Docker, CI, README skeleton.
*Acceptance:* app runs; toggle switches Hindi/English on shell pages; theme matches spec; `i18n:check` works; CI green; `/dev/ui` shows all components in both languages.

**Phase 1 — Database, Auth, RBAC, Audit**
Full Prisma schema + migrations, seed (partial OK here but schema complete), auth flows (login, reset, lockout, 2FA optional), RBAC policy engine + tests, staff management basics, audit logging, role-based redirects/sidebars for all 7 roles.
*Acceptance:* each role logs in and sees only permitted menus; forbidden API calls return 403 (tested); audit entries recorded.

**Phase 2 — Public Website (all pages)**
Every page in 8.1 fully built with real DB content, bilingual, SEO, PWA basics, open/closed badge, doctors list (verified only), services, eye problems, optical catalog (read), contact form, emergency page shell, FAQs.
*Acceptance:* zero placeholder text; Lighthouse targets on Home; all pages pass mobile/desktop checks in both languages.

**Phase 3 — Doctor Registration, Verification & Schedule Management**
8.2 + 8.7 schedule/leave/override + conflict handler + Owner doctor requests page + notifications for these events.
*Acceptance:* full register → notify → confirm/decline → public visibility flow works; leave blocks booking; conflicts notify.

**Phase 4 — Availability, Appointment & Token Engines + Booking Wizard + Tracking**
Sections 7.1–7.6, 8.3, 8.4, OTP, PDF/QR, magic link, cancel/reschedule, concurrency test.
*Acceptance:* complete 10-step booking works for specific & general; tokens unique under concurrency; ETA shown with disclaimer; live tracking updates in real time.

**Phase 5 — Reception, Queue Control, Check-in, TV Display**
8.5 fully.
*Acceptance:* QR/manual check-in, call/skip/recall/no-show, walk-ins, priority, TV board with announcements, needs-reschedule worklist.

**Phase 6 — Emergency Module**
8.6 fully with real-time alerts, SLA/escalation.
*Acceptance:* submit → alert appears within 2 seconds on admin/reception; full status flow logged.

**Phase 7 — Clinical Flow: Optometrist, Doctor Consultation, Prescription, Medical Record**
8.8, 8.7 consultation, prescriptions, records timeline, follow-ups, RBAC-restricted access with audit reads.
*Acceptance:* patient journey (check-in → optometrist → doctor → Rx) works end-to-end with correct visibility rules.

**Phase 8 — Pharmacy**
8.9.  *Acceptance:* Rx appears instantly, statuses/notifications work, catalog & public availability page.

**Phase 9 — Optical / Chashma Ghar**
8.10 with multi-image upload, public showcase, appointments, orders lifecycle.
*Acceptance:* new product with 3 images appears publicly in both languages immediately; order flow complete.

**Phase 10 — Surgery / OT**
8.11. *Acceptance:* advise → schedule (conflict detection) → pre-op → surgery day status → post-op → auto follow-ups.

**Phase 11 — Owner Admin Console: Settings, CMS, Reports, Audit**
8.12, 8.13 template editor, 8.14 feedback.
*Acceptance:* every configurable rule from the SRS (opening time, slot duration, patients per slot, service/doctor queues, free-checkup days, timings/holidays, fields required) changes behavior live; reports render with real data and export.

**Phase 12 — AI Layer (all 12 features in 9.2)**
*Acceptance:* each feature works with the real provider, has fallback when disabled, red-flag escalation verified, translations reviewed by human before save, docs in `docs/AI.md`.

**Phase 13 — Hardening & Release**
Security review vs Section 10, performance/Lighthouse, axe a11y, full e2e in both languages, RBAC negative tests, backup/restore drill, seed for production-safe init, complete documentation, final walkthrough.
*Acceptance:* `npm run test:all` green; Docker compose up works from scratch; checklist in Section 17 fully ticked.

---

## 16. PHASE COMPLETION REPORT (produce after every phase)

```
PHASE N — <name> — STATUS: COMPLETE / BLOCKED
1. What was built (screens, APIs, DB changes, engines)
2. Acceptance criteria: each item ✅/❌ with how it was verified
3. Languages verified: hi ✅ en ✅ | Viewports: 375px ✅ 1280px ✅
4. Commands run & results: typecheck, lint, test, i18n:check
5. Screenshots / recording references for key screens
6. Known limitations (must be empty for COMPLETE) & decisions made (also in DECISIONS.md)
7. Placeholder/TODO scan result: 0 found (run: grep -rniE "TODO|FIXME|lorem|placeholder" src)
```
If any acceptance item is ❌, the phase is NOT complete — fix before continuing.

---

## 17. FINAL DEFINITION OF DONE

- [ ] All 7 roles have fully working dashboards (no empty pages).
- [ ] Hindi/English toggle works everywhere: UI, DB content, forms, errors, notifications, PDFs, TV display, AI answers.
- [ ] Unverified doctors are invisible and unbookable (proven at API level).
- [ ] Booking → token → live ETA → check-in → consultation → prescription → pharmacy/optical/OT flow works end-to-end.
- [ ] Emergency flow with real-time alerts and status lifecycle works.
- [ ] No billing/revenue/doctor-document features exist anywhere.
- [ ] All configurable rules are admin-editable (nothing hard-coded).
- [ ] AI features live with safety guardrails, fallbacks, and labels.
- [ ] Professional hospital theme applied consistently; accessibility features (font size, contrast, keyboard, screen reader, read-aloud) working.
- [ ] Security & privacy measures implemented and documented; audit log active.
- [ ] Test suites green; CI green; Docker one-command startup; README and docs complete.
- [ ] Zero TODO/placeholder/lorem in code; zero console errors in browser on all main pages.

---

## 18. ASSUMPTIONS TO RECORD (change via env/settings, not code)

Single hospital now (branch-ready schema); default AI provider Gemini; SMS/WhatsApp providers via adapter (console mock in dev, production keys via env); timezone IST; default slot rules editable by Owner; fee display only; medical content is informational and reviewed by hospital before publishing.

---

**BEGIN NOW.** First create the complete task list for all phases, write `docs/DECISIONS.md`, then start **Phase 0** and continue phase by phase, completing and verifying each one fully before moving on.
