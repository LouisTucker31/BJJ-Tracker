const Router = (() => {
  const PAGE_ORDER = ['home', 'sessions', 'insights', 'profile'];

  let currentPage = 'home';
  let isTransitioning = false;

  function navigate(targetPage) {
    if (targetPage === currentPage || isTransitioning) return;

    const fromEl = document.getElementById(`page-${currentPage}`);
    const toEl   = document.getElementById(`page-${targetPage}`);
    if (!fromEl || !toEl) return;

    const fromIndex  = PAGE_ORDER.indexOf(currentPage);
    const toIndex    = PAGE_ORDER.indexOf(targetPage);
    const goingRight = toIndex > fromIndex;

    isTransitioning = true;
    fromEl.classList.remove('active');

    const exitClass  = goingRight ? 'exit-to-left'    : 'exit-to-right';
    const enterClass = goingRight ? 'enter-from-right' : 'enter-from-left';

    fromEl.classList.add(exitClass);
    toEl.classList.add(enterClass);

    setTimeout(() => {
      fromEl.classList.remove(exitClass);
      toEl.classList.remove(enterClass);
      toEl.classList.add('active');
      isTransitioning = false;
    }, 280);

    currentPage = targetPage;
  }

  function getCurrentPage() { return currentPage; }
  function getPageOrder()    { return PAGE_ORDER; }

  return { navigate, getCurrentPage, getPageOrder };
})();