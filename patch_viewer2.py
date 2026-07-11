import re

with open('src/console/CesiumGlobeViewer.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'  const toggleLayer = \(layer: string\) => {[\s\S]*?  };\n', '', content)
content = content.replace('internalLayers.includes(lay.id)', 'true')

with open('src/console/CesiumGlobeViewer.tsx', 'w') as f:
    f.write(content)
