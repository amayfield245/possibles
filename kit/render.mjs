// Renders a film spec to MP4, one frame at a time, so no frame is ever dropped.
// Run: node kit/render.mjs <id>/film.js [--out file.mp4] [--stills 1,4.5,9] [--scale 1.5]
// --stills writes PNGs at those seconds instead of a video, for checking frames against the style rules.
// --capstyle paper|card|ink overrides the film's caption style, to compare them.
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf('--' + name); return i < 0 ? null : args.splice(i, 2)[1]; };
const outArg = flag('out'), stillsArg = flag('stills'), scale = +(flag('scale') || 1.5), capstyle = flag('capstyle');
const spec = resolve(args[0] || '');
if (!args[0]) { console.error('Usage: node render.mjs path/to/film.js [--out file.mp4] [--stills 1,4.5] [--scale 1.5]'); process.exit(1); }
const outDir = join(dirname(spec), 'out');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: scale });
page.on('pageerror', e => console.error('page error:', e.message));
const player = pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), 'player.html')).href;
await page.goto(player + '?render=1' + (capstyle ? '&capstyle=' + capstyle : '') + '&film=' + encodeURIComponent(pathToFileURL(spec).href));
const info = await page.evaluate(() => window.FILM_READY);
if (!info) throw new Error('the film did not load');
info.problems.forEach(p => console.warn('CHECK', p));
const clip = { x: 0, y: 0, width: 1280, height: 720 };

if (stillsArg) {
  const dir = join(outDir, 'stills');
  mkdirSync(dir, { recursive: true });
  for (const t of stillsArg.split(',').map(Number)) {
    await page.evaluate(t => window.seek(t), t);
    const file = join(dir, t.toFixed(2).padStart(6, '0') + 's.png');
    await page.screenshot({ path: file, clip });
    console.log('still', file);
  }
} else {
  const out = resolve(outArg || join(outDir, 'film.mp4'));
  const frames = Math.round(info.duration * info.fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(info.fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', code => (code ? rej(new Error('ffmpeg exited ' + code)) : res())));
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.seek(t), i / info.fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 96, clip });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) console.log('frame', i, 'of', frames);
  }
  ff.stdin.end();
  await done;
  console.log('wrote', out, info.duration.toFixed(1) + 's', Math.round(1280 * scale) + 'x' + Math.round(720 * scale));
}
await browser.close();
if (info.problems.length) console.warn(info.problems.length + ' checks to look at, listed above.');
