/**
 * log-summary.js
 * Builds and renders the session summary page (Page 7).
 */

const LogSummary = (() => {

  const ENERGY_EMOJIS  = { 1: '😴', 2: '😕', 3: '😐', 4: '😊', 5: '🔥' };
  const ENERGY_LABELS  = { 1: 'Exhausted', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Fired Up' };
  const INTENSITY_LABELS = { light: 'Light', moderate: 'Moderate', hard: 'Hard' };
  const GI_LABELS        = { gi: 'Gi', nogi: 'No-Gi' };
  const ACADEMY_ICONS    = { dojo: '🥋', pin: '📍', home: '🏠', building: '🏛️', shield: '🛡️' };
  const COACH_ICONS      = { male: '👨', female: '👩', shirt: '🎽', medal: '🎖️' };

  // ─── Format date ──────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // ─── Format duration ──────────────────────────────
  function formatDuration(val) {
    if (!val || val === '180+') return '3+ hrs';
    const mins = parseInt(val);
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  // ─── Render ───────────────────────────────────────
  function render() {
    const details     = LogDetails.getValues();
    const academy     = LogAcademy.getSelected();
    const coach       = LogCoach.getSelected();
    const drilled     = TechniquePicker.getDrilled();
    const applied     = TechniquePicker.getApplied();
    const sessionType = window._logSessionType || 'Rolling';
    const formatType  = window._logFormatType  || '';

    // ── Hero date ──
    const heroDate = document.getElementById('summary-hero-date');
    if (heroDate) heroDate.textContent = formatDate(details.date);

    // ── Hero title ──
    const heroTitle = document.getElementById('summary-hero-title');
    if (heroTitle) {
      const gi = GI_LABELS[details.gi] || '';
      heroTitle.textContent = `${gi} ${formatType || sessionType}`.trim();
    }

    // ── Pills ──
    const pillsEl = document.getElementById('summary-hero-pills');
    if (pillsEl) {
      const energyEmoji    = ENERGY_EMOJIS[details.energy]    || '😐';
      const energyLabel    = ENERGY_LABELS[details.energy]    || 'Neutral';
      const intensityLabel = INTENSITY_LABELS[details.intensity] || '';
      const locationLabel  = academy?.location || null;

      const pills = [
        locationLabel ? { icon: '📍', label: locationLabel } : null,
        { icon: '⏱️', label: formatDuration(details.duration) },
        { icon: '⚡', label: intensityLabel },
        { icon: energyEmoji, label: energyLabel }
      ].filter(Boolean);

      pillsEl.innerHTML = pills.map(p => `
        <div class="summary-pill">
          <span class="summary-pill-icon">${p.icon}</span>
          <span>${p.label}</span>
        </div>
      `).join('');
    }

    // ── Stat tiles ──
    setText('sum-type',   formatType || sessionType);
    setText('sum-format', GI_LABELS[details.gi] || '—');

    // ── Academy ──
    const academyRow = document.getElementById('sum-academy-row');
    if (academy) {
      setText('sum-academy', academy.name);
      const iconEl = document.getElementById('sum-academy-icon');
      if (iconEl) iconEl.textContent = ACADEMY_ICONS[academy.icon] || '🥋';
      if (academyRow) academyRow.style.display = '';
    } else {
      if (academyRow) academyRow.style.display = 'none';
    }

    // ── Coach ──
    const coachRow = document.getElementById('sum-coach-row');
    if (coach) {
      setText('sum-coach', coach.name);
      const iconEl = document.getElementById('sum-coach-icon');
      if (iconEl) iconEl.textContent = COACH_ICONS[coach.icon] || '👨';
      if (coachRow) coachRow.style.display = '';
    } else {
      if (coachRow) coachRow.style.display = 'none';
    }

    // ── Drilled ──
    const drilledSection = document.getElementById('sum-drilled-section');
    const drilledTags    = document.getElementById('sum-drilled-tags');
    if (drilled.length > 0) {
      if (drilledTags) drilledTags.innerHTML = drilled.map(t =>
        `<span class="summary-tech-tag summary-tech-tag--drilled">${t.name}</span>`
      ).join('');
      if (drilledSection) drilledSection.style.display = '';
    } else {
      if (drilledSection) drilledSection.style.display = 'none';
    }

    // ── Applied ──
    const appliedSection = document.getElementById('sum-applied-section');
    const appliedTags    = document.getElementById('sum-applied-tags');
    if (applied.length > 0) {
      if (appliedTags) appliedTags.innerHTML = applied.map(t =>
        `<span class="summary-tech-tag summary-tech-tag--applied">${t.name}</span>`
      ).join('');
      if (appliedSection) appliedSection.style.display = '';
    } else {
      if (appliedSection) appliedSection.style.display = 'none';
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function init() {
    // Summary page is read-only — user closes via swipe or X button
  }

  return { init, render };

})();