const NavBar = (() => {

  let pill       = null;
  let track      = null;
  let navItems   = [];
  let activeItem = null;

  const PILL_PADDING = 8; // equal padding on all sides

  function movePillTo(item) {
    if (!pill || !track || !item) return;
    const trackRect = track.getBoundingClientRect();
    const itemRect  = item.getBoundingClientRect();

    // Pill width = item width minus equal padding each side
    const pillW    = Math.round(itemRect.width - PILL_PADDING * 2);
    const centreX  = itemRect.left + itemRect.width / 2 - trackRect.left;
    const pillLeft = Math.round(centreX - pillW / 2);

    pill.style.width = `${pillW}px`;
    pill.style.left  = `${pillLeft}px`;
  }

  function setActive(item) {
    if (!item) return;
    if (activeItem) activeItem.classList.remove('active');
    item.classList.add('active');
    activeItem = item;
    movePillTo(item);
  }

  function setActiveByTarget(target) {
    const item = navItems.find(i => i.dataset.target === target);
    if (item) setActive(item);
  }

  function init() {
    pill     = document.getElementById('nav-pill');
    track    = document.getElementById('nav-track');
    navItems = Array.from(document.querySelectorAll('.nav-item'));

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.target;

        if (target === 'log') {
          if (LogSheet.isOpen()) {
            LogSheet.checkDirtyAndClose();
          } else {
            setActive(item);
            LogSheet.open();
          }
          return;
        }

        // If sheet is open — check dirty before navigating away
        if (LogSheet.isOpen()) {
          LogSheet.checkDirtyAndClose(() => {
            setActive(item);
            Router.navigate(target);
          });
          return;
        }

        // If already on this tab — close any open sub-sheets and scroll to top
        if (target === Router.getCurrentPage()) {
          // Close sessions detail sheet if open
          if (target === 'sessions') {
            const sessionSheet = document.getElementById('session-view-sheet');
            const sessionBackdrop = document.getElementById('session-view-backdrop');
            if (sessionSheet && sessionSheet.classList.contains('open')) {
              sessionSheet.classList.remove('open');
              if (sessionBackdrop) sessionBackdrop.classList.remove('visible');
              return;
            }
            // Close technique picker if open
            const techPanel = document.getElementById('tech-picker-panel');
            if (techPanel && techPanel.classList.contains('visible')) {
              techPanel.classList.remove('visible');
              return;
            }
            // Scroll to top
            const activeView = document.querySelector('.sessions-view.active');
            if (activeView) activeView.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // Scroll active page to top
            const page = document.getElementById(`page-${target}`);
            if (page) page.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        setActive(item);
        Router.navigate(target);
      });
    });

    const initialActive = navItems.find(i => i.classList.contains('active')) || navItems[0];
    navItems.forEach(i => i.classList.remove('active'));
    activeItem = initialActive;
    activeItem.classList.add('active');

    requestAnimationFrame(() => {
      movePillTo(activeItem);
      requestAnimationFrame(() => {
        pill.classList.add('ready');
      });
    });

    window.addEventListener('resize', () => movePillTo(activeItem));
  }

  function setActiveByTarget(target) {
    const item = navItems.find(i => i.dataset.target === target);
    if (item) setActive(item);
  }

  return { init, setActive, setActiveByTarget, movePillTo };
})();