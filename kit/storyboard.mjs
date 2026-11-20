// Builds the script review for a film: one clean frame per caption beat, and every scene's text and timing as data.
// Run: node kit/storyboard.mjs <id>/film.js [--round 2] [--video out/film.mp4]
// Writes <id>/review/: index.html (the review page), storyboard.json, frames/*.jpg, logo.png and film.mp4.
// Publish review/index.html as an artifact with the rest as its files (see SKILL.md, step 8).
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, copyFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf('--' + name); return i < 0 ? null : args.splice(i, 2)[1]; };
const roundArg = flag('round'), videoArg = flag('video');
if (!args[0]) { console.error('Usage: node storyboard.mjs path/to/film.js [--round 2] [--video path.mp4]'); process.exit(1); }
const spec = resolve(args[0]);
const kit = dirname(fileURLToPath(import.meta.url));
const out = join(dirname(spec), 'review');
const prev = existsSync(join(out, 'storyboard.json')) ? JSON.parse(readFileSync(join(out, 'storyboard.json'), 'utf8')) : null;
rmSync(join(out, 'frames'), { recursive: true, force: true });
mkdirSync(join(out, 'frames'), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.25 });
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(pathToFileURL(join(kit, 'player.html')).href + '?render=1&nocaps=1&film=' + encodeURIComponent(pathToFileURL(spec).href));
const info = await page.evaluate(() => window.FILM_READY);
const film = await page.evaluate(() => {
  const pick = s => ({ type: s.type, part: s.part || '', variant: s.variant || '', in: s.in || 'cut', start: s.start, dur: s.dur, bar: s.bar !== false,
    kicker: s.kicker || '', title: s.title || '', sub: s.sub || '', logo: s.logo || '', src: s.src || (s.frames ? s.frames.dir : ''),
    captions: (s.captions || []).map(c => ({ at: c.at, dur: c.dur, text: c.text })) });
  return { meta: window.FILM.meta || {}, captionStyle: window.FILM.captionStyle || 'paper', scenes: window.FILM.scenes.map(pick) };
});

const r1 = n => Math.round(n * 100) / 100;
const scenes = [];
let logo = '';
for (const [i, s] of film.scenes.entries()) {
  const id = 's' + String(i + 1).padStart(2, '0');
  const scene = { id, n: i + 1, type: s.type, part: s.part, variant: s.variant, in: s.in, start: r1(s.start), dur: s.dur, footage: s.src, texts: [], beats: [] };
  if (s.type === 'card') {
    scene.bar = s.bar;
    for (const role of ['kicker', 'title', 'sub']) if (s[role]) scene.texts.push({ id: id + '-' + role, role, text: s[role] });
    if (s.logo) { scene.logo = 'logo.png'; logo = resolve(dirname(spec), s.logo); }
  } else {
    // One beat per caption, caught once the caption is fully up and the camera has mostly settled.
    const caps = s.captions.length ? s.captions : [{ at: 0, dur: s.dur, text: null }];
    for (const [j, c] of caps.entries()) {
      const t = s.start + c.at + c.dur * 0.65;
      await page.evaluate(t => window.seek(t), t);
      const frame = 'frames/' + id + '-' + (j + 1) + '.jpg';
      await page.screenshot({ path: join(out, frame), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1280, height: 720 } });
      const lineId = c.text === null ? null : id + '-c' + (j + 1);
      if (lineId) scene.texts.push({ id: lineId, role: 'caption', text: c.text, at: c.at, dur: c.dur, start: r1(s.start + c.at) });
      scene.beats.push({ line: lineId, t: r1(t), frame });
    }
  }
  scenes.push(scene);
  console.log('scene', id, s.type, scene.beats.length ? scene.beats.length + ' frames' : 'card');
}
// A poster for the video: the ident card, or the first second.
const ident = scenes.find(s => s.variant === 'ident');
await page.evaluate(t => window.seek(t), ident ? ident.start + ident.dur * 0.8 : 1);
await page.screenshot({ path: join(out, 'poster.jpg'), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1280, height: 720 } });
await browser.close();

const round = roundArg ? +roundArg : prev ? prev.round : 1;
const meta = film.meta;
const video = resolve(videoArg || join(dirname(spec), 'out', 'possible-' + (meta.number || '') + '-' + (meta.slug || '') + '.mp4'));
if (existsSync(video)) copyFileSync(video, join(out, 'film.mp4')); else console.warn('no video at', video, '- the page will show frames only');
if (logo && existsSync(logo)) copyFileSync(logo, join(out, 'logo.png'));
const pageHtml = readFileSync(join(kit, 'review.html'), 'utf8')
  .replace('<title>Possibles script review</title>', '<title>' + (meta.name ? meta.name + ' script review' : 'Possibles script review') + '</title>');
writeFileSync(join(out, 'index.html'), pageHtml);
const board = {
  number: meta.number || '', name: meta.name || '', round, builtAt: new Date().toISOString(), captionStyle: film.captionStyle,
  duration: r1(info.duration), video: existsSync(join(out, 'film.mp4')) ? 'film.mp4' : null, poster: 'poster.jpg',
  history: prev && prev.round !== round ? [...(prev.history || []), { round: prev.round, builtAt: prev.builtAt }] : (prev ? prev.history || [] : []),
  scenes,
};
writeFileSync(join(out, 'storyboard.json'), JSON.stringify(board, null, 1));
console.log('review in', out, '· round', round, '·', scenes.length, 'scenes ·', scenes.reduce((n, s) => n + s.texts.length, 0), 'lines');
if (info.problems.length) info.problems.forEach(p => console.warn('CHECK', p));
