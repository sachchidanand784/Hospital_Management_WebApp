import React from 'react';
import '@frontend/styles/globals.css';

export const metadata = {
  title: 'M S Memorial Netralaya | Hospital Management & Token System',
  description: 'Advanced Eye Hospital Management, Appointment Booking, Digital Tokens & Emergency Care in Dildarnagar, Ghazipur.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-hospital text-hospitalText">
        {children}
      </body>
    </html>
  );
}
