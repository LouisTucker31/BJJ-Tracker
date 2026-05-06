document.addEventListener('DOMContentLoaded', () => {
  NavBar.init();
  LogSheet.init();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});