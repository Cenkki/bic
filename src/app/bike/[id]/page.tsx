import Navigation from "@/components/Navigation";
import MapMini from "@/components/MapMini";
import { BikeStatus } from "@/types/bicycle";
import { getBikeById } from "@/lib/actions";
import { findMatchesForBike } from "@/lib/matcher";
import { notFound } from "next/navigation";
import { sendOwnershipClaimEmail, sendAbuseReportEmail } from "@/lib/emailService";
import { $Enums } from "@/generated/prisma";

export default async function BikeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Fetch bike data
  const bikeResult = await getBikeById(id);
  
  if (!bikeResult.success || !bikeResult.bike) {
    notFound();
  }
  
  const bike = bikeResult.bike;
  
  // Fetch matches
  const matches = await findMatchesForBike(id);

  const getStatusText = (status: $Enums.BikeStatus) => {
    switch (status) {
      case "LOST":
        return "Kadonnut";
      case "STOLEN":
        return "Varastettu";
      case "FOUND":
        return "Löydetty";
      case "FOR_SALE_EXTERNAL":
        return "Myyynnissä";
      default:
        return status;
    }
  };

  const getStatusColor = (status: $Enums.BikeStatus) => {
    switch (status) {
      case "LOST":
        return "bg-yellow-100 text-yellow-800";
      case "STOLEN":
        return "bg-red-100 text-red-800";
      case "FOUND":
        return "bg-green-100 text-green-800";
      case "FOR_SALE_EXTERNAL":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Takaisin
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {bike.brand} {bike.model}
                  </h1>
                  <p className="text-gray-600">{bike.color}{bike.serialNumber && ` • ${bike.serialNumber}`}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bike.status)}`}>
                  {getStatusText(bike.status)}
                </span>
              </div>

              {/* Image gallery */}
              <div className="mb-8">
                {bike.images && bike.images.length > 0 ? (
                  <>
                    <img 
                      src={bike.images[0].url} 
                      alt={`${bike.brand} ${bike.model}`} 
                      className="w-full h-96 object-cover rounded-lg mb-4"
                    />
                    {bike.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto">
                        {bike.images.slice(1).map((image: { id: string; url: string }) => (
                          <img 
                            key={image.id} 
                            src={image.url} 
                            alt={`${bike.brand} ${bike.model}`} 
                            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 mb-4" />
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Kuvaus</h2>
                <p className="text-gray-700">{bike.description || "Ei kuvausta saatavilla."}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Tiedot</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Merkki</dt>
                      <dd className="text-gray-900">{bike.brand || "-"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Malli</dt>
                      <dd className="text-gray-900">{bike.model || "-"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Väri</dt>
                      <dd className="text-gray-900">{bike.color || "-"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Sarjanumero</dt>
                      <dd className="text-gray-900">{bike.serialNumber || "-"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Kaupunki</dt>
                      <dd className="text-gray-900">{bike.city || "-"}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Ilmoitus</h3>
                  <dl className="space-y-2">
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Ilmoitettu</dt>
                      <dd className="text-gray-900">{bike.createdAt ? new Date(bike.createdAt).toLocaleDateString("fi-FI") : "-"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Päivitetty</dt>
                      <dd className="text-gray-900">{bike.updatedAt ? new Date(bike.updatedAt).toLocaleDateString("fi-FI") : "-"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-600">Lähde</dt>
                      <dd className="text-gray-900">{bike.source === "user" ? "Käyttäjä" : bike.source || "-"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Location */}
              {bike.locationLat && bike.locationLng && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Sijainti</h3>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapMini 
                      center={[bike.locationLat, bike.locationLng]} 
                      markers={[{ position: [bike.locationLat, bike.locationLng], popup: bike.city || "" }]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ota yhteyttä</h2>
              <p className="text-gray-700 mb-4">
                Jos tunnistat pyörän tai haluat lisätietoja, ota yhteyttä ilmoittajaan.
              </p>
              <button className="btn-primary w-full">
                Lähetä viesti
              </button>
            </div>

            {/* Report Actions */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ilmoita</h2>
              <div className="space-y-4">
                <button 
                  className="btn-secondary w-full flex items-center justify-center"
                  onClick={async () => {
                    // In a real implementation, this would open a modal with a form
                    // For now, we'll just log to console in development
                    console.log("Ownership claim requested for bike:", bike.id);
                    // Send email to admin
                    await sendOwnershipClaimEmail(bike.id, bike.brand || undefined, bike.model || undefined);

                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Väitä omistajuus
                </button>
                <button 
                  className="btn-secondary w-full flex items-center justify-center"
                  onClick={async () => {
                    // In a real implementation, this would open a modal with a form
                    // For now, we'll just log to console in development
                    console.log("Abuse report requested for bike:", bike.id);
                    // Send abuse report email
                    await sendAbuseReportEmail(bike.id, bike.brand || undefined, bike.model || undefined);

                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Ilmoita väärinkäytöksestä
                </button>
              </div>
            </div>

            {/* Matches */}
            {matches.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mahdolliset osumat</h2>
                <p className="text-gray-700 mb-4">
                  Seuraavat pyörät voivat olla sama kuin tämä pyörä:
                </p>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Match #{match.matchedBikeId}
                          </h3>
                          <p className="text-gray-600 text-sm">{match.details}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                          {Math.round(match.confidence)}% vastaavuus
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {match.matchType === "SERIAL_NUMBER" && "Sarjanumero täsmää"}
                          {match.matchType === "PHASH" && "Visuaalinen vastaavuus"}
                          {match.matchType === "KEYWORDS" && "Avainsanojen perusteella"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}