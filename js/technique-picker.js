/**
 * technique-picker.js
 * Two sections: Drills and Applied in Sparring.
 * Each has a dropdown button that opens a floating
 * overlay showing all techniques grouped by category.
 * Tapping a technique adds it as a tile and closes dropdown.
 */

const TechniquePicker = (() => {

  let techniquesData  = null;
  let drilledList     = [];
  let appliedList     = [];
  let activeSection   = null;

  // ─── Load data ────────────────────────────────────
  async function loadData() {
    if (techniquesData) return techniquesData;
    try {
      const res = await fetch('data/techniques.json');
      techniquesData = await res.json();
    } catch (e) {
      console.error('TechniquePicker: failed to load', e);
      techniquesData = { categories: [] };
    }
    return techniquesData;
  }

  // ─── Render page ─────────────────────────────────
  async function renderPage() {
    await loadData();
    renderTiles('drilled');
    renderTiles('applied');
  }

  // ─── Open dropdown ───────────────────────────────
  function openDropdown(section) {
    activeSection = section;

    const dropdown = document.getElementById('technique-dropdown');
    const title    = document.getElementById('technique-dropdown-title');
    const list     = document.getElementById('technique-dropdown-list');

    if (!dropdown || !list) return;

    // Set title
    if (title) title.textContent = section === 'drilled' ? 'Drills' : 'Applied in Sparring';

    // Mark button as open
    document.querySelectorAll('.tech-dropdown-btn').forEach(b => b.classList.remove('open'));
    const btn = document.getElementById(`${section}-dropdown-btn`);
    if (btn) btn.classList.add('open');

    // Build grouped list
    const currentList = section === 'drilled' ? drilledList : appliedList;
    list.innerHTML = '';

    techniquesData.categories.forEach(cat => {
      // Category heading
      const heading = document.createElement('div');
      heading.className = 'technique-group-heading';
      heading.textContent = `${cat.icon} ${cat.name}`;
      list.appendChild(heading);

      // Techniques
      cat.techniques.forEach(tech => {
        const isSelected = currentList.some(t => t.id === tech.id);
        const row = document.createElement('button');
        row.className = `technique-row${isSelected ? ' selected' : ''}`;
        row.dataset.id = tech.id;
        row.innerHTML = `
          <div class="technique-row-text">
            <div class="technique-row-name">${tech.name}</div>
            <div class="technique-row-desc">${tech.description}</div>
          </div>
          <div class="technique-row-check">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 13l4 4L19 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        `;
        row.addEventListener('click', () => addTechnique(tech, row));
        list.appendChild(row);
      });
    });

    // Show dropdown
    dropdown.classList.remove('hidden');
    requestAnimationFrame(() => dropdown.classList.add('visible'));
  }

  // ─── Close dropdown ──────────────────────────────
  function closeDropdown() {
    const dropdown = document.getElementById('technique-dropdown');
    if (!dropdown) return;

    dropdown.classList.remove('visible');
    setTimeout(() => {
      dropdown.classList.add('hidden');
    }, 220);

    document.querySelectorAll('.tech-dropdown-btn').forEach(b => b.classList.remove('open'));
    activeSection = null;
  }

  // ─── Add technique ───────────────────────────────
  function addTechnique(tech, rowEl) {
    const list = activeSection === 'drilled' ? drilledList : appliedList;
    const idx  = list.findIndex(t => t.id === tech.id);

    if (idx > -1) {
      list.splice(idx, 1);
      if (rowEl) rowEl.classList.remove('selected');
    } else {
      list.push(tech);
      if (rowEl) rowEl.classList.add('selected');
    }

    renderTiles(activeSection);
    LogPages.setDirty(true);

    // Close after adding (not removing)
    if (idx === -1) {
      setTimeout(() => closeDropdown(), 200);
    }
  }

  // ─── Render tiles ────────────────────────────────
  function renderTiles(section) {
    const list   = section === 'drilled' ? drilledList : appliedList;
    const tilesEl = document.getElementById(`${section}-tiles`);
    if (!tilesEl) return;

    tilesEl.innerHTML = '';
    list.forEach(tech => {
      const tile = document.createElement('div');
      tile.className = 'tech-tile';
      tile.innerHTML = `
        <span>${tech.name}</span>
        <button class="tech-tile-remove" aria-label="Remove ${tech.name}">
          <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1l8 8M9 1L1 9" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      `;
      tile.querySelector('.tech-tile-remove').addEventListener('click', () => {
        removeTechnique(section, tech.id);
      });
      tilesEl.appendChild(tile);
    });
  }

  // ─── Remove technique ────────────────────────────
  function removeTechnique(section, techId) {
    if (section === 'drilled') {
      drilledList = drilledList.filter(t => t.id !== techId);
    } else {
      appliedList = appliedList.filter(t => t.id !== techId);
    }
    renderTiles(section);
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    // Dropdown buttons
    document.querySelectorAll('.tech-dropdown-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        if (activeSection === section) {
          closeDropdown();
        } else {
          openDropdown(section);
        }
      });
    });

    // Close button
    const closeBtn = document.getElementById('technique-dropdown-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDropdown);
  }

  // ─── Reset ───────────────────────────────────────
  function reset() {
    drilledList  = [];
    appliedList  = [];
    activeSection = null;
    closeDropdown();
    renderTiles('drilled');
    renderTiles('applied');
  }

  function getDrilled() { return [...drilledList]; }
  function getApplied() { return [...appliedList]; }

  return { init, renderPage, reset, getDrilled, getApplied };

})();