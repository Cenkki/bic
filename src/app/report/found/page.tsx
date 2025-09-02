"use client";

import Navigation from "@/components/Navigation";
import ImageUpload from "@/components/ImageUpload";
import ReCaptcha from "@/components/ReCaptcha";
import CityAutocomplete from "@/components/CityAutocomplete";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createFoundBikeReport } from "@/lib/actions";
import { FormState } from "@/lib/validation";

export default function ReportFoundBikePage() {
  const [state, formAction] = useFormState(createFoundBikeReport, { success: false });
  const [formData, setFormData] = useState({
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
  const [images, setImages] = useState<File[]>([]);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [MapPicker, setMapPicker] = useState<any>(null);

  // Dynamically import MapPicker only on the client side
  useEffect(() => {
    import("@/components/MapPicker").then((module) => {
      setMapPicker(() => module.default);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (value: string) => {
    setFormData(prev => ({ ...prev, city: value }));
  };

  const handleImagesSelected = (selectedImages: File[]) => {
    setImages(selectedImages);
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Ilmoita löytämäsi pyörä</h1>
          
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{state.error}</p>
            </div>
          )}
          
          <form action={formAction} className="space-y-6">
            {/* Hidden ReCaptcha token field */}
            <input type="hidden" name="recaptchaToken" value={recaptchaToken || ""} />
            <input type="hidden" name="locationLat" value={formData.locationLat} />
            <input type="hidden" name="locationLng" value={formData.locationLng} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="brand" className="form-label">Merkki</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="form-input w-full"
                />
                {(state as FormState).fieldErrors?.brand && (
                  <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.brand[0]}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="model" className="form-label">Malli</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="form-input w-full"
                />
                {(state as FormState).fieldErrors?.model && (
                  <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.model[0]}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="color" className="form-label">Väri</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input w-full"
                />
                {(state as FormState).fieldErrors?.color && (
                  <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.color[0]}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="serialNumber" className="form-label">Sarjanumero</label>
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
              <label htmlFor="description" className="form-label">Kuvaus *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-input w-full"
                placeholder="Kuvaus pyörästä, esimerkiksi vaurioista tai erityispiirteistä"
                required
              />
              {(state as FormState).fieldErrors?.description && (
                <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.description[0]}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="foundDate" className="form-label">Löydetty päivämäärä *</label>
                <input
                  type="date"
                  id="foundDate"
                  name="foundDate"
                  value={formData.foundDate}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                />
                {(state as FormState).fieldErrors?.foundDate && (
                  <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.foundDate[0]}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="form-label">Kaupunki *</label>
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
              <label htmlFor="note" className="form-label">Lisätietoja</label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="form-input w-full"
                placeholder="Lisätietoja löydöstä, esimerkiksi missä paikassa löysit pyörän"
              />
              {(state as FormState).fieldErrors?.note && (
                <p className="mt-1 text-sm text-red-600">{(state as FormState).fieldErrors?.note[0]}</p>
              )}
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
              <label className="form-label">Kuvat</label>
              <ImageUpload onImagesSelected={handleImagesSelected} maxFiles={5} />
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
        </div>
      </div>
    </div>
  );
}