# Playable researcher — 19 October 2026

`src/assets/researcher-sheet.png` replaces the former 16×32 character grids.
It is a 128×256 transparent RGBA PNG: four 32×64 cells per row, with rows
ordered front (`down`), back (`up`), left, right. Column 0 is standing; movement
cycles through columns 0–3. Both side views are drawn separately.

The built-in OpenAI image generation tool used the character reference supplied
by the user in the change request. The original generation was cropped per pose,
scaled using nearest-neighbour sampling at a common scale, and centered in equal
cells with boots on the final row. Alpha is binary; white coat pixels remain opaque.
The high-resolution image is a design source; the committed sheet is the runtime asset.

`hero.ts` embeds the PNG with Vite's `?inline` import, shares a single asynchronous
load across renderers, validates dimensions, and exposes all 16 frames only after
decoding. The same asset works with iGEM/GitHub base paths and the self-contained
HTML preview. Loading errors use the homepage's existing load-failure UI.

The renderer displays each cell at 20×40 world pixels, centered horizontally at
the existing foot position. Scenery, shadow and the foot collision box are retained.
The stationary pose resumes when movement ends; reduced motion uses frame 0.
The station prompt sits above the taller character.

To revise the artwork, replace the PNG while retaining the cell size, order,
transparent padding and bottom baseline. To adjust map size, edit
`HERO_DISPLAY_W` and `HERO_DISPLAY_H` in `src/pixel/hero.ts` together. A larger
source image alone does not change map size.

Validation: `npm run lint`, `npm run build`, `npm run art:check`, then
`node tools/art-check/hero-check.mjs`. The offline checker decodes the same
embedded PNG as the browser. `npm run preview:single` produces the offline HTML.

## Image generation prompt

Use case: stylized-concept. Asset type: transparent pixel-art game character sprite sheet.
Reference image: supplied scientist character design. Preserve identity: dark tousled green-black hair, lime safety goggles raised on forehead, big green eyes, peach skin, white lab coat with pockets and a small lime/green badge on wearer's left chest, lime shirt, dark teal trousers and boots. Match the reference very closely.
Generate ONE production sprite sheet on a truly transparent background, no white rectangle, no ground shadow, no text, no labels, no grid lines, no props.
Sheet layout MUST be exactly 4 equal columns and 4 equal rows, 16 full-body sprites total. Each cell equal width and height, same character scale, same horizontal center and feet baseline, ample transparent padding, no overlap.
Rows top to bottom: front (facing viewer), back (facing away), left profile (nose points left), right profile (nose points right).
Columns left to right: neutral standing, left leg forward walking, neutral passing pose, right leg forward walking. Arms counter-swing naturally and coat hem responds subtly. Every row uses its designated direction for all four frames. Back has NO eyes or face; side poses have profile face. Right and left coat badges respect actual garment placement.
Pixel art: crisp hard square pixel clusters, limited palette, strong dark outline, no blur, no smoothing, no gradients. Design should read as a detailed 32x64 logical pixel sprite, enlarged consistently in each cell. Keep full hair and boots inside every cell. Overall image portrait 1:2 aspect ratio, each cell about 256 wide x512 high; exactly regular 4x4 layout.


## Verification performed

- ESLint, TypeScript and the production build passed.
- Eight map scenes rendered using the updated offline PNG decoder.
- `hero-check.mjs` passed: shared asynchronous load, all 16 cells, transparent
  backgrounds, distinct walking poses, unclipped arms and common foot baselines.
- Chrome desktop and 390×844 mobile viewports loaded without page errors.
  The real engine turned down/left/up/right correctly and returned to frame 0
  after each movement stopped.
- The self-contained HTML preview was built with the embedded hero asset.
- Existing `interaction-check.mjs` and `prologue-check.mjs` fail at the TRAIL
  lodge and skipped-intro transition assertions respectively. Both failures
  were reproduced on the unchanged base commit `c214de1`; those unrelated tests
  were retained without changing their expectations.
