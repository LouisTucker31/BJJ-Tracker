/**
 * log-pages.js
 * Manages pages inside the log sheet.
 * Handles navigation, dirty state, and date display.
 */

const LogPages = (() => {

  let currentPageId = null;
  let isDirty       = false;

  // ─── Navigate to a page ──────────────────────────
  function goTo(pageId) {
    const current = currentPageId
      ? document.getElementById(currentPageId)
      : null;
    const next = document.getElementById(pageId);

    if (!next) return;

    if (current) {
      current.classList.remove('active');
      current.classList.add('exit-left');
      setTimeout(() => {
        current.classList.remove('exit-left');
      }, 380);
    }

    next.classList.add('active');
    currentPageId = pageId;
  }

  // ─── Go back ─────────────────────────────────────
  function goBack(pageId) {
    const current = currentPageId
      ? document.getElementById(currentPageId)
      : null;
    const prev = document.getElementById(pageId);

    if (!prev) return;

    if (current) {
      current.classList.remove('active');
      // Slide current out to right
      current.style.transition = 'none';
      current.style.transform  = 'translateX(0)';
      current.offsetHeight; // force reflow
      current.style.transition = '';
      current.style.transform  = '';
      setTimeout(() => {
        current.style.cssText = '';
        current.classList.remove('active');
      }, 380);
    }

    // Bring prev back from left
    prev.style.transition = 'none';
    prev.style.transform  = 'translateX(-40px)';
    prev.style.opacity    = '0';
    prev.offsetHeight;
    prev.style.transition = '';
    prev.style.transform  = '';
    prev.style.opacity    = '';
    prev.classList.add('active');

    currentPageId = pageId;
  }

  // ─── Dirty state ─────────────────────────────────
  function setDirty(val) {
    isDirty = val;
  }

  function getIsDirty() {
    return isDirty;
  }

  // ─── Reset all pages ─────────────────────────────
  function reset() {
    isDirty = false;
    document.querySelectorAll('.log-page').forEach(p => {
      p.classList.remove('active', 'exit-left');
      p.style.cssText = '';
    });
    // Page 1 is always statically visible — no animation
    const p1 = document.getElementById('log-page-1');
    if (p1) p1.classList.add('active');
    currentPageId = 'log-page-1';
  }

  // ─── Format today's date ─────────────────────────
  function formatDate(date) {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day:     'numeric',
      month:   'long'
    });
  }

  // ─── Init ─────────────────────────────────────────
  function init() {
    // Set today's date on page 1
    const dateEl = document.getElementById('log-p1-date');
    if (dateEl) dateEl.textContent = formatDate(new Date());

    // Rolling tile — goes to page 2
    const rollingBtn = document.getElementById('tile-rolling');
    if (rollingBtn) {
      rollingBtn.addEventListener('click', () => {
        setDirty(false);
        goTo('log-page-2');
      });
    }
  }

  return { init, goTo, goBack, reset, setDirty, getIsDirty };

})();