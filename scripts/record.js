// DroneTones audio capture. Run in devtools console AFTER pressing Play on the panel.
//
// Captures DURATION_MS of audio from the page's Tone.js master output and
// auto-downloads as dronetones-<timestamp>.webm.
//
// Note: drone.toneflow.io ships Tone.js 13.4.10. In 13.x the destination is
// `Tone.Master` (the `Tone.getDestination()` API was added in 14.x).
//
// Configure: change DURATION_MS below.

(function recordDroneTones() {
  const DURATION_MS = 60_000;

  if (typeof Tone === 'undefined' || !Tone.Master) {
    throw new Error('Tone.js (13.x) not available on this page; is DroneTones loaded?');
  }

  const dest = Tone.context.createMediaStreamDestination();
  Tone.Master.connect(dest);

  const rec = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus' });
  const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dronetones-${Date.now()}.webm`;
    document.body.appendChild(a); a.click(); a.remove();
    console.log(`[record] saved ${(blob.size / 1024).toFixed(1)} KB`);
  };

  rec.start();
  console.log(`[record] capturing ${DURATION_MS / 1000}s of audio…`);
  setTimeout(() => rec.stop(), DURATION_MS);
  return rec;
})();
