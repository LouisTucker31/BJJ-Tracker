const LogSheet = (() => {

  let sheet      = null;
  let backdrop   = null;
  let closeBtn   = null;
  let handleArea = null;

  let previousPage  = 'home';
  let sheetOpen     = false;
  let isSaved       = false;
  let dragStartY    = 0;
  let dragCurrentY  = 0;
  let isDragging    = false;
  let dragStartTime = 0;

  const DISMISS_THRESHOLD  = 120;
  const VELOCITY_THRESHOLD = 0.5;

  function open() {
    previousPage = Router.getCurrentPage();
    sheetOpen    = true;
    isSaved      = false;
    LogPages.reset();
    setSheetTitle('');
    sheet.classList.add('open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    sheetOpen = false;
    isSaved   = false;
    sheet.classList.remove('open');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
    NavBar.setActiveByTarget(previousPage);
    setTimeout(() => {
      LogPages.reset();
      TechniquePicker.reset();
      LogDetails.reset();
      LogAcademy.reset();
      LogCoach.reset();
      window._logSessionType = '';
      window._logFormatType  = '';
    }, 450);
  }
  function isOpen() {
    return sheetOpen;
  }

  function setSheetTitle(text) {
    const el = document.getElementById('log-sheet-title');
    if (el) el.textContent = text;
  }

  function setSaved(val) {
    isSaved = val;
  }

  function checkDirtyAndClose(onConfirm) {
    if (isSaved || !LogPages.getIsDirty()) {
      close();
      if (onConfirm) onConfirm();
      return;
    }

    const confirmed = window.confirm('Discard this session?\nYour progress will be lost.');
    if (confirmed) {
      close();
      if (onConfirm) onConfirm();
    }
  }

  function onDragStart(e) {
    isDragging    = true;
    dragStartY    = e.touches ? e.touches[0].clientY : e.clientY;
    dragCurrentY  = dragStartY;
    dragStartTime = Date.now();
    sheet.classList.add('dragging');
  }

  function onDragMove(e) {
    if (!isDragging) return;
    dragCurrentY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = Math.max(0, dragCurrentY - dragStartY);
    sheet.style.transform = `translateY(${delta * 0.88}px)`;
    backdrop.style.opacity = (0.40 * (1 - Math.min(delta / 300, 1))).toString();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    sheet.classList.remove('dragging');
    sheet.style.transform = '';
    backdrop.style.opacity = '';

    const delta    = dragCurrentY - dragStartY;
    const velocity = delta / (Date.now() - dragStartTime);

    if (delta > DISMISS_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      checkDirtyAndClose();
    }
  }

  function init() {
    sheet      = document.getElementById('log-sheet');
    backdrop   = document.getElementById('log-backdrop');
    closeBtn   = document.getElementById('log-sheet-close');
    handleArea = document.getElementById('log-sheet-handle-area');

    if (!sheet || !backdrop || !closeBtn || !handleArea) {
      console.warn('LogSheet: one or more elements not found.');
      return;
    }

    closeBtn.addEventListener('click', checkDirtyAndClose);
    backdrop.addEventListener('click', checkDirtyAndClose);

    handleArea.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) { e.preventDefault(); onDragMove(e); }
    }, { passive: false });
    document.addEventListener('touchend', onDragEnd);

    handleArea.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', (e) => { if (isDragging) onDragMove(e); });
    document.addEventListener('mouseup', onDragEnd);
  }

  return { init, open, close, isOpen, setSheetTitle, checkDirtyAndClose, setSaved };

})();