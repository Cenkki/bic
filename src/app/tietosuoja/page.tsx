import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tietosuojaseloste</h1>
      
      <p className="mb-4">
        Tämä tietosuojaseloste kuvaa, miten Pyörävahti kerää, käyttää, säilyttää ja suojaa käyttäjien henkilötietoja. 
        Tämä seloste on laadittu noudattaen Yleistä tietosuoja-asetusta (GDPR).
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Rekisterinpitäjä</h2>
      <p className="mb-4">
        Pyörävahti<br />
        Sähköposti: tietosuoja@pyoravahti.fi
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Mitä tietoja keräämme?</h2>
      <p className="mb-4">Keräämme seuraavia tietoja:</p>
      <ul className="list-disc pl-8 mb-4">
        <li>Sähköpostiosoite (käyttäjätilin luonnissa ja kirjautumisessa)</li>
        <li>Ilmoittamiesi pyörien tiedot (merkki, malli, väri, sarjanumero, kuvaus, sijainti)</li>
        <li>Ilmoitusten tiedot (kadonnut/varastettu -päivämäärä, löydetty -päivämäärä)</li>
        <li>Kuvat, jotka liität ilmoituksiin</li>
        <li>Sijaintitietosi (jos annat sen ilmoituksessa)</li>
        <li>IP-osoite ja selaimen tiedot (lokitietojen osalta)</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Mihin tarkoitukseen tietoja käytetään?</h2>
      <p className="mb-4">Henkilötietojasi käytetään seuraaviin tarkoituksiin:</p>
      <ul className="list-disc pl-8 mb-4">
        <li>Käyttäjätilin luominen ja hallinta</li>
        <li>Pyöräilmoitusten julkaiseminen ja hallinta</li>
        <li>Kadonneiden ja löydettyjen pyörien yhdistäminen</li>
        <li>Suojaustoimenpiteiden toteuttaminen (esim. botteja vastaan)</li>
        <li>Sähköposti-ilmoitusten lähettäminen</li>
        <li>Sivuston käytön analysointi ja parantaminen</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Tietojen säilytysaika</h2>
      <p className="mb-4">
        Henkilötietojasi säilytetään niin kauan kuin käyttäjätilisi on aktiivinen. 
        Voit milloin tahansa pyytää tietojesi poistamista. 
        Ilmoitusten tiedot säilytetään tarpeen mukaan, mutta voit pyytää niiden poistamista milloin tahansa.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Tietojen luovuttaminen kolmansille osapuolille</h2>
      <p className="mb-4">
        Emme luovuta henkilötietojasi kolmansille osapuolille muulloin kuin:
      </p>
      <ul className="list-disc pl-8 mb-4">
        <li>Kun se on tarpeen lain vaatimusten täyttämiseksi</li>
        <li>Kun se on tarpeen sivuston teknisessä ylläpidossa (esim. palveluntarjoajat)</li>
        <li>Kun se on tarpeen oikeuksiesi suojaamiseksi</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Tietoturvatoimenpiteet</h2>
      <p className="mb-4">
        Suojamme henkilötietojasi teknisillä ja organisatorisilla toimenpiteillä, 
        kuten salasanasuojauksella, palomuurilla ja pääsynhallinnalla.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Oikeutesi</h2>
      <p className="mb-4">Sinulla on oikeus:</p>
      <ul className="list-disc pl-8 mb-4">
        <li>Saada pääsy omiin henkilötietoihisi</li>
        <li>Korjata tai täydentää tietojasi</li>
        <li>Pyytää tietojesi poistamista</li>
        <li>Rajoittaa tietojesi käsittelyä</li>
        <li>Vastustaa tietojesi käsittelyä</li>
        <li>Saada tietosi siirrettävässä muodossa</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Poistopyynnöt</h2>
      <p className="mb-4">
        Voit milloin tahansa pyytää henkilötietojesi tai tekemiesi ilmoitusten poistamista 
        lähettämällä sähköpostin osoitteeseen tietosuoja@pyoravahti.fi. 
        Pyrimme käsittelemään poistopyyntösi viimeistään kuukauden kuluessa.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Yhteystiedot</h2>
      <p className="mb-4">
        Jos sinulla on kysyttävää tästä tietosuojaselosteesta tai haluat käyttää oikeuksiasi, 
        voit ottaa meihin yhteyttä sähköpostitse osoitteessa tietosuoja@pyoravahti.fi.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Muutokset tietosuojaselosteeseen</h2>
      <p className="mb-4">
        Saatamme päivittää tätä tietosuojaselostetta ajoittain. 
        Julkaisemme muutetun selosteen tällä sivulla ja päivitämme päivämäärän yläpuolelle.
      </p>
      
      <p className="mt-8 text-sm text-gray-600">Viimeksi päivitetty: 1.9.2025</p>
    </div>
  );
}