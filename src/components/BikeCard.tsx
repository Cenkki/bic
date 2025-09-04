import { BikeStatus } from "@/types/bicycle";
import Image from "next/image";
import Link from "next/link";

interface BikeCardProps {
  id: string;
  brand?: string;
  model?: string;
  color?: string;
  city?: string;
  status: BikeStatus;
  imageUrl?: string;
  serialNumber?: string;
  isDuplicate?: boolean;
}

export default function BikeCard({ 
  id, 
  brand, 
  model, 
  color, 
  city, 
  status,
  imageUrl,
  serialNumber,
  isDuplicate = false
}: BikeCardProps) {
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

  return (
    <div className="card relative overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl">
      {isDuplicate && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-md">
            Mahdollisesti sama pyörä
          </span>
        </div>
      )}
      
      <div className="relative h-52">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={`${brand} ${model}`} 
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-bold text-gray-900 text-xl mb-2 truncate">
          {brand} {model}
        </h3>
        
        <div className="mb-4 flex-grow">
          <p className="text-gray-600 text-sm mb-1">
            {color}
          </p>
          {serialNumber && (
            <p className="text-gray-500 text-xs">
              Sarjanumero: {serialNumber}
            </p>
          )}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {city || "Sijainti ei tiedossa"}
          </span>
          <Link href={`/bike/${id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center transition-colors">
            Katso lisää
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}