"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createStolenBikeReport } from "@/lib/actions";
import { FormState } from "@/lib/validation";
import ReCaptcha from "@/components/ReCaptcha";
import CityAutocomplete from "@/components/CityAutocomplete";

export default function StolenBikeForm() {
  const [state, formAction] = useFormState(createStolenBikeReport, { success: false });
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    color: "",
    serialNumber: "",
    description: "",
    lostDate: "",
    place: "",
    contact: "",
    locationLat: "",
    locationLng: "",
    city: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [MapPicker, setMapPicker] = useState<any>(null);

  // Dynamically import MapPicker only on the client side
  useEffect(() => {
    import("@/components/MapPicker").then((module) => {
      setMapPicker(() => module.default);
    });
  }, []);

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

  const handleCityChange = (value: string) => {
    setFormData(prev => ({ ...prev, city: value }));
  };

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      locationLat: lat.toString(),
      locationLng: lng.toString()
    }));
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden ReCaptcha token field */}
      <input type="hidden" name="recaptchaToken" value={recaptchaToken || ""} />
      <input type="hidden" name="locationLat" value={formData.locationLat} />
      <input type="hidden" name="locationLng" value={formData.locationLng} />
      
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{state.error}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Ilmoita varastettu pyörä
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
            required
          />
          {(state as FormState).fieldErrors?.brand && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.brand[0]}</p>
          )}
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
            required
          />
          {(state as FormState).fieldErrors?.model && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.model[0]}</p>
          )}
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
            required
          />
          {(state as FormState).fieldErrors?.color && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.color[0]}</p>
          )}
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
          {(state as FormState).fieldErrors?.serialNumber && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.serialNumber[0]}</p>
          )}
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
          placeholder="Lisätietoja pyörästä, esimerkiksi vaurioista tai erityispiirteistä"
        />
        {(state as FormState).fieldErrors?.description && (
          <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.description[0]}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="lostDate" className="form-label">
            Varastettu päivämäärä
          </label>
          <input
            type="date"
            id="lostDate"
            name="lostDate"
            value={formData.lostDate}
            onChange={handleChange}
            className="form-input w-full"
            required
          />
          {(state as FormState).fieldErrors?.lostDate && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.lostDate[0]}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="place" className="form-label">
            Paikka
          </label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="form-input w-full"
            placeholder="Esimerkiksi 'Rautatientori, Helsinki'"
            required
          />
          {(state as FormState).fieldErrors?.place && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.place[0]}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="contact" className="form-label">
          Yhteystiedot (sähköposti/puhelin)
        </label>
        <input
          type="text"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="Esimerkiksi 'nimi@esimerkki.fi' tai '+358 40 123 4567'"
          required
        />
        {(state as FormState).fieldErrors?.contact && (
          <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.contact[0]}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className="form-label">
            Kaupunki
          </label>
          <CityAutocomplete
            value={formData.city}
            onChange={handleCityChange}
            placeholder="Valitse kaupunki"
          />
          {(state as FormState).fieldErrors?.city && (
            <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.city[0]}</p>
          )}
        </div>
      </div>
      
      <div>
        <label className="form-label">Sijainti</label>
        {MapPicker ? (
          <MapPicker 
            onLocationSelect={handleLocationSelect}
            initialPosition={
              formData.locationLat && formData.locationLng 
                ? [parseFloat(formData.locationLat), parseFloat(formData.locationLng)] 
                : undefined
            }
          />
        ) : (
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Ladataan karttaa...</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label htmlFor="locationLat" className="form-label">Leveyspiiri</label>
            <input
              type="number"
              id="locationLat"
              name="locationLat"
              value={formData.locationLat}
              onChange={handleChange}
              step="0.000001"
              className="form-input w-full"
              placeholder="Leveyspiiri"
            />
          </div>
          <div>
            <label htmlFor="locationLng" className="form-label">Pituuspiiri</label>
            <input
              type="number"
              id="locationLng"
              name="locationLng"
              value={formData.locationLng}
              onChange={handleChange}
              step="0.000001"
              className="form-input w-full"
              placeholder="Pituuspiiri"
            />
          </div>
        </div>
      </div>
      
      <div>
        <ReCaptcha onVerify={handleRecaptchaVerify} />
        {(state as FormState).fieldErrors?.recaptchaToken && (
          <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.recaptchaToken[0]}</p>
        )}
      </div>
      
      <div className="flex items-center">
        <button
          type="submit"
          className="btn-primary"
          disabled={state.success}
        >
          {state.success ? "Lähetetty!" : "Lähetä ilmoitus"}
        </button>
        
        {state.success && (
          <p className="ml-4 text-green-600">Ilmoitus lähetetty onnistuneesti!</p>
        )}
      </div>
    </form>
  );
}