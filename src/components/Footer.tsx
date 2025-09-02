import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pyörävahti</h3>
            <p className="text-gray-300">
              Autamme löytämään kadonneet pyörät ja palauttamaan löydetyt pyörät omistajilleen.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Linkit</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tietosuoja" className="text-gray-300 hover:text-white transition-colors">
                  Tietosuojaseloste
                </Link>
              </li>
              <li>
                <Link href="/kayttoehdot" className="text-gray-300 hover:text-white transition-colors">
                  Käyttöehdot
                </Link>
              </li>
              <li>
                <Link href="/report/lost" className="text-gray-300 hover:text-white transition-colors">
                  Ilmoita kadonnut pyörä
                </Link>
              </li>
              <li>
                <Link href="/report/found" className="text-gray-300 hover:text-white transition-colors">
                  Ilmoita löydetty pyörä
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Ota yhteyttä</h3>
            <p className="text-gray-300">
              Sähköposti: <a href="mailto:tuki@pyoravahti.fi" className="hover:text-white transition-colors">tuki@pyoravahti.fi</a>
            </p>
            <p className="text-gray-300 mt-2">
              Tietosuojapäällikkö: <a href="mailto:tietosuoja@pyoravahti.fi" className="hover:text-white transition-colors">tietosuoja@pyoravahti.fi</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Pyörävahti. Kaikki oikeudet pidätetään.</p>
        </div>
      </div>
    </footer>
  );
}