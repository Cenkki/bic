"use client";

import { useState, useEffect } from "react";
import { getBikes } from "@/lib/actions";
import { BikeStatus } from "@/types/bicycle";
import Link from "next/link";
import AdminBikeList from "@/components/AdminBikeList";

export default function AdminPage() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      const bikeResult = await getBikes();
      setBikes(bikeResult.success ? bikeResult.bikes || [] : []);
      setLoading(false);
    };
    
    fetchBikes();
  }, []);

  if (loading) {
    return <div className="p-6">Ladataan...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Viimeisimmät ilmoitukset</h2>
      </div>
      <AdminBikeList bikes={bikes} />
      {bikes.length === 0 && (
        <div className="px-6 py-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ei ilmoituksia</h3>
          <p className="mt-1 text-sm text-gray-500">Ei löytynyt yhtään ilmoitusta järjestelmästä.</p>
        </div>
      )}
    </div>
  );
}