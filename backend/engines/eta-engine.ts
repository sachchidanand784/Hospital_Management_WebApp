export interface ETARequest {
  patientsAhead: number;
  avgConsultMin?: number; // default 15 min
  currentTime: Date;
}

export interface ETAResult {
  centerMinutes: number;
  windowStart: string; // "10:45 AM"
  windowEnd: string;   // "11:05 AM"
  disclaimer_en: string;
  disclaimer_hi: string;
}

export function calculateETAWindow(req: ETARequest): ETAResult {
  const avg = req.avgConsultMin || 15;
  const minutesToWait = req.patientsAhead * avg;

  const centerDate = new Date(req.currentTime.getTime() + minutesToWait * 60 * 1000);

  // Window = center ± max(10 min, 20% of wait)
  const marginMin = Math.max(10, Math.round(minutesToWait * 0.2));

  const startDate = new Date(centerDate.getTime() - marginMin * 60 * 1000);
  const endDate = new Date(centerDate.getTime() + marginMin * 60 * 1000);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return {
    centerMinutes: minutesToWait,
    windowStart: formatTime(startDate),
    windowEnd: formatTime(endDate),
    disclaimer_en: "This is an estimate and may change due to consultation duration or emergency cases.",
    disclaimer_hi: "यह एक अनुमानित समय है, ओपीडी समय अथवा आपातकालीन मरीजों के कारण इसमें बदलाव हो सकता है।",
  };
}
