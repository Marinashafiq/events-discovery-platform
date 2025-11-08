import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Tajawal } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Events Discovery Platform",
  description: "Discover and book amazing events in your area",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${tajawal.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Blocking script to set direction immediately - must be first to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                try {
                  // Extract locale from path using efficient regex (handles /ar, /ar/, /en, /en/)
                  const localeMatch = window.location.pathname.match(/^\\/(ar|en)(?:\\/|$)/);
                  const locale = localeMatch ? localeMatch[1] : 'en';
                  const dir = locale === 'ar' ? 'rtl' : 'ltr';
                  
                  // Set HTML attributes immediately for SEO, accessibility, and CSS
                  const html = document.documentElement;
                  html.setAttribute('lang', locale);
                  html.setAttribute('dir', dir);
                  
                  // Set body attribute immediately to make content visible (prevents FOUC)
                  // Script runs synchronously in body, so document.body always exists
                  document.body.setAttribute('data-direction-set', 'true');
                } catch (e) {
                  // Fallback: ensure defaults are set and body is visible
                  document.documentElement.setAttribute('lang', 'en');
                  document.documentElement.setAttribute('dir', 'ltr');
                  if (document.body) {
                    document.body.setAttribute('data-direction-set', 'true');
                  }
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
