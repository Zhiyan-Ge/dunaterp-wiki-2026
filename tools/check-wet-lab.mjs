// Optional visual QA; PLAYWRIGHT_MODULE points to an external Playwright install.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const protocols = JSON.parse(fs.readFileSync(path.join(root, 'src/content/wet-lab-protocols.json')));
const shots = fs.mkdtempSync(path.join(os.tmpdir(), 'dunaterp-protocols-'));
process.env.VITE_BASE_PATH = '/dunaterp-wiki-2026/';
const server = await createServer({ root, server: { host: '127.0.0.1', port: 4177, strictPort: true } });
await server.listen();
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4177/dunaterp-wiki-2026/experiments');
    await page.locator('.wet-lab-protocol').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.article-body iframe').count(), 0);
    assert.equal(await page.locator('.wet-lab-protocol').count(), 8);
    assert.equal(await page.locator('.wet-lab-protocol table').count(), 7);
    const rendered = await page.locator('.wet-lab-protocol').allTextContents();
    const expected = await page.evaluate(documents => documents.flatMap(doc => doc.sections.map(section => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = section.html;
      return wrapper.textContent;
    })), protocols);
    assert.deepEqual(rendered, expected);
    for (const selector of ['#section-1', '#section-4', '#section-8', '.wet-lab-protocol table']) {
      await page.locator(selector).first().evaluate(element => element.scrollIntoView({ block: 'start' }));
      await page.waitForTimeout(150);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: horizontal overflow`);
      await page.screenshot({ path: path.join(shots, `${width}-${selector.replace(/[^a-z0-9]/gi, '')}.png`) });
    }
    await page.locator('[data-toc-id="section-8"]').click();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('[data-toc-id="section-8"]').getAttribute('aria-current'), 'location');
    assert.ok((await page.locator('#section-8').boundingBox()).y >= 0);
    const downloads = await page.locator('.protocol-download a').evaluateAll(links => links.map(link => link.href));
    assert.equal(downloads.length, 2);
    for (let i = 0; i < downloads.length; i++) {
      const response = await page.request.get(downloads[i]);
      assert.equal(response.status(), 200);
      assert.equal(createHash('sha256').update(await response.body()).digest('hex'), protocols[i].sha256);
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: native content, tables, TOC navigation/highlight, no overflow, intact downloads, no JS errors`);
    await page.close();
  }
  console.log(`Screenshots: ${shots}`);
} finally {
  await browser.close();
  await server.close();
}
