"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

interface FoundBikeFormData {
  brand: string;
  model: string;
  color: string;
  serialNumber: string;
  description: string;
  foundDate: string;
  note: string;
  locationLat: number | "";
  locationLng: number | "";
  city: string;
}

export default function FoundBikeForm() {
  const [formData, setFormData] = useState<FoundBikeFormData>({
    brand: "",
    model: "",
    color: "",
    serialNumber: "",
    description: "",
    foundDate: "",
    note: "",
    locationLat: "",
    locationLng: "",
    city: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Found bike report submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t("report.found.title")}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="brand" className="form-label">
            Merkki
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="model" className="form-label">
            Malli
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="color" className="form-label">
            Väri
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="serialNumber" className="form-label">
            Sarjanumero
          </label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className="form-input w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="form-label">
          Kuvaus
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="form-input w-full"
        />
      </div>
      
      <div>
        <label htmlFor="foundDate" className="form-label">
          Löydetty päivämäärä
        </label>
        <input
          type="date"
          id="foundDate"
          name="foundDate"
          value={formData.foundDate}
          onChange={handleChange}
          className="form-input w-full"
        />
      </div>
      
      <div>
        <label htmlFor="note" className="form-label">
          Lisätietoja
        </label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={3}
          className="form-input w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="locationLat" className="form-label">
            Leveyspiiri
          </label>
          <input
            type="number"
            id="locationLat"
            name="locationLat"
            value={formData.locationLat}
            onChange={handleChange}
            step="0.000001"
            className="form-input w-full"
          />
        </div>
        
        <div>
          <label htmlFor="locationLng" className="form-label">
            Pituuspiiri
          </label>
          <input
            type="number"
            id="locationLng"
            name="locationLng"
            value={formData.locationLng}
            onChange={handleChange}
            step="0.000001"
            className="form-input w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="city" className="form-label">
          Kaupunki
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="form-input w-full"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button type="button" className="btn-secondary">
          {t("common.cancel")}
        </button>
        <button type="submit" className="btn-primary">
          {t("common.save")}
        </button>
      </div>
    </form>
  );
}