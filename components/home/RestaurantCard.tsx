import Link from "next/link";
import { Restaurant } from "@/lib/types";
import { StatusBadge } from "@/components/restaurant/StatusBadge";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

function StarDisplay({ rating }: { rating?: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-amber-400" : "text-stone-200"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const staggerClasses = [
  "stagger-1",
  "stagger-2",
  "stagger-3",
  "stagger-4",
  "stagger-5",
  "stagger-6",
];

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const stagger = staggerClasses[index % staggerClasses.length];
  const hasPhoto = restaurant.photos.length > 0;

  return (
    <Link href={`/restaurant/${restaurant.id}`} className="block group">
      <article className={`card overflow-hidden opacity-0 animate-fade-up ${stagger}`}>
        <div className="relative h-44 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
          {hasPhoto ? (
            <img
              src={restaurant.photos[0]}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-30">🍽</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <StatusBadge status={restaurant.status} size="sm" />
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">
            {restaurant.cuisine}
          </p>
          <h3 className="font-display text-lg font-semibold text-stone-800 leading-snug mb-2 group-hover:text-stone-600 transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-stone-400 leading-relaxed line-clamp-2 mb-3">
            📍 {restaurant.address}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <StarDisplay rating={restaurant.rating} />
            {!restaurant.rating && (
              <span className="text-xs text-stone-300 italic">Non noté</span>
            )}
            <span className="text-xs text-stone-300">
              {new Date(restaurant.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}