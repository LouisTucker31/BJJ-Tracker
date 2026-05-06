/**
 * navbar.js
 * Controls the animated pill indicator and active
 * states on the bottom navigation bar.
 */

const NavBar = (() => {

  let pill        = null;
  let navItems    = [];
  let activeItem  = null;

  /**
   * Calculate the pill geometry for a given nav item
   * and smoothly move it there.
   */
  function movePillTo(item) {
    if (!pill || !item) return;

    const track    = document.getElementById('nav-track');
    const trackRect = track.getBoundingClientRect();
    const itemRect  = item.getBoundingClientRect();

    const pillW = 72;   /* fixed width — same for every tab */
    const pillH = 46;

    // Centre on the item relative to the track
    const centreX  = itemRect.left + itemRect.width / 2 - trackRect.left;
    const pillLeft = Math.round(centreX - pillW / 2);

    pill.style.width  = `${pillW}px`;
    pill.style.height = `${pillH}px`;
    pill.style.left   = `${pillLeft}px`;
  }

  /**
   * Set a nav item as active (visually).
   */
  function setActive(item) {
    if (activeItem) activeItem.classList.remove('active');
    item.classList.add('active');
    activeItem = item;
    movePillTo(item);
  }

  /**
   * Initialise: bind click handlers, position pill.
   */
  function init() {
    pill     = document.getElementById('nav-pill');
    navItems = Array.from(document.querySelectorAll('.nav-item'));

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.target;
        setActive(item);
        Router.navigate(target);
      });
    });

    // Set initial position (home tab)
    activeItem = navItems.find(i => i.dataset.target === 'home') || navItems[0];
    activeItem.classList.add('active');

    // Wait one frame so layout is settled, then position pill
    requestAnimationFrame(() => {
      movePillTo(activeItem);
      // Fade pill in after first position is set
      requestAnimationFrame(() => {
        pill.classList.add('ready');
      });
    });

    // Reposition on resize (orientation change etc.)
    window.addEventListener('resize', () => {
      movePillTo(activeItem);
    });
  }

  return { init, setActive, movePillTo };
})();
