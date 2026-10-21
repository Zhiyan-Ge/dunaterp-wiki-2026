// Optional visual QA; PLAYWRIGHT_MODULE points to an external Playwright install.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const shots = fs.mkdtempSync(path.join(os.tmpdir(), 'dunaterp-wet-lab-'));
const wetLabPaths = ['project-description', 'engineering', 'experiments', 'safety-and-security'];
const otherArticlePaths = ['transcriptomics', 'model', 'human-practices', 'team'];
process.env.VITE_BASE_PATH = '/dunaterp-wiki-2026/';
const server = await createServer({ root, server: { host: '127.0.0.1', port: 4177, strictPort: true } });
await server.listen();
const playwright = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = playwright.chromium ?? playwright.default.chromium;
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    for (const slug of wetLabPaths) {
      await page.goto(`http://127.0.0.1:4177/dunaterp-wiki-2026/${slug}`);
      await page.locator('.article-page--wet-lab .article-hero').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const hero = await page.locator('.article-hero').evaluate(element => {
        const style = getComputedStyle(element);
        const titleStyle = getComputedStyle(element.querySelector('h1'));
        return { background: style.backgroundImage, titleAlign: titleStyle.textAlign };
      });
      assert.match(hero.background, /great-salt-lake-iss063-e-40184\.jpg/);
      assert.doesNotMatch(hero.background, /gradient/);
      assert.equal(hero.titleAlign, 'center');
      assert.equal(await page.locator('.article-hero .page-eyebrow, .article-hero .article-intro').count(), 0);
      const heroBounds = await page.locator('.article-hero').boundingBox();
      const titleBounds = await page.locator('.article-hero h1').boundingBox();
      assert.ok(titleBounds.x >= heroBounds.x && titleBounds.x + titleBounds.width <= heroBounds.x + heroBounds.width, `${width}px ${slug}: title is clipped`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px ${slug}: horizontal overflow`);
    }

    for (const slug of otherArticlePaths) {
      await page.goto(`http://127.0.0.1:4177/dunaterp-wiki-2026/${slug}`);
      await page.locator('.article-hero').waitFor();
      assert.equal(await page.locator('.article-hero .article-intro').count(), 0, `${slug}: right-hand hero description returned`);
    }

    await page.goto('http://127.0.0.1:4177/dunaterp-wiki-2026/experiments');
    await page.screenshot({ path: path.join(shots, `${width}-experiments-hero.png`) });
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`PASS ${width}px: Wet Lab photo headers and article hero copy`);
  }
  console.log(`Screenshots: ${shots}`);
} finally {
  await browser.close();
  await server.close();
}
