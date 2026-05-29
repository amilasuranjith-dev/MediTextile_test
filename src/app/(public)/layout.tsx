import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuoteCartProvider } from '@/context/QuoteCartContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuoteCartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24">{children}</main>
        <Footer />
      </div>
    </QuoteCartProvider>
  );
}
