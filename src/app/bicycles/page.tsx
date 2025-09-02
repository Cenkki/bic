import Navigation from "@/components/Navigation";
import { t } from "@/lib/i18n";

export default function BicyclesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("bicycles.title")}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample bicycle cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="card">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900">Pyörä {item}</h2>
                <p className="text-gray-600 mt-2">Kuvaus pyörästä {item}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Merkki Malli</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Kadonnut
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}