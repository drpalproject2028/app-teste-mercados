"use client";

import { Station } from "@/lib/types";
import TrendBadge from "./TrendBadge";
import ConfidenceBadge from "./ConfidenceBadge";

interface BestOptionProps {
  station: Station;
  onConfirmPrice: (station: Station) => void;
}

export default function BestOption({ station, onConfirmPrice }: BestOptionProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}`;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
      <div className="text-sm font-medium opacity-80 mb-1">
        Melhor opção agora
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{station.name}</h2>
          <p className="text-blue-100 text-sm mt-1">
            {station.brand} — {station.distance_km} km de distância
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{station.gpl_price.toFixed(3)}€</div>
          <div className="text-blue-100 text-xs">por litro</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <TrendBadge trend={station.trend} />
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-70">Confiança:</span>
          <ConfidenceBadge score={station.confidence_score} />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white text-blue-700 font-medium py-2 px-4 rounded-lg text-center hover:bg-blue-50 transition text-sm"
        >
          Navegar
        </a>
        <button
          onClick={() => onConfirmPrice(station)}
          className="flex-1 bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
        >
          Confirmar preço
        </button>
      </div>
    </div>
  );
}
