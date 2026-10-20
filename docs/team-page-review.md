# Team page local review

The `/team` page keeps the current 2026 header, pixel borders, colours, contents
navigation, reading progress and footer. The section order and portrait/name/major
structure follow https://2025.igem.wiki/scu-china/members .

- Group Leaders: 9 students from the 2023 cohort, displayed first.
- Team Members: 17 students from the 2024 cohort.
- The first three leaders are Xin Xiong, Hongyi Wang and Kaiting Wei, in that
  order. Remaining leaders and all members are sorted by family-name pinyin,
  then given-name pinyin. Names display given name followed by family name.
- Yongyuan Mi: `Ecology`. Tianyu Zhou, Zhiyan Ge and Keyu Liu:
  `Computational Biology`. Yinuo Wang: `Computational Science`. Jiaxuan Chen:
  `Materials Engineering`. Hao Wang: `Pharmacy`. Other majors remain
  `Biological Science`. Edit entries in `src/content/team.ts`.
- Existing 2025 spellings are retained for returning students. Other names use
  standard pinyin for human review.
- Team Photos and the team-page hero use only the supplied total-team photo.
- `_1` originals take priority: Hengyu Dai, Yihan Dai, Ziyang Zhou, Xin Xiong,
  Zhutian Mao and Tianyu Zhou, Jiaxuan Chen, Hao Wang, Xinyu Wang and Ziqi Wang.

## Photos

The official Uploads UI limits each batch to 10 MB. The user approved processed
web copies after being shown that this excludes some original 13 MB photos.
`tools/import-team-photos.py` records the selections and individual framing.
It creates consistent 4:5 portraits at up to 1600 x 2000 pixels (without upscaling),
using WebP quality 95. The complete group photo is 4800 x 3200 pixels at quality
95. No original is modified. No portrait is generated or retouched by Codex.

`docs/team-photo-sources.json` records source and exported SHA-256 hashes,
original dimensions, exported dimensions and file sizes. The generated web
copies are ignored in Git because official iGEM Uploads hosts these assets.

## Publication

All 27 current photo assets were uploaded through the team's official Wiki Uploads
interface to the `team` folder. The actual returned links are recorded in
`src/content/deploy-assets.json`, `docs/igem-cdn-assets.json` and the photo source
manifest. WebP is stored unchanged by the official tool.
Run `npm run build` and `npm run deploy:prepare` after mapping the returned URLs.
The user approved GitLab push and Wiki publication on 20 October 2026 after
reviewing the local page and subsequent portrait/major corrections.

## Validation

- TypeScript and production build: passed.
- Official asset mapping and deployment packaging: passed (1.28 MiB archive estimate).
- All 27 source-photo SHA-256 hashes remain unchanged.
- All 26 exported portraits have an exact 4:5 aspect ratio.
- Browser verification: all 26 portraits and the complete group photo load from
  the returned official CDN URLs; no Chinese text in the team-page content.
- Desktop three-column and mobile two-column layouts checked; no horizontal overflow.
- A direct Python HTTPS byte-hash check of CDN downloads timed out during TLS;
  CDN rendering was verified in the browser instead.
- Publication approved by the user. Working branch: `codex/team-roster-local`.

## Updated portraits and order

The three newly supplied `_1` photos for Xin Xiong, Zhutian Mao and Tianyu Zhou
replace their earlier portraits. They were uploaded through the official UI
with hash-suffixed names to avoid stale CDN caching. The earlier objects remain
available for review, while the local page points to the new official URLs.
The requested first-three ordering and English major corrections are applied.

## Additional 2024-cohort members

Jiaxuan Chen and Hao Wang join the member roster, bringing it to 17 people
(26 portraits overall). Their supplied `_1` photos are framed to 4:5, with
individual alignment to keep the head and shoulders inside the frame. The newly
available `_1` versions for Xinyu Wang and Ziqi Wang also replace their standard
photos, following the user's standing preference. All four web copies are
submitted using the official Uploads interface and new hash-suffixed filenames.
The five user-provided major corrections are recorded in `src/content/team.ts`.
