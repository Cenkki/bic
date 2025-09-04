'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  // Show loading state while checking session
  if (sessionStatus === "loading") {
    return (
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center">
            <div className="flex">
              <span className="text-xl font-bold text-gray-900">Pyörävahti</span>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <div className="ml-3 relative">
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Pyörävahti</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link href="/lost-or-stolen" className={`nav-link ${isActive('/lost-or-stolen') ? 'nav-link-active font-semibold' : ''}`}>
              Kadonneet/Varastetut
            </Link>
            <Link href="/found" className={`nav-link ${isActive('/found') ? 'nav-link-active font-semibold' : ''}`}>
              Löydetyt
            </Link>
            <Link href="/for-sale" className={`nav-link ${isActive('/for-sale') ? 'nav-link-active font-semibold' : ''}`}>
              Myynnissä
            </Link>
            <Link href="/report/lost" className={`nav-link ${isActive('/report/lost') ? 'nav-link-active font-semibold' : ''}`}>
              Ilmoita kadonnut
            </Link>
            <Link href="/report/found" className={`nav-link ${isActive('/report/found') ? 'nav-link-active font-semibold' : ''}`}>
              Ilmoita löydetty
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center">
            <div className="ml-4 relative">
              {sessionData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 hidden lg:inline">{sessionData.user?.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary text-sm"
                  >
                    Kirjaudu ulos
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="btn-secondary text-sm"
                >
                  Kirjaudu sisään
                </button>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Avaa päävalikko</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/lost-or-stolen" className={`nav-link ${isActive('/lost-or-stolen') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Kadonneet/Varastetut
            </Link>
            <Link href="/found" className={`nav-link ${isActive('/found') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Löydetyt
            </Link>
            <Link href="/for-sale" className={`nav-link ${isActive('/for-sale') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Myynnissä
            </Link>
            <Link href="/report/lost" className={`nav-link ${isActive('/report/lost') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Ilmoita kadonnut
            </Link>
            <Link href="/report/found" className={`nav-link ${isActive('/report/found') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Ilmoita löydetty
            </Link>
            <Link href="/tietosuoja" className={`nav-link ${isActive('/tietosuoja') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Tietosuojaseloste
            </Link>
            <Link href="/kayttoehdot" className={`nav-link ${isActive('/kayttoehdot') ? 'nav-link-active font-semibold' : ''} block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}>
              Käyttöehdot
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {sessionData ? (
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">{sessionData.user?.email}</span>
                  </div>
                ) : null}
              </div>
              <div className="mt-3 space-y-1 px-2">
                {sessionData ? (
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary w-full text-left text-sm"
                  >
                    Kirjaudu ulos
                  </button>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="btn-secondary w-full text-left text-sm"
                  >
                    Kirjaudu sisään
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}