from datetime import datetime
from pydantic import BaseModel


class StationResponse(BaseModel):
    station_id: int
    name: str
    lat: float
    lon: float
    distance_km: float
    gpl_price: float
    updated_at: datetime
    confidence_score: float
    trend: str
    score: float
    address: str | None = None
    brand: str | None = None

    model_config = {"from_attributes": True}


class NearbyResponse(BaseModel):
    best_option: StationResponse | None
    alternatives: list[StationResponse]
    all_stations: list[StationResponse]


class StationDetailResponse(BaseModel):
    station_id: int
    name: str
    lat: float
    lon: float
    gpl_price: float
    updated_at: datetime
    confidence_score: float
    trend: str
    address: str | None = None
    brand: str | None = None
    reports: list["ReportResponse"]

    model_config = {"from_attributes": True}


class ReportCreate(BaseModel):
    reported_price: float


class ReportResponse(BaseModel):
    id: int
    station_id: int
    reported_price: float
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportSubmitResponse(BaseModel):
    message: str
    new_confidence: float
    new_price: float
