'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface FloatingCTAsProps {
  locale: 'hi' | 'en';
  messages: any;
}

export const FloatingCTAs: React.FC<FloatingCTAsProps> = ({ locale, messages }) => {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col space-y-2 md:hidden">
      <Link
        href={`/${locale}/appointment`}
        className="bg-primary text-white px-4 py-3 rounded-full shadow-floating flex items-center justify-center font-bold text-xs"
        aria-label={messages.common.bookAppointment}
      >
        <Calendar className="w-5 h-5 mr-1" />
        <span>{messages.common.bookAppointment}</span>
      </Link>
    </div>
  );
};
