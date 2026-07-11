import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, List

def generate_sovereign_block_seal(gauge_id: str, timestamp: datetime, water_level: float, discharge: float) -> str:
    """
    Computes a SHA-256 cryptographic signature seal matching System Pillar 10 specifications.
    Injects a theological/cybernetic block payload.
    """
    payload_str = f"{gauge_id}-{timestamp.isoformat()}-{water_level:.4f}-{discharge:.2f}-ItIsFinished"
    sha = hashlib.sha256()
    sha.update(payload_str.encode("utf-8"))
    return sha.hexdigest()

def process_telemetry_batch(telemetry_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Validates, filters, and seals a batch of river gauge telemetry records before db insertion.
    Returns the processed and sealed records.
    """
    processed = []
    for record in telemetry_records:
        gauge_id = record.get("gauge_id", "USGS-UNKNOWN")
        water_level = float(record.get("water_level_stage_ft", 0.0))
        discharge = float(record.get("discharge_cfs", 0.0))
        temperature = float(record.get("temperature_c", 15.0))
        
        # Parse or default timestamp
        ts = record.get("timestamp")
        if isinstance(ts, str):
            try:
                timestamp = datetime.fromisoformat(ts.replace("Z", "+00:00"))
            except ValueError:
                timestamp = datetime.now(timezone.utc)
        elif isinstance(ts, datetime):
            timestamp = ts
        else:
            timestamp = datetime.now(timezone.utc)
            
        # Security & Integrity Check - filter extreme spikes/outliers
        if water_level < -10.0 or water_level > 80.0:
            print(f"Skipping telemetry anomaly on {gauge_id}: water level {water_level} ft.")
            continue
            
        # Sign the block
        seal = generate_sovereign_block_seal(gauge_id, timestamp, water_level, discharge)
        
        processed.append({
            "gauge_id": gauge_id,
            "timestamp": timestamp,
            "water_level_stage_ft": water_level,
            "discharge_cfs": discharge,
            "temperature_c": temperature,
            "seal_hash": seal
        })
    return processed
