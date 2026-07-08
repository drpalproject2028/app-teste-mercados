"use client";

import { Station } from "@/lib/types";
import TrendBadge from "./TrendBadge";
import ConfidenceBadge from "./ConfidenceBadge";

interface StationListProps {
  stations: Station[];
  selectedId: number | null;
  sort: string;
  onSelect: (id: number) => void;
  onSortChange: (sort: string) => void;
}

export default function StationList({
  stations,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: StationListProps) {
  const sortOptions = [
    { value: "score", label: "Melhor opção" },
    { value: "price", label: "Preço" },
    { value: "distance", label: "Distância" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Todos os postos</h2>
        <div className="flex gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                sort === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {stations.map((station) => (
          <button
            key={station.station_id}
            onClick={() => onSelect(station.station_id)}
            className={`w-full text-left p-3 rounded-lg border transition ${
              selectedId === station.station_id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{station.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {station.brand} — {station.distance_km} km
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-700">
                  {station.gpl_price.toFixed(3)}€
                </div>
                <TrendBadge trend={station.trend} />
              </div>
            </div>
            <div className="mt-2">
              <ConfidenceBadge score={station.confidence_score} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
