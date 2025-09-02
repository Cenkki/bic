"use client";

import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import BikeCard from "@/components/BikeCard";
import { BikeStatus } from "@/types/bicycle";
import { useState, useEffect } from "react";
import { getBikesWithDuplicatesAction } from "@/lib/actions";

export default function FoundPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "FOUND" as BikeStatus | "",
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
        const result = await getBikesWithDuplicatesAction({
          ...filters,
          query: searchQuery || undefined,
          status: filters.status || undefined
        });
        
        if (result.success) {
          setBikes(result.bikes || []);
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Löydetyt pyörät</h1>
          <p className="text-gray-600">Ilmoita löytämäsi pyörä tai tarkista löydettyjä pyöriä</p>
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
                brand={bike.brand}
                model={bike.model}
                color={bike.color}
                city={bike.city}
                status={bike.status}
                serialNumber={bike.serialNumber}
                imageUrl={bike.images[0]?.url}
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