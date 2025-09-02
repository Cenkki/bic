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
  };
}

export default function HomePageClient({ initialStatistics }: HomePageClientProps) {
  const [latestBikes, setLatestBikes] = useState<BikeWithDuplicates[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statistics, setStatistics] = useState(initialStatistics);

  // Fetch latest bikes
  useEffect(() => {
    const fetchLatestBikes = async () => {
      setLoading(true);
      try {
        const result = await getBikesWithDuplicatesAction({
          limit: 3
        });
        
        if (result.success && result.bikes) {
          setLatestBikes(result.bikes as unknown as BikeWithDuplicates[]);
        }
      } catch (error) {
        console.error("Error fetching latest bikes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBikes();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real implementation, you might want to redirect to a search results page
    console.log("Search query:", query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Pyörävahti
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            Seuraa kadonnutta pyörää tai ilmoita löytämäsi pyörä
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <Link 
            href="/report/lost" 
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-center"
          >
            Ilmoita kadonneesta pyörästä
          </Link>
          <Link 
            href="/report/found" 
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center"
          >
            Ilmoita löydetyistä pyörästä
          </Link>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Kadonneet/Varastetut</h3>
                <p className="text-2xl font-bold text-gray-900">{statistics.lostStolenCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Löydetyt</h3>
                <p className="text-2xl font-bold text-gray-900">{statistics.foundCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Mahdolliset osumat</h3>
                <p className="text-2xl font-bold text-gray-900">{statistics.matchesThisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Uudet myynti-ilmoitukset</h3>
                <p className="text-2xl font-bold text-gray-900">{statistics.forSaleCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/lost-or-stolen" className="card hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="bg-red-100 text-red-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Kadonneet/Varastetut</h2>
              <p className="text-gray-600">Tarkista lista kadonneista tai varastetuista pyöristä</p>
            </div>
          </Link>

          <Link href="/found" className="card hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="bg-green-100 text-green-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Löydetyt</h2>
              <p className="text-gray-600">Ilmoita löytämäsi pyörä tai tarkista löydettyjä pyöriä</p>
            </div>
          </Link>

          <Link href="/for-sale" className="card hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tori.fi myynnissä</h2>
              <p className="text-gray-600">Selaa pyöriä myynnissä ulkoisista lähteistä</p>
            </div>
          </Link>
        </div>

        {/* Latest Listings Preview */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Uusimmat ilmoitukset</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Ladataan pyöriä...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBikes.map((bike) => (
                <BikeCard 
                  key={bike.id} 
                  id={bike.id}
                  brand={bike.brand || undefined}
                  model={bike.model || undefined}
                  color={bike.color || undefined}
                  city={bike.city || undefined}
                  status={bike.status}
                  serialNumber={bike.serialNumber || undefined}
                  imageUrl={bike.images[0]?.url}
                  isDuplicate={bike.isDuplicate}
                />
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link href="/lost-or-stolen" className="text-blue-600 hover:text-blue-800 font-medium">
              Näytä kaikki ilmoitukset →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}