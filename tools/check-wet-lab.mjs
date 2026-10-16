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
    await page.locator('.wet-lab-overview').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(shots, `${width}-entry.png`) });
    assert.equal(await page.locator('.article-body iframe').count(), 0);
    assert.equal(await page.locator('.wet-lab-protocol').count(), 5);
    assert.equal(await page.locator('.wet-lab-protocol table').count(), 6);
    assert.equal(await page.locator('.method-figure img').count(), 2);
    assert.equal(await page.locator('.wet-lab-method details, .wet-lab-method summary, .method-reading-tools, .method-index, .method-figure a').count(), 0);
    // Source text must be readable on arrival, not merely present inside a closed panel.
    const content = page.locator('.wet-lab-protocol p, .wet-lab-protocol li, .wet-lab-protocol h4, .wet-lab-protocol table');
    assert.ok(await content.count() > 50);
    for (const element of await content.all()) assert.ok(await element.isVisible());
    const rendered = await page.locator('.wet-lab-protocol').allTextContents();
    const expected = await page.evaluate(documents => [...documents[0].sections, documents[1].sections[3]].map(section => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = section.html.match(/<h3>[\s\S]*?<\/h3>([\s\S]*)$/)[1];
      return wrapper.textContent;
    }), protocols);
    assert.deepEqual(rendered, expected);
    const intros = await page.locator('.method-introduction').allTextContents();
    const sourceIntros = await page.evaluate(documents => [...documents[0].sections, documents[1].sections[3]].map(section => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = section.html.split('<p>This section includes:</p>')[0];
      return wrapper.textContent;
    }), protocols);
    assert.deepEqual(intros, sourceIntros);
    for (const selector of ['#section-1', '#section-2', '#section-5', '#section-6']) {
      await page.locator(selector).first().evaluate(element => element.scrollIntoView({ block: 'start' }));
      await page.locator(selector + ' img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
      await page.waitForTimeout(150);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: horizontal overflow`);
      await page.screenshot({ path: path.join(shots, `${width}-${selector.replace(/[^a-z0-9]/gi, '')}.png`) });
    }
    assert.ok(await page.locator('.method-figure img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)));
    const imageUrls = await page.locator('.method-figure img').evaluateAll(images => images.map(img => img.currentSrc));
    assert.ok(imageUrls.every(url => width < 600 ? url.endsWith('-mobile.svg') : !url.endsWith('-mobile.svg')));
    await page.locator('.wet-lab-protocol table').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(shots, `${width}-protocol-table.png`) });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator('[data-toc-id="section-6"]').click();
    await page.waitForTimeout(250);
    assert.equal(await page.locator('[data-toc-id="section-6"]').getAttribute('aria-current'), 'location');
    assert.ok((await page.locator('#section-6').boundingBox()).y >= 0);
    const downloads = await page.locator('.protocol-download a').evaluateAll(links => links.map(link => link.href));
    assert.equal(downloads.length, 2);
    for (let i = 0; i < downloads.length; i++) {
      const response = await page.request.get(downloads[i]);
      assert.equal(response.status(), 200);
      assert.equal(createHash('sha256').update(await response.body()).digest('hex'), protocols[i].sha256);
    }
    assert.deepEqual(errors, []);
    await page.goto('http://127.0.0.1:4177/dunaterp-wiki-2026/experiments#method-qpcr-2');
    await page.waitForTimeout(200);
    assert.ok(await page.locator('#method-qpcr-2').isVisible());
    const target = await page.locator('#method-qpcr-2').boundingBox();
    assert.ok(target.y >= 0 && target.y < 900, 'Direct method anchor remains supported');
    console.log(`PASS ${width}px: original text and tables visible without interaction, two responsive diagrams, no accordions or redundant links, TOC, no overflow, intact downloads`);
    await page.close();
  }
  console.log(`Screenshots: ${shots}`);
} finally {
  await browser.close();
  await server.close();
}
