/**
 * app.js
 * Entry point. Bootstraps the app once the DOM is ready.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialise navigation
  NavBar.init();
  LogSheet.init();

  // PWA: register service worker if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .catch(() => { /* SW optional — fail silently */ });
  }
});
