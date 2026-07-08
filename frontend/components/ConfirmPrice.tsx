"use client";

import { useState } from "react";
import { Station } from "@/lib/types";
import { submitPriceReport } from "@/lib/api";

interface ConfirmPriceProps {
  station: Station;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConfirmPrice({ station, onClose, onSuccess }: ConfirmPriceProps) {
  const [price, setPrice] = useState(station.gpl_price.toFixed(3));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0 || numPrice > 5) {
      setError("Preço inválido");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await submitPriceReport(station.station_id, numPrice);
      onSuccess();
    } catch {
      setError("Erro ao submeter. Tenta novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-1">Confirmar preço</h3>
        <p className="text-sm text-gray-500 mb-4">{station.name}</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço GPL (€/litro)
          </label>
          <input
            type="number"
            step="0.001"
            min="0.1"
            max="5"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "A submeter..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
