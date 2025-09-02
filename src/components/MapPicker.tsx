"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  height?: string;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPicker({ 
  onLocationSelect,
  initialPosition = [60.1699, 24.9384], // Default to Helsinki
  height = "400px"
}: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(initialPosition as [number, number] | null);
  const [zoom, setZoom] = useState(13);

  const handleMapClick = (lat: number, lng: number) => {
    const newPosition: [number, number] = [lat, lng];
    setPosition(newPosition);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="relative">
      <MapContainer 
        center={initialPosition} 
        zoom={zoom} 
        style={{ height, width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onLocationSelect={handleMapClick} />
        {position && (
          <Marker position={position}>
            <Popup>
              Valittu sijainti
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="mt-2 text-sm text-gray-600">
        Klikkaa karttaa valitaksesi sijainnin
      </div>
    </div>
  );
}