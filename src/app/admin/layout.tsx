import Navigation from "@/components/Navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ylläpito</h1>
          <p className="text-gray-600 mt-2">Hallitse ilmoituksia ja käyttäjiä</p>
        </div>
        {children}
      </div>
    </div>
  );
}