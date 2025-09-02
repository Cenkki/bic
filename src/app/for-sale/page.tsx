"use client";

import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import BikeCard from "@/components/BikeCard";
import { BikeStatus } from "@/types/bicycle";
import { ExternalListing } from "@/types/external";
import { useState, useEffect } from "react";
import { getBikesWithDuplicatesAction } from "@/lib/actions";
import { fetchExternalListings, externalListingToBike, ConvertedBike } from "@/lib/externalListings";
import { $Enums } from "@/generated/prisma";

interface FilterState {
  status: BikeStatus | "";
  brand: string;
  city: string;
  color: string;
  serialNumber: string;
}

// Extend ConvertedBike to match the BikeCard props
interface BikeWithImage {
  id: string;
  brand?: string | null;
  model?: string | null;
  color?: string | null;
  status: $Enums.BikeStatus;
  city?: string | null;
  source: string;
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  price?: number;
  serialNumber?: string | null;
  images?: { url: string }[];
  isDuplicate?: boolean;
}

export default function ForSalePage() {
  const [bikes, setBikes] = useState<BikeWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: BikeStatus.FOR_SALE_EXTERNAL,
    brand: "",
    city: "",
    color: "",
    serialNumber: ""
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch bikes based on filters
  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        // For external listings, we'll fetch from our external service
        if (filters.status === BikeStatus.FOR_SALE_EXTERNAL || !filters.status) {
          const externalListings = await fetchExternalListings();
          const convertedBikes: BikeWithImage[] = externalListings.map(listing => {
            const bike = externalListingToBike(listing);
            return {
              ...bike,
              images: listing.image ? [{ url: listing.image }] : []
            };
          });
          
          // Apply filters
          let filteredBikes = convertedBikes;
          
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredBikes = filteredBikes.filter(bike => 
              (bike.brand && bike.brand.toLowerCase().includes(query)) ||
              (bike.model && bike.model.toLowerCase().includes(query)) ||
              (bike.color && bike.color.toLowerCase().includes(query))
            );
          }
          
          if (filters.city) {
            filteredBikes = filteredBikes.filter(bike => 
              bike.city && bike.city.toLowerCase().includes(filters.city.toLowerCase())
            );
          }
          
          if (filters.brand) {
            filteredBikes = filteredBikes.filter(bike => 
              bike.brand && bike.brand.toLowerCase().includes(filters.brand.toLowerCase())
            );
          }
          
          if (filters.color) {
            filteredBikes = filteredBikes.filter(bike => 
              bike.color && bike.color.toLowerCase().includes(filters.color.toLowerCase())
            );
          }
          
          setBikes(filteredBikes);
        } else {
          // For other statuses, use the existing database query
          const result = await getBikesWithDuplicatesAction({
            ...filters,
            query: searchQuery || undefined,
            status: filters.status || undefined
          });
          
          if (result.success) {
            // Cast to any to bypass type checking for now
            // In a real application, you would fix the type definitions properly
            setBikes(result.bikes as any || []);
          }
        }
      } catch (error) {
        console.error("Error fetching bikes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, [filters, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pyörät myynnissä</h1>
          <p className="text-gray-600">Selaa pyöriä myynnissä ulkoisista lähteistä</p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <Filters onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Ladataan pyöriä...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <BikeCard 
                key={bike.id} 
                id={bike.id}
                brand={bike.brand || undefined}
                model={bike.model || undefined}
                color={bike.color || undefined}
                city={bike.city || undefined}
                status={bike.status as any}
                serialNumber={bike.serialNumber || undefined}
                imageUrl={bike.images?.[0]?.url || bike.image}
                isDuplicate={bike.isDuplicate}
              />
            ))}

          </div>
        )}

        {!loading && bikes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ei löytynyt pyöriä annetuilla hakuehdoilla.</p>
          </div>
        )}
      </div>
    </div>
  );
}
