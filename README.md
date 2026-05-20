# skill-dronetones

An agent skill for **DroneTones** — a browser-based generative drone synthesizer at <https://drone.toneflow.io/>.

Press Play and hear up to 8 voices swell and fade with randomized timing, pitched by interval from a root, with randomized overtone shapes and per-voice vibrato + auto-filter. No install, no MIDI — pure Web Audio via Tone.js.

This skill teaches an agent how to:

- **Narrate the instrument** to a human at the GUI (manual-learning mode) — shipped in v0.1.
- **Operate the instrument headlessly** via a companion CLI to roll takes, dial recipes, and capture audio (agent-driven mode, three sub-variants) — designed and documented in this skill, but the companion CLI is **not yet published**. Treat agent-driven as the v0.2 roadmap.

The full skill lives in [`SKILL.md`](SKILL.md). Helper scripts (panel scrape, audio capture) are in [`scripts/`](scripts/) — usable today via paste-in-devtools.

## Attribution

DroneTones is a public Creative Commons work, available at <https://drone.toneflow.io/>. This skill is a *wrapper* — it does not redistribute upstream code, only describes how to drive the page.

The screenshot at [`assets/screenshot.png`](assets/screenshot.png) is included for illustration. See [`assets/CREDITS.md`](assets/CREDITS.md).

## License

[MIT](LICENSE) — the skill's prose, scripts, and recipe format. The screenshot is separately credited; see `LICENSE`.
