import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// Counts the passes and strokes of every pattern in the book, without rendering.
// Run from the repo root: node 261106-marbling-atelier/count-recipes.mjs
const here = fileURLToPath(new URL('.', import.meta.url));
// WebGL is off, so nothing renders; only the recipe builders run.
const b = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
const p = await b.newPage();
p.on('pageerror', e => console.log('err', e.message));
await p.goto('file://' + here + 'experiment/index.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
await p.waitForTimeout(2000);
const out = await p.evaluate(() => RECIPES.map(r => {
  const pal = (SUITES.find(s => s.id === r.suite) || SUITES[0]).colours.map(([name, hex]) => ({ name, hex, rgb: hex2rgb(hex) }));
  const h = new Hand(r.palette || pal, 271828, { gall: 1, size: 1 });
  r.build(h);
  return { id: r.id, name: r.name, trad: r.trad, date: r.date, origin: r.origin, passes: h.steps.length, ops: h.steps.reduce((a, s) => a + s.ops.length, 0), steps: h.steps.map(s => s.caption) };
}));
writeFileSync(here + 'data/recipes.json', JSON.stringify(out, null, 1));
for (const r of out) console.log(r.trad.padEnd(8), r.name.padEnd(16), String(r.passes).padStart(3), String(r.ops).padStart(7));
await b.close();
