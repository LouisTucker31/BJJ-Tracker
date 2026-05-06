/**
 * log-coach.js
 * Handles the coach selection page (Page 4).
 */

const LogCoach = (() => {

  let selectedCoach = null;
  let selectedIcon  = 'male';

  const ICONS = {
    male:   '👨',
    female: '👩',
    belt:   '🥋',
    star:   '⭐'
  };

  // ─── Render saved coaches ─────────────────────────
  function renderList() {
    const list = document.getElementById('coach-list');
    if (!list) return;

    const coaches = CoachStore.getAll();
    list.innerHTML = '';

    if (coaches.length === 0) {
      list.style.display = 'none';
      return;
    }

    list.style.display = '';
    coaches.forEach(coach => {
      const card = document.createElement('button');
      card.className = 'academy-card';
      card.dataset.id = coach.id;
      card.innerHTML = `
        <div class="academy-card-icon">${ICONS[coach.icon] || '👨'}</div>
        <div class="academy-card-text">
          <div class="academy-card-name">${coach.name}</div>
        </div>
        <div class="academy-card-check">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `;
      card.addEventListener('click', () => selectCoach(coach, card));
      list.appendChild(card);
    });
  }

  // ─── Select coach ─────────────────────────────────
  function selectCoach(coach, cardEl) {
    selectedCoach = coach;
    document.querySelectorAll('#coach-list .academy-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');

    setTimeout(() => {
      LogPages.pushHistory('log-page-4');
      LogSheet.setSheetTitle('Techniques');
      LogPages.showBack();
      TechniquePicker.renderPage();
      LogPages.goTo('log-page-5');
    }, 220);
  }

  // ─── Skip ─────────────────────────────────────────
  function skip() {
    selectedCoach = null;
    LogPages.pushHistory('log-page-4');
    LogSheet.setSheetTitle('Techniques');
    LogPages.showBack();
    TechniquePicker.renderPage();
    LogPages.goTo('log-page-5');
  }

  // ─── Show/hide form ───────────────────────────────
  function showForm() {
    const form = document.getElementById('add-coach-form');
    const btn  = document.getElementById('add-coach-btn');
    if (form) form.classList.remove('hidden');
    if (btn)  btn.classList.add('hidden');
    setTimeout(() => {
      const input = document.getElementById('coach-name-input');
      if (input) input.focus();
    }, 100);
  }

  function hideForm() {
    const form = document.getElementById('add-coach-form');
    const btn  = document.getElementById('add-coach-btn');
    if (form) {
      form.classList.add('hidden');
      document.getElementById('coach-name-input').value = '';
      resetIconPicker();
    }
    if (btn) btn.classList.remove('hidden');
  }

  // ─── Icon picker ──────────────────────────────────
  function resetIconPicker() {
    selectedIcon = 'male';
    document.querySelectorAll('#coach-icon-picker .icon-option').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.icon === 'male');
    });
  }

  // ─── Save coach ───────────────────────────────────
  function saveCoach() {
    const name = document.getElementById('coach-name-input').value.trim();
    if (!name) {
      document.getElementById('coach-name-input').focus();
      return;
    }
    CoachStore.save({ name, icon: selectedIcon });
    hideForm();
    renderList();
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    const addBtn = document.getElementById('add-coach-btn');
    if (addBtn) addBtn.addEventListener('click', showForm);

    const cancelBtn = document.getElementById('coach-cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', hideForm);

    const saveBtn = document.getElementById('coach-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveCoach);

    const skipBtn = document.getElementById('skip-coach-btn');
    if (skipBtn) skipBtn.addEventListener('click', skip);

    document.querySelectorAll('#coach-icon-picker .icon-option').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIcon = btn.dataset.icon;
        document.querySelectorAll('#coach-icon-picker .icon-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  function getSelected() { return selectedCoach; }

  function reset() {
    selectedCoach = null;
    hideForm();
    renderList();
  }

  return { init, reset, getSelected, renderList };

})();