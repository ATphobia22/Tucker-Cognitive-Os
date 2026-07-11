import * as THREE from 'three';

export interface GeoJSONFeature {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export async function fetchFemaFloodZones(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  // FEMA NFHL S_Fld_Haz_Ar (Layer 28)
  const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query`;
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "FLD_ZONE,ZONE_SUBTY",
    geometry: bbox.join(','),
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outSR: "4326",
    f: "geojson"
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch FEMA data');
    return await res.json();
  } catch (error) {
    console.error("FEMA API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}

export async function fetchIndianaHistoricSites(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `https://maps.indiana.edu/arcgis/rest/services/Demographics/Historic_Sites_IDNR/MapServer/0/query`;
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "*",
    geometry: bbox.join(','),
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outSR: "4326",
    f: "geojson"
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch INMap data');
    return await res.json();
  } catch (error) {
    console.error("INMap API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}
