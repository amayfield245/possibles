// Opens The Marbling Atelier (experiment/index.html, the 6 Nov 2026 version) in headless Chromium for filming.
// The app redraws the bath and advances its own animation once per screen refresh. Here those refreshes are
// held in a queue and released one at a time by tick(), so every refresh can be filmed as one frame.
// Nothing in the app is changed: the page runs as published, only its clock is stepped by hand.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const { chromium } = createRequire(import.meta.url)('playwright');
export const here = fileURLToPath(new URL('.', import.meta.url));
const appUrl = 'file://' + join(here, 'experiment', 'index.html');

const HOLD_RAF = () => {
  const queue = [];
  window.requestAnimationFrame = cb => { queue.push(cb); return queue.length; };
  window.cancelAnimationFrame = () => {};
  window.__tick = () => { const run = queue.splice(0); const t = performance.now(); run.forEach(cb => cb(t)); return run.length; };
  // Each viewer is asked once whether they want the guided first plate. Answer "not now" so the banner stays away.
  try { localStorage.setItem('marbling-atelier:invited', 'true'); } catch (e) {}
};

export async function openApp(browser, { width = 1600, height = +(process.env.VIEW_H || 1000), dpr = 2 } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: dpr });
  page.setDefaultTimeout(600000);
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.addInitScript(HOLD_RAF);
  await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 600000 });
  await page.evaluate(() => document.fonts.ready);
  const invite = page.locator('#inviteNo');
  if (await invite.isVisible()) await invite.click();
  return page;
}

// Releases one screen refresh and waits for the GPU to finish drawing it.
export const tick = page => page.evaluate(() => { const n = window.__tick(); const gl = document.getElementById('gl').getContext('webgl2'); gl && gl.finish(); return n; });

// Refreshes until the bath has nothing left to draw or bake.
export async function settle(page, max = 400) {
  for (let i = 0; i < max; i++) {
    await tick(page);
    if (await page.evaluate(() => !M.needs && !P.active)) return i;
  }
  return max;
}
