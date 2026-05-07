/**
 * log-coach.js
 * Handles the coach selection page (Page 4).
 * Supports multiple coach selection.
 */

const LogCoach = (() => {

  let selectedCoaches = [];
  let selectedIcon    = 'male';

  const ICONS = {
    male:   '👨',
    female: '👩',
    shirt:  '🎽',
    medal:  '🎖️'
  };

  // ─── Render saved coaches ─────────────────────────
  function renderList() {
    const list = document.getElementById('coach-list');
    if (!list) return;

    const coaches = CoachStore.getAll();
    list.innerHTML = '';

    if (coaches.length === 0) {
      list.style.display = 'none';
      updateContinueBtn();
      return;
    }

    list.style.display = '';
    coaches.forEach(coach => {
      const card = document.createElement('button');
      card.className = 'academy-card';
      card.dataset.id = coach.id;

      const isSelected = selectedCoaches.some(c => c.id === coach.id);
      if (isSelected) card.classList.add('selected');

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
      card.addEventListener('click', () => toggleCoach(coach, card));
      list.appendChild(card);
    });

    updateContinueBtn();
  }

  // ─── Toggle coach selection ───────────────────────
  function toggleCoach(coach, cardEl) {
    const idx = selectedCoaches.findIndex(c => c.id === coach.id);
    if (idx > -1) {
      selectedCoaches.splice(idx, 1);
      cardEl.classList.remove('selected');
    } else {
      selectedCoaches.push(coach);
      cardEl.classList.add('selected');
    }
    updateContinueBtn();
  }

  // ─── Show/hide continue button ────────────────────
  function updateContinueBtn() {
    const btn = document.getElementById('coach-continue-btn');
    if (!btn) return;
    btn.style.display = selectedCoaches.length > 0 ? '' : 'none';
  }

  // ─── Advance to next page ─────────────────────────
  function advance() {
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
    if (skipBtn) skipBtn.addEventListener('click', () => {
      selectedCoaches = [];
      advance();
    });

    const continueBtn = document.getElementById('coach-continue-btn');
    if (continueBtn) continueBtn.addEventListener('click', advance);

    document.querySelectorAll('#coach-icon-picker .icon-option').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIcon = btn.dataset.icon;
        document.querySelectorAll('#coach-icon-picker .icon-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  function getSelected() { return selectedCoaches; }

  function reset() {
    selectedCoaches = [];
    hideForm();
    renderList();
  }

  return { init, reset, getSelected, renderList };

})();