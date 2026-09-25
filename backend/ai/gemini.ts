import { AIProvider, AIResponse, redactPII } from './provider';

export class GeminiAIProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  async generateText(prompt: string, locale: 'hi' | 'en' = 'hi'): Promise<AIResponse<string>> {
    const safePrompt = redactPII(prompt);
    
    // Fallback if no API key is provided or offline
    if (!this.apiKey) {
      return {
        success: true,
        data: locale === 'hi' 
          ? "एआई सहायक वर्तमान में सीमित मोड में है। कृपया अपॉइंटमेंट बुक करने या आपातकालीन बटन का उपयोग करें।"
          : "AI Assistant is currently operating in fallback mode. Please proceed to book an appointment or use the emergency button.",
      };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `System: You are an AI Eye Care Assistant for Prayag Eye Hospital. Never diagnose. Answer concisely in ${locale === 'hi' ? 'Hindi' : 'English'}.\nUser: ${safePrompt}` }] }],
          }),
        }
      );

      const json = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return { success: true, data: text };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gemini API call failed' };
    }
  }

  async generateStructured<T>(prompt: string, schemaDescription: string, locale: 'hi' | 'en' = 'hi'): Promise<AIResponse<T>> {
    const textRes = await this.generateText(`${prompt}\nFormat response strictly as JSON matching: ${schemaDescription}`, locale);
    if (!textRes.success || !textRes.data) return { success: false, error: textRes.error };

    try {
      const cleanJsonStr = textRes.data.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr) as T;
      return { success: true, data: parsed };
    } catch (err) {
      return { success: false, error: 'Failed to parse AI JSON response' };
    }
  }

  async triageSymptom(symptomText: string): Promise<AIResponse<{ severity: 'HIGH' | 'MEDIUM' | 'LOW'; isRedFlag: boolean; category: string; suggestedSpecialization: string }>> {
    const lower = symptomText.toLowerCase();
    const redFlagKeywords = ['sudden vision loss', 'chemical', 'acid', 'fire', 'sharp object', 'bleeding', 'severe pain', 'अचानक रोशनी', 'तेज दर्द', 'केमिकल', 'चोट'];
    const isRedFlag = redFlagKeywords.some((kw) => lower.includes(kw));

    if (isRedFlag) {
      return {
        success: true,
        data: {
          severity: 'HIGH',
          isRedFlag: true,
          category: 'Emergency Trauma / Sudden Vision Loss',
          suggestedSpecialization: 'Retina & Ocular Trauma Specialist',
        },
        isEmergencyAlert: true,
      };
    }

    return {
      success: true,
      data: {
        severity: lower.includes('blur') || fontIncludes(lower, ['धुंधला', 'चश्मा']) ? 'MEDIUM' : 'LOW',
        isRedFlag: false,
        category: 'General Vision Consultation',
        suggestedSpecialization: 'Cataract & General Ophthalmology',
      },
    };
  }
}

function fontIncludes(text: string, arr: string[]): boolean {
  return arr.some((item) => text.includes(item));
}
