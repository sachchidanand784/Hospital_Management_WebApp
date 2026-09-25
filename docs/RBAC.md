# Role-Based Access Control (RBAC.md)

## 1. Overview & Security Policy

Access control in the Eye Hospital System is strictly enforced on both **client UI** and **server API / Server Actions**.
Permissions are **denied by default**. Anonymous patients have zero administrative access and can only access their specific appointment using a signed magic link or Appointment ID + Mobile OTP verification.

## 2. Roles Defined

1. `OWNER`: Hospital Administrator / Superuser
2. `DOCTOR`: Medical Practitioners / Ophthalmologists
3. `RECEPTION`: Receptionists & Front Desk Staff
4. `OPTOMETRIST`: Eye Technicians & Vision Testing Staff
5. `PHARMACY`: Pharmacy Staff
6. `OPTICAL`: Chashma Ghar / Optical Shop Staff
7. `OT`: Operation Theatre & Surgery Staff

## 3. Capability Matrix

| Feature / Resource | OWNER | DOCTOR | RECEPTION | OPTOMETRIST | PHARMACY | OPTICAL | OT |
|---|---|---|---|---|---|---|---|
| Hospital Info & Timings | ✅ Manage | ❌ Read | ❌ Read | ❌ Read | ❌ Read | ❌ Read | ❌ Read |
| Staff Management & Verification | ✅ Manage | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied |
| Own Profile & Schedule | ✅ Manage | ✅ Manage | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied |
| Appointment Queue | ✅ View All | ✅ Own Only | ✅ Manage All | ✅ Assigned | ❌ Denied | ❌ Denied | ❌ Denied |
| Check-in & Walk-ins | ✅ Manage | ❌ Denied | ✅ Manage | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied |
| Patient Basic Contact Info | ✅ Access | ✅ Own Patients | ✅ Access | ✅ Assigned | ✅ Via Rx | ✅ Via Optical | ✅ Via OT |
| Eye Refraction Record | ✅ View | ✅ View | ❌ Denied | ✅ Create/Edit | ❌ Denied | ✅ Refraction | ✅ View |
| Consultation & Prescription | ✅ View | ✅ Create (Own) | ❌ Denied | ❌ Denied | ✅ View Rx | ✅ View Glasses | ✅ View Advice |
| Pharmacy Inventory & Queue | ✅ View | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Manage | ❌ Denied | ❌ Denied |
| Optical Catalog & Orders | ✅ View | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Manage | ❌ Denied |
| Surgery Schedule & Checklist | ✅ View | ✅ Advise | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Manage |
| Emergency Alerts | ✅ Manage | ✅ Notified | ✅ Manage | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Notified |
| System Audit Log | ✅ View All | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied |
