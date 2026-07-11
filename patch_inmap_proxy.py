import re

with open('server.ts', 'r') as f:
    content = f.read()

inmap_proxy_regex = r'app\.get\("/api/historic-sites"[\s\S]*?\}\);'

new_inmap_proxy = """app.get("/api/historic-sites", async (req, res) => {
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
      // Fallback to mock data
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
  });"""

content = re.sub(inmap_proxy_regex, new_inmap_proxy, content)

with open('server.ts', 'w') as f:
    f.write(content)
