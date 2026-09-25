'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Volume2, Type } from 'lucide-react';

interface A11yControlsProps {
  locale: 'hi' | 'en';
}

export const A11yControls: React.FC<A11yControlsProps> = ({ locale }) => {
  const [scale, setScale] = useState<number>(1);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', scale.toString());
  }, [scale]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [highContrast]);

  const speakPage = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = document.body.innerText.substring(0, 300);
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = locale === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 bg-primary-dark/10 p-1 rounded-lg text-xs font-medium">
      {/* Font Size Adjusters */}
      <button
        onClick={() => setScale(0.9)}
        className={`px-2 py-1 rounded transition ${scale === 0.9 ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'}`}
        title={locale === 'hi' ? 'अक्षर छोटा करें (A-)' : 'Decrease text size'}
        aria-label="Decrease font size"
      >
        A-
      </button>
      <button
        onClick={() => setScale(1)}
        className={`px-2 py-1 rounded transition ${scale === 1 ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'}`}
        title={locale === 'hi' ? 'सामान्य अक्षर (A)' : 'Reset text size'}
        aria-label="Reset font size"
      >
        A
      </button>
      <button
        onClick={() => setScale(1.15)}
        className={`px-2 py-1 rounded transition ${scale === 1.15 ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-700'}`}
        title={locale === 'hi' ? 'अक्षर बड़ा करें (A+)' : 'Increase text size'}
        aria-label="Increase font size"
      >
        A+
      </button>

      {/* High Contrast Toggle */}
      <button
        onClick={() => setHighContrast(!highContrast)}
        className={`p-1.5 rounded transition ${highContrast ? 'bg-black text-yellow-400 border border-yellow-400' : 'hover:bg-gray-200 text-gray-700'}`}
        title={locale === 'hi' ? 'हाई कंट्रास्ट मोड' : 'Toggle High Contrast'}
        aria-label="Toggle high contrast"
      >
        {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Speech TTS */}
      <button
        onClick={speakPage}
        className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition"
        title={locale === 'hi' ? 'बोलकर सुनें' : 'Read Aloud'}
        aria-label="Read page aloud"
      >
        <Volume2 className="w-4 h-4" />
      </button>
    </div>
  );
};
