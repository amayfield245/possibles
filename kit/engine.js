/* Possibles film engine. Loads a film spec (?film=path/to/film.js) and draws any moment of it with seek(t),
   so the renderer can step frame by frame and a browser can preview in real time.

   A film spec sets window.FILM = { fps, scenes: [...] }. Scene kinds:
   card: { type: 'card', variant: 'ident' | 'statement' | 'section' | 'end', dur, kicker, title, sub, bar, logo }
   shot: { type: 'shot', dur, src | frames: { dir, count, fps, ext, pad }, dpr,
           cam: [{ at, c: [x, y], w }],             camera keyframes in capture CSS px: centre and width of the view
           marks: [{ at, dur, rect: [x, y, w, h], tag }],
           captions: [{ at, dur, text }] }
   Every scene takes in: 'cut' (default) or 'fade', a 300ms cross-fade from the scene before. */
(() => {
  const qs = new URLSearchParams(location.search);
  const filmUrl = qs.get('film');
  const base = filmUrl ? new URL(filmUrl, location.href).href.replace(/[^/]*$/, '') : '';
  const STAGE = { w: 1184, h: 500 };
  const FADE = 0.3, STEP = 0.3, CAP = 0.24;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const out = p => 1 - Math.pow(1 - clamp01(p), 3);
  const inOut = p => { p = clamp01(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  const el = (cls, parent, tag) => { const e = document.createElement(tag || 'div'); if (cls) e.className = cls; parent.appendChild(e); return e; };
  const frame = document.getElementById('frame');
  const capText = document.querySelector('#caption .text');
  const problems = [];
  let scenes = [], duration = 0;

  const loadImage = src => new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => { problems.push('missing image: ' + src); res(img); };
    img.src = src;
  });
  const frameSrc = (f, i) => base + f.dir + '/' + String(i).padStart(f.pad || 4, '0') + '.' + (f.ext || 'jpg');

  const buildCard = (s, root) => {
    root.classList.add('card-scene', s.variant || 'ident');
    s.parts = [];
    if (s.bar !== false) s.parts.push(el('bar', root));
    for (const k of ['kicker', 'title', 'sub']) if (s[k]) { const e = el(k, root); e.textContent = s[k]; s.parts.push(e); }
    if (s.logo) { const img = el('logo', root, 'img'); img.src = base + s.logo; s.parts.push(img); return loadImage(img.src); }
  };

  const buildShot = async (s, root) => {
    s.stage = el('stage', root);
    s.world = el('world', s.stage);
    s.img = el('', s.world, 'img');
    const first = await loadImage(s.frames ? frameSrc(s.frames, 0) : base + s.src);
    const dpr = s.dpr || 3;
    s.size = [first.naturalWidth / dpr, first.naturalHeight / dpr];
    s.world.style.width = s.size[0] + 'px';
    s.world.style.height = s.size[1] + 'px';
    s.img.src = first.src;
    s.shown = first.src;
    if (!s.cam || !s.cam.length) s.cam = [{ at: 0, c: [s.size[0] / 2, s.size[1] / 2], w: s.size[0] }];
    s.markEls = (s.marks || []).map(m => {
      const e = el('mark', s.world);
      if (m.tag) { m.tagEl = el('tag', e); m.tagEl.textContent = m.tag; }
      return e;
    });
  };

  const camAt = (s, lt) => {
    const k = s.cam;
    let i = 0;
    while (i < k.length - 1 && lt >= k[i + 1].at) i++;
    if (i >= k.length - 1) return k[k.length - 1];
    const a = k[i], b = k[i + 1], p = inOut((lt - a.at) / (b.at - a.at));
    return { c: [a.c[0] + (b.c[0] - a.c[0]) * p, a.c[1] + (b.c[1] - a.c[1]) * p], w: a.w + (b.w - a.w) * p };
  };

  const drawCard = (s, lt) => {
    s.parts.forEach((e, i) => {
      const p = out((lt - 0.15 - i * STEP) / 0.32);
      e.style.opacity = p;
      e.style.transform = 'translateY(' + ((1 - p) * 12).toFixed(2) + 'px)';
    });
  };

  const drawShot = async (s, lt) => {
    if (s.frames) {
      const i = Math.min(s.frames.count - 1, Math.max(0, Math.floor(lt * (s.frames.fps || 30))));
      const src = frameSrc(s.frames, i);
      if (src !== s.shown) { s.img.src = src; s.shown = src; try { await s.img.decode(); } catch (e) { problems.push('missing frame: ' + src); } }
    }
    const cam = camAt(s, lt);
    const k = STAGE.w / cam.w;
    const x = cam.c[0] - cam.w / 2, y = cam.c[1] - (STAGE.h / k) / 2;
    s.world.style.transform = 'scale(' + k.toFixed(5) + ') translate(' + (-x).toFixed(3) + 'px,' + (-y).toFixed(3) + 'px)';
    (s.marks || []).forEach((m, i) => {
      const e = s.markEls[i];
      const p = Math.min(out((lt - m.at) / 0.3), out((m.at + m.dur - lt) / 0.3));
      e.style.opacity = lt >= m.at && lt <= m.at + m.dur ? p : 0;
      const pad = 6 / k;
      e.style.left = (m.rect[0] - pad) + 'px'; e.style.top = (m.rect[1] - pad) + 'px';
      e.style.width = (m.rect[2] + pad * 2) + 'px'; e.style.height = (m.rect[3] + pad * 2) + 'px';
      e.style.borderWidth = (3 / k) + 'px'; e.style.borderRadius = (4 / k) + 'px';
      if (m.tagEl) m.tagEl.style.transform = 'scale(' + (1 / k).toFixed(5) + ')';
    });
  };

  const seek = async t => {
    t = Math.max(0, Math.min(duration - 1e-6, t));
    let caption = null, capP = 0;
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i], next = scenes[i + 1];
      const end = s.start + s.dur + (next && next.in === 'fade' ? FADE : 0);
      const on = t >= s.start && t < end;
      s.root.style.display = on ? '' : 'none';
      if (!on) continue;
      s.root.style.opacity = s.in === 'fade' && i > 0 ? out((t - s.start) / FADE) : 1;
      const lt = Math.min(t - s.start, s.dur);
      if (s.type === 'card') drawCard(s, lt); else await drawShot(s, lt);
      if (t < s.start + s.dur) for (const c of s.captions || []) {
        if (lt >= c.at && lt < c.at + c.dur) { caption = c.text; capP = Math.min(out((lt - c.at) / CAP), out((c.at + c.dur - lt) / CAP)); }
      }
    }
    if (caption !== null && capText.textContent !== caption) capText.textContent = caption;
    // The whole caption band fades, so a styled band never shows without its words.
    capText.parentNode.style.opacity = caption === null ? 0 : capP;
    capText.style.transform = 'translateY(' + ((1 - capP) * 8).toFixed(2) + 'px)';
  };

  /* Checks the style rules a machine can check: two-line captions, reading time, text inside the frame. */
  const lint = () => {
    for (const s of scenes) for (const c of s.captions || []) {
      capText.textContent = c.text;
      const lines = Math.round(capText.getBoundingClientRect().height / frame.getBoundingClientRect().height * 720 / (42 * 1.18));
      if (lines > 2) problems.push('caption runs to ' + lines + ' lines: "' + c.text + '"');
      const words = c.text.trim().split(/\s+/).length, need = 1 + words * 0.3;
      if (c.dur < need) problems.push('caption needs ' + need.toFixed(1) + 's, has ' + c.dur + 's: "' + c.text + '"');
      if (/[!—]/.test(c.text)) problems.push('caption has an exclamation mark or em-dash: "' + c.text + '"');
      if (c.at + c.dur > s.dur + 1e-6) problems.push('caption outlasts its scene: "' + c.text + '"');
    }
    capText.textContent = '';
  };

  const start = async () => {
    if (!filmUrl) { document.getElementById('hud').textContent = 'Add ?film=path/to/film.js'; return null; }
    await new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = new URL(filmUrl, location.href).href; sc.onload = res; sc.onerror = () => rej(new Error('cannot load ' + filmUrl)); document.head.appendChild(sc); });
    const film = window.FILM;
    scenes = film.scenes;
    // Caption style: the film's own, unless the URL asks for another (?capstyle=ink) to compare.
    frame.classList.add('cap-' + (qs.get('capstyle') || film.captionStyle || 'paper'));
    let at = 0;
    const waits = [];
    scenes.forEach((s, i) => {
      s.start = at; at += s.dur;
      s.root = el('scene', frame);
      s.root.style.zIndex = i + 1;
      waits.push(s.type === 'card' ? buildCard(s, s.root) : buildShot(s, s.root));
    });
    duration = at;
    await Promise.all(waits);
    await Promise.all(['600 42px "Bricolage Grotesque"', '400 32px "Hanken Grotesk"', '400 26px "IBM Plex Mono"', '500 26px "IBM Plex Mono"'].map(f => document.fonts.load(f)));
    await document.fonts.ready;
    for (const fam of ['Bricolage Grotesque', 'Hanken Grotesk', 'IBM Plex Mono']) if (![...document.fonts].some(f => f.family.replace(/["']/g, '') === fam && f.status === 'loaded')) problems.push('font not loaded: ' + fam);
    lint();
    await seek(0);
    return { duration, fps: film.fps || 30, problems };
  };

  window.seek = seek;
  window.FILM_READY = start();

  // nocaps: frames without the caption band, for the review page, which lays editable captions over them.
  if (qs.has('nocaps')) document.body.classList.add('nocaps');
  if (qs.has('render')) document.body.classList.add('render');
  else window.FILM_READY.then(info => {
    if (!info) return;
    const fit = () => { frame.style.transform = 'scale(' + Math.min(innerWidth / 1280, innerHeight / 720) + ')'; };
    fit(); addEventListener('resize', fit);
    const hud = document.getElementById('hud');
    let t0 = performance.now(), paused = false, t = 0;
    addEventListener('keydown', e => { if (e.key === ' ') { paused = !paused; t0 = performance.now() - t * 1000; } });
    const loop = async () => {
      if (!paused) { t = ((performance.now() - t0) / 1000) % info.duration; await seek(t); hud.textContent = t.toFixed(1) + ' / ' + info.duration.toFixed(1) + 's · space pauses' + (info.problems.length ? ' · ' + info.problems.length + ' problems' : ''); }
      requestAnimationFrame(loop);
    };
    loop();
  });
})();
