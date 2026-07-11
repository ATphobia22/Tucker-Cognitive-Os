import re

with open('src/console/CesiumGlobeViewer.tsx', 'r') as f:
    content = f.read()

# Remove the layer toggles from the UI
toggles_regex = r'        \{/\* Dynamic Layer Toggles \*/\}[\s\S]*?        </div>'
content = re.sub(toggles_regex, '', content)

with open('src/console/CesiumGlobeViewer.tsx', 'w') as f:
    f.write(content)
