# Pyörävahti

A modern web application for tracking lost/stolen bicycles and reporting found ownerless bikes, built with TypeScript, Next.js, Prisma, and PostgreSQL.

## Teknologiat

- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js with Email provider
- **Maps**: OpenStreetMap with Leaflet
- **Image Processing**: image-hash library for pHash calculation
- **Image Storage**: Local storage (development) with abstraction for S3 (production)
- **Security**: ReCaptcha v3 for bot prevention
- **Rate Limiting**: Memory-based in development, Redis-based in production

## Ominaisuudet

- Selaa pyöräilmoituksia (kadonnut/varastettu/löydetty/myynnissä)
- Ilmoita kadonnut tai varastettu pyörä
- Ilmoita löytämäsi pyörä
- Edistynyt haku (teksti, sarjanumero, kaupunki, tila)
- Reaaliaikainen suodatus viivästetyllä haulla
- Duplikaattien tunnistus sarjanumeroiden ja pHashin avulla
- Tarkastele pyörien tietoja karttasijainnin kanssa
- Kuvien lataus vetämällä ja pudottamalla
- Perceptual hash (pHash) laskenta duplikaattien tunnistamiseen
- Samankaltaisten pyörien tunnistus Hamming-etäisyyden avulla
- Käyttäjien tunnistautuminen sähköpostilinkin kautta
- Suomenkielinen käyttöliittymä
- Responsiivinen design
- Ulkoisten ilmoitusten integrointi (esim. Tori.fi)
- Automaattinen vastaavuusmoottori mahdollisille osumille
- Sisällön moderointi ja väärinkäytösten esto
- Ylläpitopaneeli ilmoitusten hallintaan
- Arkistointi- ja poistotoiminnot ylläpitäjille
- ReCaptcha v3 integrointi bottien estoon
- Interaktiivinen kartta sijainnin valintaan
- Kaupungin automaattinen täydennys suomalaisille kaupungeille
- Omistajuuden vaatimus ja väärinkäytösten ilmoittaminen

## Sivut

- **/** - Etusivu haulla ja kolmella kategorialla
- **/lost-or-stolen** - Kadonnut/varastettu pyörien listaushaku ja suodattimet
- **/found** - Löydettyjen pyörien listaushaku ja suodattimet
- **/for-sale** - Myynnissä olevat pyörät ulkoisista lähteistä
- **/report/lost** - Lomake kadonneen/varastetun pyörän ilmoittamiseen kuvien kanssa
- **/report/found** - Lomake löydetyn pyörän ilmoittamiseen kuvien kanssa
- **/bike/[id]** - Pyörän tietosivu kuvien, tietojen, kartan ja vastaavuuksien kanssa
- **/admin** - Ylläpitopaneeli ilmoitusten hallintaan (suojattu)

## Komponentit

- **SearchBar** - Hakukenttä reaaliaikaisella viivästetyllä haulla
- **BikeCard** - Pyöräkortti duplikaattimerkinnällä
- **Filters** - Suodatinpaneeli laajennettavilla valinnoilla
- **MapMini** - Minikartta OpenStreetMapin ja Leafletin avulla
- **MapPicker** - Interaktiivinen kartta sijainnin valintaan
- **CityAutocomplete** - Automaattinen täydennys suomalaisille kaupungeille
- **ImageUpload** - Kuvien lataus vetämällä ja pudottamalla
- **ReCaptcha** - ReCaptcha v3 komponentti bottien estoon

## Haku- ja duplikaattitunnistus

### Hakutoiminnot
- **Tekstihaku**: Haku merkki-, malli-, väri- ja kuvauskentistä
- **Sarjanumeron täsmäys**: Tarkka täsmäys sarjanumeroihin
- **Kaupungin suodatus**: Suodata pyöriä kaupungin mukaan
- **Tilasuodatus**: Suodata pyörätilan mukaan (LOST, STOLEN, FOUND, FOR_SALE_EXTERNAL)
- **Reaaliaikainen suodatus**: Viivästetty haku sujuvaa käyttökokemusta varten

### Duplikaattitunnistus
- **Sarjanumeron täsmäys**: Saman sarjanumeron pyörät merkitään duplikaateiksi
- **pHash samankaltaisuus**: Samankaltaiset perceptual hashit (Hamming-etäisyys ≤ 10) merkitään mahdollisiksi duplikaateiksi
- **Visuaalinen merkki**: "Mahdollisesti sama pyörä" -merkki duplikaattikorteissa
- **Automaattinen tunnistus**: Duplikaattitarkistus suoritetaan automaattisesti haku- ja suodatustoimintojen yhteydessä

## Kuvien lataus ja pHash-toiminnot

### ImageUpload-komponentti
- Tuki vetämällä ja pudottamalla
- Tiedostojen validointi (vain JPG/PNG)
- Koko rajoitus (max 5MB per kuva)
- Määrärajoitus (max 5 kuvaa)
- Visuaalinen palaute valituista kuvista
- Mahdollisuus poistaa valittuja kuvia

### Backend-palvelu
- Tallentaa kuvat `/public/uploads` -hakemistoon (kehitys)
- Laskee perceptual hashin (pHash) image-hash -kirjastolla
- Tallentaa kuvien URL-osoitteet tietokantaan
- Päivittää Bike.phash ensisijaisen kuvan hashilla
- Tarjoaa `findSimilarBikes(phash)` -funktion joka palauttaa samankaltaiset pyörät Hamming-etäisyyden perusteella (≤ 10)

## Ulkoiset ilmoitukset

Sovellus integroituu ulkoisiin lähteisiin kuten Tori.fi näyttämään myynnissä olevat pyörät. Ulkoisten ilmoitusten ominaisuudet:

- **ExternalListing-liitäntä**: Standardiliitäntä ulkoisille pyöräilmoituksille
- **Ulkoisten ilmoitusten palvelu**: Palvelu ulkoisten ilmoitusten hakemiseen, tallentamiseen ja käsittelyyn
- **API-reitit**: RESTful API-reitit ulkoisten ilmoitusten hallintaan
- **Tietojen purku**: Automaattinen pyörätietojen purku ilmoitusten otsikoista
- **Duplikaattitunnistus**: Integrointi olemassa olevaan duplikaattitunnistukseen ulkoisille ilmoituksille

### ExternalListing-liitäntä
```typescript
interface ExternalListing {
  title: string;
  price?: number;
  city?: string;
  url: string;
  image?: string;
  extractedAt: Date;
}
```

## Vastaavuusmoottori

Sovellus sisältää automaattisen vastaavuusmoottorin joka etsii mahdollisia osumia pyörien välillä:

- **Sarjanumeron täsmäys**: Tarkat täsmäykset LOST/STOLEN ja FOUND/FOR_SALE_EXTERNAL pyörien välillä
- **pHash samankaltaisuus**: Visuaalinen samankaltaisuus perceptual hashin avulla (Hamming-etäisyys ≤ 10)
- **Avainsana + kaupunki täsmäys**: Täsmäys merkin/mallin ja saman kaupungin perusteella

Osumat näytetään pyörän tietosivulla luottamusprosentin kanssa.

## Moderointi ja väärinkäytösten esto

Sovellus sisältää useita ominaisuuksia väärinkäytösten estämiseen:

- **Sisällön moderointi**: Tekstin ja kuvien suodatus kiellettyjen sanojen ja virheellisten tiedostotyyppien varalta
- **Rate Limiting**: Rajoitus 5 ilmoitusta minuutissa per IP-osoite (muistiin perustuva kehityksessä, Redis-pohjainen tuotannossa)
- **ReCaptcha v3**: Bottien estäminen ilmoituslomakkeissa
- **Ylläpitopaneeli**: Suojattu paneeli ilmoitusten hallintaan arkistointi- ja poistotoiminnot

## Karttaintegraatio

Sovellus käyttää Leafletiä ja OpenStreetMapia karttatoiminnallisuuksiin:

- **MapPicker**: Interaktiivinen karttakomponentti sijainnin valintaan lomakkeissa
- **MapMini**: Minikarttakomponentti pyörien sijaintien näyttämiseen listauksissa
- **CityAutocomplete**: Automaattinen täydennys suomalaisille kaupungeille paikallisesta JSON-tietolähteestä

## Ilmoitusominaisuudet

Käyttäjät voivat ilmoittaa ongelmista pyörälistauksissa:

- **Omistajuuden vaatimus**: Käyttäjät voivat vaatia pyörien omistajuutta tukevat todisteet
- **Väärinkäytösten ilmoitus**: Käyttäjät voivat ilmoittaa sopimatonta sisältöä tai väärinkäyttöä
- **Sähköposti-ilmoitukset**: Ylläpitäjät saavat sähköposti-ilmoituksia ilmoituksista (simuloitu kehityksessä)

## API-reitit

Sovellus tarjoaa julkisen RESTful API:n tietojen hakemiseen ja ilmoitusten tekemiseen. Sovellus käynnistyy oletuksena porttiin 3000, mutta kehitysympäristössä se voi käyttää myös muita vapaita portteja.

### GET /api/bikes

Hakee listan pyöristä suodattimilla.

**Query-parametrit:**
- `status` - Pyörän tila (LOST, STOLEN, FOUND, FOR_SALE_EXTERNAL)
- `q` - Yleinen hakutermi (hakee merkkiä, mallia, väriä, kuvausta, kaupunkia, sarjanumeroa)
- `city` - Kaupunki
- `serial` - Sarjanumero
- `near` - Läheisyyssuodatus muodossa `lat,lng,radiusKm` (esim. `60.1699,24.9384,10`)

**Esimerkki:**
```bash
curl "http://localhost:3000/api/bikes?status=LOST&city=Helsinki"
```

**Vastaus:**
```json
[
  {
    "id": "clxxxxxx",
    "brand": "Kona",
    "model": "Hei Hei",
    "color": "Musta",
    "serialNumber": "ABC123",
    "description": "Hyvä kuntoinen vuoristopyörä",
    "status": "LOST",
    "locationLat": 60.1699,
    "locationLng": 24.9384,
    "city": "Helsinki",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z",
    "source": "user",
    "sourceUrl": null,
    "phash": null,
    "images": [
      {
        "id": "clxxxxxx",
        "url": "/uploads/image.jpg",
        "bikeId": "clxxxxxx",
        "createdAt": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
```

### GET /api/bikes/[id]

Hakee yksittäisen pyörän ID:n perusteella.

**Esimerkki:**
```bash
curl "http://localhost:3000/api/bikes/clxxxxxx"
```

**Vastaus:**
```json
{
  "id": "clxxxxxx",
  "brand": "Kona",
  "model": "Hei Hei",
  "color": "Musta",
  "serialNumber": "ABC123",
  "description": "Hyvä kuntoinen vuoristopyörä",
  "status": "LOST",
  "locationLat": 60.1699,
  "locationLng": 24.9384,
  "city": "Helsinki",
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z",
  "source": "user",
  "sourceUrl": null,
  "phash": null,
  "images": [...],
  "reports": [...],
  "finds": [...]
}
```

### POST /api/report/lost

Ilmoittaa kadonneen/varastetun pyörän.

**Pyyntö:**
```json
{
  "brand": "Kona",
  "model": "Hei Hei",
  "color": "Musta",
  "serialNumber": "ABC123",
  "description": "Hyvä kuntoinen vuoristopyörä",
  "lostDate": "2023-01-01",
  "place": "Rautatientori, Helsinki",
  "contact": "matti@example.com",
  "locationLat": 60.1699,
  "locationLng": 24.9384,
  "city": "Helsinki",
  "userId": "user123" // Valinnainen, käytetään authentikoinnissa
}
```

**Esimerkki:**
```bash
curl -X POST http://localhost:3000/api/report/lost \
  -H "Content-Type: application/json" \
  -d '{"brand":"Kona","model":"Hei Hei","color":"Musta","serialNumber":"ABC123","description":"Hyvä kuntoinen vuoristopyörä","lostDate":"2023-01-01","place":"Rautatientori, Helsinki","contact":"matti@example.com","locationLat":60.1699,"locationLng":24.9384,"city":"Helsinki"}'
```

**Vastaus:**
```json
{
  "bike": {
    "id": "clxxxxxx",
    "brand": "Kona",
    "model": "Hei Hei",
    "color": "Musta",
    "serialNumber": "ABC123",
    "description": "Hyvä kuntoinen vuoristopyörä",
    "status": "LOST",
    "locationLat": 60.1699,
    "locationLng": 24.9384,
    "city": "Helsinki",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z",
    "source": "api"
  },
  "report": {
    "id": "clxxxxxx",
    "userId": "temp-user-id",
    "bikeId": "clxxxxxx",
    "lostDate": "2023-01-01T00:00:00.000Z",
    "place": "Rautatientori, Helsinki",
    "contact": "matti@example.com",
    "createdAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### POST /api/report/found

Ilmoittaa löydetyn pyörän.

**Pyyntö:**
```json
{
  "brand": "Kona",
  "model": "Hei Hei",
  "color": "Musta",
  "serialNumber": "ABC123",
  "description": "Hyvä kuntoinen vuoristopyörä",
  "foundDate": "2023-01-01",
  "note": "Löytyi rautatieasemalta",
  "locationLat": 60.1699,
  "locationLng": 24.9384,
  "city": "Helsinki",
  "userId": "user123" // Valinnainen, käytetään authentikoinnissa
}
```

**Esimerkki:**
```bash
curl -X POST http://localhost:3000/api/report/found \
  -H "Content-Type: application/json" \
  -d '{"brand":"Kona","model":"Hei Hei","color":"Musta","serialNumber":"ABC123","description":"Hyvä kuntoinen vuoristopyörä","foundDate":"2023-01-01","note":"Löytyi rautatieasemalta","locationLat":60.1699,"locationLng":24.9384,"city":"Helsinki"}'
```

**Vastaus:**
```json
{
  "bike": {
    "id": "clxxxxxx",
    "brand": "Kona",
    "model": "Hei Hei",
    "color": "Musta",
    "serialNumber": "ABC123",
    "description": "Hyvä kuntoinen vuoristopyörä",
    "status": "FOUND",
    "locationLat": 60.1699,
    "locationLng": 24.9384,
    "city": "Helsinki",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z",
    "source": "api"
  },
  "find": {
    "id": "clxxxxxx",
    "userId": "temp-user-id",
    "bikeId": "clxxxxxx",
    "note": "Löytyi rautatieasemalta",
    "foundDate": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T12:00:00.000Z"
  }
}
```

## Tietomalli

Sovellus käyttää seuraavia tietomalleja:

- **User**: Rekisteröityneet käyttäjät jotka voivat ilmoittaa kadonneita/varastettuja tai löydettyjä pyöriä
- **Bike**: Pyörätiedot tilalla (LOST, STOLEN, FOUND, FOR_SALE_EXTERNAL)
- **Image**: Pyöriin liittyvät kuvat
- **Report**: Käyttäjien ilmoitukset kadonneista/varastetuista pyöristä
- **Find**: Käyttäjien ilmoitukset löydetyistä pyöristä

## Edellytykset

- Node.js (versio 18 tai uudempi)
- PostgreSQL-tietokanta
- Yarn-paketinhallinta
- Redis-tietokanta (tuotannon rate limiting varten)

## Docker-käyttö

Sovellus voidaan ajaa Docker-kontissa. Docker Compose -tiedosto määrittelee tarvittavat palvelut:

```bash
docker-compose up -d
```

Tämä käynnistää:
- PostgreSQL-tietokannan
- Next.js-sovelluksen
- MailDev-palvelun sähköpostien testaamiseen

## Pika-asennus

1. **Kloonaa repositorio:**
   ```bash
   git clone <repository-url>
   cd bicyai
   ```

2. **Asenna riippuvuudet:**
   ```bash
   yarn install
   ```

3. **Määritä tietokanta:**
   ```bash
   ./setup-db.sh
   ```
   Tai luo PostgreSQL-tietokanta nimeltä `bicyai` manuaalisesti.

4. **Suorita Prisma-migraatiot:**
   ```bash
   yarn prisma:migrate
   ```

5. **Käynnistä kehityspalvelin:**
   ```bash
   yarn dev
   ```

6. **Avaa selain:**
   Siirry osoitteeseen [http://localhost:3000](http://localhost:3000)

## Manuaalinen asennus

Jos haluat määrittää ympäristön manuaalisesti:

1. **Asenna riippuvuudet:**
   ```bash
   yarn install
   ```

2. **Määritä tietokanta:**
   - Asenna PostgreSQL järjestelmääsi
   - Luo tietokanta nimeltä `bicyai`
   - Päivitä `DATABASE_URL` [.env](file:///Users/cenkyakinlar/Documents/Dokumentit%20%E2%80%93%20CenkAir%20-%20MacBook%20Air/DREAMWEAVER/voonfi/bicyai/.env)-tiedostossa tietokantatunnuksillasi

3. **Suorita Prisma-migraatiot:**
   ```bash
   yarn prisma:migrate
   ```

4. **Käynnistä kehityspalvelin:**
   ```bash
   yarn dev
   ```

## Ympäristömuuttujat

Luo [.env](file:///Users/cenkyakinlar/Documents/Dokumentit%20%E2%80%93%20CenkAir%20-%20MacBook%20Air/DREAMWEAVER/voonfi/bicyai/.env)-tiedosto juurihakemistoon seuraavilla muuttujilla:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bicyai?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Email provider
EMAIL_SERVER="smtp://localhost:1025"
EMAIL_FROM="Pyörävahti <noreply@pyoravahti.fi>"

# ReCaptcha
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"

# Redis (for production rate limiting)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Tori.fi adapter
ENABLE_TORI_ADAPTER=true
```

## Projektirakenne

```
/app          # Next.js app router -sivut ja API-reitit
/components   # React-komponentit
/lib          # Apufunktiot ja palvelut
/server       # Palvelinpuolen koodi (cron-jobit, scraperit)
/styles       # Globaalit tyylit
/prisma       # Prisma-skeema ja migraatiot
/types        # TypeScript-tyypit
/data         # Staattiset tiedostot (esim. suomalaiset kaupungit)
```

## Käytettävissä olevat skriptit

- `yarn dev` - Käynnistä kehityspalvelin
- `yarn build` - Käännä tuotantosovellus
- `yarn start` - Käynnistä tuotantopalvelin
- `yarn prisma:generate` - Generoi Prisma-client
- `yarn prisma:migrate` - Suorita Prisma-migraatiot
- `yarn prisma:studio` - Avaa Prisma Studio
- `yarn cron:fetch` - Hae ulkoisia ilmoituksia (Tori.fi ym.)
- `yarn cron:match` - Laske uudelleen osumat viimeisille pyörille

## Taustaprosessit ja Cron-jobit

Sovellus sisältää taustaprosesseja ja cron-jobeja tietojen päivittämiseen ja osumien laskemiseen.

### fetchForSale.ts

Hakee ulkoisia ilmoituksia lähteistä kuten Tori.fi ja luo niistä pyörärekisteröintejä.

**Toiminnallisuus:**
- Hakee ulkoisia ilmoituksia määritellyistä lähteistä
- Muuntaa ilmoitukset pyörärekisteröinneiksi
- Luo uusia pyörärekisteröintejä uusille ilmoituksille
- Päivittää olemassa olevat pyörärekisteröinnit päivitetyille ilmoituksille
- Asettaa pyörärekisteröinnin tilaksi `FOR_SALE_EXTERNAL`

**Ajastus:**
```bash
# Suorita joka tunti
0 * * * * cd /path/to/bicyai && yarn cron:fetch
```

### recomputeMatches.ts

Laskee uudelleen osumat viime aikoina lisätyille pyörille löytääkseen mahdollisia yhteyksiä kadonneiden/varastettujen ja löydettyjen/myynnissä olevien pyörien välillä.

**Toiminnallisuus:**
- Käsittelee viimeisen 24 tunnin aikana luodut pyörät
- Etsii osumat seuraavien perusteella:
  - Sarjanumeron täsmäys
  - pHash visuaalinen samankaltaisuus
  - Avainsanojen ja kaupungin täsmäys
- Kirjaa osumat luottamusprosentteineen

**Ajastus:**
```bash
# Suorita joka 15 minuutti
*/15 * * * * cd /path/to/bicyai && yarn cron:match
```

## Tori.fi-adapterin vastuuvapaus

Tori.fi-adapteri on toteutettu vain demonstraation tarkoituksiin. Ulkoisten lähteiden käyttö on käyttäjän vastuulla, ja Pyörävahti ei ota vastuuta mahdollisista rikkomuksista ulkoisten lähteiden käyttöehdoista. Adapteri voidaan kytkeä pois päältä asettamalla `ENABLE_TORI_ADAPTER=false` ympäristömuuttujassa.

## Tunnistautuminen

Sovellus käyttää NextAuth.js:ää sähköpostipalveluntarjoajalla. Käyttäjät voivat kirjautua syöttämällä sähköpostiosoitteensa ja klikkaamalla heille lähetettyä vahvistuslinkkiä.

## Kuvien tallennus

Kuvat tallennetaan paikallisesti `/public/uploads` -hakemistoon kehityksessä. Tallennuspalvelu on abstrahoitu `StorageService`-liitännän kautta, joten se voidaan helposti vaihtaa S3:ksi tai muiksi pilvitallennuspalveluiksi tuotannossa.

## Kielikäännökset (i18n)

Sovellus tukee tällä hetkellä vain suomea, mutta i18n-rakenne on paikalla tulevia kielilisäyksiä varten.

## Ylläpitopaneeli

Ylläpitopaneeli osoitteessa `/admin` tarjoaa toiminnot ilmoitusten hallintaan:
- Tarkastele kaikkia pyöräilmoituksia
- Arkistoi ilmoituksia (pehmeä poisto)
- Poista ilmoituksia (kovapoisto)
- Tarkastele ilmoitusten tietoja

Huom: Tuotantoympäristössä tulisi toteuttaa oikea tunnistautuminen ja valtuutus rajoittamaan pääsy vain ylläpitäjille.

## Rate Limiting

Sovellus toteuttaa rate limitin väärinkäytösten estämiseksi:
- **Kehitys**: Muistiin perustuva rate limiting (5 pyyntöä minuutissa per IP)
- **Tuotanto**: Redis-pohjainen rate limiting (5 pyyntöä minuutissa per IP)

## ReCaptcha-integraatio

Sovellus käyttää ReCaptcha v3:ta bottien estämiseen:
- Kaikki ilmoituslomakkeet sisältävät ReCaptcha-vahvistuksen
- Lomakkeita ei voi lähettää ilman kelvollista ReCaptcha-tokenia
- Kehityksessä ReCaptcha-vahvistus ohitetaan helpomman testauksen vuoksi

## Karttaintegraatio

Sovellus käyttää Leafletiä ja OpenStreetMapia karttatoiminnallisuuksiin:
- **MapPicker**: Interaktiivinen komponentti sijaintien valintaan lomakkeissa
- **MapMini**: Minikartta sijaintien näyttämiseen listauksissa
- **CityAutocomplete**: Automaattinen täydennys suomalaisille kaupungeille paikallisesta datasta

## Sähköpostipalvelu

Sovellus sisältää sähköpostipalvelun ilmoituksia varten:
- **Kehitys**: Kirjaa sähköpostit konsoliin
- **Tuotanto**: Käyttäisi SMTP:tä tai sähköpostipalveluntarjoajaa

## Lisätietoja

Lisätietoja tässä projektissa käytetyistä teknologioista:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [image-hash Documentation](https://www.npmjs.com/package/image-hash)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)