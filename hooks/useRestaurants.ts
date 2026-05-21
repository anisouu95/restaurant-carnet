"use client";

import { useState, useEffect, useCallback } from "react";
import { Restaurant, CreateRestaurantInput, UpdateRestaurantInput } from "@/lib/types";
import * as storage from "@/lib/storage";

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  isLoading: boolean;
  getById: (id: string) => Restaurant | undefined;
  add: (input: CreateRestaurantInput) => Restaurant;
  update: (id: string, input: UpdateRestaurantInput) => Restaurant | null;
  remove: (id: string) => boolean;
  refresh: () => void;
}

export function useRestaurants(): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setRestaurants(storage.readAll());
  }, []);

  useEffect(() => {
    storage.seedDemoData();
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const getById = useCallback(
    (id: string) => restaurants.find((r) => r.id === id),
    [restaurants]
  );

  const add = useCallback(
    (input: CreateRestaurantInput): Restaurant => {
      const created = storage.create(input);
      setRestaurants((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const update = useCallback(
    (id: string, input: UpdateRestaurantInput): Restaurant | null => {
      const updated = storage.update(id, input);
      if (!updated) return null;
      setRestaurants((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
      return updated;
    },
    []
  );

  const remove = useCallback(
    (id: string): boolean => {
      const success = storage.remove(id);
      if (success) {
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
      }
      return success;
    },
    []
  );

  return { restaurants, isLoading, getById, add, update, remove, refresh };
}