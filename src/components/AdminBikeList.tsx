"use client";

import { useState } from "react";
import { BikeStatus } from "@/types/bicycle";
import Link from "next/link";
import { useFormState } from "react-dom";
import { archiveBike, deleteBike } from "@/lib/actions";

// Define form state types
type AdminFormState = {
  success: boolean;
  error?: string;
  action?: string;
  bikeId?: string;
};

// Initial form state
const initialFormState: AdminFormState = {
  success: false,
};

// Server actions for archive and delete
async function archiveBikeAction(prevState: AdminFormState, formData: FormData) {
  const bikeId = formData.get("bikeId") as string;
  try {
    const result = await archiveBike(bikeId);
    if (result.success) {
      return { success: true, action: "archive", bikeId };
    } else {
      return { success: false, error: result.error, action: "archive", bikeId };
    }
  } catch (error) {
    return { success: false, error: "Failed to archive bike", action: "archive", bikeId };
  }
}

async function deleteBikeAction(prevState: AdminFormState, formData: FormData) {
  const bikeId = formData.get("bikeId") as string;
  try {
    const result = await deleteBike(bikeId);
    if (result.success) {
      return { success: true, action: "delete", bikeId };
    } else {
      return { success: false, error: result.error, action: "delete", bikeId };
    }
  } catch (error) {
    return { success: false, error: "Failed to delete bike", action: "delete", bikeId };
  }
}

export default function AdminBikeList({ bikes }: { bikes: any[] }) {
  const [archiveState, archiveAction] = useFormState(archiveBikeAction, initialFormState);
  const [deleteState, deleteAction] = useFormState(deleteBikeAction, initialFormState);
  const [bikeList, setBikeList] = useState(bikes);

  // Handle successful archive/delete actions
  if (archiveState.success && archiveState.bikeId) {
    setBikeList(bikeList.map(bike => 
      bike.id === archiveState.bikeId ? { ...bike, archived: true } : bike
    ));
  }

  if (deleteState.success && deleteState.bikeId) {
    setBikeList(bikeList.filter(bike => bike.id !== deleteState.bikeId));
  }

  const getStatusText = (status: BikeStatus) => {
    switch (status) {
      case "LOST":
        return "Kadonnut";
      case "STOLEN":
        return "Varastettu";
      case "FOUND":
        return "Löydetty";
      case "FOR_SALE_EXTERNAL":
        return "Myyynnissä";
      default:
        return status;
    }
  };

  const getStatusColor = (status: BikeStatus) => {
    switch (status) {
      case "LOST":
        return "bg-yellow-100 text-yellow-800";
      case "STOLEN":
        return "bg-red-100 text-red-800";
      case "FOUND":
        return "bg-green-100 text-green-800";
      case "FOR_SALE_EXTERNAL":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pyörä
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiedot
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tilanne
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ilmoitettu
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Toiminnot
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bikeList.map((bike: any) => (
            <tr key={bike.id} className={bike.archived ? "opacity-50" : ""}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                    {bike.images && bike.images.length > 0 ? (
                      <img className="h-10 w-10 rounded-md object-cover" src={bike.images[0].url} alt="" />
                    ) : (
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {bike.brand} {bike.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bike.color}{bike.serialNumber && ` • ${bike.serialNumber}`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{bike.city}</div>
                <div className="text-sm text-gray-500">{bike.source || "Käyttäjä"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(bike.status)}`}>
                  {getStatusText(bike.status)}
                  {bike.archived && <span className="ml-1">• Arkistoitu</span>}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(bike.createdAt).toLocaleDateString("fi-FI")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link href={`/bike/${bike.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                  Näytä
                </Link>
                {!bike.archived ? (
                  <form action={archiveAction} className="inline">
                    <input type="hidden" name="bikeId" value={bike.id} />
                    <button type="submit" className="text-yellow-600 hover:text-yellow-900 mr-3">
                      Arkistoi
                    </button>
                  </form>
                ) : null}
                <form action={deleteAction} className="inline">
                  <input type="hidden" name="bikeId" value={bike.id} />
                  <button 
                    type="submit" 
                    className="text-red-600 hover:text-red-900"
                    onClick={(e) => {
                      if (!confirm("Haluatko varmasti poistaa tämän ilmoituksen?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Poista
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}