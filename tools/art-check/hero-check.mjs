import assert from 'node:assert/strict';
import { installShim } from './canvas2d.mjs';
installShim();
const { prepareHero, getHeroSheet, HERO_W, HERO_H } = await import('./.out/entry.js');
assert.throws(getHeroSheet, /Prepare/);
const pending = prepareHero();
assert.equal(prepareHero(), pending, 'Concurrent renderers share one image load');
assert.throws(getHeroSheet, /Prepare/, 'The atlas is not exposed before image decoding');
await pending;
const sheet = getHeroSheet();
for (const direction of ['down', 'up', 'left', 'right']) {
  assert.equal(sheet[direction].length, 4);
  const unique = new Set();
  for (const frame of sheet[direction]) {
    assert.deepEqual([frame.w, frame.h], [HERO_W, HERO_H]);
    const pixels = frame.canvas.data;
    assert.ok(pixels.some((value, i) => i % 4 === 3 && value === 255));
    assert.equal(pixels[3], 0, 'Background stays transparent');
    assert.ok(Array.from({length: HERO_W}, (_, x) => pixels[((HERO_H - 1) * HERO_W + x) * 4 + 3]).includes(255), 'Feet share the bottom baseline');
    assert.ok(Array.from({length: HERO_H}, (_, y) => [pixels[y * HERO_W * 4 + 3], pixels[((y + 1) * HERO_W - 1) * 4 + 3]]).flat().every(a => a === 0), 'Arms and coat have unclipped side padding');
    unique.add(Buffer.from(pixels).toString('base64'));
  }
  assert.ok(unique.size >= 3, 'Walking has distinct authored poses');
}
assert.notDeepEqual(sheet.down[0].canvas.data, sheet.up[0].canvas.data, 'Rear view is distinct from the face');
await prepareHero();
assert.equal(getHeroSheet(), sheet, 'Completed frames are cached');
console.log('Hero loading, frame extraction, transparency and foot alignment pass');
