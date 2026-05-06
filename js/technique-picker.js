/**
 * technique-picker.js
 * Uses native <select> with <optgroup> for each category.
 * Selecting a technique adds it as a tile.
 */

const TechniquePicker = (() => {

  let techniquesData = null;
  let drilledList    = [];
  let appliedList    = [];

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

  // ─── Populate a select element ───────────────────
  function populateSelect(selectEl) {
    if (!techniquesData || !selectEl) return;

    // Clear existing options except placeholder
    while (selectEl.options.length > 1) selectEl.remove(1);

    techniquesData.categories.forEach(cat => {
      const group = document.createElement('optgroup');
      group.label = `${cat.icon} ${cat.name}`;
      cat.techniques.forEach(tech => {
        const option = document.createElement('option');
        option.value = tech.id;
        option.textContent = tech.name;
        group.appendChild(option);
      });
      selectEl.appendChild(group);
    });
  }

  // ─── Find technique by id ────────────────────────
  function findTechnique(id) {
    if (!techniquesData) return null;
    for (const cat of techniquesData.categories) {
      const tech = cat.techniques.find(t => t.id === id);
      if (tech) return tech;
    }
    return null;
  }

  // ─── Handle selection ────────────────────────────
  function handleSelect(selectEl, section) {
    const id = selectEl.value;
    if (!id) return;

    const tech = findTechnique(id);
    if (!tech) return;

    const list = section === 'drilled' ? drilledList : appliedList;
    const already = list.some(t => t.id === id);

    if (!already) {
      list.push(tech);
      renderTiles(section);
      LogPages.setDirty(true);
    }

    // Reset select back to placeholder
    selectEl.value = '';
  }

  // ─── Render tiles ────────────────────────────────
  function renderTiles(section) {
    const list    = section === 'drilled' ? drilledList : appliedList;
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

  // ─── Render page ─────────────────────────────────
  async function renderPage() {
    await loadData();
    const drilledSelect = document.getElementById('drilled-select');
    const appliedSelect = document.getElementById('applied-select');
    populateSelect(drilledSelect);
    populateSelect(appliedSelect);
    renderTiles('drilled');
    renderTiles('applied');
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    const drilledSelect = document.getElementById('drilled-select');
    const appliedSelect = document.getElementById('applied-select');

    if (drilledSelect) {
      drilledSelect.addEventListener('change', () => handleSelect(drilledSelect, 'drilled'));
    }
    if (appliedSelect) {
      appliedSelect.addEventListener('change', () => handleSelect(appliedSelect, 'applied'));
    }
  }

  // ─── Reset ───────────────────────────────────────
  function reset() {
    drilledList = [];
    appliedList = [];
    const drilledSelect = document.getElementById('drilled-select');
    const appliedSelect = document.getElementById('applied-select');
    if (drilledSelect) drilledSelect.value = '';
    if (appliedSelect) appliedSelect.value = '';
    renderTiles('drilled');
    renderTiles('applied');
  }

  function getDrilled() { return [...drilledList]; }
  function getApplied() { return [...appliedList]; }

  return { init, renderPage, reset, getDrilled, getApplied };

})();