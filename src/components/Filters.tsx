"use client";

import { useState } from "react";
import { BikeStatus } from "@/types/bicycle";

interface FiltersProps {
  onFilterChange: (filters: {
    status?: BikeStatus;
    brand?: string;
    city?: string;
    color?: string;
    serialNumber?: string;
  }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: "" as string,
    brand: "",
    city: "",
    color: "",
    serialNumber: ""
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters as any);
  };

  return (
    <div className="card p-4 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Suodattimet</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {expanded ? "Piilota" : "Näytä lisää"}
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="form-label">Tila</label>
          <select
            id="status"
            className="form-input w-full"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Kaikki tilat</option>
            <option value="LOST">Kadonnut</option>
            <option value="STOLEN">Varastettu</option>
            <option value="FOUND">Löydetty</option>
            <option value="FOR_SALE_EXTERNAL">Myyynnissä</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="brand" className="form-label">Merkki</label>
          <input
            type="text"
            id="brand"
            className="form-input w-full"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            placeholder="Esimerkiksi Trek"
          />
        </div>
        
        {expanded && (
          <>
            <div>
              <label htmlFor="city" className="form-label">Kaupunki</label>
              <input
                type="text"
                id="city"
                className="form-input w-full"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="Esimerkiksi Helsinki"
              />
            </div>
            
            <div>
              <label htmlFor="color" className="form-label">Väri</label>
              <input
                type="text"
                id="color"
                className="form-input w-full"
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
                placeholder="Esimerkiksi sininen"
              />
            </div>
            
            <div>
              <label htmlFor="serialNumber" className="form-label">Sarjanumero</label>
              <input
                type="text"
                id="serialNumber"
                className="form-input w-full"
                value={filters.serialNumber}
                onChange={(e) => handleFilterChange("serialNumber", e.target.value)}
                placeholder="Tarkka sarjanumero"
              />
            </div>
          </>
        )}
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button 
          className="btn-secondary text-sm"
          onClick={() => {
            setFilters({ status: "", brand: "", city: "", color: "", serialNumber: "" });
            onFilterChange({ status: undefined, brand: undefined, city: undefined, color: undefined, serialNumber: undefined });
          }}
        >
          Tyhjennä
        </button>
      </div>
    </div>
  );
}