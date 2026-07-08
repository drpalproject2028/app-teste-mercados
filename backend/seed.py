from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from models import Station, UserReport

MOCK_STATIONS = [
    {"name": "Galp Almada", "lat": 38.6790, "lon": -9.1565, "price": 0.649, "address": "Av. 25 de Abril, Almada", "brand": "Galp"},
    {"name": "Repsol Amadora", "lat": 38.7530, "lon": -9.2340, "price": 0.669, "address": "Estrada Nacional 117, Amadora", "brand": "Repsol"},
    {"name": "BP Sintra", "lat": 38.7980, "lon": -9.3810, "price": 0.659, "address": "Av. Heliodoro Salgado, Sintra", "brand": "BP"},
    {"name": "Prio Loures", "lat": 38.8300, "lon": -9.1700, "price": 0.639, "address": "EN 8, Loures", "brand": "Prio"},
    {"name": "Cepsa Cascais", "lat": 38.6970, "lon": -9.4210, "price": 0.679, "address": "Av. Marginal, Cascais", "brand": "Cepsa"},
    {"name": "Galp Parque das Nacoes", "lat": 38.7680, "lon": -9.0940, "price": 0.655, "address": "Av. Dom Joao II, Lisboa", "brand": "Galp"},
    {"name": "Galp Matosinhos", "lat": 41.1830, "lon": -8.6890, "price": 0.645, "address": "Rua de Godinho, Matosinhos", "brand": "Galp"},
    {"name": "Repsol Vila Nova de Gaia", "lat": 41.1240, "lon": -8.6120, "price": 0.665, "address": "Av. da Republica, Gaia", "brand": "Repsol"},
    {"name": "BP Maia", "lat": 41.2360, "lon": -8.6200, "price": 0.655, "address": "EN 14, Maia", "brand": "BP"},
    {"name": "Prio Porto Centro", "lat": 41.1580, "lon": -8.6290, "price": 0.635, "address": "Rua de Camoes, Porto", "brand": "Prio"},
    {"name": "Galp Faro", "lat": 37.0194, "lon": -7.9322, "price": 0.672, "address": "EN 125, Faro", "brand": "Galp"},
    {"name": "Repsol Albufeira", "lat": 37.0882, "lon": -8.2500, "price": 0.685, "address": "Av. dos Descobrimentos, Albufeira", "brand": "Repsol"},
    {"name": "BP Portimao", "lat": 37.1320, "lon": -8.5370, "price": 0.668, "address": "EN 125, Portimao", "brand": "BP"},
    {"name": "Galp Coimbra", "lat": 40.2033, "lon": -8.4103, "price": 0.658, "address": "Av. Fernao de Magalhaes, Coimbra", "brand": "Galp"},
    {"name": "Prio Leiria", "lat": 39.7437, "lon": -8.8070, "price": 0.642, "address": "IC2, Leiria", "brand": "Prio"},
]


def seed_database(db: Session):
    existing = db.query(Station).count()
    if existing > 0:
        return

    now = datetime.utcnow()
    random.seed(42)

    for data in MOCK_STATIONS:
        station = Station(
            name=data["name"],
            lat=data["lat"],
            lon=data["lon"],
            location=from_shape(Point(data["lon"], data["lat"]), srid=4326),
            gpl_price=data["price"],
            address=data["address"],
            brand=data["brand"],
            updated_at=now - timedelta(hours=random.randint(1, 12)),
        )
        db.add(station)
        db.flush()

        num_reports = random.randint(2, 5)
        for j in range(num_reports):
            hours_ago = random.uniform(2, 60)
            variation = random.uniform(-0.01, 0.01)
            report = UserReport(
                station_id=station.id,
                reported_price=round(data["price"] + variation, 3),
                created_at=now - timedelta(hours=hours_ago),
            )
            db.add(report)

    db.commit()
