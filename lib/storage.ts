import { Restaurant, CreateRestaurantInput, UpdateRestaurantInput } from "./types";

const STORAGE_KEY = "restaurant-carnet-v1";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function readAll(): Restaurant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Restaurant[];
  } catch {
    console.error("[storage] Erreur de lecture:", STORAGE_KEY);
    return [];
  }
}

function writeAll(restaurants: Restaurant[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
}

export function getById(id: string): Restaurant | undefined {
  return readAll().find((r) => r.id === id);
}

export function create(input: CreateRestaurantInput): Restaurant {
  const restaurant: Restaurant = {
    ...input,
    id: generateId(),
    createdAt: now(),
    updatedAt: now(),
  };
  const all = readAll();
  writeAll([restaurant, ...all]);
  return restaurant;
}

export function update(
  id: string,
  input: UpdateRestaurantInput
): Restaurant | null {
  const all = readAll();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updated: Restaurant = {
    ...all[index],
    ...input,
    id,
    createdAt: all[index].createdAt,
    updatedAt: now(),
  };
  all[index] = updated;
  writeAll(all);
  return updated;
}

export function remove(id: string): boolean {
  const all = readAll();
  const filtered = all.filter((r) => r.id !== id);
  if (filtered.length === all.length) return false;
  writeAll(filtered);
  return true;
}

export function seedDemoData(): void {
  if (readAll().length > 0) return;

  const demos: Restaurant[] = [
    {
      id: "demo-1",
      name: "Le Comptoir du Relais",
      address: "9 Carrefour de l'Odéon, 75006 Paris",
      cuisine: "Française",
      status: "visited",
      rating: 5,
      review: "Une cuisine bistrot parfaite. Le foie de veau était exceptionnel.",
      photos: [],
      coordinates: { lat: 48.8521, lng: 2.3387 },
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: "demo-2",
      name: "Septime",
      address: "80 Rue de Charonne, 75011 Paris",
      cuisine: "Française",
      status: "to-visit",
      photos: [],
      coordinates: { lat: 48.8534, lng: 2.3796 },
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "demo-3",
      name: "Ippudo Paris",
      address: "14 Rue Grégoire de Tours, 75006 Paris",
      cuisine: "Japonaise",
      status: "visited",
      rating: 4,
      review: "Les meilleurs ramens de Paris selon moi. Bouillon très profond.",
      photos: [],
      coordinates: { lat: 48.8512, lng: 2.3379 },
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: "demo-4",
      name: "Holybelly",
      address: "19 Rue Lucien Sampaix, 75010 Paris",
      cuisine: "Américaine",
      status: "to-visit",
      photos: [],
      coordinates: { lat: 48.8706, lng: 2.3612 },
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];

  writeAll(demos);
}