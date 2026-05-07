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

    // Position next off-screen right instantly (no transition)
    next.style.transition = 'none';
    next.style.transform  = 'translateX(100%)';
    next.style.opacity    = '1';
    next.offsetHeight; // force reflow

    // Re-enable transitions on both
    next.style.transition    = '';
    next.style.transform     = '';

    if (current) {
      current.style.transition = '';
      current.style.transform  = 'translateX(-100%)';
    }

    // Make next interactive
    next.classList.add('active');
    if (current) current.classList.remove('active');

    currentPageId = pageId;

    }

  // ─── Navigate back ───────────────────────────────
  function goBack(pageId) {
    const current = currentPageId ? document.getElementById(currentPageId) : null;
    const prev    = document.getElementById(pageId);
    if (!prev) return;

    // Position prev off-screen left instantly (no transition)
    prev.style.transition = 'none';
    prev.style.transform  = 'translateX(-100%)';
    prev.style.opacity    = '1';
    prev.offsetHeight; // force reflow

    // Slide prev in from left, slide current out to right simultaneously
    prev.style.transition = '';
    prev.style.transform  = '';

    if (current) {
      current.style.transition = '';
      current.style.transform  = 'translateX(100%)';
    }

    prev.classList.add('active');
    if (current) current.classList.remove('active');

    currentPageId = pageId;
  }

  // ─── History ─────────────────────────────────────
  function pushHistory(pageId) { _history.push(pageId); }

  // ─── Dirty state ─────────────────────────────────
  function setDirty(val)  { isDirty = val; }
  function getIsDirty()   { return isDirty; }

  // ─── Header helpers ───────────────────────────────
  function showBack() {
    const btn = document.getElementById('log-sheet-back');
    if (btn) btn.classList.add('visible');
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
      showBack();
      LogSheet.setSheetTitle('Rolling');
    } else if (pageId === 'log-page-3') {
      showBack();
      LogSheet.setSheetTitle('Where did you train?');
    } else if (pageId === 'log-page-4') {
      showBack();
      LogSheet.setSheetTitle('Who was your coach?');
    } else if (pageId === 'log-page-5') {
      showBack();
      LogSheet.setSheetTitle('Techniques');
    } else if (pageId === 'log-page-6') {
      showBack();
      LogSheet.setSheetTitle('Session Details');
    } else if (pageId === 'log-page-7') {
      hideBack();
      LogSheet.setSheetTitle('Summary');
    }
  }
  // ─── Reset ───────────────────────────────────────
  function reset() {
    isDirty      = false;
    _history     = [];
    currentPageId = 'log-page-1';
    window._logSessionType = '';
    window._logFormatType  = '';

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
      month:   'long',
      year:    'numeric'
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
        window._logSessionType = 'Rolling';
        pushHistory('log-page-1');
        LogSheet.setSheetTitle('Rolling');
        showBack();
        goTo('log-page-2');
      });
    }

    // Page 5 → Page 6: continue
    const continueBtn = document.getElementById('techniques-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        pushHistory('log-page-5');
        LogSheet.setSheetTitle('Session Details');
        showBack();
        LogDetails.renderSummary();
        goTo('log-page-6');
      });
    }

    // Page 6 → Page 7: save
    const saveBtn = document.getElementById('save-session-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        // Build and save session object
        const details = LogDetails.getValues();
        const coaches = LogCoach.getSelected();
        const session = {
          ...details,
          sessionType: window._logSessionType || 'Rolling',
          formatType:  window._logFormatType  || '',
          academy:     LogAcademy.getSelected(),
          coach:       coaches.length > 0 ? coaches : null,
        };
        SessionStore.save(session);
        SessionsPage.refresh();

        LogSummary.render();
        LogSheet.setSheetTitle('Summary');
        LogSheet.setSaved(true);
        hideBack();
        goTo('log-page-7');
      });
    }
    // Page 2 → Page 3: format tiles
    ['tile-regular', 'tile-comp-class', 'tile-open-mat', 'tile-private'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          setDirty(true);
          window._logFormatType = btn.querySelector('.format-tile-title').textContent;
          pushHistory('log-page-2');
          const label = btn.querySelector('.format-tile-title').textContent;
          LogSheet.setSheetTitle(label);
          showBack();
          LogAcademy.renderList();
          goTo('log-page-3');
        });
      }
    });
  }

  return { init, goTo, goBack, reset, setDirty, getIsDirty, showBack, hideBack, pushHistory };

})();