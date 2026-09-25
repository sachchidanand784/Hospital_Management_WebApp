import React from 'react';
import { Navbar } from '@frontend/components/common/Navbar';
import { Footer } from '@frontend/components/common/Footer';
import { FloatingCTAs } from '@frontend/components/common/FloatingCTAs';
import en from '@messages/en.json';
import hi from '@messages/hi.json';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  return (
    <div className="min-h-screen flex flex-col bg-hospital text-hospitalText" lang={locale}>
      <Navbar locale={locale} messages={messages} />
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} messages={messages} />
      <FloatingCTAs locale={locale} messages={messages} />
    </div>
  );
}
