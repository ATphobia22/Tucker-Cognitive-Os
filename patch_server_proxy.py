import re

with open('server.ts', 'r') as f:
    content = f.read()

proxy_code = """
  // 5. Proxy endpoints for external GIS services
  app.get("/api/fema-flood-zones", async (req, res) => {
    try {
      const bbox = req.query.bbox as string;
      const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/28/query`;
      const params = new URLSearchParams({
        where: "1=1",
        outFields: "FLD_ZONE,ZONE_SUBTY",
        geometry: bbox,
        geometryType: "esriGeometryEnvelope",
        inSR: "4326",
        spatialRel: "esriSpatialRelIntersects",
        outSR: "4326",
        f: "geojson"
      });
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) throw new Error(`FEMA API responded with status: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("FEMA Proxy Error:", error);
      res.status(500).json({ type: "FeatureCollection", features: [], error: error.message });
    }
  });

  app.get("/api/historic-sites", async (req, res) => {
    try {
      const bbox = req.query.bbox as string;
      const url = `https://maps.indiana.edu/arcgis/rest/services/Demographics/Historic_Sites_IDNR/MapServer/0/query`;
      const params = new URLSearchParams({
        where: "1=1",
        outFields: "*",
        geometry: bbox,
        geometryType: "esriGeometryEnvelope",
        inSR: "4326",
        spatialRel: "esriSpatialRelIntersects",
        outSR: "4326",
        f: "geojson"
      });
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) throw new Error(`IndianaMap API responded with status: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Historic Sites Proxy Error:", error);
      res.status(500).json({ type: "FeatureCollection", features: [], error: error.message });
    }
  });

  // Serve static assets or mount Vite dev server
"""

content = content.replace('  // Serve static assets or mount Vite dev server\n', proxy_code)

with open('server.ts', 'w') as f:
    f.write(content)
