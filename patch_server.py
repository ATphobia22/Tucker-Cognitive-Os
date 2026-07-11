import re

with open('server.ts', 'r') as f:
    content = f.read()

# Replace everything from `// 5. Proxy endpoints` to `// Serve static assets`
pattern = r'// 5\. Proxy endpoints for external GIS services[\s\S]*?// Serve static assets or mount Vite dev server'

new_proxy = """// 5. Proxy endpoints for external GIS services
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
      console.error("FEMA Proxy Error:", error.message, "- Falling back to mock data");
      res.json({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { FLD_ZONE: "AE", ZONE_SUBTY: "" },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [-88.05, 37.85],
                [-87.95, 37.85],
                [-87.95, 37.95],
                [-88.05, 37.95],
                [-88.05, 37.85]
              ]]
            }
          },
          {
            type: "Feature",
            properties: { FLD_ZONE: "X", ZONE_SUBTY: "0.2 PCT ANNUAL CHANCE FLOOD HAZARD" },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [-88.1, 37.8],
                [-88.05, 37.8],
                [-88.05, 37.85],
                [-88.1, 37.85],
                [-88.1, 37.8]
              ]]
            }
          }
        ]
      });
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${url}?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`IndianaMap API responded with status: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Historic Sites Proxy Error:", error.message, "- Falling back to mock data");
      res.json({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { NAME: "Tucker Homestead" },
            geometry: {
              type: "Point",
              coordinates: [-88.0, 37.9]
            }
          },
          {
            type: "Feature",
            properties: { NAME: "Point Township Church" },
            geometry: {
              type: "Point",
              coordinates: [-87.95, 37.85]
            }
          }
        ]
      });
    }
  });

  // Serve static assets or mount Vite dev server"""

content = re.sub(pattern, new_proxy, content)

with open('server.ts', 'w') as f:
    f.write(content)

