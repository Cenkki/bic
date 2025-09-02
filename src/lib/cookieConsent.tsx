'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CookieConsentContextType {
  consent: boolean | null;
  acceptCookies: () => void;
  rejectCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent !== null) {
      setConsent(storedConsent === 'true');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setConsent(true);
    
    // Enable analytics cookies if you add them later
    // For now, we only use necessary cookies
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setConsent(false);
    
    // Disable non-essential cookies
    // For now, we don't use any non-essential cookies
  };

  return (
    <CookieConsentContext.Provider value={{ consent, acceptCookies, rejectCookies }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}