# AGENTS.md

Agent-facing entry for the **dronetones** skill. Human-facing docs are in [`README.md`](README.md); this file is for an LLM agent that lands here cold.

## You are here

This is an Anthropic-spec skill that wraps **DroneTones**, a browser-based generative drone synthesizer at <https://drone.toneflow.io/>. Your job is to operate the instrument on the user's behalf: narrate it (interactive mode) or dial in a sound and capture it (agent-driven mode).

## Read in this order

1. [`SKILL.md`](SKILL.md) — full operating manual: mental model, control IDs, canonical scripts, known quirks.
2. [`scripts/take.yaml`](scripts/take.yaml) — the canonical recipe. Run this; do not author a replacement.
3. [`scripts/scrape-recipe.js`](scripts/scrape-recipe.js) + [`scripts/record-async.js`](scripts/record-async.js) — the canonical session scripts.

## Hard rules

- **Use the canonical scripts in `scripts/`.** Do not write your own scrape or record code. They exist because the instrument has quirks (Stop→Play can crash the audio context, overtone modes are mutually required, timing is fragile) that the canonical scripts already handle.
- **`eval:` in a recipe takes a path to a `.js` file.** Inline `eval: |` is rejected by browser-runner with a clear error. For session-specific panel state, write a sibling `dial.js` and reference it: `- eval: dial.js`.
- **Session artifact layout: `dial.js` + `take.yaml`** in the output directory. Both portable, both re-runnable, both shippable to another user who has the skill installed.
- **For agent-driven mode, install browser-runner first** (see [`SKILL.md`](SKILL.md) → *First-time setup*). Do not try to operate the page without it.
- **Do not set `BROWSER_RUNNER_CHANNEL=chrome` for dronetones.** Bundled Chromium handles the `.webm` (VP8/VP9 + Opus) capture path and avoids the macOS Chrome profile-lock conflicts.

## Common asks → canonical answers

| Human says                       | You do                                                                  |
|----------------------------------|-------------------------------------------------------------------------|
| "make a tone" / "make me a drone"| Run `scripts/take.yaml` with `--out .`. 60s default duration.           |
| "make it shorter / longer"       | Edit `DURATION_MS` at the top of `scripts/record-async.js`. Do not fork.|
| "more cheerful / darker / etc."  | Write a `dial.js` setting the panel (see Programmatic dial in SKILL.md); pair with a `take.yaml` that runs it before recording. |
| "walk me through it"             | Switch to interactive mode. Direct the human to the URL; narrate panel sections from SKILL.md → *Mental model & controls*. |
| "capture this as a take"         | Run scrape + record. Save `recipe-{n}.json` + `take-{n}.webm`.          |

## Don't

- Don't write a new `.yaml` or `.js` file when a canonical one already does the job.
- Don't inline JS into a recipe (`eval: |` is not supported; you will get a fast-fail error).
- Don't fork or duplicate `record-async.js` to change duration; edit `DURATION_MS` in place.
- Don't `git clone` browser-runner or this skill into your agent host's skills directory; install from the release zip (the `.git/` directory creates host-sandbox and agent noise).

## When in doubt

Re-read [`SKILL.md`](SKILL.md). It is the single source of truth for control IDs, the eval contract, and the quirk inventory.
