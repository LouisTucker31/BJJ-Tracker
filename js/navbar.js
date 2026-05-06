const NavBar = (() => {

  let pill       = null;
  let track      = null;
  let navItems   = [];
  let activeItem = null;

  const PILL_WIDTH = 72;

  function movePillTo(item) {
    if (!pill || !track || !item) return;
    const trackRect = track.getBoundingClientRect();
    const itemRect  = item.getBoundingClientRect();
    const centreX   = itemRect.left + itemRect.width / 2 - trackRect.left;
    const pillLeft  = Math.round(centreX - PILL_WIDTH / 2);
    pill.style.width = `${PILL_WIDTH}px`;
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