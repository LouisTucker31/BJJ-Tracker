/**
 * log-details.js
 * Handles the session details page (Page 6).
 * Date, Gi/No-Gi, Intensity, Energy, Notes, Summary.
 */

const LogDetails = (() => {

  // ─── Set today's date and max ─────────────────────
  function initDate() {
    const input = document.getElementById('session-date');
    if (!input) return;
    const today = new Date().toISOString().split('T')[0];
    input.value = today;
    input.max   = today;
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const day   = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('en-GB', { month: 'short' });
    const year  = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // ─── Segmented controls ───────────────────────────
  function initSegmented() {
    document.querySelectorAll('.segmented-control').forEach(control => {
      control.querySelectorAll('.seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          control.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });
  }

  // ─── Render technique summary ─────────────────────
  function renderSummary() {
    const drilled = TechniquePicker.getDrilled();
    const applied = TechniquePicker.getApplied();
    const section = document.getElementById('technique-summary-section');

    if (!section) return;

    // Hide summary if nothing logged
    if (drilled.length === 0 && applied.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = '';

    const drilledEl = document.getElementById('summary-drilled');
    const appliedEl = document.getElementById('summary-applied');

    if (drilledEl) {
      drilledEl.innerHTML = drilled.length === 0 ? '' : `
        <div class="summary-group-title">Drilled</div>
        <div class="summary-tags">
          ${drilled.map(t => `<span class="summary-tag">${t.name}</span>`).join('')}
        </div>
      `;
    }

    if (appliedEl) {
      appliedEl.innerHTML = applied.length === 0 ? '' : `
        <div class="summary-group-title">Applied in Sparring</div>
        <div class="summary-tags">
          ${applied.map(t => `<span class="summary-tag summary-tag--applied">${t.name}</span>`).join('')}
        </div>
      `;
    }
  }

  // ─── Get all values ───────────────────────────────
  function getValues() {
    const date      = document.getElementById('session-date')?.value;
    const duration  = document.getElementById('session-duration')?.value;
    const gi        = document.querySelector('#gi-control .seg-btn.active')?.dataset.value;
    const intensity = document.querySelector('#intensity-control .seg-btn.active')?.dataset.value;
    const energy    = document.getElementById('energy-slider')?.value;
    const notes     = document.getElementById('session-notes')?.value.trim();
    const drilled   = TechniquePicker.getDrilled();
    const applied   = TechniquePicker.getApplied();

    return { date, duration, gi, intensity, energy: parseInt(energy), notes, drilled, applied };
  }

  // ─── Reset ────────────────────────────────────────
  function reset() {
    initDate();

    // Reset segmented controls to first option
    document.querySelectorAll('.segmented-control').forEach(control => {
      const btns = control.querySelectorAll('.seg-btn');
      btns.forEach((b, i) => b.classList.toggle('active', i === 0));
    });

    // Reset slider
    const slider = document.getElementById('energy-slider');
    if (slider) slider.value = 3;

    // Reset duration
    const duration = document.getElementById('session-duration');
    if (duration) duration.value = '60';

    // Clear notes
    const notes = document.getElementById('session-notes');
    if (notes) notes.value = '';

    // Hide summary
    const section = document.getElementById('technique-summary-section');
    if (section) section.style.display = 'none';
  }

  // ─── Init ─────────────────────────────────────────
  function init() {
    initDate();
    initSegmented();
  }

  return { init, reset, getValues, renderSummary };

})();