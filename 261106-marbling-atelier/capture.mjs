// Captures footage of The Marbling Atelier for the film, from the published version in experiment/index.html.
// Run from this repo's root: node 261106-marbling-atelier/capture.mjs [page] [book] [history] [sheet] [studio]
// The film uses: VIEW_H=1400 node 261106-marbling-atelier/capture.mjs book history, then node 261106-marbling-atelier/capture.mjs page sheet studio// With no arguments it captures all four. Output goes to 261106-marbling-atelier/captures/ (not committed).
//
// Everything filmed is the app doing what it does for any visitor. It opens on its Bouquet (the app's own seed,
// 271828). The history stills use its Undo history, one pass at a time. The animation is the app working the
// Bouquet from its pattern book, one screen refresh per frame (see app.mjs). No model runs inside the app.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { chromium, here, openApp, tick, settle } from './app.mjs';

const want = process.argv.slice(2);
const doing = k => !want.length || want.includes(k);
const out = join(here, 'captures');
mkdirSync(out, { recursive: true });
const rectsFile = join(out, 'rects.json');
const rects = {};
const rectOf = (page, sels) => page.evaluate(sels => Object.fromEntries(sels.map(sel => [sel, Array.from(document.querySelectorAll(sel)).slice(0, 40).map(e => {
  const r = e.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height].map(Math.round);
})]).filter(([, v]) => v.length)), sels);
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

const browser = await chromium.launch();
const page = await openApp(browser);
log('opened; drawing the opening Bouquet');
log('settled after', await settle(page), 'refreshes');

// The region from the plate title to the history bar, in page CSS px.
const workRegion = async () => {
  const [a, b] = await page.evaluate(() => [document.querySelector('.plate-head').getBoundingClientRect(), document.querySelector('.historybar').getBoundingClientRect()].map(r => [r.x + scrollX, r.y + scrollY, r.right + scrollX, r.bottom + scrollY]));
  return { x: a[0] - 8, y: a[1] - 8, width: a[2] - a[0] + 16, height: b[3] - a[1] + 16 };
};

if (doing('page')) {
  // The app draws the pattern book's swatches one at a time on timers after it opens. Wait for all of them.
  await page.waitForFunction(() => [...document.querySelectorAll('.recipe .sw')].every(s => s.style.backgroundImage), null, { timeout: 1800000, polling: 2000 });
  await page.screenshot({ path: join(out, 'page.png'), fullPage: true });
  rects.page = await rectOf(page, ['.masthead', '.lineage', '.lineage li', 'h1', '.sub', '.bench', '.panel.pots', '.workspace', '.trough', '.bath', '.rack', '.historybar', '.panel.book', '.recipes', '.recipe', '.trad-label', '.colophon', '.colophon > div']);
  log('page still');
}

if (doing('book')) {
  // The pattern book scrolls inside its own panel. Film the panel at the start of each tradition.
  await page.waitForFunction(() => [...document.querySelectorAll('.recipe .sw')].every(s => s.style.backgroundImage), null, { timeout: 1800000, polling: 2000 });
  const dir = join(out, 'book');
  mkdirSync(dir, { recursive: true });
  const panel = await page.evaluate(() => { const r = document.querySelector('.panel.book').getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; });
  rects.book = { clip: panel, views: [] };
  const labels = await page.evaluate(() => [...document.querySelectorAll('.trad-label')].map(e => e.textContent));
  for (let i = 0; i < labels.length; i++) {
    await page.evaluate(i => { const box = document.querySelector('.recipes'); box.scrollTop = document.querySelectorAll('.trad-label')[i].offsetTop - box.offsetTop - 6; }, i);
    await page.waitForTimeout(300);
    const inside = await rectOf(page, ['.recipe', '.trad-label']);
    rects.book.views.push({ label: labels[i], inside });
    await page.screenshot({ path: join(dir, i + '.png'), clip: panel });
    log('book:', labels[i]);
  }
  await page.evaluate(() => { document.querySelector('.recipes').scrollTop = 0; });
}

if (doing('history')) {
  const clip = await workRegion();
  rects.history = { clip, inside: await rectOf(page, ['.plate-head', '.trough', '.bath', '.historybar', '#histLabel', '#histO', '#histR']) };
  const dir = join(out, 'history');
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const passes = await page.evaluate(() => M.passes);
  for (let k = passes, i = 0; k >= 0; k--, i++) {
    await page.evaluate(k => goPass(k), k);
    await settle(page);
    await page.screenshot({ path: join(dir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92, clip });
    log('history: pass', k, 'of', passes, '|', await page.evaluate(() => histLabel.textContent));
  }
  await page.evaluate(n => goPass(n), passes);
  await settle(page);
}

if (doing('sheet')) {
  // Lay down a sheet. The sheet's fall is a CSS transition on timers, so this keeps releasing refreshes for
  // three seconds of real time, then films the proof the sheet took up.
  await page.evaluate(() => document.querySelector('.plate-head').scrollIntoView());
  await page.click('#layBtn');
  const t0 = Date.now();
  while (Date.now() - t0 < 3000) await tick(page);
  await settle(page);
  await page.waitForTimeout(500);
  const clip = await workRegion();
  rects.proof = { clip };
  await page.screenshot({ path: join(out, 'proof.jpg'), type: 'jpeg', quality: 92, clip });
  log('proof:', await page.evaluate(() => document.getElementById('caption').textContent));
  // The drying line, then the sheet opened as a specimen and bound as a book.
  await page.evaluate(() => document.querySelector('.drying').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
  rects.drying = await rectOf(page, ['.drying', '.sheet-thumb']);
  await page.screenshot({ path: join(out, 'drying.png'), fullPage: true });
  await page.click('.sheet-thumb');
  await tick(page);
  await page.waitForTimeout(800);
  rects.specimen = await rectOf(page, ['.modal-card', '.specimen-sheet', '#specImg', '.bound', '.volume', '#specTitle', '#specMeta']);
  await page.screenshot({ path: join(out, 'specimen.png') });
  log('specimen:', await page.evaluate(() => [specTitle.textContent, specMeta.textContent]));
  await page.click('#specClose');
}

if (doing('studio')) {
  // Studio mode, then the Bouquet from the pattern book, worked from a clean bath with the app's own seed.
  await page.evaluate(() => setStudio(true));
  for (let i = 0; i < 4; i++) await tick(page);
  await page.waitForTimeout(300);
  const vp = page.viewportSize();
  const clip = { x: 0, y: 0, width: vp.width, height: vp.height };
  rects.studio = { clip, inside: await rectOf(page, ['.plate-head', '#plateName', '#caption', '.stage', '.strip', '.trough', '.bath', '.rack', '.side']) };
  await page.evaluate(() => workRecipe(RECIPES.find(r => r.id === 'bouquet'), { seed: 271828 }));
  const dir = join(out, 'studio');
  rmSync(dir, { recursive: true, force: true });
  const passes = [];
  let n = 0, last = -1;
  for (let guard = 0; guard < 2000; guard++) {
    await tick(page);
    const st = await page.evaluate(() => ({ active: P.active, pass: M.passes, cap: document.getElementById('caption').textContent }));
    if (st.pass !== last) { passes.push({ pass: st.pass, from: n, caption: st.cap }); last = st.pass; log('studio: pass', st.pass, st.cap); }
    mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: join(dir, String(n).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 90, clip });
    n++;
    if (!st.active && guard > 2) break;
  }
  // a few more refreshes at rest, so the finished bath is drawn at full resolution
  await settle(page);
  for (let i = 0; i < 3; i++) await page.screenshot({ path: join(dir, String(n++).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 90, clip });
  rects.studio.frames = n;
  rects.studio.passes = passes;
  log('studio frames', n);
}

let old = {};
try { old = JSON.parse((await import('node:fs')).readFileSync(rectsFile, 'utf8')); } catch (e) {}
writeFileSync(rectsFile, JSON.stringify({ ...old, ...rects }, null, 1));
await browser.close();
log('done');
