# API Specifications & Endpoint Inventory (API.md)

## 1. Overview
All API routes and Server Actions enforce Zod schema validation, session authentication, and RBAC policy evaluation. All responses follow standardized JSON structures with bilingual error messages.

## 2. Public API Endpoints (No Authentication Required)

- `GET /api/public/hospital`: Hospital bio, address, map link, timings, emergency toggle.
- `GET /api/public/services`: List active hospital services (bilingual).
- `GET /api/public/problems`: Service problems list with emergency red-flag tags.
- `GET /api/public/doctors`: Filtered list of verified active doctors only.
- `GET /api/public/doctors/:id`: Bio and available booking slots for a verified doctor.
- `GET /api/public/availability`: Calculate bookable slots based on doctor, service, and date.
- `GET /api/public/optical/products`: Catalog of optical products (frames, lenses, accessories).
- `GET /api/public/faqs`: Hospital FAQs grounded for RAG and search.
- `POST /api/public/appointments`: Create appointment (10-step wizard submission, idempotent).
- `POST /api/public/otp/send`: Request OTP verification for appointment booking.
- `POST /api/public/otp/verify`: Verify mobile OTP.
- `POST /api/public/emergency`: Immediate emergency request submission.
- `GET /api/public/appointments/:code`: View appointment and token details (magic link / OTP).
- `GET /api/public/appointments/:code/sse`: Real-time Server-Sent Events stream for token status & ETA.
- `POST /api/public/appointments/:code/cancel`: Cancel appointment.
- `POST /api/public/appointments/:code/reschedule`: Reschedule appointment.
- `POST /api/public/doctor/register`: Doctor registration submission (status `PENDING`).
- `POST /api/public/ai/assistant`: Public Eye-Care Assistant chatbot handler.

## 3. Authenticated Staff & Dashboard Endpoints

### Authentication & Profile
- `POST /api/auth/login`: Staff/Doctor login with Argon2/bcrypt password check.
- `POST /api/auth/logout`: Invalidate session cookie.
- `POST /api/auth/reset-password`: Password reset request & verification.

### Owner Dashboard (`/api/admin/*`)
- `GET /api/admin/doctors/requests`: List pending doctor registration applications.
- `POST /api/admin/doctors/:id/confirm`: Verify doctor, activate account, seed default schedule.
- `POST /api/admin/doctors/:id/decline`: Decline doctor application with reason.
- `POST /api/admin/doctors/:id/suspend`: Suspend doctor from public availability.
- `GET/POST/PUT /api/admin/services`: Manage hospital services and problems.
- `GET/POST/PUT /api/admin/cms`: Manage announcements, FAQs, and articles.
- `GET /api/admin/reports`: Export non-revenue operational performance metrics (CSV/PDF).

### Doctor Workspace (`/api/doctor/*`)
- `GET /api/doctor/appointments`: Today's and upcoming appointments.
- `GET/POST /api/doctor/schedule`: Manage recurring weekly schedule and date overrides.
- `POST /api/doctor/leave`: Mark unavailable dates & trigger patient rescheduling flow.
- `POST /api/doctor/consultation`: Submit clinical findings, diagnosis, and prescription.

### Reception Desk (`/api/reception/*`)
- `GET /api/reception/queue`: Queue overview for all departments.
- `POST /api/reception/checkin`: QR scan or manual patient check-in.
- `POST /api/reception/walkin`: Fast walk-in token allocation.
- `POST /api/reception/queue/control`: Call next, skip, recall, or reassign token.

### Optometry & Technician (`/api/optometry/*`)
- `POST /api/optometry/examination`: Save refraction (SPH/CYL/AXIS/ADD, IOP) and send to doctor.

### Pharmacy & Optical (`/api/pharmacy/*`, `/api/optical/*`)
- `GET/PUT /api/pharmacy/prescriptions`: Pharmacy queue management.
- `GET/POST/PUT /api/optical/products`: Manage optical product catalog & multi-image upload.
- `GET/PUT /api/optical/orders`: Lifecycle management of glasses orders.

### Surgery / OT (`/api/ot/*`)
- `GET/POST /api/ot/surgeries`: Manage surgery schedule, pre-op checklists, and follow-ups.

## 4. Real-time Streams & Health
- `GET /api/sse/queue/:id`: Real-time queue board events.
- `GET /api/sse/emergency`: Emergency alert stream for staff.
- `GET /api/health`: System health check & DB connection state.
