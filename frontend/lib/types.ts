export interface Station {
  station_id: number;
  name: string;
  lat: number;
  lon: number;
  distance_km: number;
  gpl_price: number;
  updated_at: string;
  confidence_score: number;
  trend: "up" | "down" | "stable";
  score: number;
  address?: string;
  brand?: string;
}

export interface NearbyResponse {
  best_option: Station | null;
  alternatives: Station[];
  all_stations: Station[];
}

export interface ReportSubmitResponse {
  message: string;
  new_confidence: number;
  new_price: number;
}
