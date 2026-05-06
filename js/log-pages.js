/**
 * log-pages.js
 * Manages pages inside the log sheet.
 * Handles navigation, dirty state, and date display.
 */

const LogPages = (() => {

  let currentPageId = null;
  let isDirty       = false;
  let _history      = [];

  // ─── Navigate forward ────────────────────────────
  function goTo(pageId) {
    const current = currentPageId ? document.getElementById(currentPageId) : null;
    const next    = document.getElementById(pageId);
    if (!next) { console.warn('LogPages: page not found:', pageId); return; }

    if (current) {
      current.classList.remove('active');
      current.classList.add('exit-left');
      setTimeout(() => current.classList.remove('exit-left'), 380);
    }

    next.classList.add('active');
    currentPageId = pageId;
  }

  // ─── Navigate back ───────────────────────────────
  function goBack(pageId) {
    const current = currentPageId ? document.getElementById(currentPageId) : null;
    const prev    = document.getElementById(pageId);
    if (!prev) return;

    // Slide current out to the right
    if (current) {
      current.classList.remove('active');
      current.classList.add('exit-right');
      setTimeout(() => current.classList.remove('exit-right'), 380);
    }

    // Bring prev in from the left
    prev.classList.remove('exit-left', 'exit-right');
    prev.classList.add('entering-from-left');
    prev.classList.add('active');
    setTimeout(() => prev.classList.remove('entering-from-left'), 380);

    currentPageId = pageId;
  }

  // ─── History ─────────────────────────────────────
  function pushHistory(pageId) { _history.push(pageId); }

  // ─── Dirty state ─────────────────────────────────
  function setDirty(val)  { isDirty = val; }
  function getIsDirty()   { return isDirty; }

  // ─── Header helpers ───────────────────────────────
  function showBack(label) {
    const btn = document.getElementById('log-sheet-back');
    const lbl = document.getElementById('log-sheet-back-label');
    if (btn) btn.classList.add('visible');
    if (lbl) lbl.textContent = label;
  }

  function hideBack() {
    const btn = document.getElementById('log-sheet-back');
    if (btn) btn.classList.remove('visible');
  }

  function updateHeader(pageId) {
    if (pageId === 'log-page-1') {
      hideBack();
      LogSheet.setSheetTitle('');
    } else if (pageId === 'log-page-2') {
      showBack('Rolling');
      LogSheet.setSheetTitle('Rolling');
    }
  }

  // ─── Reset ───────────────────────────────────────
  function reset() {
    isDirty      = false;
    _history     = [];
    currentPageId = 'log-page-1';

    document.querySelectorAll('.log-page').forEach(p => {
      p.classList.remove('active', 'exit-left', 'exit-right', 'entering-from-left');
      p.style.cssText = '';
    });

    const p1 = document.getElementById('log-page-1');
    if (p1) p1.classList.add('active');

    hideBack();
    LogSheet.setSheetTitle('');
  }

  // ─── Format date ─────────────────────────────────
  function formatDate(date) {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day:     'numeric',
      month:   'long'
    });
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    // Date on page 1
    const dateEl = document.getElementById('log-p1-date');
    if (dateEl) dateEl.textContent = formatDate(new Date());

    // Back button
    const backBtn = document.getElementById('log-sheet-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (_history.length > 0) {
          const prev = _history.pop();
          goBack(prev);
          updateHeader(prev);
        }
      });
    }

    // Page 1 → Page 2: Rolling
    const rollingBtn = document.getElementById('tile-rolling');
    if (rollingBtn) {
      rollingBtn.addEventListener('click', () => {
        pushHistory('log-page-1');
        LogSheet.setSheetTitle('Rolling');
        showBack('Back');
        goTo('log-page-2');
      });
    }

    // Page 2 → Page 3: format tiles
    ['tile-regular', 'tile-comp-class', 'tile-open-mat', 'tile-private'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          setDirty(true);
          pushHistory('log-page-2');
          const label = btn.querySelector('.format-tile-title').textContent;
          LogSheet.setSheetTitle(label);
          showBack('Session Type');
          goTo('log-page-3');
        });
      }
    });
  }

  return { init, goTo, goBack, reset, setDirty, getIsDirty, showBack, hideBack };

})();