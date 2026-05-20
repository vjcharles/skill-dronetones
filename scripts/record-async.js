// record-async.js — agent-driven variant of record.js.
//
// Same capture as record.js (Tone.Master → MediaStreamDestination →
// MediaRecorder → webm/opus anchor-download), but wrapped in an awaitable
// Promise. The IIFE doesn't return until the file has been triggered.
//
// Why two versions:
//   - record.js is fire-and-forget. Returns immediately. Right for paste-in-devtools
//     where the human is sitting at the page and waits visually.
//   - record-async.js awaits stop. Right for recipe runners (e.g. browser-runner's
//     `capture_download`) that need the eval to live long enough for the
//     delayed download to fire.
//
// Confirmed working in headless Chrome via browser-runner.

(async () => {
  const DURATION_MS = 60_000;
  if (typeof Tone === 'undefined' || !Tone.Master) {
    throw new Error('Tone.js (13.x) not available on this page — is DroneTones loaded?');
  }
  const dest = Tone.context.createMediaStreamDestination();
  Tone.Master.connect(dest);
  const rec = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus' });
  const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const t0 = Date.now();
  const done = new Promise(resolve => {
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `dronetones-${Date.now()}.webm`;
      document.body.appendChild(a); a.click(); a.remove();
      resolve({ size_bytes: blob.size, duration_ms: Date.now() - t0 });
    };
  });
  rec.start();
  setTimeout(() => rec.stop(), DURATION_MS);
  return await done;
})()
