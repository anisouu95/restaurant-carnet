export type RestaurantStatus = "to-visit" | "visited";

export type CuisineType =
  | "Française"
  | "Italienne"
  | "Japonaise"
  | "Mexicaine"
  | "Thaïlandaise"
  | "Indienne"
  | "Américaine"
  | "Coréenne"
  | "Libanaise"
  | "Espagnole"
  | "Autre";

export const CUISINE_TYPES: CuisineType[] = [
  "Française", "Italienne", "Japonaise", "Mexicaine",
  "Thaïlandaise", "Indienne", "Américaine", "Coréenne",
  "Libanaise", "Espagnole", "Autre",
];

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: CuisineType;
  status: RestaurantStatus;
  rating?: number;
  review?: string;
  photos: string[];
  coordinates?: Coordinates;
  createdAt: string;
  updatedAt: string;
}

export type CreateRestaurantInput = Omit<Restaurant, "id" | "createdAt" | "updatedAt">;

export type UpdateRestaurantInput = Partial<Omit<Restaurant, "id" | "createdAt" | "updatedAt">>;

export interface FilterState {
  status: RestaurantStatus | "all";
  cuisine: CuisineType | "all";
  minRating: number;
}
