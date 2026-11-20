/* Possible #261106: The Marbling Atelier. Story A, treatment 1 (forwards, then back), with Antony's line as the
   opening and his lesson as the so what (dossier, 20 Nov 2026).
   Footage is the app as published on 6 Nov 2026, filmed by capture.mjs. Coordinates are CSS px in each capture.
   Every number in a caption is on screen in the app: 26 patterns in the book, 9 passes and 1,481 strokes on the
   specimen label, "pass 0 of 9" on the history bar. Nothing in the app is a model's output at run time. */
const STUDIO = { dir: 'captures/studio', fps: 30 };
// First frame of each pass in captures/studio (captures/rects.json, studio.passes).
const PASS = { throw: 0, stylus: 165, comb: 270, wave: 297, end: 328 };

window.FILM = {
  meta: { number: '261106', name: 'The Marbling Atelier', slug: 'marbling-atelier' },
  fps: 30,
  scenes: [
    // Hook: the combs drawn through, close on the bath, then the masthead and its lineage.
    {
      type: 'shot', part: 'Hook', dur: 6, dpr: 2,
      frames: { ...STUDIO, start: PASS.comb, count: PASS.end - PASS.comb, fps: 14 },
      cam: [{ at: 0, c: [662, 471], w: 760 }, { at: 6, c: [662, 471], w: 660 }],
      captions: [{ at: 0.4, dur: 5.4, text: 'From one prompt, Fable researched and built an app.' }],
    },
    {
      type: 'shot', part: 'Hook', in: 'fade', dur: 5.6, dpr: 2, src: 'captures/page.png',
      cam: [{ at: 0, c: [430, 176], w: 820 }, { at: 1.4, c: [430, 176], w: 820 }, { at: 4.6, c: [1185, 176], w: 820 }],
      captions: [{ at: 0.3, dur: 5.1, text: 'It explores nine centuries of the craft of paper marbling.' }],
    },
    { type: 'card', part: 'Hook', variant: 'ident', in: 'fade', dur: 3.6, kicker: 'Possible #261106', title: 'The Marbling Atelier', sub: 'Fable is an AI model made by Anthropic.' },

    // What: the pattern book, a pattern worked pass by pass, a sheet laid down and bound.
    {
      type: 'shot', part: 'What', in: 'fade', dur: 9, dpr: 2, src: 'captures/page.png',
      cam: [{ at: 0, c: [1220, 560], w: 760 }, { at: 1.6, c: [1220, 560], w: 760 }, { at: 8.6, c: [1220, 1380], w: 760 }],
      captions: [
        { at: 0.3, dur: 3.6, text: 'Its pattern book holds 26 patterns.' },
        { at: 4.2, dur: 4.6, text: 'Japan, Persia, Istanbul and Europe, each with its place and date.' },
      ],
    },
    {
      type: 'shot', part: 'What', dur: 10.4, dpr: 2,
      frames: { ...STUDIO, start: PASS.throw, count: PASS.comb - PASS.throw, fps: 30 },
      cam: [{ at: 0, c: [800, 360], w: 1600 }, { at: 4, c: [800, 360], w: 1600 }, { at: 9.6, c: [662, 471], w: 1120 }],
      captions: [
        { at: 0.3, dur: 4.9, text: 'Choose one, and the app works it on the bath, pass by pass.' },
        { at: 5.4, dur: 4.8, text: 'The Bouquet: six colours from the whisk, then the stylus.' },
      ],
    },
    {
      type: 'shot', part: 'What', in: 'fade', dur: 6, dpr: 2, src: 'captures/proof.jpg',
      cam: [{ at: 0, c: [455, 366], w: 900 }, { at: 6, c: [470, 366], w: 820 }],
      captions: [{ at: 0.3, dur: 5.5, text: 'Lay down a sheet, and it takes up the whole pattern in one print.' }],
    },
    {
      type: 'shot', part: 'What', dur: 5.6, dpr: 2, src: 'captures/specimen.png',
      cam: [{ at: 0, c: [800, 600], w: 1150 }, { at: 1.2, c: [800, 600], w: 1150 }, { at: 5.6, c: [930, 625], w: 1080 }],
      captions: [{ at: 0.3, dur: 5.1, text: 'Then it shows the sheet bound as a book, in half morocco.' }],
    },

    // So what: nothing can be undone in a real bath; here the history runs back. Then Antony's lesson.
    {
      type: 'shot', part: 'So what', in: 'fade', dur: 4.4, dpr: 2, src: 'captures/proof.jpg',
      cam: [{ at: 0, c: [455, 190], w: 900 }],
      captions: [{ at: 0.3, dur: 3.9, text: '“A bath gives one good print,” the app says.' }],
    },
    {
      type: 'shot', part: 'So what', dur: 10, dpr: 2,
      frames: { dir: 'captures/history', count: 10, fps: 1.6 },
      cam: [{ at: 0, c: [455, 366], w: 900 }, { at: 6.6, c: [455, 366], w: 900 }, { at: 8, c: [455, 807], w: 900 }],
      captions: [
        { at: 0.3, dur: 4.2, text: 'In a real bath, nothing can be undone.' },
        { at: 4.8, dur: 5, text: 'Here, all 1,481 strokes can, pass by pass, back to a clean bath.' },
      ],
    },
    { type: 'card', part: 'So what', variant: 'statement', in: 'fade', dur: 5.6, title: 'Frontier models now make apps rich enough to explore in their own right.' },
    { type: 'card', part: 'So what', variant: 'statement', dur: 5.2, title: 'Far from the idea of “single-use software”.' },

    // What next
    { type: 'card', part: 'What next', variant: 'section', in: 'fade', dur: 5, kicker: 'What next', title: 'I keep going back, to learn the craft and its history.' },
    {
      type: 'shot', part: 'What next', in: 'fade', dur: 5.6, dpr: 2, src: 'captures/page.png',
      cam: [{ at: 0, c: [1050, 1767], w: 900 }, { at: 5.6, c: [1250, 1800], w: 700 }],
      captions: [{ at: 0.3, dur: 5.1, text: 'No marbler has checked a word of it yet.' }],
    },
    { type: 'card', part: 'What next', variant: 'end', in: 'fade', dur: 4.6, bar: false, title: 'Is it right? We would like a marbler to tell us.', logo: '../kit/assets/logos/antonym-wordmark.png' },
  ],
};
