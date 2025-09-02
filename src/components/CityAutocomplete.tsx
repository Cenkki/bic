"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import finnishCities from "@/data/finnish-cities.json";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Valitse kaupunki", 
  className = "" 
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter cities based on input
  const getSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      return [];
    }
    
    const filtered = finnishCities.filter(city => 
      city.toLowerCase().includes(input.toLowerCase())
    );
    
    return filtered.slice(0, 10); // Limit to 10 suggestions
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (inputValue.trim()) {
      setSuggestions(getSuggestions(inputValue));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSuggestions([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (value.trim()) {
            setSuggestions(getSuggestions(value));
            setIsOpen(true);
          }
        }}
        placeholder={placeholder}
        className={`form-input w-full ${className}`}
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((city, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}