import re

with open('server.ts', 'r') as f:
    content = f.read()

pattern = r'const response = await fetch\(`\$\{url\}\?\$\{params\.toString\(\)\}`\);'
replacement = """const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${url}?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);"""

content = content.replace(pattern, replacement)

with open('server.ts', 'w') as f:
    f.write(content)
