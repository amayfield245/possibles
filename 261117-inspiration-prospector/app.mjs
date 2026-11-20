// Opens the Inspiration prospector in headless Chromium with local copies of its scripts and fonts.
// Shared by capture.mjs (footage) and live-run.mjs (a real session with Claude).
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const { chromium } = createRequire(import.meta.url)('playwright');
export const here = fileURLToPath(new URL('.', import.meta.url));
// The experiment lives in the latent repo. Set LATENT_DIR to its checkout; by default it sits next to this repo.
export const root = process.env.LATENT_DIR || join(here, '..', '..', 'latent');
const libs = join(root, 'test', 'libs');
const fonts = join(here, '..', 'kit', 'assets', 'fonts');

const face = (family, file, weight) => `@font-face{font-family:'${family}';src:url(https://kit.fonts/${file});font-weight:${weight}}`;
const fontCss = [face('Bricolage Grotesque', 'BricolageGrotesque.ttf', '200 800'), face('Hanken Grotesk', 'HankenGrotesk.ttf', '100 900'), face('IBM Plex Mono', 'IBMPlexMono-Regular.ttf', '400'), face('IBM Plex Mono', 'IBMPlexMono-Medium.ttf', '500')].join('\n');

// A stand-in for Claude that never answers. It only makes the buttons look as they do in the live artifact.
export const silentClaude = () => { window.claude = { use: async name => (name === 'sample' ? () => new Promise(() => {}) : name === 'downloads' ? { save: async () => ({ status: 'saved' }) } : null) }; };

// opts: dpr, clock (install a controllable clock), claude (an init script that defines window.claude), setup(page) run before the page loads.
export const openApp = async (browser, workDir, opts = {}) => {
  mkdirSync(workDir, { recursive: true });
  const file = join(workDir, 'page.html');
  const app = readFileSync(join(root, 'inspiration-prospector.html'), 'utf8');
  writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + app + '</body></html>');
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, deviceScaleFactor: opts.dpr || 1, colorScheme: 'light' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.route(/^https?:\/\//, route => {
    const url = new URL(route.request().url());
    const name = basename(url.pathname);
    if (url.host === 'kit.fonts') return route.fulfill({ path: join(fonts, name), contentType: 'font/ttf', headers: { 'access-control-allow-origin': '*' } });
    if (url.host === 'fonts.googleapis.com') return route.fulfill({ status: 200, contentType: 'text/css', body: fontCss });
    if (existsSync(join(libs, name))) return route.fulfill({ path: join(libs, name), contentType: 'text/javascript' });
    return route.fulfill({ status: 404, body: '' });
  });
  if (opts.setup) await opts.setup(page);
  await page.addInitScript(opts.claude || silentClaude);
  if (opts.clock) await page.clock.install();
  await page.goto('file://' + file);
  await page.waitForSelector('.tabs');
  await page.evaluate(() => document.fonts.ready);
  return page;
};

// Loads a saved session through the app's own Open dialog.
export const loadSession = async (page, sessionFile) => {
  await page.click('#open-session');
  await page.fill('#open-paste', readFileSync(sessionFile, 'utf8'));
  await page.click('#open-load');
  await page.waitForTimeout(400);
  // The "Opened the session" notice is not part of the session, so it is dismissed before filming.
  const dismiss = page.locator('.notice button', { hasText: 'Dismiss' });
  if (await dismiss.count()) await dismiss.first().click();
};
