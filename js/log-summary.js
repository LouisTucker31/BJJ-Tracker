/**
 * log-summary.js
 * Builds and renders the session summary page (Page 7).
 */

const LogSummary = (() => {

  const ENERGY_EMOJIS = { 1: '😴', 2: '😕', 3: '😐', 4: '😊', 5: '🔥' };

  const INTENSITY_LABELS = {
    light:    'Light',
    moderate: 'Moderate',
    hard:     'Hard'
  };

  const GI_LABELS = {
    gi:   'Gi',
    nogi: 'No-Gi'
  };

  const ACADEMY_ICONS = {
    dojo:     '🥋',
    pin:      '📍',
    star:     '⭐',
    building: '🏛️',
    shield:   '🛡️'
  };

  const COACH_ICONS = {
    male:   '👨',
    female: '👩',
    belt:   '🥋',
    star:   '⭐'
  };

  // ─── Format date nicely ───────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day:     'numeric',
      month:   'long',
      year:    'numeric'
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

  // ─── Build title from session data ───────────────
  function buildTitle(data) {
    const gi        = GI_LABELS[data.gi] || '';
    const type      = data.sessionType || 'Session';
    return `${gi} ${type}`.trim();
  }

  // ─── Render ───────────────────────────────────────
  function render() {
    const details  = LogDetails.getValues();
    const academy  = LogAcademy.getSelected();
    const coach    = LogCoach.getSelected();
    const drilled  = TechniquePicker.getDrilled();
    const applied  = TechniquePicker.getApplied();

    // Get session type from history (stored on format tile click)
    const sessionType = window._logSessionType || 'Rolling';
    const formatType  = window._logFormatType  || '';

    // ── Hero ──
    const heroDate = document.getElementById('summary-hero-date');
    if (heroDate) heroDate.textContent = formatDate(details.date);

    const heroTitle = document.getElementById('summary-hero-title');
    if (heroTitle) {
      const gi = GI_LABELS[details.gi] || '';
      heroTitle.textContent = `${gi} ${formatType || sessionType}`.trim();
    }

    // ── Pills ──
    const pillsEl = document.getElementById('summary-hero-pills');
    if (pillsEl) {
      const pills = [
        { icon: '📅', label: formatDate(details.date).split(',')[0] },
        { icon: '⏱️', label: formatDuration(details.duration) },
        { icon: '⚡', label: INTENSITY_LABELS[details.intensity] || '' },
        { icon: ENERGY_EMOJIS[details.energy] || '😐', label: '' }
      ].filter(p => p.label || p.icon);

      pillsEl.innerHTML = pills.map(p => `
        <div class="summary-pill">
          <span class="summary-pill-icon">${p.icon}</span>
          ${p.label ? `<span>${p.label}</span>` : ''}
        </div>
      `).join('');
    }

    // ── Stat tiles ──
    setText('sum-type',      formatType || sessionType);
    setText('sum-format',    GI_LABELS[details.gi] || '—');
    setText('sum-intensity', INTENSITY_LABELS[details.intensity] || '—');
    setText('sum-energy',    ENERGY_EMOJIS[details.energy] || '😐');

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

    // ── Notes ──
    const notesSection = document.getElementById('sum-notes-section');
    const notesEl      = document.getElementById('sum-notes');
    if (details.notes) {
      if (notesEl)      notesEl.textContent = details.notes;
      if (notesSection) notesSection.style.display = '';
    } else {
      if (notesSection) notesSection.style.display = 'none';
    }

    // ── Drilled techniques ──
    const drilledSection = document.getElementById('sum-drilled-section');
    const drilledTags    = document.getElementById('sum-drilled-tags');
    if (drilled.length > 0) {
      if (drilledTags) {
        drilledTags.innerHTML = drilled.map(t =>
          `<span class="summary-tech-tag summary-tech-tag--drilled">${t.name}</span>`
        ).join('');
      }
      if (drilledSection) drilledSection.style.display = '';
    } else {
      if (drilledSection) drilledSection.style.display = 'none';
    }

    // ── Applied techniques ──
    const appliedSection = document.getElementById('sum-applied-section');
    const appliedTags    = document.getElementById('sum-applied-tags');
    if (applied.length > 0) {
      if (appliedTags) {
        appliedTags.innerHTML = applied.map(t =>
          `<span class="summary-tech-tag summary-tech-tag--applied">${t.name}</span>`
        ).join('');
      }
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
    const doneBtn = document.getElementById('summary-done-btn');
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        LogSheet.close();
      });
    }
  }

  return { init, render };

})();