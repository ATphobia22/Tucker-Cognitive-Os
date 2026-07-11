import re

with open('src/components/SovereignCockpit.tsx', 'r') as f:
    content = f.read()

content = content.replace('import TurboVecCompactor from "../console/TurboVecCompactor";\n', '')
content = content.replace('<TurboVecCompactor />', '')

with open('src/components/SovereignCockpit.tsx', 'w') as f:
    f.write(content)
