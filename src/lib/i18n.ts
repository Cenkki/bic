// Simple i18n implementation for Finnish language support

interface Translations {
  [key: string]: string;
}

const finnishTranslations: Translations = {
  // Navigation
  "nav.home": "Etusivu",
  "nav.bicycles": "Pyörät",
  "nav.reportStolen": "Ilmoita kadonnut/varastettu",
  "nav.reportFound": "Ilmoita löytämiäsi",
  "nav.login": "Kirjaudu",
  "nav.logout": "Kirjaudu ulos",
  
  // Home page
  "home.title": "Pyörävahti",
  "home.description": "Seuraa kadonnutta pyörää tai ilmoita löytämäsi pyörä",
  "home.latestListings": "Uusimmat ilmoitukset",
  
  // Bicycle listings
  "bicycles.title": "Pyöräilmoitukset",
  "bicycles.addNew": "Lisää uusi ilmoitus",
  
  // Report forms
  "report.stolen.title": "Ilmoita kadonnut tai varastettu pyörä",
  "report.found.title": "Ilmoita löytämäsi pyörä",
  
  // Auth
  "auth.signIn": "Kirjaudu sisään",
  "auth.signOut": "Kirjaudu ulos",
  "auth.emailPlaceholder": "nimi@esimerkki.fi",
  "auth.sendLoginLink": "Lähetä kirjautumislinkki",
  "auth.checkEmail": "Tarkista sähköpostisi",
  "auth.verifyRequest": "Kirjautumislinkki lähetetty sähköpostiisi",
  
  // Common
  "common.loading": "Ladataan...",
  "common.error": "Tapahtui virhe",
  "common.save": "Tallenna",
  "common.cancel": "Peruuta",
  "common.delete": "Poista",
  "common.edit": "Muokkaa",
};

export type TranslationKey = keyof typeof finnishTranslations;

export function t(key: TranslationKey): string {
  const value = finnishTranslations[key];
  return typeof value === 'string' ? value : String(key);
}

// For future multi-language support
export function getTranslations(locale: string): Translations {
  // Currently only Finnish is supported
  return finnishTranslations;
}