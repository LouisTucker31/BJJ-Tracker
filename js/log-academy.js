/**
 * log-academy.js
 * Handles the academy selection page (Page 3).
 */

const LogAcademy = (() => {

  let selectedAcademy = null;
  let selectedIcon    = 'dojo';

  const ICONS = {
    dojo:     '🥋',
    pin:      '📍',
    home:     '🏠',
    building: '🏛️',
    shield:   '🛡️'
  };

  // ─── Render saved academies ───────────────────────
  function renderList() {
    const list = document.getElementById('academy-list');
    if (!list) return;

    const academies = AcademyStore.getAll();
    list.innerHTML = '';

    if (academies.length === 0) {
      list.style.display = 'none';
      return;
    }

    list.style.display = '';
    academies.forEach(academy => {
      const card = document.createElement('button');
      card.className = 'academy-card';
      card.dataset.id = academy.id;
      card.innerHTML = `
        <div class="academy-card-icon">${ICONS[academy.icon] || '🥋'}</div>
        <div class="academy-card-text">
          <div class="academy-card-name">${academy.name}</div>
          ${academy.location ? `<div class="academy-card-location">${academy.location}</div>` : ''}
        </div>
        <div class="academy-card-check">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `;
      card.addEventListener('click', () => selectAcademy(academy, card));
      list.appendChild(card);
    });
  }

  // ─── Select academy ───────────────────────────────
  function selectAcademy(academy, cardEl) {
    selectedAcademy = academy;

    // Highlight selected
    document.querySelectorAll('.academy-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');

    // Auto-advance after short delay so user sees selection
    setTimeout(() => {
      LogPages.pushHistory('log-page-3');
      LogSheet.setSheetTitle('Who was your coach?');
      LogPages.showBack();
      LogCoach.renderList();
      LogPages.goTo('log-page-4');
    }, 220);
  }

  // ─── Show/hide add form ───────────────────────────
  function showForm() {
    const form = document.getElementById('add-academy-form');
    const btn  = document.getElementById('add-academy-btn');
    if (form) form.classList.remove('hidden');
    if (btn)  btn.classList.add('hidden');

    // Focus name input
    setTimeout(() => {
      const input = document.getElementById('academy-name-input');
      if (input) input.focus();
    }, 100);
  }

  function hideForm() {
    const form = document.getElementById('add-academy-form');
    const btn  = document.getElementById('add-academy-btn');
    if (form) {
      form.classList.add('hidden');
      document.getElementById('academy-name-input').value  = '';
      document.getElementById('academy-location-input').value = '';
      resetIconPicker();
    }
    if (btn) btn.classList.remove('hidden');
  }

  // ─── Icon picker ──────────────────────────────────
  function resetIconPicker() {
    selectedIcon = 'dojo';
    document.querySelectorAll('#academy-icon-picker .icon-option').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.icon === 'dojo');
    });
  }

  // ─── Save new academy ────────────────────────────
  function saveAcademy() {
    const name = document.getElementById('academy-name-input').value.trim();
    if (!name) {
      document.getElementById('academy-name-input').focus();
      return;
    }
    const location = document.getElementById('academy-location-input').value.trim();
    AcademyStore.save({ name, location, icon: selectedIcon });
    hideForm();
    renderList();
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    // Add academy button
    const addBtn = document.getElementById('add-academy-btn');
    if (addBtn) addBtn.addEventListener('click', showForm);

    // Cancel
    const cancelBtn = document.getElementById('academy-cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', hideForm);

    // Save
    const saveBtn = document.getElementById('academy-save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveAcademy);

    // Icon picker — scoped to academy picker only
    document.querySelectorAll('#academy-icon-picker .icon-option').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIcon = btn.dataset.icon;
        document.querySelectorAll('#academy-icon-picker .icon-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  function getSelected() { return selectedAcademy; }

  function reset() {
    selectedAcademy = null;
    hideForm();
    renderList();
  }

  return { init, reset, getSelected, renderList };

})();