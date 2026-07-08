"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useStationsStore } from "@/store/stations";
import { Station } from "@/lib/types";
import LocationButton from "@/components/LocationButton";
import BestOption from "@/components/BestOption";
import StationList from "@/components/StationList";
import ConfirmPrice from "@/components/ConfirmPrice";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const {
    bestOption,
    alternatives,
    allStations,
    selectedStationId,
    userLocation,
    isLoading,
    sort,
    error,
    setLocation,
    setSort,
    selectStation,
    fetchStations,
  } = useStationsStore();

  const [confirmStation, setConfirmStation] = useState<Station | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleLocate = useCallback(
    (lat: number, lon: number) => {
      setGeoLoading(false);
      setLocation(lat, lon);
    },
    [setLocation]
  );

  useEffect(() => {
    if (userLocation) {
      fetchStations();
    }
  }, [userLocation, sort, fetchStations]);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const handleConfirmSuccess = () => {
    setConfirmStation(null);
    fetchStations();
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700">GPL Perto de Ti</h1>
        <p className="text-gray-500 text-sm">
          Encontra o GPL mais barato perto de ti
        </p>
      </header>

      {!userLocation && (
        <div className="mb-6">
          <LocationButton
            onLocate={handleLocate}
            loading={geoLoading}
            error={geoError}
          />
          <p className="text-xs text-gray-400 mt-2 text-center">
            Precisamos da tua localização para encontrar postos próximos
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          <p className="text-gray-500 mt-3">A procurar postos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {userLocation && !isLoading && (
        <>
          {bestOption && (
            <div className="mb-4">
              <BestOption
                station={bestOption}
                onConfirmPrice={setConfirmStation}
              />
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                Alternativas
              </h2>
              <div className="grid gap-2">
                {alternatives.map((s) => (
                  <button
                    key={s.station_id}
                    onClick={() => selectStation(s.station_id)}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition text-left"
                  >
                    <div>
                      <span className="font-medium text-sm">{s.name}</span>
                      <span className="text-gray-400 text-xs ml-2">
                        {s.distance_km} km
                      </span>
                    </div>
                    <span className="font-bold text-blue-700">
                      {s.gpl_price.toFixed(3)}€
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <MapView
              stations={allStations}
              selectedId={selectedStationId}
              userLat={userLocation.lat}
              userLon={userLocation.lon}
              onSelect={selectStation}
            />
          </div>

          <StationList
            stations={allStations}
            selectedId={selectedStationId}
            sort={sort}
            onSelect={selectStation}
            onSortChange={handleSortChange}
          />
        </>
      )}

      {allStations.length === 0 && userLocation && !isLoading && !error && (
        <div className="text-center py-12 text-gray-400">
          Nenhum posto encontrado na tua zona.
          <br />
          Experimenta aumentar o raio de pesquisa.
        </div>
      )}

      {confirmStation && (
        <ConfirmPrice
          station={confirmStation}
          onClose={() => setConfirmStation(null)}
          onSuccess={handleConfirmSuccess}
        />
      )}
    </main>
  );
}
