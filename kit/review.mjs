// The back half of the script review page: check a sent review, then apply it once approved.
//
//   1. Export the review page's store (Claude does this with ArtifactData, out_dir = <id>/review/inbox):
//        edits/<line>.json, comments/<id>.json, review/state.json, style/captions.json
//   2. node kit/review.mjs check <id>/film.js
//        Applies the edits to a copy of the film (film.review.js), runs the renderer's own checks on it
//        plus the house-style checks, and writes review/report.json: a draft report and plan for the page.
//        Claude adds the fact check against the footage, then writes report and plan to review/state.
//   3. After the maker approves on the page:
//      node kit/review.mjs apply <id>/film.js
//        Writes the edits into film.js and lists the scenes to retime and reshoot.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const [cmd, specArg] = process.argv.slice(2);
if (!['check', 'apply'].includes(cmd) || !specArg) { console.error('Usage: node review.mjs check|apply path/to/film.js'); process.exit(1); }
const spec = resolve(specArg);
const dir = dirname(spec);
const inbox = join(dir, 'review', 'inbox');
const board = JSON.parse(readFileSync(join(dir, 'review', 'storyboard.json'), 'utf8'));

// Spaces typed at either end are dropped; line breaks inside are kept, and the film shows them.
const clean = s => s.replace(/[ \t]+$/gm, '').trim();
// ArtifactData writes each document as { id, data, version, ... } or as the bare body; accept both.
const readDocs = sub => {
  const p = join(inbox, sub);
  if (!existsSync(p)) return [];
  return readdirSync(p).filter(f => f.endsWith('.json')).map(f => {
    const raw = JSON.parse(readFileSync(join(p, f), 'utf8'));
    return { id: raw.id || f.replace(/\.json$/, ''), ...(raw.data || raw) };
  });
};
const edits = readDocs('edits').filter(e => e.round === board.round).map(e => ({ ...e, text: clean(e.text) }));
const comments = readDocs('comments').filter(c => !c.resolved);
const state = readDocs('review').find(d => d.id === 'state') || null;
// A caption style chosen on the page this round, if it differs from the cut's.
const STYLE_NAMES = { paper: 'Paper', card: 'Card band', ink: 'Ink plate' };
const baseStyle = board.captionStyle || 'paper';
const styleDoc = readDocs('style').find(d => d.id === 'captions' && d.round === board.round) || null;
const styleTo = styleDoc && STYLE_NAMES[styleDoc.style] && styleDoc.style !== baseStyle ? styleDoc.style : null;
function applyStyle(src) {
  if (!styleTo) return src;
  if (/captionStyle: '[a-z]+'/.test(src)) return src.replace(/captionStyle: '[a-z]+'/, "captionStyle: '" + styleTo + "'");
  return src.replace(/^(\s*)fps: /m, "$1captionStyle: '" + styleTo + "',\n$1fps: ");
}
const lines = Object.fromEntries(board.scenes.flatMap(s => s.texts.map(t => [t.id, { ...t, scene: s }])));

// Put new text into the spec in place of the old, as a single-quoted JS string.
const jsq = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n') + "'";
function applyEdits(src) {
  const problems = [];
  for (const e of edits) {
    const L = lines[e.id];
    if (!L) { problems.push('unknown line ' + e.id); continue; }
    const from = jsq(L.text), hits = src.split(from).length - 1;
    if (hits !== 1) { problems.push(e.id + ': the original text appears ' + hits + ' times in the spec, so it was not replaced. Edit it by hand.'); continue; }
    src = src.replace(from, jsq(clean(e.text)));
  }
  return { src, problems };
}

// The house-style checks, kept in step with the review page.
const AVOID = ['very', 'really', 'quite', 'extremely', 'incredibly', 'leverage', 'leverages', 'foster', 'synergy', 'paradigm', 'game-changing', 'revolutionary', 'crucial',
  'forward-thinking', 'strategic imperative', 'fundamental shift', 'honestly', 'quietly', "here's the thing", 'what most people miss', 'key takeaway', 'only time will tell', "in today's", 'not just', "it's not about"];
const US = { organization: 'organisation', organizations: 'organisations', realize: 'realise', realized: 'realised', color: 'colour', center: 'centre', favorite: 'favourite', analyze: 'analyse', behavior: 'behaviour', optimize: 'optimise', prioritize: 'prioritise', labor: 'labour' };
function style(text) {
  const out = [], t = ' ' + text.toLowerCase().replace(/’/g, "'") + ' ';
  if (/!/.test(text)) out.push(['error', 'exclamation mark']);
  if (/—/.test(text)) out.push(['error', 'em dash']);
  if (/\s-\s/.test(text)) out.push(['warning', 'hyphen used as a dash']);
  if (/"/.test(text)) out.push(['warning', 'straight quotation marks']);
  for (const w of AVOID) if (new RegExp('[^a-z]' + w.replace(/[-']/g, m => '\\' + m) + '[^a-z]').test(t)) out.push(['warning', '"' + w + '" is on the avoid list']);
  for (const [us, uk] of Object.entries(US)) if (new RegExp('[^a-z]' + us + '[^a-z]').test(t)) out.push(['warning', 'British spelling: ' + uk]);
  return out;
}

if (cmd === 'check') {
  const { src, problems } = applyEdits(readFileSync(spec, 'utf8'));
  const trial = join(dir, 'film.review.js');
  writeFileSync(trial, applyStyle(src));
  // The renderer's own checks: two-line captions, reading time, captions inside their scene.
  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), 'player.html')).href + '?render=1&film=' + encodeURIComponent(pathToFileURL(trial).href));
  const info = await page.evaluate(() => window.FILM_READY);
  await browser.close();

  const report = [], plan = [];
  for (const p of problems) report.push({ level: 'error', text: p });
  if (styleTo) {
    plan.push({ action: 'edit', text: 'Change the caption style from ' + STYLE_NAMES[baseStyle] + ' to ' + STYLE_NAMES[styleTo] + ', on every caption.' });
    if (styleTo === 'ink') report.push({ level: 'warning', text: 'Ink plate departs from the house style, which puts captions on a paper or card band.' });
    else report.push({ level: 'ok', text: STYLE_NAMES[styleTo] + ' keeps captions inside the house style.' });
  }
  for (const e of edits) {
    const L = lines[e.id];
    const found = style(e.text);
    const sceneN = 'scene ' + L.scene.n;
    if (!found.length) report.push({ scene: L.scene.id, level: 'ok', text: 'The new ' + (L.role === 'caption' ? 'caption' : 'card ' + L.role) + ' meets the house style: “' + e.text + '”' });
    for (const [level, what] of found) report.push({ scene: L.scene.id, level, text: what + ' in “' + e.text + '”' });
    plan.push({ scene: L.scene.id, action: 'edit', text: 'Change “' + L.text + '” to “' + e.text + '”.' });
    if (/\d/.test(e.text)) report.push({ scene: L.scene.id, level: 'warning', text: 'Has a figure. Fact check against the footage before approving (' + sceneN + ').' });
  }
  for (const p of info.problems) {
    const m = p.match(/needs ([\d.]+)s, has ([\d.]+)s: "(.*)"$/);
    const line = m && Object.values(lines).find(l => l.text === m[3] || edits.some(e => e.id === l.id && e.text === m[3]));
    if (m) plan.push({ scene: line ? line.scene.id : undefined, action: 'retime', text: 'Give “' + m[3] + '” ' + m[1] + ' s on screen, up from ' + m[2] + ' s.' });
    else report.push({ level: /lines/.test(p) ? 'error' : 'warning', text: p });
  }
  for (const c of comments) {
    const s = board.scenes.find(x => x.id === c.scene);
    if (!s) continue;
    const action = c.kind === 'reshoot' ? 'reshoot' : c.kind === 'cut' ? 'cut' : 'note';
    plan.push({ scene: s.id, action, text: (action === 'note' ? 'Answer: ' : '') + c.text, comment: c.id });
  }
  const out = { round: board.round, status: state ? state.status : 'none', checkedAt: new Date().toISOString(), edits: edits.length, captionStyle: styleTo, comments: comments.length, report, plan };
  writeFileSync(join(dir, 'review', 'report.json'), JSON.stringify(out, null, 1));
  console.log('review state:', out.status, '· edits', edits.length, '· caption style', styleTo || 'unchanged', '· open comments', comments.length);
  for (const r of report) console.log(r.level.toUpperCase().padEnd(7), r.scene || '', r.text);
  for (const p of plan) console.log('PLAN   ', (p.scene || '').padEnd(4), p.action.padEnd(8), p.text);
  console.log('draft written to review/report.json; trial spec at film.review.js');
}

if (cmd === 'apply') {
  if (!state || state.status !== 'approved' || state.round !== board.round) { console.error('Not approved on the page for round ' + board.round + ' (state: ' + (state ? state.status + ', round ' + state.round : 'none') + '). Nothing changed.'); process.exit(1); }
  const { src, problems } = applyEdits(readFileSync(spec, 'utf8'));
  problems.forEach(p => console.warn('CHECK', p));
  writeFileSync(spec, applyStyle(src));
  console.log('wrote', edits.length - problems.length, 'edits into', spec + (styleTo ? ', and caption style ' + styleTo : ''));
  const reshoot = comments.filter(c => c.kind === 'reshoot'), cut = comments.filter(c => c.kind === 'cut');
  if (reshoot.length) console.log('reshoot:', reshoot.map(c => c.scene + ' "' + c.text + '"').join('; '));
  if (cut.length) console.log('cut:', cut.map(c => c.scene + ' "' + c.text + '"').join('; '));
  console.log('next: retime, recapture what the plan says, render, then node kit/storyboard.mjs ' + specArg + ' --round ' + (board.round + 1));
}
