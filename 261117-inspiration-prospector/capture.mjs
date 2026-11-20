// Captures footage of the Inspiration prospector for the film: stills of each view and a slow orbit of the 3D space.
// Run from this repo's root, after `node build.mjs` in the latent checkout (see app.mjs, LATENT_DIR): node 261117-inspiration-prospector/capture.mjs [session.json]
// Needs the five CDN scripts in the latent checkout's test/libs (see its test/smoke.mjs).
//
// With a session file (for example live/session.json from live-run.mjs) the footage shows that session. Without one
// it shows the built-in example. Either way the session is filmed at rest. A stand-in for Claude is installed only so
// the buttons look as they do in the live artifact. Nothing here presses a button that generates ideas, so no
// stand-in output ever reaches the film.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium, here, openApp, loadSession } from './app.mjs';

const session = process.argv[2] ? resolve(process.argv[2]) : null;
const out = join(here, 'captures');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
// SELECT names an idea that landed in a filled gap. It is selected so its readout and stretch test are on screen.
const select = process.env.SELECT || '';
const open = async (dpr, clock, withSelect) => {
  const page = await openApp(browser, out, { dpr, clock });
  if (session) await loadSession(page, session);
  if (withSelect && select) {
    await page.click('#tab-gaps');
    await page.locator('.gap ul li button.link', { hasText: select }).first().click();
  } else if (await page.locator('#panel-close').count()) await page.click('#panel-close');
  return page;
};

// Stills, at three times the screen size so the film can move in close.
const page = await open(3, false, true);
const rects = {};
for (const tab of ['frames', 'space', 'slice', 'gaps', 'stretch', 'cards', 'table']) {
  await page.click('#tab-' + tab);
  await page.waitForTimeout(tab === 'space' ? 1500 : 300);
  await page.screenshot({ path: join(out, tab + '.png'), fullPage: true });
  // Where things sit on the page, in CSS px, for placing the camera and the gold marks in a film spec.
  rects[tab] = await page.evaluate(() => Object.fromEntries(['#problem', '.dim', '.space', '.slice', '.gap', '.gap .badge', '.gap ul', '.panel', '.legend', '.card.stretch', '.stop-card', '.stop-marks', '.card.idea'].map(sel => [sel, Array.from(document.querySelectorAll(sel)).slice(0, 45).map(e => { const r = e.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height].map(Math.round); })]).filter(([, v]) => v.length)));
  console.log('still', tab);
}
// One still per stop of the stretch test, so the film can step along it.
await page.click('#tab-stretch');
for (let i = 0; i < 5 && await page.locator('#stop-' + i).count(); i++) {
  await page.click('#stop-' + i);
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(out, 'stretch-' + i + '.png'), fullPage: true });
}
writeFileSync(join(out, 'rects.json'), JSON.stringify(rects, null, 1));
await page.close();

// The orbit: the 3D space turning on its own, stepped with a paused clock so every frame is an equal turn.
const TICKS = 4, FRAMES = +(process.env.ORBIT_FRAMES || 270);
const orbit = await open(2, true, false);
await orbit.click('#tab-space');
await orbit.waitForTimeout(1500);
const dir = join(out, 'orbit');
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
await orbit.evaluate(() => scrollTo(0, document.querySelector('.space').getBoundingClientRect().top + scrollY - 24));
const box = await orbit.locator('.space').boundingBox();
await orbit.clock.pauseAt(new Date(Date.now() + 1000));
for (let i = 0; i < FRAMES; i++) {
  await orbit.clock.runFor(TICKS * 16);
  await orbit.screenshot({ path: join(dir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 93, clip: box });
  if (i % 90 === 0) console.log('orbit frame', i, 'of', FRAMES);
}
await browser.close();
console.log('captures in', out);
