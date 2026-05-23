# skill-dronetones

An agent skill for **DroneTones**, a browser-based generative drone synthesizer at <https://drone.toneflow.io/>.

Press Play and hear up to 8 voices swell and fade with randomized timing, pitched by interval from a root, with randomized overtone shapes and per-voice vibrato + auto-filter. No install, no MIDI; pure Web Audio via Tone.js.

> **Pairs with [`skill-browser-runner`](https://github.com/vjcharles/skill-browser-runner)** for agent-driven mode (the agent operates the synth headlessly). Interactive tutorial mode works on its own.

## What you take away from a session

1. **The listen.** An agent-narrated tour while you shape a drone you actually like.
2. **A `.webm` audio file** of the take, captured straight from Tone.js's master output. Yours to keep, loop, layer, score against.
3. **A recipe JSON** of every panel setting that produced it. Reproducible and shareable: send the JSON, your friend hears the same drone.

## Getting started

**Install.** Download the latest release zip and unpack into your agent host's skills directory (`~/.claude/skills/` for Claude Code; check your host's docs for Gemini, Codex, etc.):

```bash
curl -L https://github.com/vjcharles/skill-dronetones/releases/latest/download/dronetones.zip -o /tmp/dronetones.zip
unzip /tmp/dronetones.zip -d ~/.claude/skills/
```

That's the whole install for the **interactive tutorial mode**.

For **agent-driven mode** (the agent operates the synth headlessly), also install the companion primitive `skill-browser-runner` (this skill declares it via `depends_on:` in the SKILL.md frontmatter):

```bash
curl -L https://github.com/vjcharles/skill-browser-runner/releases/latest/download/browser-runner.zip -o /tmp/browser-runner.zip
unzip /tmp/browser-runner.zip -d ~/.claude/skills/
cd ~/.claude/skills/browser-runner && npm install
```

`npm install` pulls Playwright + bundled Chromium (~150MB, one time per host). See [`SKILL.md`](SKILL.md) → *First-time setup* for sandbox notes.

**Two ways in.** Pick the one that matches how you want to use the skill.

*Interactive (you at the GUI, the agent narrates):*

> *"Use the dronetones skill to walk me through the synth."*

Close variants: *"teach me dronetones"*, *"let's explore dronetones together"*, *"open dronetones in learn mode"*. The agent will direct you to <https://drone.toneflow.io/>, narrate the panel, and help you shape a drone you like. Hit Play when it tells you to; ask questions as you go. When you've got a sound: *"capture this as a take"* saves the `.webm` and a recipe JSON.

*Agent-driven (the agent operates the synth, you listen):*

> `/dronetones make a tone and show me the file.`

The agent opens the page headlessly, applies a dial, records a take, and hands you the `.webm`. Refine from there in chat: *"more cheerful"*, *"shorter"*, *"deeper bass"* (each turn rolls a new take). Requires `skill-browser-runner` installed (see install section above).

## What this skill teaches an agent

- **Narrate the instrument** to a human at the GUI (manual-learning mode).
- **Operate the instrument headlessly** via the `browser-runner` primitive skill this one depends on (agent-driven mode, three sub-variants).

The full skill lives in [`SKILL.md`](SKILL.md). Helper scripts (panel scrape, audio capture) and the canonical recipe (`take.yaml`) are in [`scripts/`](scripts/).

## Attribution

DroneTones is a public Creative Commons work, available at <https://drone.toneflow.io/>. This skill is a *wrapper*: it does not redistribute upstream code, only describes how to drive the page.

The screenshot at [`assets/screenshot.png`](assets/screenshot.png) is included for illustration. See [`assets/CREDITS.md`](assets/CREDITS.md).

## Verifying releases

Releases from `v0.1.1` onward are signed with my SSH signing key. (v0.1 predates this convention and is unsigned.) Verifying takes stock git plus a working internet connection.

Signing key fingerprint: `SHA256:wjXZwnbq9RfqZ5SfqvBZCPK/Ozy2oU5G/i9CrXzWfUI`. The same key is served at <https://github.com/vjcharles.keys>.

```sh
TAG=v0.1.1   # the release you cloned

# 1. Build an allowed_signers file from my GitHub keys
curl -fsS https://github.com/vjcharles.keys \
  | awk '/^ssh-/ {print "vjcharles@gmail.com", $1, $2}' \
  > /tmp/vjcharles_signers

# 2. Verify the tag
git -c gpg.ssh.allowedSignersFile=/tmp/vjcharles_signers verify-tag "$TAG"
```

A valid release prints `Good "git" signature` and `vjcharles@gmail.com`. If you see `No principal matched` or `bad signature`, do not trust the release.

This follows a small convention I'm developing called **signed-skills**: a way to distribute AI skill folders with cryptographic integrity and verifiable authorship using only signed git tags. Spec repo coming soon. A valid signature proves I released exactly these bytes; it does not prove the code is safe to run. Treat as you would an npm or Debian publisher.

## License

[MIT](LICENSE) for the skill's prose, scripts, and recipe format. The screenshot is separately credited; see `LICENSE`.
