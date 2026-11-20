# Possibles

This repository holds Possibles: the process and film kit that turn Antonym & Co experiments into stories (a short captioned video and a concise account). Start at `README.md`.

## Layout

- `.claude/skills/possible-story/SKILL.md`: the process. Follow it to make a Possible.
- `kit/`: the film kit (engine, renderer, script review). Shared by every Possible.
- `<number>-<short-name>/`: one folder per Possible, for example `261117-idea-prospector/`. The number is the experiment's date as YYMMDD.
- `README.md`: what Possibles is, and the register of every Possible with its status.

## Working rules

- Possibles work goes in this repository. The experiments themselves stay in their own repositories. For example, the Inspiration prospector stays in `latent`.
- Capture scripts that need an experiment read it from a checkout next to this repository (for #261117: `../latent`, or `LATENT_DIR`).
- Run every command from this repository's root.
- Keep the register in `README.md` current when a Possible changes status.

## Keeping work safe (Antony does not manage this; Claude does)

At the start of every session:

1. Check for open pull requests and unmerged `claude/` branches in this repository. If one holds Possibles work that this session needs, bring it in before you start.
2. Read the register in `README.md` and the Roma task for the Possible, to see where things stand. Links to review pages are kept in both.

During and at the end of the work:

1. Commit and push after each piece of work that would be painful to redo. Never end a turn with unpushed work.
2. Record every published page (for example, a script review page) by its link in the register and in the Roma task. A page keeps what Antony types into it, so its link must never be lost.
3. End each session with one plain line: "Everything is saved." or what is not saved and why.
4. When work is ready to keep, tell Antony "ready to merge". He replies "merge it", and Claude merges the pull request.
