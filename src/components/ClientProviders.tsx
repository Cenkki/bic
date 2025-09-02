"use client";

import { SessionProvider } from "next-auth/react";
import { CookieConsentProvider } from "@/lib/cookieConsent";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Footer from "@/components/Footer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <CookieConsentProvider>
        {children}
        <Footer />
        <CookieConsentBanner />
      </CookieConsentProvider>
    </SessionProvider>
  );
}