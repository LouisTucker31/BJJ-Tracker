/**
 * technique-picker.js
 * Shared category pill picker for Drilled and Applied sections.
 * Tapping a section header activates it.
 * Tapping a technique adds it and closes the list.
 */

const TechniquePicker = (() => {

  let techniquesData = null;
  let drilledList    = [];
  let appliedList    = [];
  let activeSection  = null;
  let activeCategory = null;

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
    renderSection('drilled');
    renderSection('applied');
    renderCategoryPills();
    // Default to drilled section active
    setActiveSection('drilled');
  }

  // ─── Set active section ───────────────────────────
  function setActiveSection(section) {
    activeSection = section;

    // Update header active states
    document.querySelectorAll('.technique-section-header').forEach(h => {
      h.classList.toggle('active', h.dataset.section === section);
    });

    // Update picker label
    const label = document.getElementById('technique-picker-label');
    if (label) {
      label.textContent = section === 'drilled'
        ? 'Adding to Drilled — select a category'
        : 'Adding to Applied in Sparring — select a category';
    }

    // Re-render technique list if category already open
    if (activeCategory) {
      renderTechniqueList(activeCategory);
    }
  }

  // ─── Render tags for a section ────────────────────
  function renderSection(section) {
    const list    = section === 'drilled' ? drilledList : appliedList;
    const tagsEl  = document.getElementById(`${section}-tags`);
    const emptyEl = document.getElementById(`${section}-empty`);
    if (!tagsEl) return;

    tagsEl.innerHTML = '';

    if (list.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      list.forEach(tech => {
        const tag = document.createElement('div');
        tag.className = 'technique-tag';
        tag.innerHTML = `
          <span>${tech.name}</span>
          <button class="technique-tag-remove" aria-label="Remove">
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1l8 8M9 1L1 9" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        `;
        tag.querySelector('.technique-tag-remove').addEventListener('click', () => {
          removeTechnique(section, tech.id);
        });
        tagsEl.appendChild(tag);
      });
    }
  }

  // ─── Render category pills ────────────────────────
  function renderCategoryPills() {
    const container = document.getElementById('technique-category-pills');
    if (!container || !techniquesData) return;
    container.innerHTML = '';
    techniquesData.categories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = 'category-pill';
      pill.dataset.id = cat.id;
      pill.textContent = `${cat.icon} ${cat.name}`;
      pill.addEventListener('click', () => selectCategory(cat.id));
      container.appendChild(pill);
    });
  }

  // ─── Select category ─────────────────────────────
  function selectCategory(catId) {
    // If same pill tapped again — close list
    if (activeCategory === catId) {
      activeCategory = null;
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('technique-list-panel');
      if (panel) panel.classList.add('hidden');
      return;
    }

    activeCategory = catId;
    document.querySelectorAll('.category-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.id === catId);
    });

    renderTechniqueList(catId);
    const panel = document.getElementById('technique-list-panel');
    if (panel) panel.classList.remove('hidden');
  }

  // ─── Render technique list ────────────────────────
  function renderTechniqueList(catId) {
    const cat    = techniquesData.categories.find(c => c.id === catId);
    const listEl = document.getElementById('technique-list-items');
    const titleEl = document.getElementById('technique-list-title');
    if (!cat || !listEl) return;

    if (titleEl) titleEl.textContent = cat.name;
    listEl.innerHTML = '';

    const currentList = activeSection === 'drilled' ? drilledList : appliedList;

    cat.techniques.forEach(tech => {
      const isSelected = currentList.some(t => t.id === tech.id);
      const item = document.createElement('button');
      item.className = `technique-list-item${isSelected ? ' selected' : ''}`;
      item.dataset.id = tech.id;
      item.innerHTML = `
        <div class="technique-list-item-text">
          <div class="technique-list-item-name">${tech.name}</div>
          <div class="technique-list-item-desc">${tech.description}</div>
        </div>
        <div class="technique-list-item-check">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `;
      item.addEventListener('click', () => addTechnique(tech, item));
      listEl.appendChild(item);
    });
  }

  // ─── Add technique and close list ────────────────
  function addTechnique(tech, itemEl) {
    const list = activeSection === 'drilled' ? drilledList : appliedList;
    const idx  = list.findIndex(t => t.id === tech.id);

    if (idx > -1) {
      // Already in list — remove it
      list.splice(idx, 1);
      if (itemEl) itemEl.classList.remove('selected');
    } else {
      // Add it
      list.push(tech);
      if (itemEl) itemEl.classList.add('selected');
    }

    renderSection(activeSection);
    LogPages.setDirty(true);

    // Close list after adding (not removing)
    if (idx === -1) {
      setTimeout(() => {
        activeCategory = null;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('technique-list-panel');
        if (panel) panel.classList.add('hidden');
      }, 300);
    }
  }

  // ─── Remove technique tag ─────────────────────────
  function removeTechnique(section, techId) {
    if (section === 'drilled') {
      drilledList = drilledList.filter(t => t.id !== techId);
    } else {
      appliedList = appliedList.filter(t => t.id !== techId);
    }
    renderSection(section);
  }

  // ─── Init ────────────────────────────────────────
  function init() {
    // Section headers activate picker for that section
    document.querySelectorAll('.technique-section-header').forEach(header => {
      header.addEventListener('click', () => {
        setActiveSection(header.dataset.section);
      });
    });
  }

  // ─── Reset ───────────────────────────────────────
  function reset() {
    drilledList   = [];
    appliedList   = [];
    activeSection = null;
    activeCategory = null;

    const panel = document.getElementById('technique-list-panel');
    if (panel) panel.classList.add('hidden');
    document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.technique-section-header').forEach(h => h.classList.remove('active'));
  }

  function getDrilled() { return [...drilledList]; }
  function getApplied() { return [...appliedList]; }

  return { init, renderPage, reset, getDrilled, getApplied };

})();