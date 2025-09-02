import Navigation from "@/components/Navigation";
import { t } from "@/lib/i18n";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="card p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("auth.checkEmail")}
          </h1>
          <p className="text-gray-600 mb-8">
            {t("auth.verifyRequest")}
          </p>
          <div className="bg-blue-100 p-4 rounded-md">
            <p className="text-blue-800">
              Tarkista sähköpostisi saapuneet-kansio ja klikkaa kirjautumislinkkiä.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}