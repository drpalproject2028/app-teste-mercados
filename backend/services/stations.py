from sqlalchemy import func, text
from sqlalchemy.orm import Session
from models import Station, UserReport
from services.scoring import calculate_confidence, score_station, calculate_trend, weighted_price


def get_nearby_stations(
    db: Session,
    lat: float,
    lon: float,
    radius_km: float = 10.0,
    sort: str = "score",
) -> dict:
    point = func.ST_SetSRID(func.ST_MakePoint(lon, lat), 4326)
    distance_expr = func.ST_Distance(
        Station.location.cast(text("geography")),
        point.cast(text("geography")),
    ) / 1000  # meters to km

    stations = (
        db.query(Station, distance_expr.label("distance_km"))
        .filter(
            func.ST_DWithin(
                Station.location.cast(text("geography")),
                point.cast(text("geography")),
                radius_km * 1000,
            )
        )
        .all()
    )

    if not stations:
        return {"best_option": None, "alternatives": [], "all_stations": []}

    all_prices = [s.Station.gpl_price for s in stations if s.Station.gpl_price]
    if not all_prices:
        return {"best_option": None, "alternatives": [], "all_stations": []}

    max_distance = max(s.distance_km for s in stations) if stations else radius_km

    results = []
    for row in stations:
        station = row.Station
        distance = round(row.distance_km, 2)

        reports = (
            db.query(UserReport)
            .filter(UserReport.station_id == station.id)
            .order_by(UserReport.created_at.desc())
            .limit(10)
            .all()
        )

        confidence = calculate_confidence(reports)
        trend = calculate_trend(reports)
        station_score = score_station(
            station.gpl_price, distance, confidence, all_prices, max_distance
        )

        results.append({
            "station_id": station.id,
            "name": station.name,
            "lat": station.lat,
            "lon": station.lon,
            "distance_km": distance,
            "gpl_price": station.gpl_price,
            "updated_at": station.updated_at,
            "confidence_score": confidence,
            "trend": trend,
            "score": station_score,
            "address": station.address,
            "brand": station.brand,
        })

    sort_keys = {
        "score": lambda x: x["score"],
        "price": lambda x: x["gpl_price"],
        "distance": lambda x: x["distance_km"],
    }
    results.sort(key=sort_keys.get(sort, sort_keys["score"]))

    return {
        "best_option": results[0] if results else None,
        "alternatives": results[1:4],
        "all_stations": results,
    }


def submit_report(db: Session, station_id: int, reported_price: float) -> dict:
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        return None

    report = UserReport(station_id=station_id, reported_price=reported_price)
    db.add(report)
    db.flush()

    reports = (
        db.query(UserReport)
        .filter(UserReport.station_id == station_id)
        .order_by(UserReport.created_at.desc())
        .limit(10)
        .all()
    )

    new_confidence = calculate_confidence(reports)
    new_price = weighted_price(reports)
    if new_price:
        station.gpl_price = new_price

    from datetime import datetime
    station.updated_at = datetime.utcnow()
    db.commit()

    return {
        "message": "Report submitted",
        "new_confidence": new_confidence,
        "new_price": station.gpl_price,
    }


def get_station_detail(db: Session, station_id: int) -> dict | None:
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        return None

    reports = (
        db.query(UserReport)
        .filter(UserReport.station_id == station_id)
        .order_by(UserReport.created_at.desc())
        .limit(20)
        .all()
    )

    confidence = calculate_confidence(reports)
    trend = calculate_trend(reports)

    return {
        "station_id": station.id,
        "name": station.name,
        "lat": station.lat,
        "lon": station.lon,
        "gpl_price": station.gpl_price,
        "updated_at": station.updated_at,
        "confidence_score": confidence,
        "trend": trend,
        "address": station.address,
        "brand": station.brand,
        "reports": [
            {
                "id": r.id,
                "station_id": r.station_id,
                "reported_price": r.reported_price,
                "created_at": r.created_at,
            }
            for r in reports
        ],
    }
