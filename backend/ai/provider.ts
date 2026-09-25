export interface AIResponse<T = string> {
  success: boolean;
  data?: T;
  rawText?: string;
  error?: string;
  isEmergencyAlert?: boolean;
}

export interface AIProvider {
  generateText(prompt: string, locale?: 'hi' | 'en'): Promise<AIResponse<string>>;
  generateStructured<T>(prompt: string, schemaDescription: string, locale?: 'hi' | 'en'): Promise<AIResponse<T>>;
  triageSymptom(symptomText: string): Promise<AIResponse<{ severity: 'HIGH' | 'MEDIUM' | 'LOW'; isRedFlag: boolean; category: string; suggestedSpecialization: string }>>;
}

export function redactPII(text: string): string {
  // Redact 10-digit mobile numbers, emails, and names
  return text
    .replace(/\b[6-9]\d{9}\b/g, '[REDACTED_MOBILE]')
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]');
}
