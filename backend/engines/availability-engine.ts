export interface Slot {
  slotStart: string; // "09:00"
  slotEnd: string;   // "09:20"
  capacity: number;
  bookedCount: number;
  available: boolean;
  reason?: string;
}

export interface DayAvailability {
  date: string; // "YYYY-MM-DD"
  isClosed: boolean;
  isHoliday: boolean;
  onLeave: boolean;
  slots: Slot[];
}

export interface ScheduleConfig {
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
  slotDurationMin: number;
  capacityPerSlot: number;
  breakStart?: string;
  breakEnd?: string;
}

export function computeSlots(
  config: ScheduleConfig,
  bookedCounts: Record<string, number> = {}
): Slot[] {
  const slots: Slot[] = [];
  const [startH, startM] = config.startTime.split(':').map(Number);
  const [endH, endM] = config.endTime.split(':').map(Number);

  let currentMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;

  const breakStartMin = config.breakStart ? config.breakStart.split(':').map(Number).reduce((h, m) => h * 60 + m) : null;
  const breakEndMin = config.breakEnd ? config.breakEnd.split(':').map(Number).reduce((h, m) => h * 60 + m) : null;

  while (currentMin + config.slotDurationMin <= endMin) {
    const sH = Math.floor(currentMin / 60).toString().padStart(2, '0');
    const sM = (currentMin % 60).toString().padStart(2, '0');
    const nextMin = currentMin + config.slotDurationMin;
    const eH = Math.floor(nextMin / 60).toString().padStart(2, '0');
    const eM = (nextMin % 60).toString().padStart(2, '0');

    const slotStartStr = `${sH}:${sM}`;
    const slotEndStr = `${eH}:${eM}`;

    // Check if slot falls in break
    const isBreak = breakStartMin !== null && breakEndMin !== null && currentMin >= breakStartMin && currentMin < breakEndMin;

    if (!isBreak) {
      const booked = bookedCounts[slotStartStr] || 0;
      const available = booked < config.capacityPerSlot;

      slots.push({
        slotStart: slotStartStr,
        slotEnd: slotEndStr,
        capacity: config.capacityPerSlot,
        bookedCount: booked,
        available: available,
        reason: available ? undefined : 'Slot Full',
      });
    }

    currentMin = nextMin;
  }

  return slots;
}
