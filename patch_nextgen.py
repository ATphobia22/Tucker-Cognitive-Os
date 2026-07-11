import re

with open('src/components/NextGenDigitalTwin.tsx', 'r') as f:
    content = f.read()

content = content.replace('three/examples/jsm/controls/OrbitControls', 'three/addons/controls/OrbitControls.js')

with open('src/components/NextGenDigitalTwin.tsx', 'w') as f:
    f.write(content)
