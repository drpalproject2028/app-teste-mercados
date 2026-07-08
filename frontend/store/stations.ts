import { create } from "zustand";
import { Station } from "@/lib/types";
import { fetchNearbyStations } from "@/lib/api";

interface StationsState {
  bestOption: Station | null;
  alternatives: Station[];
  allStations: Station[];
  selectedStationId: number | null;
  userLocation: { lat: number; lon: number } | null;
  isLoading: boolean;
  sort: string;
  radiusKm: number;
  error: string | null;
  setLocation: (lat: number, lon: number) => void;
  setSort: (sort: string) => void;
  selectStation: (id: number | null) => void;
  fetchStations: () => Promise<void>;
}

export const useStationsStore = create<StationsState>((set, get) => ({
  bestOption: null,
  alternatives: [],
  allStations: [],
  selectedStationId: null,
  userLocation: null,
  isLoading: false,
  sort: "score",
  radiusKm: 15,
  error: null,

  setLocation: (lat, lon) => {
    set({ userLocation: { lat, lon } });
  },

  setSort: (sort) => {
    set({ sort });
  },

  selectStation: (id) => {
    set({ selectedStationId: id });
  },

  fetchStations: async () => {
    const { userLocation, sort, radiusKm } = get();
    if (!userLocation) return;

    set({ isLoading: true, error: null });
    try {
      const data = await fetchNearbyStations(
        userLocation.lat,
        userLocation.lon,
        radiusKm,
        sort
      );
      set({
        bestOption: data.best_option,
        alternatives: data.alternatives,
        allStations: data.all_stations,
        isLoading: false,
      });
    } catch {
      set({ error: "Erro ao carregar postos", isLoading: false });
    }
  },
}));
