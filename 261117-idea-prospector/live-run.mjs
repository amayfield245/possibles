// A live run of the Inspiration prospector: one real question, answered by real Claude calls.
// Run from this repo's root, after `node build.mjs` in the latent checkout (see app.mjs, LATENT_DIR): node 261117-idea-prospector/live-run.mjs "Your question?"
//
// The published artifact calls Claude through the artifact runtime. That is not reachable from a script, so this run
// sends the app's own prompts, unedited, to Claude through the Claude Code command line (`claude -p`), with no tools
// and a one-line system prompt, and streams the answers back to the app. Every prompt and answer is kept in live/calls.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { chromium, here, openApp } from './app.mjs';

const question = process.argv[2];
if (!question) { console.error('Usage: node live-run.mjs "Your question?"'); process.exit(1); }
const MODEL = process.env.MODEL || 'claude-fable-5-2';
const SYSTEM = 'You are Claude, answering a request from a web page. Reply with exactly what the request asks for and nothing else.';
const live = join(here, 'live');
const calls = join(live, 'calls');
rmSync(calls, { recursive: true, force: true });
mkdirSync(calls, { recursive: true });

let n = 0, cost = 0;
const ask = prompt => new Promise((resolve, reject) => {
  const id = String(++n).padStart(2, '0');
  writeFileSync(join(calls, id + '.prompt.txt'), prompt);
  const t0 = Date.now();
  const p = spawn('claude', ['-p', '--model', MODEL, '--system-prompt', SYSTEM, '--tools', '', '--strict-mcp-config', '--setting-sources', '', '--output-format', 'json'], { cwd: live, stdio: ['pipe', 'pipe', 'ignore'] });
  let out = '';
  p.stdout.on('data', d => { out += d; });
  p.on('close', code => {
    try {
      const res = JSON.parse(out);
      if (code || res.is_error || typeof res.result !== 'string') throw new Error(res.result || 'exit ' + code);
      cost += res.total_cost_usd || 0;
      writeFileSync(join(calls, id + '.answer.txt'), res.result);
      console.log('call', id, ((Date.now() - t0) / 1000).toFixed(0) + 's', res.result.length + ' chars', Object.keys(res.modelUsage || {}).join(','));
      resolve(res.result);
    } catch (e) { reject(new Error('Claude call ' + id + ' failed: ' + e.message)); }
  });
  p.stdin.end(prompt);
});

// In the page: window.claude backed by the real calls above, streamed in small pieces as the artifact runtime would.
const liveClaude = model => {
  const sample = async (prompt, opts = {}) => {
    const text = await window.__ask(prompt);
    for (let at = 0; at < text.length; at += 160) {
      if (opts.signal && opts.signal.aborted) throw { code: 'cancelled', message: 'stopped' };
      const delta = text.slice(at, at + 160);
      if (opts.onText) opts.onText({ text: text.slice(0, at + delta.length), delta });
      await new Promise(r => setTimeout(r, 2));
    }
    return { text, truncated: false, modelTierApplied: 'complex', modelApplied: model };
  };
  window.claude = { use: async name => (name === 'sample' ? sample : name === 'downloads' ? { save: async r => { await window.__save(r.filename, r.data); return { status: 'saved' }; } } : null) };
};

const browser = await chromium.launch();
const page = await openApp(browser, live, {
  claude: { content: '(' + liveClaude.toString() + ')(' + JSON.stringify(MODEL) + ')' },
  setup: async p => {
    await p.exposeFunction('__ask', ask);
    await p.exposeFunction('__save', (name, data) => { const f = name.endsWith('.json') ? 'session.json' : 'summary.md'; writeFileSync(join(live, f), data); console.log('saved', f); });
  },
});
page.setDefaultTimeout(15000);

// Waits until the app has been idle for two seconds, and stops on any error notice.
const done = async label => {
  let quiet = 0;
  for (;;) {
    await page.waitForTimeout(500);
    const s = await page.evaluate(() => ({ busy: !!document.querySelector('.notice.busy'), bad: (document.querySelector('.notice.bad, .notice.warn') || {}).textContent || '' }));
    if (s.bad) throw new Error(label + ': the app reported "' + s.bad + '"');
    quiet = s.busy ? 0 : quiet + 500;
    if (quiet >= 2000) break;
  }
  console.log('done', label, '·', (await page.textContent('.meta')).trim());
};
const step = async (label, fn) => { try { await fn(); await done(label); return true; } catch (e) { console.warn('SKIPPED', label, '-', e.message.split('\n')[0]); return false; } };

await page.click('#new-problem');
if (await page.locator('#new-go').count()) await page.click('#new-go');
await page.fill('#problem', question);
await page.click('#propose-frames');
await done('frames');
await page.click('#map-ideas');
await done('40 ideas');

await page.click('#tab-gaps');
await page.click('#judge-gaps');
await done('verdicts');
// Fill the first gap judged unexplored, or else unfashionable. An impossible gap is left alone.
await step('fill a gap', async () => {
  const pick = sel => page.locator('.gap').filter({ has: page.locator(sel) }).first();
  const gap = (await pick('.badge.pos').count()) ? pick('.badge.pos') : pick('.badge.caution');
  await gap.locator('.acts button').first().click();
});
// Stretch the first idea that landed in that gap along the X axis.
await step('stretch test', async () => {
  await page.locator('.gap ul li button.link').first().click();
  await page.click('#panel-stretch');
  await page.click('#run-stretch');
});

await page.click('#save-json');
await page.click('#save-md');
await page.waitForTimeout(500);
await page.screenshot({ path: join(live, 'end.png'), fullPage: true });
await browser.close();
writeFileSync(join(live, 'run.json'), JSON.stringify({ question, model: MODEL, system: SYSTEM, calls: n, costUsd: +cost.toFixed(2), at: new Date().toISOString(), via: 'claude -p (Claude Code command line), no tools' }, null, 1));
console.log('live run finished:', n, 'calls, about $' + cost.toFixed(2));
