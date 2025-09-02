'use client';

import React from 'react';
import { useCookieConsent } from '@/lib/cookieConsent';

export default function CookieConsentBanner() {
  const { consent, acceptCookies, rejectCookies } = useCookieConsent();

  // Don't show banner if user has made a choice
  if (consent !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            Tämä verkkosivusto käyttää vain välttämättömiä evästeitä toimiakseen oikein. 
            Emme käytä evästeitä markkinointiin tai analytiikkaan. 
            Käyttämällä sivustoa hyväksyt evästeiden käytön.
          </p>
          <p className="text-xs mt-2 text-gray-300">
            Lue lisää: <a href="/tietosuoja" className="underline hover:text-gray-100">Tietosuojaseloste</a>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            Hyväksy
          </button>
          <button
            onClick={rejectCookies}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
          >
            Hylkää
          </button>
        </div>
      </div>
    </div>
  );
}