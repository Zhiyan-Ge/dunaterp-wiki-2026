// iGEM Pages permits a 5 MB build archive; binary assets live on its official CDN.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { pages } from '../../outputs/deploy-data/entry.js';
const mapping = JSON.parse(fs.readFileSync('src/content/deploy-assets.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('docs/igem-cdn-assets.json', 'utf8'));
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
function visit(value) {
  if (typeof value === 'string') {
    const relative = value.replace(/^\/+/, '');
    if (/^(figures|images|protocols)\//.test(relative) && !mapping[relative]) throw new Error(`Missing CDN mapping: ${relative}`);
  } else if (Array.isArray(value)) value.forEach(visit);
  else if (value && typeof value === 'object') Object.values(value).forEach(visit);
}
visit(pages);
const fonts = new Map(manifest.filter(a => a.source.startsWith('fonts/')).map(a => [a.sha256, a.url]));
const fontUrls = new Map();
for (const file of walk('dist/assets').filter(f => f.endsWith('.woff2'))) {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const url = fonts.get(hash);
  if (!url) throw new Error(`Unmapped font: ${file}`);
  fontUrls.set(path.basename(file), url);
}
for (const file of walk('dist/assets').filter(f => f.endsWith('.css'))) {
  let css = fs.readFileSync(file, 'utf8').replace(/,\s*url\([^)]*\.(?:woff|ttf)["']?\)\s*format\([^)]*\)/g, '');
  css = css.replace(/url\(([^)]*\.woff2)\)/g, (_, src) => {
    const clean = src.replace(/["']/g, '');
    const url = fontUrls.get(path.basename(clean));
    if (!url) throw new Error(`Missing font URL: ${src}`);
    return `url("${url}")`;
  });
  fs.writeFileSync(file, css);
}
const index = 'dist/index.html';
fs.writeFileSync(index, fs.readFileSync(index, 'utf8').replace(/href="[^"]*favicon\.svg"/, `href="${mapping['favicon.svg']}"`));
for (const file of walk('dist').filter(f => /\.(png|jpe?g|webp|avif|svg|pdf|pdb|woff2?|ttf)$/i.test(f))) fs.unlinkSync(file);
const files = walk('dist');
const estimate = files.reduce((sum, file) => sum + zlib.deflateRawSync(fs.readFileSync(file)).length + 256, 0);
console.log(JSON.stringify({ estimatedArchiveMiB: +(estimate / 2 ** 20).toFixed(2), files: files.length, hostedAssets: manifest.length }, null, 2));
if (estimate > 4.5 * 2 ** 20) throw new Error('The Pages archive exceeds the 4.5 MiB deployment budget');
