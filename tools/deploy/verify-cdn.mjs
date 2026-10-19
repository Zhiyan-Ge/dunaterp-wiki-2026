// Read-only integrity check for every official CDN object in the release.
import fs from 'node:fs';
import crypto from 'node:crypto';
const manifest = JSON.parse(fs.readFileSync('docs/igem-cdn-assets.json', 'utf8'));
const objects = [...new Map(manifest.map(asset => [asset.url, asset])).values()];
let next = 0;
const failures = [];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < objects.length) {
    const asset = objects[next++];
    try {
      const response = await fetch(asset.url, { headers: { Origin: 'https://2026.igem.wiki' }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const hash = crypto.createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
      if (hash !== asset.sha256) throw new Error('SHA-256 mismatch');
      if (asset.source.startsWith('fonts/') || asset.source === 'researcher-sheet.png') {
        const cors = response.headers.get('access-control-allow-origin');
        if (cors !== '*' && cors !== 'https://2026.igem.wiki') throw new Error('Missing cross-origin permission');
      }
    } catch (error) { failures.push({ source: asset.source, url: asset.url, error: error.message }); }
  }
}));
console.log(JSON.stringify({ checked: objects.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
