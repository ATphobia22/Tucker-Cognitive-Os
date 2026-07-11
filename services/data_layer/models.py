from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime, timezone

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, index=True, nullable=False)
    email = Column(String(256), unique=True, index=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    security_level = Column(Integer, default=10)  # Level 10 Aligned
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class LeveeFeature(Base):
    __tablename__ = "levee_features"
    
    id = Column(Integer, primary_key=True, index=True)
    levee_id = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(256), nullable=False)
    river_system = Column(String(128), index=True)  # Wabash or Ohio Rivers
    station_start = Column(Float)
    station_end = Column(Float)
    crest_elevation_ft = Column(Float)
    design_stage_ft = Column(Float)
    geojson_geometry = Column(Text, nullable=False)  # Stored as WKT/GeoJSON string for flexible environment parsing
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class HydraulicModel(Base):
    __tablename__ = "hydraulic_models"
    
    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(64), unique=True, index=True, nullable=False)
    scenario_name = Column(String(128), nullable=False)
    manning_override = Column(Float, default=0.035)
    boundary_inflow_cfs = Column(Float, default=125000.0)
    simulated_peak_elevation_ft = Column(Float)
    is_fema_compliant = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    compiled_by_id = Column(Integer, ForeignKey("users.id"))
    
    compiled_by = relationship("User")

class GaugeTelemetry(Base):
    __tablename__ = "gauge_telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    gauge_id = Column(String(64), index=True, nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    water_level_stage_ft = Column(Float, nullable=False)
    discharge_cfs = Column(Float)
    temperature_c = Column(Float)
    seal_hash = Column(String(64))  # Sovereign Ledger SHA-256 block hash
