# iGEM deployment

The official release follows GitHub main `1fa1e4d` (file tree `659df7d`), with the
animated researcher replacement. It preserves the official GitLab history,
SCU-China team environment and CC BY 4.0 licence. Deployment changes only affect
asset delivery and packaging, not scientific content or numerical results.

The official Teams wiki FAQ states a **5 MB** Pages artifact limit. Bundled-asset
attempts at `c462735` and `c1938b2` built successfully but were rejected with HTTP
413. The user then authorised official iGEM asset uploads and publication.

## Official asset hosting

Assets are uploaded under `https://static.igem.wiki/teams/6212/wiki/`. The manifest
`igem-cdn-assets.json` records each original source path, official URL, original
SHA-256, uploaded SHA-256 and size. Names contain a content hash so updates do not
reuse URLs subject to the CDN's 24-hour cache.

Original full-quality assets come from the authoritative GitHub tree. PNG/JPEG
files are encoded as **lossless WebP**, retaining original dimensions and
rendered pixels. All 48 source photographs/scientific PNGs retain identical RGBA
bytes; the researcher atlas differs only in RGB values beneath fully transparent
pixels, with identical visible colours and alpha. The upload tool stores WebP and SVG unchanged; this avoids
its automatic AVIF conversion. Existing WebP, SVG, PDF and WOFF2 files are
uploaded byte-for-byte. The upload service rejects binary DOCX files as non-UTF-8
text, so both original DOCX downloads (about 63 KiB total) stay in the Pages
artifact. Duplicate images share one CDN object. An unused MSVC
compiler debug database, misleadingly named `vc140.pdb`, is not a molecular
structure or a website dependency and is excluded.

`src/content/deploy-assets.json` maps source asset paths to official CDN URLs.
The article renderer, wet-lab responsive SVGs and animated researcher use that
resolver. `VITE_LOCAL_ASSETS=1` uses the previous local aliases and embedded PNG
for the offline preview and art-check tools. Source assets remain in Git.

## Build and validation

`npm run build` checks TypeScript and builds the site. `npm run deploy:prepare`
validates page asset mappings, replaces generated KaTeX font URLs and the favicon
with their official CDN URLs, and omits CDN-hosted binary assets from the Pages artifact.
It enforces a 4.5 MiB estimated ZIP budget, below the official 5 MB limit. The
checked estimate is approximately 1.02 MiB; the published bundle contains the
application code, styles and local interactive widget.

CI uses Node 22 and the locked npm dependencies. It publishes the prepared build
on the official default branch. Checks include ESLint, TypeScript, production
build, asset URL validation, lossless image pixel comparisons, CDN SHA-256 checks,
and the researcher animation/frame/transparency/foot-alignment checks.
