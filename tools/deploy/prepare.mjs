// Keep the Pages archive below the iGEM upload limit. Source assets remain in
// Git; only unused deployment images and obsolete font fallbacks are omitted.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pages } from '../../outputs/deploy-data/entry.js';
const mapping = JSON.parse(fs.readFileSync('src/content/deploy-assets.json', 'utf8'));
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const used = new Set();
function visit(value) {
  if (typeof value === 'string') {
    const relative = value.replace(/^\/+/, '');
    if (/^(figures|images|protocols)\//.test(relative)) used.add(mapping[relative] ?? relative);
  } else if (Array.isArray(value)) value.forEach(visit);
  else if (value && typeof value === 'object') Object.values(value).forEach(visit);
}
visit(pages);
used.add('figures/project/salt-strata.svg');
for (const src of used) if (!fs.existsSync(path.join('dist', src))) throw new Error(`Missing published asset: ${src}`);
const removed = [];
for (const file of walk('dist/figures')) {
  const relative = file.slice(5);
  if (/\.svg$/.test(file) && relative.startsWith('figures/wet-lab/')) continue;
  if (/\.(png|jpe?g|webp|svg)$/i.test(file) && !used.has(relative)) {
    fs.unlinkSync(file); removed.push(relative);
  }
}
let allCss = '';
for (const file of walk('dist/assets').filter(f => f.endsWith('.css'))) {
  const css = fs.readFileSync(file, 'utf8').replace(/,\s*url\([^)]*\.(?:woff|ttf)["']?\)\s*format\([^)]*\)/g, '');
  fs.writeFileSync(file, css); allCss += css;
}
for (const file of walk('dist/assets').filter(f => /\.(woff|ttf)$/.test(f))) {
  if (!allCss.includes(path.basename(file))) fs.unlinkSync(file);
}
const files = walk('dist');
const estimate = files.reduce((sum, file) => sum + zlib.deflateRawSync(fs.readFileSync(file)).length + 256, 0);
console.log(JSON.stringify({ omittedUnusedImages: removed, estimatedArchiveMiB: +(estimate / 2 ** 20).toFixed(2), files: files.length }, null, 2));
if (estimate > 9.5 * 2 ** 20) throw new Error('The Pages archive exceeds the 9.5 MiB deployment budget');
