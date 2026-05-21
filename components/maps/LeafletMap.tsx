"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Restaurant } from "@/lib/types";

// Fix icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Icône rouge pour "à visiter"
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icône verte pour "visité"
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface LeafletMapProps {
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
}

// Centre la carte sur Paris par défaut
const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;

export function LeafletMap({ restaurants, onSelect }: LeafletMapProps) {
  const withCoords = restaurants.filter((r) => r.coordinates);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {withCoords.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.coordinates!.lat, restaurant.coordinates!.lng]}
          icon={restaurant.status === "visited" ? greenIcon : redIcon}
          eventHandlers={{
            click: () => onSelect(restaurant),
          }}
        />
      ))}
    </MapContainer>
  );
}
