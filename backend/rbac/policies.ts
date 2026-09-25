export type Role = 'OWNER' | 'DOCTOR' | 'RECEPTION' | 'OPTOMETRIST' | 'PHARMACY' | 'OPTICAL' | 'OT';

export interface UserContext {
  id: string;
  role: Role;
  hospitalId: string;
  doctorId?: string;
}

export type Action =
  | 'manage_hospital'
  | 'manage_staff'
  | 'view_doctor_requests'
  | 'confirm_doctor'
  | 'manage_own_schedule'
  | 'view_all_appointments'
  | 'view_own_appointments'
  | 'checkin_patient'
  | 'manage_queue'
  | 'create_eye_exam'
  | 'create_consultation'
  | 'view_prescription'
  | 'manage_pharmacy'
  | 'manage_optical'
  | 'manage_surgeries'
  | 'view_audit_log'
  | 'view_reports';

export function can(user: UserContext, action: Action, resourceOwnerId?: string): boolean {
  if (!user || !user.role) return false;

  switch (action) {
    case 'manage_hospital':
    case 'manage_staff':
    case 'view_doctor_requests':
    case 'confirm_doctor':
    case 'view_audit_log':
    case 'view_reports':
      return user.role === 'OWNER';

    case 'manage_own_schedule':
      return user.role === 'OWNER' || (user.role === 'DOCTOR' && (!resourceOwnerId || resourceOwnerId === user.doctorId));

    case 'view_all_appointments':
      return user.role === 'OWNER' || user.role === 'RECEPTION';

    case 'view_own_appointments':
      return user.role === 'OWNER' || user.role === 'RECEPTION' || (user.role === 'DOCTOR' && (!resourceOwnerId || resourceOwnerId === user.doctorId));

    case 'checkin_patient':
    case 'manage_queue':
      return user.role === 'OWNER' || user.role === 'RECEPTION';

    case 'create_eye_exam':
      return user.role === 'OWNER' || user.role === 'OPTOMETRIST';

    case 'create_consultation':
      return user.role === 'OWNER' || user.role === 'DOCTOR';

    case 'view_prescription':
      return user.role === 'OWNER' || user.role === 'DOCTOR' || user.role === 'PHARMACY' || user.role === 'OPTICAL';

    case 'manage_pharmacy':
      return user.role === 'OWNER' || user.role === 'PHARMACY';

    case 'manage_optical':
      return user.role === 'OWNER' || user.role === 'OPTICAL';

    case 'manage_surgeries':
      return user.role === 'OWNER' || user.role === 'OT' || user.role === 'DOCTOR';

    default:
      return false;
  }
}
