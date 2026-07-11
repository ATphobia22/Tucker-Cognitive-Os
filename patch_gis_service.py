import re

with open('src/services/gisService.ts', 'r') as f:
    content = f.read()

new_fema = """export async function fetchFemaFloodZones(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/fema-flood-zones`;
  const params = new URLSearchParams({
    bbox: bbox.join(',')
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch FEMA data');
    return await res.json();
  } catch (error) {
    console.error("FEMA API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}"""

old_fema_regex = r'export async function fetchFemaFloodZones\([\s\S]*?^}'

content = re.sub(old_fema_regex, new_fema, content, flags=re.MULTILINE | re.M)

new_inmap = """export async function fetchIndianaHistoricSites(bbox: [number, number, number, number]): Promise<GeoJSONFeatureCollection> {
  const url = `/api/historic-sites`;
  const params = new URLSearchParams({
    bbox: bbox.join(',')
  });

  try {
    const res = await fetch(`${url}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch INMap data');
    return await res.json();
  } catch (error) {
    console.error("INMap API Error:", error);
    return { type: "FeatureCollection", features: [] };
  }
}"""

old_inmap_regex = r'export async function fetchIndianaHistoricSites\([\s\S]*?^}'
content = re.sub(old_inmap_regex, new_inmap, content, flags=re.MULTILINE | re.M)

with open('src/services/gisService.ts', 'w') as f:
    f.write(content)
