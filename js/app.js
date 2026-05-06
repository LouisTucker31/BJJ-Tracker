document.addEventListener('DOMContentLoaded', () => {
  NavBar.init();
  LogSheet.init();
  LogPages.init();
  LogAcademy.init();
  LogCoach.init();
  TechniquePicker.init();
  LogDetails.init();
  SessionsPage.init();
  LogSummary.init();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});