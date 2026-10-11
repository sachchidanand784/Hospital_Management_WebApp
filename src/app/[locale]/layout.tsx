import React from 'react';
import { Navbar } from '@frontend/components/common/Navbar';
import { Footer } from '@frontend/components/common/Footer';
import { FloatingCTAs } from '@frontend/components/common/FloatingCTAs';
import en from '@messages/en.json';
import hi from '@messages/hi.json';
import { getHospitalSettings } from '@/actions/hospital';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'hi';
  const messages = locale === 'hi' ? hi : en;

  // Fetch real-time live hospital information configured by Owner/Admin
  const settingsRes = await getHospitalSettings();
  const hospital = settingsRes.hospital;

  return (
    <div className="min-h-screen flex flex-col bg-hospital text-hospitalText" lang={locale}>
      <Navbar locale={locale} messages={messages} hospital={hospital} />
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} messages={messages} hospital={hospital} />
      <FloatingCTAs locale={locale} messages={messages} hospital={hospital} />
    </div>
  );
}
