"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ onSearch, placeholder = "Hae merkkiä, mallia, väriä, kaupunkia tai sarjanumeroa...", initialValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="search-bar shadow-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-full border-0 py-4 pl-6 pr-32 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-base sm:leading-6 transition-all duration-300"
          placeholder={placeholder}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <button 
            type="submit"
            className="btn-primary rounded-full px-6 py-2 text-base font-semibold"
          >
            Hae
          </button>
        </div>
      </div>
    </form>
  );
}