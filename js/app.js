document.addEventListener('DOMContentLoaded', () => {
  NavBar.init();
  LogSheet.init();
  LogPages.init();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});