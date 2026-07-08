from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas import NearbyResponse, ReportCreate, ReportSubmitResponse, StationDetailResponse
from services.stations import get_nearby_stations, submit_report, get_station_detail

router = APIRouter(prefix="/api/stations")


@router.get("/nearby", response_model=NearbyResponse)
def nearby_stations(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    radius_km: float = Query(10.0, description="Search radius in km"),
    sort: str = Query("score", description="Sort by: score, price, distance"),
    db: Session = Depends(get_db),
):
    result = get_nearby_stations(db, lat, lon, radius_km, sort)
    return result


@router.post("/{station_id}/report", response_model=ReportSubmitResponse)
def create_report(
    station_id: int,
    report: ReportCreate,
    db: Session = Depends(get_db),
):
    result = submit_report(db, station_id, report.reported_price)
    if result is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return result


@router.get("/{station_id}", response_model=StationDetailResponse)
def station_detail(
    station_id: int,
    db: Session = Depends(get_db),
):
    result = get_station_detail(db, station_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return result
