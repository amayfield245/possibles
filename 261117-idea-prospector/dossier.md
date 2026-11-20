# Possible #261117: Idea prospector

Made as Inspiration prospector. Renamed by Antony in the script review, 19 Nov 2026. The published tool keeps its old name for now.

Working file for the story. Started 19 Nov 2026. Status: round 2 cut made from the script review. Round 2 of the review is open.

## Facts

- Kind: Concept.
- Made: 17 Nov 2026, as a single-file Claude artifact, from a draft brief of the same date. Version 0.
- Sources named in the app: Stephanie Hubbard's Latent Space Exploration Brief for Hive (12 Nov 2026) and Kevin Kelly's "Latent Space as a New Medium".
- Published at https://claude.ai/artifact/EZ9sZJpfEAtPE4xWjDRyQm. Source is in this repository.
- Tested: every view and flow passes a headless test with a stand-in for Claude. The live Claude calls have not been run yet, and no real problem has been put through it.
- Footage so far shows the example session only: 43 ideas written and scored by Claude when the tool was built. That is real model output, but it is not a live run.

## Review

### What

A tool that maps the ideas a model can give you for one problem, so you can see where they bunch and where there are none.

You state a problem as a question. The tool sets up dimensions, each a named line with two poles. Four come from the Hive brief (Order to Chaos, Function to Emotion, Predictable to Surprising, Mainstream to Niche). Claude proposes four more: an era, an art movement, a rival industry and a wildcard. Claude then writes ideas in batches of ten and scores each one from -1 to 1 on every dimension, with a one-line reason. Later batches are told which poles the map has barely reached.

The ideas are drawn as points in a 3D space and a 2D slice. Around that sit five instruments:

- The obvious answer. The first idea must be the one an average model would give first. It is marked, and every idea is measured from it.
- Distance from the centre of all the ideas.
- The 1750s test, from 0 to 10: would this sound mad to a sensible person today, the way a phone call across the world would have sounded in 1750?
- The gap finder. The space is cut into 27 regions. An empty one cannot be filled until it has a verdict: impossible, unfashionable or unexplored.
- The stretch test. One idea is pulled along one dimension in five stops, to find where it breaks.

The question driving it, in the tool's own words to Claude: "Language models drift toward the average answer, so work against that on purpose." Can you see the average, and steer away from it deliberately?

The example session asks "What is the future of playable software for a game studio?" It holds 43 ideas on 8 dimensions. On the default axes, 12 of 27 regions are empty.

### So what

- Leaders already suspect that everyone asking the same models gets the same ten ideas. This makes that worry visible. The average becomes a landmark on a map, and stops being the answer.
- The empty space is more interesting than the points. A gap with a reason is a strategic claim. "Unfashionable" is the useful one: it could work, but taste, markets or habit ignore it. In the example, the unfashionable region is orderly, sentimental and mass-market: "greeting-card territory. Studios find it uncool, though the audience is large."
- A finding in the data (found in this review, to check with the maker). On this map the ordinary ideas are the outliers. The five ideas furthest from the centre score an average of 0.6 out of 10 on the 1750s test. The furthest of all is "Playable ads studio", noted as "An existing industry." The obvious answer, "Playable onboarding", is the third furthest out, at 0.73 against a median of 0.49. The idea nearest the centre is "Game master for decisions". Tell a model to avoid the average and it builds a new average somewhere stranger. "Far from the centre" then means far from this session's habits, not far from the world's.
- Every score is Claude's judgement, not a measurement. The app says so on every page: "Run it again and a score can move." The map is an argument to have, not a result to trust. That is what "software to think with" means here.
- It changes the posture from asking to navigating. You choose the dimensions, so you choose what matters. That choice is the leadership part.
- Themes it connects to: sameness in AI-assisted strategy and creative work, where contrarian opportunity sits, human judgement in the loop, and whether a map made of opinions can be trusted.

### What next

- Will (already planned in the task list): run a real question through it live, starting with Anorak's.
- Could: run the same question twice and compare the maps, to see how far the scores move. Plot a team's own brainstorm on the map to see where the team bunches. Use it in a workshop, where choosing the dimensions is the conversation. Add measured distances beside the judged ones.
- Who would find it useful: strategy and innovation leads, creative directors and studio heads, people who run idea portfolios, and facilitators. Why: it turns "be more original" into a place you can point at.

Where the numbers come from: the app's header and readouts for the example session, and `src/data.js` read with the app's own `Core.stats`. The 1750s averages and the distance ranking were worked out in this review from the same data.

## Maker interview

Antony Mayfield, 19 Nov 2026, by inline cards. His own words are in quotation marks. The rest are options he chose.

1. Why did you want this made? "Every problem has a possibility space. The obvious answers are the average, unexciting and most competed for... How can we look for radical new ideas in under-imagined, under-explored spaces?"
2. What surprised or pleased you? The map itself: seeing ideas as points in a space you can turn. And the gaps and verdicts: empty regions that must be called impossible, unfashionable or unexplored.
3. The review's finding, that the ordinary ideas sit at the edge of the map and the strange ones at the centre? It is a flaw to fix. The centre should be the obvious answers. It is not a story.
4. Who should watch, and do what? Leaders. They should start a conversation with Antonym & Co about their own problem.
5. What next? Run real questions through it, and use it with clients.

Decisions from the same session:

- Film the tool as it is. Do not fix the centre first. Keep the film away from distance and centre.
- Make the live run ourselves, on this question: "How could a professional services firm grow when AI does the drafting?"
- The Inspiration prospector is a good pilot: "fairly simple but a v cool visual and idea".

What the interview changed in the review: the "ordinary ideas are the outliers" finding moves from So what to a known flaw. The driving question is now in the maker's words, and it is about competition as much as originality: the obvious answers are the most competed for.

## Stories

First pass, before the interview. Each has a hook, a claim and its proof on screen.

1. The obvious answer is an outlier. Hook: "We asked an AI to avoid the average. It made a new one." Claim: steering a model away from the average moves the average. Proof: the obvious answer marked at the edge, the five furthest ideas all ordinary, "Game master for decisions" at the centre. Ends on a doubt: far from what? Kind: surprising finding.
2. Why is nobody here? Hook: "The most interesting thing on this map is where there is nothing." Claim: an empty region is only useful once you say why it is empty. Proof: 12 of 27 regions empty, the three verdicts, greeting-card territory filled with three ideas. Kind: a question leaders already have about white space.
3. Funeral for a save file. Hook: "A ceremony for ending a long game: witnesses, a eulogy, then deletion." Claim: you can ask for strangeness on purpose and measure it. Proof: one idea followed across the tool, 9 out of 10 on the 1750s test, its position, its distance from the obvious. Kind: one object followed closely.
4. A map made of opinions. Hook: "Every number on this map is an opinion." Claim: the judgements are the point, because they give you something to argue with. Proof: the one-line reason beside every score, the footer note, a score you disagree with. Kind: a doubt, taken seriously.

Recommendation: story 1, with the gaps from story 2 as its second act. It is the only one that is a finding and not a feature. It is concrete, a little uncomfortable, and true to "delighted but sceptical". It needs the maker to agree the finding is fair, and it is stronger if a live run shows the same pattern.

## Live run

Made 19 Nov 2026, because the tool had only ever been run on its example. Question: "How could a professional services firm grow when AI does the drafting?"

- 8 real Claude calls, model claude-fable-5-2, about $1.04. The app's own prompts were sent unedited through the Claude Code command line with no tools, because the artifact runtime cannot be reached from a script. Every prompt and answer is in `live/calls/`. The session is `live/session.json` and opens in the published artifact.
- Result: 43 ideas on 8 dimensions. On the default axes, 12 of 27 regions are empty.
- Dimensions Claude proposed: Guild workshop to Factory line, Bauhaus plain to Baroque flourish, Formula One pit to Michelin kitchen, Silent machine to Signing ceremony.
- Ideas include: Bespoke illuminated contracts, Midnight contract vending machine, The firm that grieves with you, Pay clients for disagreement, Advice only for beekeepers.
- Verdicts on the eight largest gaps: two impossible, three unfashionable, three unexplored. One was judged again when it was filled.
  - Impossible: "Predictable chaos stops being chaos, so ideas here cancel themselves out."
  - Unfashionable: "Steady, ritual client care such as birthday calls and annual lunches works well, but it seems old fashioned next to talk of AI."
  - Unexplored: "Loose, feeling-led ideas of middling novelty, such as open house client days or drop-in clinics, could work. Nobody has yet looked here."
- The gap that was filled: "Middling, practical moves with a slight twist get little attention. Talk about AI in firms favours either safe efficiency plays or bold reinventions, so the sensible middle stays empty." Three ideas landed in it: Sell the checking, not drafting. Juniors placed inside clients. Weekly client problem sweep.
- Stretch test on "Sell the checking, not drafting" along Order to Chaos: "It breaks at both ends: full order takes drafting back from the client, full chaos makes the guarantee uninsurable. The idea needs free drafting but a bounded sign-off."
- The flaw shows here too. One verdict reads: "This is the home of ordinary efficiency moves like cross-selling and price cuts. Too obvious to list, so the map skipped them." The film leaves that gap out.

## Decision

Story: "Why is nobody here?", told on the live run. The other stories are dropped or folded in. The maker asked to see treatments before choosing how to tell it.

## Treatments

Three ways to tell the story. Opening frames are in `out/treatments.png`.

1. The question. About 75 seconds. Follows one real question through the tool, start to finish. Structure is implicit.
   - Hook: the question on paper. Then: "Ask an AI and you get the answers everyone gets."
   - Ident: Possible #261117: Inspiration prospector.
   - What: Claude names four new dimensions. 40 ideas arrive. The map turns.
   - So what: 12 of 27 regions hold nothing. Each needs a verdict. Pan to the gap the tool called unfashionable: the sensible middle. Three ideas land in it.
   - Close on one: "Sell the checking, not drafting." Stretch it. It breaks at both ends.
   - What next: "What is your question?" Wordmark.
   - Sample caption: "Let clients draft with their own AI. Charge to check it, and stand behind it."
2. The empty middle. About 60 seconds. Opens cold on the finding, then goes back to show how the tool got there. Section cards say What, So what, What next.
   - Hook: "We asked an AI where nobody is looking. It said: the sensible middle."
   - Sample caption: "Talk about AI in firms favours safe efficiency or bold reinvention. That is Claude's judgement, not a measurement."
3. Three verdicts. About 70 seconds. Three chapters, each a single word on paper and one real gap from the map. More typographic, less of a walkthrough.
   - Impossible: "Predictable chaos stops being chaos."
   - Unfashionable: "Birthday calls and annual lunches still work. They seem old fashioned next to talk of AI."
   - Unexplored: "Open house client days. Drop-in clinics. Nobody has yet looked here."
   - Ends on a question: which of your empty spaces are which?

Recommendation: treatment 1, borrowing the three-word beat from treatment 3 for its middle. It shows the whole tool to a leader who has never seen it, and it lands on an idea a managing partner could act on.

Chosen by Antony, 19 Nov 2026: treatment 1, The question.

## The film

`film.js` is the shot list. `out/possible-261117-inspiration-prospector.mp4` is the first cut, about 86 seconds, 1920 by 1080, silent.

Where each caption's facts come from:

- "Claude proposed four": the four dimensions tagged Claude on the Frames page.
- "40 ideas, pushed to the far ends": the seed prompt asks for ideas at the far ends of each dimension. 40 came back in four batches.
- "12 of the 27 regions": the Gap finder's own sentence, read after one gap had been filled.
- "The sensible middle stays empty", "practical moves with a slight twist": Claude's verdict on the filled gap, on screen.
- "Clients draft with their own AI...": the idea's description in its readout.
- "It breaks", "free drafting but a bounded sign-off": the stretch test's stops and its summary line.
- "Every score is Claude's judgement, not a measurement": the app's footer.
- "The obvious answers ... most competed for" and "real questions, with clients": the maker interview.

Eval against the goals, by Claude. The maker's view is still to come.

- Hook: the first frame is the question a services leader is already asking. Pass.
- One story: a tool that shows where nobody is looking, and what it found for one real question. Every scene serves it.
- So what: carried by the second card and the sensible middle. It is implicit. A leader has to make the link to their own firm.
- What next: ends on the viewer's question. There is no contact line yet, so "start a conversation" has nowhere to go.
- Truth: every number and quote is on screen in the footage. The idea cards show "from centre" figures in small type, which the maker asked the film to stay off. The captions never mention them.
- Style: stills checked. The renderer reports no caption problems. One accent colour. Wordmark once, on the end card.
- Length: 86 seconds, inside the 60 to 90 second range but longer than the 75 the treatment promised.

## Script review, round 1

Sent by Antony on 19 Nov 2026 at 21:43 UTC: 17 lines changed, no comments. Checked by Claude the same evening.

- All 17 meet the house style and fit on screen.
- Raised: a typo in scene 7 (“Creativity if found”), a missing object in scene 9 (“validates”), and the rename to Idea prospector, which clashes with the app’s own header in every footage shot.
- Plan posted to the page: write in the changes, correct the two lines, rename in the film and recapture footage with the new header, retime eight lines. The film grows to about 1:32.
- Fixed in the kit while checking: line breaks typed on the page are now kept in the film, and `review.mjs` escapes them.
- Approved by Antony on 20 Nov 2026 at 03:21 UTC.

Applied on 20 Nov 2026:

- The 16 line edits written in by `review.mjs apply`, plus the rename, the two corrections and the retiming by hand.
- Footage recaptured with the app's heading reading Idea prospector (`NAME` in `capture.mjs`). Correction to the report: I said every footage shot shows the app's heading. None does, because the camera never frames the top of the app, so the recapture was not needed. It changed nothing on screen.
- The film is now 93 seconds, past the 60 to 90 second target, because eight lines needed longer to read.
- Fixed while applying: the engine's preview loop had attached itself to the wrong condition when the caption-free mode was added, so renders kept rewinding to the first scene. The round 1 cut was rendered before that change and was not affected.
- The round 1 cut stays at `out/possible-261117-inspiration-prospector.mp4` for comparison. The round 2 cut is `out/possible-261117-idea-prospector.mp4`.

## Footage notes

- `capture.mjs` films a session at rest: the live one when given `live/session.json`, or else the example. A stand-in for Claude is installed so the buttons look live. Nothing it writes can reach the screen, because nothing that generates is pressed.
- Capture for the film: `SELECT="Sell the checking, not drafting" ORBIT_FRAMES=300 node 261117-idea-prospector/capture.mjs 261117-idea-prospector/live/session.json`.
- `style-test.film.js` renders `out/style-test.mp4`, 30 seconds. It tests the look and the moves. It is not the film.
- `style-test.film.js` was framed on the example session. Re-capture without a session file before rendering it again.
- The logo files are in `kit/assets/logos/`.
