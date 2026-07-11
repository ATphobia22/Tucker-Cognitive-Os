import re

with open('src/console/CesiumGlobeViewer.tsx', 'r') as f:
    content = f.read()

# Replace internalLayers usage
old_internal_layers = """  const [internalLayers, setInternalLayers] = useState<string[]>(["elev", "rivers", "levees", "geology", "parcels"]);"""
content = content.replace(old_internal_layers, "")

# Add vegetationGroupRef
old_refs = """  const parcelsGroupRef = useRef<THREE.Group | null>(null);
  const geologyGroupRef = useRef<THREE.Group | null>(null);"""
new_refs = """  const parcelsGroupRef = useRef<THREE.Group | null>(null);
  const geologyGroupRef = useRef<THREE.Group | null>(null);
  const vegetationGroupRef = useRef<THREE.Group | null>(null);"""
content = content.replace(old_refs, new_refs)

old_geology_setup = """    // 6. Create Subsurface Geology Strata Volumes (Visualized beneath the terrain)"""
new_vegetation_setup = """    // Vegetation Layer Setup
    const vegetationGroup = new THREE.Group();
    scene.add(vegetationGroup);
    vegetationGroupRef.current = vegetationGroup;

    for (let i = 0; i < 200; i++) {
      const vx = (Math.random() - 0.5) * 40;
      const vz = (Math.random() - 0.5) * 40;
      
      const gridX = Math.floor(((vx + 25) / 50) * gridDim);
      const gridZ = Math.floor(((vz + 25) / 50) * gridDim);
      if (gridX >= 0 && gridX < gridDim && gridZ >= 0 && gridZ < gridDim) {
        const h = terrainGrid.current[gridZ * gridDim + gridX];
        if (h > -1.0) { // Only place trees above typical water level
          const treeGeo = new THREE.ConeGeometry(0.3, 1.5, 4);
          const treeMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.9 });
          const tree = new THREE.Mesh(treeGeo, treeMat);
          tree.position.set(vx, h + 0.75, vz);
          vegetationGroup.add(tree);
        }
      }
    }

    // 6. Create Subsurface Geology Strata Volumes (Visualized beneath the terrain)"""
content = content.replace(old_geology_setup, new_vegetation_setup)

old_sync = """    // Toggle Geology layer
    if (geologyGroupRef.current) {
      geologyGroupRef.current.visible = internalLayers.includes("geology");
    }

    // Clear and Redraw Lineage Parcels in 3D
    if (parcelsGroupRef.current) {
      // Clean up existing meshes
      while (parcelsGroupRef.current.children.length > 0) {
        const obj = parcelsGroupRef.current.children[0];
        parcelsGroupRef.current.remove(obj);
      }

      if (internalLayers.includes("parcels")) {"""

new_sync = """    if (vegetationGroupRef.current) {
      vegetationGroupRef.current.visible = activeLayers.vegetation;
    }

    // Clear and Redraw Lineage Parcels in 3D
    if (parcelsGroupRef.current) {
      // Clean up existing meshes
      while (parcelsGroupRef.current.children.length > 0) {
        const obj = parcelsGroupRef.current.children[0];
        parcelsGroupRef.current.remove(obj);
      }

      if (true) {"""

content = content.replace(old_sync, new_sync)

content = content.replace("}, [activeLayers, internalLayers, parcels]);", "}, [activeLayers, parcels]);")
content = content.replace("}, [activeLayers, parcels]);", "}, [activeLayers, parcels]);")

with open('src/console/CesiumGlobeViewer.tsx', 'w') as f:
    f.write(content)
