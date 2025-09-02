import Navigation from "@/components/Navigation";
import BicycleForm from "@/components/BicycleForm";
import { t } from "@/lib/i18n";

export default function NewBicyclePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t("bicycle.form.title")}
          </h1>
          <BicycleForm />
        </div>
      </div>
    </div>
  );
}