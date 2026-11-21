/* Possible #261117: Idea prospector (made as Inspiration prospector). Treatment 1, "The question".
   Footage is the live run of 19 Nov 2026 (live/session.json), filmed at rest by capture.mjs with
   SELECT="Sell the checking, not drafting" NAME="Idea prospector". Coordinates are CSS px from captures/rects.json.
   Every quoted line and number is on screen in the footage. The film stays off distance and centre. */
window.FILM = {
  meta: { number: '261117', name: 'Idea prospector', slug: 'idea-prospector' },
  fps: 30,
  scenes: [
    // Hook
    { type: 'card', part: 'Hook', variant: 'statement', dur: 4.6, title: 'How could a professional services firm grow when AI does the drafting?' },
    { type: 'card', part: 'Hook', variant: 'statement', dur: 4.4, title: 'Surprise is a superpower.\n\nWhen you’re surprised you’ve found something new.' },
    { type: 'card', part: 'Hook', variant: 'ident', in: 'fade', dur: 3.6, kicker: 'Possible #261117', title: 'Idea prospector', sub: 'Search for good ideas.' },

    // What: dimensions first, then ideas, then the map
    {
      type: 'shot', part: 'What', in: 'fade', dur: 9.6, dpr: 3, src: 'captures/frames.png',
      cam: [{ at: 0, c: [330, 330], w: 640 }, { at: 3.0, c: [330, 330], w: 640 }, { at: 4.8, c: [950, 765], w: 820 }, { at: 6.6, c: [950, 765], w: 820 }, { at: 7.6, c: [950, 868], w: 820 }],
      marks: [{ at: 5.0, dur: 1.8, rect: [596, 636, 222, 24] }, { at: 7.5, dur: 1.8, rect: [596, 941, 254, 24] }],
      captions: [
        { at: 0.3, dur: 3.9, text: 'Every problem has an idea space.' },
        { at: 4.6, dur: 4.7, text: 'Its tensions are the longitude and latitude.' },
      ],
    },
    {
      type: 'shot', part: 'What', dur: 7, dpr: 3, src: 'captures/cards.png',
      cam: [{ at: 0, c: [322, 518], w: 580 }, { at: 2.4, c: [322, 518], w: 580 }, { at: 4.6, c: [680, 518], w: 580 }],
      captions: [
        { at: 0.3, dur: 3.5, text: 'A rush of ideas.' },
        { at: 4.2, dur: 2.6, text: '“A midnight contract vending machine.”' },
      ],
    },
    {
      type: 'shot', part: 'What', in: 'fade', dur: 9.8, dpr: 2,
      frames: { dir: 'captures/orbit', count: 300, fps: 30 },
      cam: [{ at: 0, c: [464, 300], w: 928 }, { at: 9.8, c: [484, 310], w: 760 }],
      captions: [
        { at: 0.4, dur: 4.7, text: 'Every idea gets a place on the map.' },
        { at: 5.4, dur: 4.2, text: 'You can argue with the scores. (It creates more ideas.)' },
      ],
    },

    // So what: the empty regions, and the one called the sensible middle
    {
      type: 'shot', part: 'So what', dur: 11.8, dpr: 3, src: 'captures/gaps.png',
      cam: [{ at: 0, c: [386, 330], w: 716 }, { at: 5.0, c: [386, 330], w: 716 }, { at: 6.8, c: [386, 480], w: 716 }],
      marks: [{ at: 7.2, dur: 4.2, rect: [97, 455, 95, 20] }],
      captions: [
        { at: 0.3, dur: 6.2, text: 'Be curious about spaces with no ideas. This may be where the least obvious opportunities are found.' },
        { at: 6.8, dur: 4.8, text: 'Safe means boring. Creativity is found in the impossible, unfashionable or unexplored.' },
      ],
    },
    {
      type: 'shot', part: 'So what', dur: 12, dpr: 3, src: 'captures/gaps.png',
      cam: [{ at: 0, c: [386, 1896], w: 716 }, { at: 12, c: [386, 1900], w: 708 }],
      marks: [{ at: 0.6, dur: 3.4, rect: [97, 1877, 116, 20] }, { at: 8.2, dur: 3, rect: [97, 1922, 250, 68] }],
      captions: [
        { at: 0.3, dur: 4, text: 'Unfashionable: practical moves with a slight twist.' },
        { at: 4.6, dur: 2.8, text: '“The sensible middle stays empty.”' },
        { at: 7.7, dur: 4.1, text: 'Asked to fill it, Claude put three new ideas there.' },
      ],
    },
    {
      type: 'shot', part: 'So what', in: 'fade', dur: 10.8, dpr: 3, src: 'captures/stretch-2.png',
      cam: [{ at: 0, c: [1140, 256], w: 440 }, { at: 10.8, c: [1146, 258], w: 410 }],
      captions: [
        { at: 0.4, dur: 3.8, text: 'One of them: sell the checking, not the drafting.' },
        { at: 4.5, dur: 6.0, text: 'Clients draft with their own AI. The firm checks it, improves it and vouches for it.' },
      ],
    },
    {
      type: 'shot', part: 'So what', dur: 3.6, dpr: 3, src: 'captures/stretch-0.png',
      cam: [{ at: 0, c: [500, 505], w: 940 }],
      captions: [{ at: 0.3, dur: 3.0, text: 'Stretched towards order, the idea breaks.' }],
    },
    {
      type: 'shot', part: 'So what', in: 'fade', dur: 7.2, dpr: 3, src: 'captures/stretch-4.png',
      cam: [{ at: 0, c: [500, 505], w: 940 }, { at: 3, c: [500, 505], w: 940 }, { at: 4.4, c: [500, 560], w: 900 }],
      captions: [
        { at: 0.4, dur: 2.6, text: 'Towards chaos, it breaks again.' },
        { at: 3.5, dur: 3.5, text: 'It needs free drafting but a bounded sign-off.' },
      ],
    },

    // What next
    { type: 'card', part: 'What next', variant: 'section', dur: 4.2, kicker: 'What next', title: 'This is version 0. Next come real questions.' },
    { type: 'card', part: 'What next', variant: 'end', in: 'fade', dur: 4.6, bar: false, title: 'What is your question?', logo: '../kit/assets/logos/antonym-wordmark.png' },
  ],
};
