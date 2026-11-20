# Possibles

This repository holds Possibles: the process and film kit that turn Antonym & Co experiments into stories (a short captioned video and a concise account). Start at `README.md`.

## Layout

- `.claude/skills/possible-story/SKILL.md`: the process. Follow it to make a Possible.
- `kit/`: the film kit (engine, renderer, script review). Shared by every Possible.
- `<number>-<short-name>/`: one folder per Possible, for example `261117-inspiration-prospector/`. The number is the experiment's date as YYMMDD.
- `README.md`: what Possibles is, and the register of every Possible with its status.

## Working rules

- Possibles work goes in this repository. The experiments themselves stay in their own repositories. For example, the Inspiration prospector stays in `latent`.
- Capture scripts that need an experiment read it from a checkout next to this repository (for #261117: `../latent`, or `LATENT_DIR`).
- Run every command from this repository's root.
- Keep the register in `README.md` current when a Possible changes status.
