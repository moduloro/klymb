import type { Metadata } from "next";
import { Suspense } from "react";
import { resolveAudience } from "@/lib/locale";
import { getCommonContent } from "@/lib/content";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./banner-surface.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Klymb",
  description: "Your Career Agent",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audience = await resolveAudience();
  const common = await getCommonContent(audience.cc, audience.lang);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        <Providers>
          <Suspense fallback={null}>
            <Header nav={common.nav} />
          </Suspense>
          {/* Spacer to offset fixed header height on all viewports */}
          <div className="h-14" aria-hidden="true" />
          <div className="flex-1">{children}</div>
          <Footer labels={common.footer} />
          {/* Sitewide GDPR cookie consent drawer */}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
