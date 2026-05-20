// DroneTones panel → recipe JSON. Run in devtools console while the panel
// shows the settings you want to capture.
//
// Output:
//   - logs the recipe JSON
//   - copies it to clipboard (Chrome / Firefox devtools `copy` helper)
//   - returns the recipe object
//
// Schema matches trials/dronetones/recipe-NNN.json in the band session repo.

(function scrapeDroneTones() {
  const num = v => (v == null || v === '') ? null : Number(v);

  // Voice slots: <select>s whose options spell the interval list.
  const voiceSelects = [...document.querySelectorAll('select')].filter(sel => {
    const opts = [...sel.options].map(o => o.value).join(',');
    return opts.includes('Root') && opts.includes('Sub') && opts.includes('m2');
  });
  const voices = voiceSelects.slice(0, 8).map(s => s.value);

  // Root pitch: <select> with chromatic-pitch options (C2..B2).
  const rootSelect = [...document.querySelectorAll('select')].find(sel => {
    const vals = [...sel.options].map(o => o.value);
    return vals.includes('C2') && vals.includes('B2');
  });
  const root_pitch = rootSelect ? rootSelect.value : null;

  // Tuning %: read the dedicated display element directly.
  // (Earlier version read parent .tuning-controls textContent and tried to
  // strip the +/- buttons' text via regex — but that also killed the sign of
  // negative values and zeroed positives.)
  let tuning_pct = 0;
  const tuningEl = document.querySelector('#tuning_value');
  if (tuningEl) {
    const m = (tuningEl.textContent || '').trim().match(/-?\d+(?:\.\d+)?/);
    if (m) tuning_pct = Number(m[0]);
  }

  // Walk inputs in document order; resolve label by <label for>, then by previousSibling text.
  const labelOf = el => {
    if (el.id) {
      const lbl = document.querySelector(`label[for="${el.id}"]`);
      if (lbl) return lbl.textContent.trim();
    }
    if (el.previousElementSibling) return el.previousElementSibling.textContent.trim();
    return el.name || el.id || '?';
  };

  const flags = {}, nums = {};
  document.querySelectorAll('input').forEach(el => {
    const label = labelOf(el);
    if (el.type === 'checkbox' || el.type === 'radio') {
      flags[label] = el.checked;
    } else {
      let key = label, i = 1;
      while (key in nums) key = `${label}#${++i}`;
      nums[key] = el.value;
    }
  });

  // Fetch labeled numerics by ordinal collision (1-indexed).
  const get = (label, n = 1) => num(nums[n === 1 ? label : `${label}#${n}`]);

  const recipe = {
    instrument: 'dronetones',
    url: location.href,
    captured_at: new Date().toISOString().slice(0, 10),
    captured_via: 'scripts/scrape-recipe.js',
    voices,
    active_voice_count: voices.filter(v => v !== 'Off').length,
    root_pitch,
    tuning_pct,
    overtones: {
      sawtooth:   { enabled: !!flags['Sawtooth'] },
      full_vol:   { enabled: !!flags['FullStops'],   count: get('#:', 1) },
      random_vol: { enabled: !!flags['RandomStops'], count: get('#:', 2) },
      clusters:   { enabled: !!flags['Clusters'],    count: get('#:', 3), density: get('Density:') }
    },
    fx: {
      vibrato: { enabled: !!flags['vibrato-on'], rate: get('Rate:', 1), depth: get('Depth:', 1) },
      filter:  { enabled: !!flags['filter-on'],  rate: get('Rate:', 2), depth: get('Depth:', 2) }
    },
    timing: {
      rise: { min: get('Min:', 1), max: get('Max:', 1) },
      fall: { min: get('Min:', 2), max: get('Max:', 2) },
      rest: { min: get('Min:', 3), max: get('Max:', 3) }
    },
    notes: ''
  };

  const out = JSON.stringify(recipe, null, 2);
  console.log(out);
  if (typeof copy === 'function') copy(out);
  return recipe;
})();
