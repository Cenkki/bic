import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Pyörävahti</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Autamme löytämään kadonneet pyörät ja palauttamaan löydetyt pyörät omistajilleen.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Palvelut</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/lost-or-stolen" className="text-gray-400 hover:text-white transition-colors">
                  Kadonneet/Varastetut
                </Link>
              </li>
              <li>
                <Link href="/found" className="text-gray-400 hover:text-white transition-colors">
                  Löydetyt
                </Link>
              </li>
              <li>
                <Link href="/for-sale" className="text-gray-400 hover:text-white transition-colors">
                  Myynnissä
                </Link>
              </li>
              <li>
                <Link href="/report/lost" className="text-gray-400 hover:text-white transition-colors">
                  Ilmoita kadonnut
                </Link>
              </li>
              <li>
                <Link href="/report/found" className="text-gray-400 hover:text-white transition-colors">
                  Ilmoita löydetty
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Tietoa</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tietosuoja" className="text-gray-400 hover:text-white transition-colors">
                  Tietosuojaseloste
                </Link>
              </li>
              <li>
                <Link href="/kayttoehdot" className="text-gray-400 hover:text-white transition-colors">
                  Käyttöehdot
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Tietoa palvelusta
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Ota yhteyttä
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Ota yhteyttä</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Sähköposti: <a href="mailto:tuki@pyoravahti.fi" className="hover:text-white transition-colors ml-2">tuki@pyoravahti.fi</a>
              </li>
              <li className="text-gray-400 flex items-start mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tietosuojapäällikkö: <a href="mailto:tietosuoja@pyoravahti.fi" className="hover:text-white transition-colors ml-2">tietosuoja@pyoravahti.fi</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Pyörävahti. Kaikki oikeudet pidätetään.</p>
        </div>
      </div>
    </footer>
  );
}