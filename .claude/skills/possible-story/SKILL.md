---
name: possible-story
description: Turn an Antonym & Co experiment into a Possible - a short captioned video and a concise account that tell one surprising story about it. Use when asked to make, film, write up or publish a Possible, or to turn an experiment, demo or prototype into a story.
---

# Possible story

Possibles are Antonym & Co's working ideas: tangible futures, software to think with. A Possible does not promise a finished product. It invites people to explore an idea, experience it and imagine what might come next.

This skill is the process for turning one experiment into one story. It is written as a GISTO brief: Goals, Information, Steps, Task output, then an Eval that loops back to the Goals.

## Goals

- Attract attention and interest from customers and collaborators for the thinking and services of Antonym & Co.
- Tell one story per experiment that surprises and intrigues. One, not a tour of features.
- Main audience: leaders interested in what AI could do for their organisations. Second audience: innovators and influencers working with AI in their fields.

## Information

Gather all of it before forming a view.

- The experiment itself: the app or demo, run it and look at every part.
- Documentation, the brief it was built from, its sources, and the project context (tasks, notes, the conversation it was built in).
- Any data it produced: sessions, exports, results.
- The maker. Interview them (step 3). The maker's intent and surprises are information nothing else holds.

Every Possible has a number and a name, such as "Possible #261101: Decision Support Viz". The number is the date the experiment was made, as YYMMDD. Its folder is `<number>-<short-name>/`.

Possibles come in kinds (definitions confirmed by Antony, 19 Nov 2026):

- Concept: an idea made tangible enough to try.
- Concept Study: a concept worked through in depth on one question, with what was found.
- Test Case: a concept tried on a real problem with a real organisation.

## Steps

Keep one working file per Possible, `dossier.md`, and fill it in as you go. It is the record a later session picks up from.

1. Review the experiment and its data. Run it. Write down facts and numbers you can point to on screen, and anything that surprised you. Look in the data for a finding the maker may not have seen.
2. Draft the learning in three parts.
   - What: what was made, and the question driving it.
   - So what: what it shows, why that matters to the audience, and which themes, issues and open questions it connects to.
   - What next: whether it will or could be developed, who would find it useful and why. Keep "will" and "could" apart.
3. Interview the maker. Ask at most five questions, made specific by the review: why they made it, what they expected, what surprised them, what they would change, what they want from it next. Ask them as inline cards, one question at a time, each with a few likely answers and room for the maker's own words. Put any finding from the review to the maker as a question: they may see a flaw where you see a story. Add the answers to the dossier in their own words, then revise step 2.
4. Look for the stories that could be told. A story has a hook (the first five seconds), one claim, the proof on screen, and a reason the audience should care. Aim for three to five that differ in kind, for example: a surprising finding, a question the audience already has, one object followed closely, the maker's account, a doubt.
5. Present the stories for a decision, with a recommendation. Stop here. Do not film until the maker has chosen.
6. Offer treatments if the maker wants them: two or three ways to tell the chosen story, each as a short outline of scenes and a sample caption. Stop for the choice.
7. If the experiment has only been run on example or test data, make a live run first: a real question, answered by the real model, with every prompt and answer kept. Capture footage from the real experiment (`capture.mjs`), write the shot list as a film spec (`film.js`), render stills and check them, then render the film.
8. Write the account.
9. Run the Eval. Fix what fails.
10. Open the script review. Build it with `node kit/storyboard.mjs <id>/film.js`, then publish `review/index.html` as an artifact with the rest of `review/` as its files, declaring `{db: {}, user: {scopes: ["profile"]}}`. Keep the same artifact for every round. On the page the maker edits captions and card text over the real frames, pins comments on pictures, marks scenes to reshoot or cut, and presses Finish review. A line that breaks a house rule blocks sending.
11. When the maker says the review is in, export the page's store with ArtifactData (`edits`, `comments`, `review` into `review/inbox`), run `node kit/review.mjs check <id>/film.js`, add the fact check against the footage and captures, and write the report and plan to `review/state` with status `checked`. Reply to each comment on its own document.
12. Make no change to the film until the page reads `approved`. Then run `review.mjs apply`, retime, recapture what the plan says, render, check stills, and rebuild the storyboard with `--round` one higher. Republish the same artifact, and resolve the comments that were dealt with.
13. File it: commit the dossier, account, film spec and video, and add the Possible to the register in `README.md`.

## Task output

A video and a concise account of the experiment.

Video:

- 60 to 90 seconds, 1920 by 1080, silent, carried by captions. It must work with the sound off.
- It tells its story with cuts, pans, cross-fades and caption design. Move the camera for a reason: to arrive at the thing the caption is about.
- It opens on an attention hook, then the ident: "Possible #261101: Decision Support Viz".
- It follows what, so what, what next. The structure can be explicit, as section cards, or implicit.
- Look and caption voice follow the `antonym-video-style` skill. Read it before writing captions. The kit in `kit/` builds that style in.
- The Antonym wordmark appears once, on the end card. Use the real logo files in `kit/assets/logos/`. Never redraw them. The wordmark has a clear background. The A-mark carries its own pale grey ground.

Account (`account.md`):

- At most 200 words. One line of facts (number, kind, date, maker, status, link), then what, so what, what next in a short paragraph each.
- Plain English. British spelling. No em dashes.

Planned for later versions (asked 19 Nov 2026, not built yet): each video in 9:16 portrait as well as 16:9, and a slide version of each story with images and text.

## Honesty rules

- Film only what the experiment really did. If a capture needs a stand-in for a live model or service, nothing the stand-in wrote may appear on screen.
- Every number in a caption must be readable off the experiment or its data. Note in the dossier where each one comes from.
- If something has not been tested, leave it out or say so. A Possible is allowed to end on a doubt.
- Say whose judgement a claim is. A model's score is a judgement, not a measurement.

## Eval

Check the finished film and account against the Goals.

- Hook: would a busy leader keep watching after five seconds? Is the first caption concrete?
- One story: can you say the film's claim in one sentence, and does every scene serve it?
- So what: is it clear why this matters to someone running an organisation, without being told to care?
- What next: does the film end on a real next step, a question or a doubt, and not a slogan?
- Truth: does it pass every honesty rule?
- Style: do the stills pass the `antonym-video-style` checklist, and does the renderer report no caption checks?
- Possibles: does it invite the viewer to imagine what comes next, without promising a product?

## The kit

Run from the repository root. Playwright and ffmpeg must be installed.

- `kit/player.html?film=../<folder>/film.js` previews a film in a browser. Space pauses.
- `node kit/render.mjs <folder>/film.js --stills 2,8,15` writes check stills to `out/stills/`.
- `node kit/render.mjs <folder>/film.js` writes `out/film.mp4`.
- The renderer warns when a caption runs past two lines, is on screen too briefly to read, or outlasts its scene.
- `kit/engine.js` documents the film spec at the top. Scenes are cards (text on paper) and shots (a still or a frame sequence, with camera keyframes, gold marks and captions). A scene opens with a hard cut or a 300ms cross-fade.
- `kit/storyboard.mjs` builds the script review: a clean frame per caption, every line's text and timing, the cut and a poster, with the page from `kit/review.html`. A film spec needs `meta: { number, name, slug }` and a `part` on each scene (Hook, What, So what, What next).
- `kit/review.mjs check|apply` is the back half of the review: it checks sent edits against the renderer and the house style, drafts the report and plan, and writes approved edits into the spec.
- The page's store holds `edits/<line id>` (round, text, base, by, at), `comments/<id>` (round, scene, target image|line|scene, kind note|reshoot|cut, text, x, y, beat, line, resolved, replies) and `review/state` (round, status open|submitted|checked|approved, note, and from Claude: headline, summary, report [{scene, level error|warning|ok, text}], plan [{scene, action edit|retime|reshoot|cut|note, text}]). Claude writes replies with `by: "claude"`.
- `261117-inspiration-prospector/` is the worked example: `capture.mjs` and `live-run.mjs` for footage, `film.js` for a spec, `review/` for the script review.
