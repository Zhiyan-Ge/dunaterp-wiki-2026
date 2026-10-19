import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assetUrl } from '../../outputs/deploy-data/entry.js';
const mapping = JSON.parse(fs.readFileSync('src/content/deploy-assets.json', 'utf8'));
for (const [source, target] of Object.entries(mapping)) {
  assert.equal(assetUrl(source), assetUrl('/' + source));
  if (source.endsWith(".docx")) {
    assert.ok(assetUrl(source).endsWith("/" + target));
    assert.ok(fs.existsSync("public/" + target));
    continue;
  }
  assert.equal(assetUrl(source), target, source);
  assert.ok(target.startsWith('https://static.igem.wiki/teams/6212/wiki/'), target);
}
for (const external of ['https://example.org/figure.png', 'data:image/png;base64,test', 'blob:local-test', '//example.org/image.png']) assert.equal(assetUrl(external), external);
assert.equal(assetUrl('/data:image/png;base64,test'), 'data:image/png;base64,test');
console.log('Official CDN mappings, external links and offline data URLs pass');
