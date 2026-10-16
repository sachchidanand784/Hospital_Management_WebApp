/**
 * Standardized 12-Hour Time Utilities (Asia/Kolkata IST)
 * Provides 12-hour clock (AM/PM) formatting across the entire hospital system.
 */

export function formatTo12Hour(timeOrDate?: string | Date | null): string {
  if (!timeOrDate) return '10:00 AM';

  // If already in 12h format e.g. "10:30 AM" or "02:15 PM"
  if (typeof timeOrDate === 'string' && /(AM|PM|am|pm)/i.test(timeOrDate)) {
    return timeOrDate.trim().toUpperCase();
  }

  // If it's a 24h string like "16:40", "09:20", "11:20", "18:00"
  if (typeof timeOrDate === 'string' && /^\d{1,2}:\d{2}/.test(timeOrDate)) {
    const parts = timeOrDate.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10) || 0;
    
    if (isNaN(hours)) return timeOrDate;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;

    const hFormatted = String(hours).padStart(2, '0');
    const mFormatted = String(minutes).padStart(2, '0');
    return `${hFormatted}:${mFormatted} ${ampm}`;
  }

  // If it's a Date object or ISO timestamp string
  try {
    const d = new Date(timeOrDate);
    if (!isNaN(d.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    }
  } catch {
    // fallback
  }

  return String(timeOrDate);
}

/**
 * Returns the exact current actual booking time in 12-Hour AM/PM format (Asia/Kolkata IST)
 * Example: "02:45 AM", "11:20 AM", "04:30 PM"
 */
export function getActualBookingTime12(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats a range like "09:00 - 17:00" into "09:00 AM - 05:00 PM"
 */
export function formatTimeRange12(start: string, end: string): string {
  return `${formatTo12Hour(start)} - ${formatTo12Hour(end)}`;
}
