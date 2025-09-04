"use client";

import Navigation from "@/components/Navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { getBikesWithDuplicatesAction } from "@/lib/actions";
import BikeCard from "@/components/BikeCard";
import { BikeStatus } from "@/types/bicycle";

interface BikeWithDuplicates {
  id: string;
  brand?: string | null;
  model?: string | null;
  color?: string | null;
  serialNumber?: string | null;
  status: BikeStatus;
  city?: string | null;
  images: {
    url: string;
    id: string;
    createdAt: Date;
    bikeId: string;
  }[];
  isDuplicate: boolean;
  duplicates: {
    id: string;
    brand?: string | null;
    model?: string | null;
    color?: string | null;
    serialNumber?: string | null;
    status: BikeStatus;
    city?: string | null;
    images: {
      url: string;
      id: string;
      createdAt: Date;
      bikeId: string;
    }[];
  }[];
}

// Define props for the client component
interface HomePageClientProps {
  initialStatistics: {
    lostStolenCount: number;
    foundCount: number;
    matchesThisWeek: number;
    forSaleCount: number;
    error?: string;
  };
}

export default function HomePageClient({ initialStatistics }: HomePageClientProps) {
  const [statistics, setStatistics] = useState(initialStatistics);
  const [latestBikes, setLatestBikes] = useState<BikeWithDuplicates[]>([]);
  const [loading, setLoading] = useState(true);
  const [bikeLoadingError, setBikeLoadingError] = useState<string | null>(null);

  // Handle search function
  const handleSearch = (query: string) => {
    // In a real implementation, you might want to redirect to a search results page
    console.log("Search query:", query);
  };

  // Fetch latest bikes
  useEffect(() => {
    const fetchLatestBikes = async () => {
      setLoading(true);
      setBikeLoadingError(null);
      try {
        const result = await getBikesWithDuplicatesAction({
          limit: 3
        });
        
        if (result.success && result.bikes) {
          setLatestBikes(result.bikes as unknown as BikeWithDuplicates[]);
        } else if (result.error) {
          setBikeLoadingError(result.error);
        }
      } catch (error) {
        console.error("Error fetching latest bikes:", error);
        setBikeLoadingError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch bikes if there's no statistics error
    if (!initialStatistics.error) {
      fetchLatestBikes();
    } else {
      setLoading(false);
      setBikeLoadingError(initialStatistics.error);
    }
  }, [initialStatistics.error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="page-container py-24 md:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
                Pyörävahti
              </h1>
              <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Seuraa kadonnutta pyörää tai ilmoita löytämäsi pyörä
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/report/lost" 
                  className="btn-primary text-center px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  Ilmoita kadonneesta pyörästä
                </Link>
                <Link 
                  href="/report/found" 
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transform hover:-translate-y-0.5 text-center text-lg"
                >
                  Ilmoita löydetyistä pyörästä
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Search Section */}
      <div className="page-container -mt-10 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-2">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="page-container py-20">
        <h2 className="section-title text-center mb-16">Tilastot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="bg-red-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Kadonneet/Varastetut</h3>
            <p className="text-4xl font-bold text-gray-900">{statistics.lostStolenCount}</p>
          </div>

          <div className="stat-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Löydetyt</h3>
            <p className="text-4xl font-bold text-gray-900">{statistics.foundCount}</p>
          </div>

          <div className="stat-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mahdolliset osumat</h3>
            <p className="text-4xl font-bold text-gray-900">{statistics.matchesThisWeek}</p>
          </div>

          <div className="stat-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Uudet myynti-ilmoitukset</h3>
            <p className="text-4xl font-bold text-gray-900">{statistics.forSaleCount}</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="page-container">
          <h2 className="section-title text-center mb-16">Kuinka se toimii?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-blue-100 text-blue-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ilmoita kadonnut pyörä</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Jos pyöräsi on kadonnut tai varastettu, ilmoita siitä järjestelmäämme. Lisää mahdollisimman paljon tietoa pyörästä.</p>
              <Link href="/report/lost" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center">
                Ilmoita nyt 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="feature-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-green-100 text-green-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Löysitkö pyörän?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Jos olet löytänyt pyörän, ilmoita siitä järjestelmäämme. Autamme yhdistämään pyörät omistajilleen.</p>
              <Link href="/report/found" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center">
                Ilmoita löytö 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="feature-card text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="bg-yellow-100 text-yellow-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Selaa myynnissä olevia</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Selaa pyöriä, jotka ovat myynnissä. Löydä uusi pyöräsi edullisella hinnalla.</p>
              <Link href="/for-sale" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center">
                Selaa myyntiä 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bikes Section */}
      <div className="page-container py-16">
        <h2 className="section-title mb-16">Viimeisimmät ilmoitukset</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : bikeLoadingError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Virhe! </strong>
            <span className="block sm:inline">Tietojen lataamisessa tapahtui virhe: {bikeLoadingError}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                id={bike.id}
                brand={bike.brand || undefined}
                model={bike.model || undefined}
                color={bike.color || undefined}
                city={bike.city || undefined}
                status={bike.status}
                imageUrl={bike.images[0]?.url}
                serialNumber={bike.serialNumber || undefined}
                isDuplicate={bike.isDuplicate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}