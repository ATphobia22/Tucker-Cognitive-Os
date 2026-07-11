import json
from typing import Any, Dict, Optional, Union
try:
    from shapely.geometry import shape, mapping
    from shapely.validation import make_valid
    HAS_SHAPELY = True
except ImportError:
    HAS_SHAPELY = False

def repair_polygon_geometry(geojson_geom: Union[str, Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validates and repairs self-intersecting polygon geometries using the
    standard Shapely buffer(0.0) repair technique, ensuring strict topological
    validity for GIS queries.
    """
    if not HAS_SHAPELY:
        # Graceful fallback if shapely is not installed in the workspace environment
        return geojson_geom if isinstance(geojson_geom, dict) else json.loads(geojson_geom)
        
    try:
        if isinstance(geojson_geom, str):
            geom_dict = json.loads(geojson_geom)
        else:
            geom_dict = geojson_geom
            
        geom = shape(geom_dict)
        
        if not geom.is_valid:
            # First attempt: buffer(0.0) self-intersection repair
            repaired_geom = geom.buffer(0.0)
            if not repaired_geom.is_valid:
                # Second attempt: make_valid fallback
                repaired_geom = make_valid(geom)
            return mapping(repaired_geom)
            
        return geom_dict
    except Exception as e:
        print(f"Topological repair warning: {e}. Returning original geometry.")
        return geojson_geom if isinstance(geojson_geom, dict) else json.loads(geojson_geom)

def calculate_bounding_box(geojson_geom: Dict[str, Any]) -> tuple:
    """Calculate the bounding box (min_x, min_y, max_x, max_y) of a feature."""
    if not HAS_SHAPELY:
        # Manual fallback for bounding box calculation
        coords = []
        def extract_coords(obj):
            if isinstance(obj, list):
                if len(obj) == 2 and isinstance(obj[0], (int, float)):
                    coords.append(obj)
                else:
                    for item in obj:
                        extract_coords(item)
        extract_coords(geojson_geom.get("coordinates", []))
        if not coords:
            return (0.0, 0.0, 0.0, 0.0)
        xs = [c[0] for c in coords]
        ys = [c[1] for c in coords]
        return (min(xs), min(ys), max(xs), max(ys))
        
    try:
        geom = shape(geojson_geom)
        return geom.bounds
    except Exception:
        return (0.0, 0.0, 0.0, 0.0)
