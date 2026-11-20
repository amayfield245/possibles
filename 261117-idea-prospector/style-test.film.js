/* Style test for Possible #261117. It shows the look and the moves: cold open, ident, live footage with a push-in,
   a pan with gold marks, a hard cut to a section card. It is not the film: the story has not been chosen yet. */
window.FILM = {
  fps: 30,
  scenes: [
    { type: 'card', variant: 'statement', dur: 4, title: 'Ask an AI for ideas and it drifts to the average answer.' },
    { type: 'card', variant: 'ident', in: 'fade', dur: 3.8, kicker: 'Possible #261117', title: 'Inspiration prospector', sub: 'Software to think with.' },
    {
      type: 'shot', in: 'fade', dur: 9, dpr: 2,
      frames: { dir: 'captures/orbit', count: 270, fps: 30 },
      cam: [{ at: 0, c: [464, 290], w: 928 }, { at: 9, c: [500, 300], w: 740 }],
      captions: [
        { at: 0.4, dur: 4, text: 'One question. 43 ideas, placed by what they are like.' },
        { at: 4.8, dur: 4, text: 'The shaded blocks are regions with no idea in them.' },
      ],
    },
    {
      type: 'shot', dur: 10, dpr: 3, src: 'captures/gaps.png',
      cam: [{ at: 0, c: [384, 474], w: 680 }, { at: 1.6, c: [384, 474], w: 680 }, { at: 5.8, c: [384, 768], w: 680 }],
      marks: [{ at: 1.2, dur: 3, rect: [97, 455, 95, 20] }, { at: 6, dur: 3.4, rect: [97, 793, 95, 20] }],
      captions: [
        { at: 0.4, dur: 4.6, text: '12 of its 27 regions are empty. Each one needs a verdict.' },
        { at: 5.6, dur: 3.9, text: 'Impossible, unfashionable – or nobody has looked.' },
      ],
    },
    { type: 'card', variant: 'section', dur: 3.6, kicker: 'So what', title: 'Why is nobody here?' },
  ],
};
