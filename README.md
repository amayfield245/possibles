# Possibles

Working ideas. Tangible futures. Software to think with.

Possibles is the umbrella for Antonym & Co's experiments, told as stories. A Possible does not promise a finished product. It invites people to explore an idea, experience it and imagine what might come next. Within it, Concepts, Concept Studies and Test Cases name different kinds of work.

Each Possible ends in a short captioned video and a concise account, made for leaders interested in what AI could do for their organisations.

## The process

The process is a skill: `.claude/skills/possible-story/SKILL.md`. In Claude Code in this repository, ask for a Possible story or run `/possible-story`. In short:

1. Review the experiment and its data.
2. Draft what, so what, what next.
3. Interview the maker.
4. Find the stories that could be told.
5. Present them. The maker chooses.
6. Offer treatments, if wanted.
7. Capture, cut and render the film. Write the account.
8. Check both against the goals.
9. Open the script review page. The maker edits captions on the frames and comments on pictures, then sends it. Claude checks it and posts a plan. Once the maker approves, Claude edits the film and reshoots scenes, and a new round opens.
10. File the finished film and account here.

## What is here

- `kit/`: the film kit. A timeline engine, the Antonym video style sheet, the fonts and a frame-by-frame renderer.
- One folder per Possible, named by number and short name. Each holds `dossier.md` (the working file), `capture.mjs`, a film spec and `out/` for renders.

## Register

| Number | Name | Kind | Status |
|---|---|---|---|
| #261117 | Inspiration prospector | Concept | First cut made. Script review round 1 is open: https://claude.ai/artifact/VaoCDusTU8z3TnQG2bzfn8 |

## Render a film

The footage for #261117 comes from the Inspiration prospector, which lives in the `latent` repository. The capture scripts expect a checkout of `latent` next to this repository (`../latent`). Set `LATENT_DIR` to use another place.

Build the app, in the `latent` checkout:

```bash
node build.mjs
```

Capture the footage, from this repository's root:

```bash
SELECT="Sell the checking, not drafting" ORBIT_FRAMES=300 node 261117-inspiration-prospector/capture.mjs 261117-inspiration-prospector/live/session.json
```

Render the film:

```bash
node kit/render.mjs 261117-inspiration-prospector/film.js --out 261117-inspiration-prospector/out/possible-261117-inspiration-prospector.mp4
```

The capture needs the five CDN scripts in the `latent` checkout's `test/libs/`, as its smoke test does. The renderer needs Playwright and ffmpeg.
