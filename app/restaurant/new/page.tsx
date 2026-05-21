import { RestaurantForm } from "@/components/restaurant/RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-stone-800 mb-2">
          Ajouter un restaurant
        </h1>
        <p className="text-stone-400">
          Renseigne les infos de base, tu pourras ajouter photos et avis ensuite.
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
        <RestaurantForm />
      </div>
    </div>
  );
}
