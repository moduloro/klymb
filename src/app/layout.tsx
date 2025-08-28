import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        <Providers>
          <Header />
          {/* Spacer to offset fixed header height on all viewports */}
          <div className="h-14" aria-hidden="true" />
          <div className="flex-1">{children}</div>
          <Footer />
          {/* Sitewide GDPR cookie consent drawer */}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
