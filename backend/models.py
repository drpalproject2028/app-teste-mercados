from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from database import Base


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    location = Column(Geometry("POINT", srid=4326))
    gpl_price = Column(Float)
    address = Column(String(500))
    brand = Column(String(100))
    updated_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship("UserReport", back_populates="station")

    __table_args__ = (
        Index("idx_stations_location", "location", postgresql_using="gist"),
    )


class UserReport(Base):
    __tablename__ = "user_reports"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    reported_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    station = relationship("Station", back_populates="reports")

    __table_args__ = (
        Index("idx_reports_station_created", "station_id", created_at.desc()),
    )
