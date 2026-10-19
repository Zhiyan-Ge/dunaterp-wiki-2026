# iGEM deployment — 19 October 2026

The official release is based on GitHub main `1fa1e4d` (file tree `659df7d`).
It preserves the original iGEM GitLab history, team environment and CC BY 4.0
licence. The user requested bundled local assets for this deployment.

The iGEM server rejects Git packs over 11 MiB. Assets were transferred in five
small commits before the final main update, so the incomplete transfer did not
publish a partial website. The first build completed, but its artifact upload
failed with HTTP 413 because the bundled site was too large.

The deployment now uses local WebP assets and an alias map. All 43 scientific
PNGs remain in source, and their deployed WebP equivalents were checked for exact
decoded RGBA equality at the original dimensions. Identical figures share one
output file. Outreach and hardware photographs have web-sized derivatives;
original photographs remain in commit `c462735`. Encoding parameters and source
hashes are recorded in `deployment-assets.json`.

`npm run deploy:prepare` bundles the actual page data, validates asset aliases,
checks every referenced page asset, removes only unused deployment figures and
obsolete WOFF/TTF fallbacks, and enforces a 9.5 MiB estimated ZIP budget. The
fallback article illustration and dynamically selected wet-lab SVGs are kept.
WOFF2 maths fonts remain. The checked package estimate is 9.32 MiB.

CI builds from the locked npm dependencies, prepares the deployment, and replaces
the artifact directory with the prepared build. Fastzip uses its `slowest`
compression setting to keep the archive within the upload limit. The original
source asset directory is retained outside the published artifact during the job.

Local validation: ESLint, TypeScript/production build, all 43 scientific image
pixel comparisons, asset alias/existence checks, and the deployment size gate.
