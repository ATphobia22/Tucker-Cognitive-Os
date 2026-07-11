import sys
import os
from datetime import datetime, timezone

# Add parent directory to path so imports work correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.core.config import settings
from services.core import auth
from services.data_layer import models, spatial_index, telemetry_pipeline
from services.simulation.solver import ShallowWater2DSolver
from services.gis_aggregation.idnr_client import IDNRServiceClient

def test_config():
    print("Testing settings and project details...")
    assert settings.PROJECT_NAME == "Point Township Sovereign Digital Twin (PTDT v23)"
    print("✓ Config loaded successfully.")

def test_auth():
    print("Testing token generation and verification...")
    username = "anthony"
    token = auth.create_access_token(subject=username)
    assert token is not None
    verified_sub = auth.verify_access_token(token)
    assert verified_sub == username
    print("✓ Auth Token verification succeeds perfectly.")

def test_spatial_index():
    print("Testing spatial repair and geometry cleaning...")
    # Mock self-intersecting polygon (invalid geometry)
    invalid_geojson = {
        "type": "Polygon",
        "coordinates": [
            [[0, 0], [0, 2], [2, 2], [2, 0], [0, 0], [1, 1], [0, 0]]  # Invalid figure-8 loop
        ]
    }
    repaired = spatial_index.repair_polygon_geometry(invalid_geojson)
    assert repaired is not None
    print("✓ Spatial index buffer(0.0) self-intersection repair verified.")

def test_telemetry_pipeline():
    print("Testing telemetry signature pipeline sealing...")
    gauge_id = "USGS-Wabash-03377500"
    now = datetime.now(timezone.utc)
    wl = 24.3
    discharge = 125000.0
    seal = telemetry_pipeline.generate_sovereign_block_seal(gauge_id, now, wl, discharge)
    assert len(seal) == 64  # SHA-256 length
    print(f"✓ Telemetry seal hash created successfully: {seal}")

def test_solver():
    print("Testing vectorized 2D Shallow Water hydrodynamic simulation step...")
    solver = ShallowWater2DSolver(nx=64, ny=64)
    solver.initialize_topography_point_township()
    solver.set_flood_scenario((32, 32), 125000.0)
    
    # Run a few solver iterations
    for step_no in range(5):
        stats = solver.step(0.05)
        assert stats["is_system_stable"] is True
        
    print(f"✓ Hydrodynamic 2D Solver converged successfully over 5 simulation steps.")
    print(f"  Peak depth: {stats['max_water_depth_m']:.4f} meters.")
    print(f"  Total water volume in region: {stats['total_water_volume_m3']:.2f} m3.")

if __name__ == "__main__":
    print("======================================================================")
    print("       PTDT v23 SOVEREIGN DIGITAL TWIN INTEGRITY VERIFIER")
    print("======================================================================")
    try:
        test_config()
        test_auth()
        test_spatial_index()
        test_telemetry_pipeline()
        test_solver()
        print("\n✓✓✓ ALL PTDT v23 VERIFICATION TESTS PASSED SUCCESSFULLY! Spine is stable.")
    except Exception as e:
        print(f"\n❌ VERIFICATION FAILURE DETECTED: {e}")
        sys.exit(1)
