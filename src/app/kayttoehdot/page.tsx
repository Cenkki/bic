import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Käyttöehdot</h1>
      
      <p className="mb-4">
        Nämä käyttöehdot koskevat Pyörävahti-palvelun käyttöä. 
        Käyttämällä palvelua hyväksyt nämä käyttöehdot.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Palvelun kuvaus</h2>
      <p className="mb-4">
        Pyörävahti on verkkopalvelu, jonka tarkoituksena on auttaa kadonneiden ja varastettujen 
        pyörien löytämisessä sekä löydettyjen pyörien ilmoittamisessa omistajille.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Käyttäjätunnukset</h2>
      <p className="mb-4">
        Joidenkin toimintojen käyttö edellyttää rekisteröitymistä. 
        Olet vastuussa käyttäjätunnuksesi ja salasanasi turvallisuudesta. 
        Älä jaa tunnuksiasi kolmansille osapuolille.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sisällön julkaiseminen</h2>
      <p className="mb-4">
        Julkaisemalla sisältöä palvelussa myönnät meille oikeuden:
      </p>
      <ul className="list-disc pl-8 mb-4">
        <li>Näyttää sisältösi palvelussa</li>
        <li>Muokata sisältöäsi teknisistä syistä</li>
        <li>Poistaa sisältöäsi, jos se rikkoo näitä käyttöehtoja</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sisällön säännöt</h2>
      <p className="mb-4">Et saa julkaisemaan sisältöä, joka:</p>
      <ul className="list-disc pl-8 mb-4">
        <li>Loukkaa toisten oikeuksia</li>
        <li>On laitonta tai harhaanjohtavaa</li>
        <li>Sisältää roskapostia tai mainoksia</li>
        <li>On ilmeisen valheellista tai petollista</li>
        <li>Loukkaa yksityisyyttä tai henkilönsuojaa</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Ilmoitusten tekeminen</h2>
      <p className="mb-4">
        Kadonneen/varastetun tai löydetyn pyörän ilmoittamisessa annat totuudenmukaiset tiedot. 
        Pyörävahti ei ole vastuussa virheellisten tietojen antamisesta aiheutuvista vahingoista.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Vastuunrajoitus</h2>
      <p className="mb-4">
        Palvelu tarjotaan &quot;sellaisena kuin se on&quot; ilman minkäänlaista takuuta. 
        Pyörävahti ei ole vastuussa palvelun keskeytymisestä tai virheistä, 
        eikä siitä, löytyykö kadonnut pyöräsi palvelun avulla.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Palvelun muutokset</h2>
      <p className="mb-4">
        Voimme milloin tahansa muuttaa tai lopettaa palvelun osan tai kokonaisuudessaan. 
        Pyrimme ilmoittamaan merkittävistä muutoksista etukäteen.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Käyttöehtojen muutokset</h2>
      <p className="mb-4">
        Voimme päivittää näitä käyttöehtoja. 
        Julkaisemme päivitetyt ehdot tällä sivulla. 
        Jatkamalla palvelun käyttöä muutosten jälkeen hyväksyt uudet ehdot.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Sovellettava laki</h2>
      <p className="mb-4">
        Näihin käyttöehtoihin sovelletaan Suomen lakia. 
        Mahdolliset riidat ratkaistaan ensisijaisesti neuvottelemalla, 
        ja tarvittaessa Helsingin käräjäoikeudessa.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Yhteystiedot</h2>
      <p className="mb-4">
        Jos sinulla on kysyttävää näistä käyttöehdoista, voit ottaa meihin yhteyttä 
        sähköpostitse osoitteessa tuki@pyoravahti.fi.
      </p>
      
      <p className="mt-8 text-sm text-gray-600">Viimeksi päivitetty: 1.9.2025</p>
    </div>
  );
}