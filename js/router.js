/**
 * router.js
 * Lightweight client-side router.
 * Knows the ordered list of pages so it can decide
 * which direction to animate when switching tabs.
 */

const Router = (() => {
  const PAGE_ORDER = ['home', 'sessions', 'insights', 'profile'];

  let currentPage = 'home';
  let isTransitioning = false;

  /**
   * Navigate to a page by name.
   * @param {string} targetPage
   */
  function navigate(targetPage) {
    if (targetPage === currentPage || isTransitioning) return;

    const fromEl = document.getElementById(`page-${currentPage}`);
    const toEl   = document.getElementById(`page-${targetPage}`);

    if (!fromEl || !toEl) return;

    const fromIndex = PAGE_ORDER.indexOf(currentPage);
    const toIndex   = PAGE_ORDER.indexOf(targetPage);
    const goingRight = toIndex > fromIndex;

    isTransitioning = true;

    // Remove active from current
    fromEl.classList.remove('active');

    // Apply exit animation
    const exitClass  = goingRight ? 'exit-to-left'      : 'exit-to-right';
    const enterClass = goingRight ? 'enter-from-right'   : 'enter-from-left';

    fromEl.classList.add(exitClass);
    toEl.classList.add(enterClass);

    // After animation completes, clean up
    const duration = 280; // match --duration-mid
    setTimeout(() => {
      fromEl.classList.remove(exitClass);
      toEl.classList.remove(enterClass);
      toEl.classList.add('active');

      isTransitioning = false;
    }, duration);

    currentPage = targetPage;
  }

  function getCurrentPage() {
    return currentPage;
  }

  function getPageOrder() {
    return PAGE_ORDER;
  }

  return { navigate, getCurrentPage, getPageOrder };
})();
