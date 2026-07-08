import { NearbyResponse, ReportSubmitResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchNearbyStations(
  lat: number,
  lon: number,
  radiusKm: number = 10,
  sort: string = "score"
): Promise<NearbyResponse> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    radius_km: radiusKm.toString(),
    sort,
  });
  const res = await fetch(`${API_BASE}/api/stations/nearby?${params}`);
  if (!res.ok) throw new Error("Failed to fetch stations");
  return res.json();
}

export async function submitPriceReport(
  stationId: number,
  reportedPrice: number
): Promise<ReportSubmitResponse> {
  const res = await fetch(`${API_BASE}/api/stations/${stationId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reported_price: reportedPrice }),
  });
  if (!res.ok) throw new Error("Failed to submit report");
  return res.json();
}
