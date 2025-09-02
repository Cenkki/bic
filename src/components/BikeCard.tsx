import { BikeStatus } from "@/types/bicycle";

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
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
      {isDuplicate && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Mahdollisesti sama pyörä
          </span>
        </div>
      )}
      
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${brand} ${model}`} 
          className="w-full h-32 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-4" />
      )}
      
      <h3 className="font-bold text-gray-900 truncate">
        {brand} {model}
      </h3>
      
      <p className="text-gray-600 text-sm mt-1">
        {color}{serialNumber && ` • ${serialNumber}`}
      </p>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">{city}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      </div>
    </div>
  );
}