"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Station } from "@/lib/types";

function priceColor(price: number, allPrices: number[]): string {
  if (allPrices.length < 2) return "#3b82f6";
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  const ratio = (price - min) / (max - min || 1);
  if (ratio < 0.33) return "#22c55e";
  if (ratio < 0.66) return "#eab308";
  return "#ef4444";
}

function createPriceIcon(price: number, color: string, isSelected: boolean) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${color};
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      border: ${isSelected ? "3px solid #1d4ed8" : "2px solid white"};
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
    ">${price.toFixed(3)}€</div>`,
    iconSize: [60, 28],
    iconAnchor: [30, 14],
  });
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 12);
  }, [map, lat, lon]);
  return null;
}

interface MapViewProps {
  stations: Station[];
  selectedId: number | null;
  userLat: number;
  userLon: number;
  onSelect: (id: number) => void;
}

export default function MapView({ stations, selectedId, userLat, userLon, onSelect }: MapViewProps) {
  const allPrices = stations.map((s) => s.gpl_price);

  const userIcon = L.divIcon({
    className: "user-marker",
    html: `<div style="
      width: 16px; height: 16px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59,130,246,0.5);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <div className="h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={[userLat, userLon]} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={userLat} lon={userLon} />
        <Marker position={[userLat, userLon]} icon={userIcon}>
          <Popup>A tua localização</Popup>
        </Marker>
        {stations.map((station) => {
          const color = priceColor(station.gpl_price, allPrices);
          const icon = createPriceIcon(station.gpl_price, color, station.station_id === selectedId);
          return (
            <Marker
              key={station.station_id}
              position={[station.lat, station.lon]}
              icon={icon}
              eventHandlers={{ click: () => onSelect(station.station_id) }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{station.name}</strong>
                  <br />
                  {station.gpl_price.toFixed(3)}€/L — {station.distance_km} km
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
