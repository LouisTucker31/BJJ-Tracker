/**
 * sessions-page.js
 * Renders the Sessions page — list view and techniques view.
 */

const SessionsPage = (() => {

  let currentView = 'sessions'; // 'sessions' | 'techniques'

  const ENERGY_EMOJIS    = { 1: '😴', 2: '😕', 3: '😐', 4: '😊', 5: '🔥' };
  const ENERGY_LABELS    = { 1: 'Exhausted', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Fired Up' };
  const INTENSITY_LABELS = { light: 'Light', moderate: 'Moderate', hard: 'Hard' };
  const GI_LABELS        = { gi: 'Gi', nogi: 'No-Gi' };
  const ACADEMY_ICONS    = { dojo: '🥋', pin: '📍', home: '🏠', building: '🏛️', shield: '🛡️' };
  const COACH_ICONS      = { male: '👨', female: '👩', shirt: '🎽', medal: '🎖️' };

  // ─── Format helpers ───────────────────────────────
  function formatCardDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function formatFullDate(dateStr, timeStr) {
    if (!dateStr) return '';
    const d   = new Date(dateStr + 'T00:00:00');
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleDateString('en-GB', { month: 'short' });
    const datePart = `${day} ${mon} ${d.getFullYear()}`;
    return timeStr ? `${datePart} · ${timeStr.slice(0, 5)}` : datePart;
  }

  function formatMonthGroup(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }

  function formatDuration(val) {
    if (!val || val === '180+') return '3+ hrs';
    const mins = parseInt(val);
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  // ─── Render sessions list ─────────────────────────
  function renderSessionsList() {
    const container = document.getElementById('sessions-list-view');
    if (!container) return;

    const sessions = SessionStore.getAll();

    if (sessions.length === 0) {
      container.innerHTML = `
        <div class="sessions-empty">
          <div class="sessions-empty-emoji">🥋</div>
          <div class="sessions-empty-title">No sessions yet</div>
          <div class="sessions-empty-sub">Tap Log to record your first session</div>
        </div>
      `;
      return;
    }

    // Group by month
    const groups = {};
    sessions.forEach(s => {
      const key = formatMonthGroup(s.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });

    container.innerHTML = Object.entries(groups).map(([month, group]) => `
      <div class="sessions-month-group">
        <div class="sessions-month-heading">${month}</div>
        ${group.map(s => renderSessionCard(s)).join('')}
      </div>
    `).join('');

    // Bind card taps
    container.querySelectorAll('.session-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        openDetail(id);
      });
    });
  }

  // ─── Render single session card ───────────────────
  function renderSessionCard(s) {
    const allTechs  = [...(s.drilled || []), ...(s.applied || [])];
    const showTags  = allTechs.slice(0, 3);
    const extraCount = allTechs.length - showTags.length;

    const drilledIds = (s.drilled || []).map(t => t.id);

    const tagHtml = [
      ...showTags.map(t => {
        const isDrilled = drilledIds.includes(t.id);
        return `<span class="session-card-tag ${isDrilled ? 'session-card-tag--drilled' : 'session-card-tag--applied'}">${t.name}</span>`;
      }),
      extraCount > 0 ? `<span class="session-card-tag session-card-tag--more">+${extraCount} more</span>` : ''
    ].join('');

    return `
      <div class="session-card" data-id="${s.id}">
        <div class="session-card-top">
          <span class="session-card-date">${formatCardDate(s.date)}</span>
          <span class="session-card-duration">${formatDuration(s.duration)}</span>
        </div>
        <div class="session-card-title">
          ${s.sessionType === 'Rolling' ? '🤼' : s.sessionType === 'Coaching' ? '📋' : s.sessionType === 'Competition' ? '🏆' : '⭐'}
          ${GI_LABELS[s.gi] || ''} ${s.formatType || s.sessionType}
        </div>
        ${s.academy ? `<div class="session-card-academy">📍 ${s.academy.name}${s.academy.location ? ', ' + s.academy.location : ''}</div>` : ''}
        ${allTechs.length > 0 ? `<div class="session-card-tags">${tagHtml}</div>` : ''}
      </div>
    `;
  }

  // ─── Edit state ───────────────────────────────────
  let _editDrilled = [];
  let _editApplied = [];

  // ─── Render view mode ─────────────────────────────
  function renderViewMode(session) {
    const sheet = document.getElementById('session-view-sheet');
    const body  = document.getElementById('session-view-body');
    if (!body) return;

    const drilled = session.drilled || [];
    const applied = session.applied || [];

    body.innerHTML = `
      <div class="summary-page-hero" style="padding: 0 0 16px 0;">
        <div class="summary-page-date">${formatFullDate(session.date, session.time)}</div>
        <div class="summary-pills" style="margin-top:8px;">
          ${session.academy?.location ? `<div class="summary-pill"><span>📍</span><span>${session.academy.location}</span></div>` : ''}
          <div class="summary-pill"><span>⏱️</span><span>${formatDuration(session.duration)}</span></div>
          <div class="summary-pill"><span>⚡</span><span>${INTENSITY_LABELS[session.intensity] || ''}</span></div>
          <div class="summary-pill"><span>${ENERGY_EMOJIS[session.energy] || '😐'}</span><span>${ENERGY_LABELS[session.energy] || ''}</span></div>
        </div>
      </div>

      <div class="summary-stack">
        <div class="summary-stack-tile">
          <span class="summary-stack-emoji">🥋</span>
          <div class="summary-stack-text">
            <div class="summary-stack-label">Training Type</div>
            <div class="summary-stack-value">${session.formatType || session.sessionType}</div>
          </div>
        </div>
        <div class="summary-stack-tile">
          <span class="summary-stack-emoji">👘</span>
          <div class="summary-stack-text">
            <div class="summary-stack-label">Format</div>
            <div class="summary-stack-value">${GI_LABELS[session.gi] || '—'}</div>
          </div>
        </div>
        ${session.academy ? `
        <div class="summary-stack-tile">
          <span class="summary-stack-emoji">${ACADEMY_ICONS[session.academy.icon] || '🥋'}</span>
          <div class="summary-stack-text">
            <div class="summary-stack-label">Trained at</div>
            <div class="summary-stack-value">${session.academy.name}</div>
          </div>
        </div>` : ''}
        ${session.coach ? `
        <div class="summary-stack-tile">
          <span class="summary-stack-emoji">${Array.isArray(session.coach) ? (COACH_ICONS[session.coach[0]?.icon] || '👨') : (COACH_ICONS[session.coach.icon] || '👨')}</span>
          <div class="summary-stack-text">
            <div class="summary-stack-label">Coached by</div>
            <div class="summary-stack-value">${Array.isArray(session.coach) ? session.coach.map(c => c.name).join(', ') : session.coach.name}</div>
          </div>
        </div>` : ''}
      </div>

      ${drilled.length > 0 ? `
      <div class="summary-techniques">
        <div class="summary-section-heading">Drilled</div>
        <div class="summary-tech-tags">
          ${drilled.map(t => `<span class="summary-tech-tag summary-tech-tag--drilled">${t.name}</span>`).join('')}
        </div>
      </div>` : ''}

      ${applied.length > 0 ? `
      <div class="summary-techniques">
        <div class="summary-section-heading">Applied in Sparring</div>
        <div class="summary-tech-tags">
          ${applied.map(t => `<span class="summary-tech-tag summary-tech-tag--applied">${t.name}</span>`).join('')}
        </div>
      </div>` : ''}

      ${session.notes ? `
      <div class="summary-techniques" style="margin-top:8px;">
        <div class="summary-section-heading">Notes</div>
        <div style="font-size:15px;color:var(--color-label-primary,#000);line-height:1.5;white-space:pre-wrap;padding:4px 0;">${session.notes}</div>
      </div>` : ''}

      <div class="session-float-actions">
        <button class="session-action-btn session-action-btn--edit" id="session-view-edit">Edit</button>
        <button class="session-action-btn session-action-btn--delete" id="session-view-delete">Delete</button>
      </div>
    `;

    if (sheet) {
      const titleEl = sheet.querySelector('.session-view-title');
      if (titleEl) titleEl.textContent = `${GI_LABELS[session.gi] || ''} ${session.formatType || session.sessionType}`.trim();
    }

    document.getElementById('session-view-edit').onclick = () => renderEditMode(session);

    document.getElementById('session-view-delete').onclick = () => {
      const confirmed = window.confirm('Delete this session?\nThis cannot be undone.');
      if (confirmed) {
        SessionStore.remove(session.id);
        closeDetail();
        renderSessionsList();
        renderTechniquesView();
      }
    };
  }

  // ─── Render edit mode ─────────────────────────────
  function renderEditMode(session) {
    const body = document.getElementById('session-view-body');
    if (!body) return;

    _editDrilled = [...(session.drilled || [])];
    _editApplied = [...(session.applied || [])];

    const sheet   = document.getElementById('session-view-sheet');
    const titleEl = sheet?.querySelector('.session-view-title');
    if (titleEl) titleEl.textContent = 'Edit Session';

    body.innerHTML = `

      <div class="details-section">
        <div class="details-row">
          <span class="details-label">Date</span>
          <button class="details-value-btn" id="edit-date-display">${formatFullDateShort(session.date)}</button>
          <input type="date" id="edit-date" class="details-date-hidden" value="${session.date || ''}" max="${new Date().toISOString().split('T')[0]}" />
        </div>
        <div class="details-row details-row--border">
          <span class="details-label">Time</span>
          <button class="details-value-btn" id="edit-time-display">${(session.time || '').slice(0,5)}</button>
          <input type="time" id="edit-time" class="details-date-hidden" value="${session.time || ''}" />
        </div>
        <div class="details-row details-row--border">
          <span class="details-label">Duration</span>
          <select id="edit-duration" class="details-select">
            ${[30,45,60,75,90,105,120,150,180].map(v =>
              `<option value="${v}" ${String(session.duration) === String(v) ? 'selected' : ''}>${v < 60 ? v+' min' : (v%60===0 ? (v/60)+'h' : Math.floor(v/60)+'h '+(v%60)+'m')}</option>`
            ).join('')}
            <option value="180+" ${session.duration === '180+' ? 'selected' : ''}>3+ hours</option>
          </select>
        </div>
      </div>

      <div class="details-section">
        <div class="details-row">
          <span class="details-label">Format</span>
          <div class="segmented-control" id="edit-gi-control">
            <button class="seg-btn ${session.gi === 'gi'   ? 'active' : ''}" data-value="gi">Gi</button>
            <button class="seg-btn ${session.gi === 'nogi' ? 'active' : ''}" data-value="nogi">No-Gi</button>
          </div>
        </div>
        <div class="details-row details-row--border">
          <span class="details-label">Intensity</span>
          <div class="segmented-control" id="edit-intensity-control">
            <button class="seg-btn ${session.intensity === 'light'    ? 'active' : ''}" data-value="light">Light</button>
            <button class="seg-btn ${session.intensity === 'moderate' ? 'active' : ''}" data-value="moderate">Moderate</button>
            <button class="seg-btn ${session.intensity === 'hard'     ? 'active' : ''}" data-value="hard">Hard</button>
          </div>
        </div>
      </div>

      <div class="details-section">
        <div class="energy-row">
          <div class="energy-emojis">
            <span>😴</span><span>😕</span><span>😐</span><span>😊</span><span>🔥</span>
          </div>
          <input type="range" id="edit-energy" class="energy-slider" min="1" max="5" step="1" value="${session.energy || 3}" />
        </div>
      </div>

      <div class="details-section" style="padding: 14px 16px;">
        <div class="edit-tech-section-label">Drilled</div>
        <div id="edit-drilled-tags" class="edit-tech-tags"></div>
        <button class="edit-tech-add-btn" id="edit-drilled-add">+ Add</button>
      </div>

      <div class="details-section" style="padding: 14px 16px;">
        <div class="edit-tech-section-label">Applied in Sparring</div>
        <div id="edit-applied-tags" class="edit-tech-tags"></div>
        <button class="edit-tech-add-btn edit-tech-add-btn--applied" id="edit-applied-add">+ Add</button>
      </div>

      <div class="details-section">
        <textarea id="edit-notes" class="notes-input" rows="4" placeholder="Any notes about the session..." autocapitalize="sentences" autocorrect="on" spellcheck="true">${session.notes || ''}</textarea>
      </div>

      <div class="session-float-actions">
        <button class="session-action-btn session-action-btn--edit" id="edit-cancel-btn">Cancel</button>
        <button class="session-action-btn session-action-btn--save" id="edit-save-btn">Save</button>
      </div>
    `;

    renderEditTechTags('drilled');
    renderEditTechTags('applied');

    // Segmented controls
    body.querySelectorAll('.segmented-control').forEach(ctrl => {
      ctrl.querySelectorAll('.seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          ctrl.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });

    // Date picker
    const dateInput   = document.getElementById('edit-date');
    const dateDisplay = document.getElementById('edit-date-display');
    dateDisplay.addEventListener('click', () => {
      dateInput.style.cssText = 'position:fixed;opacity:0;top:0;left:0;width:100%;height:100%;z-index:999;pointer-events:auto;';
      dateInput.showPicker?.();
      dateInput.focus();
      dateInput.click();
    });
    dateInput.addEventListener('change', () => {
      dateDisplay.textContent = formatFullDateShort(dateInput.value);
      dateInput.style.cssText = '';
    });
    dateInput.addEventListener('blur', () => { dateInput.style.cssText = ''; });

    // Time picker
    const timeInput   = document.getElementById('edit-time');
    const timeDisplay = document.getElementById('edit-time-display');
    timeDisplay.addEventListener('click', () => {
      timeInput.style.cssText = 'position:fixed;opacity:0;top:0;left:0;width:100%;height:100%;z-index:999;pointer-events:auto;';
      timeInput.showPicker?.();
      timeInput.focus();
      timeInput.click();
    });
    timeInput.addEventListener('change', () => {
      timeDisplay.textContent = timeInput.value.slice(0, 5);
      timeInput.style.cssText = '';
    });
    timeInput.addEventListener('blur', () => { timeInput.style.cssText = ''; });

    // Technique add buttons
    document.getElementById('edit-drilled-add').addEventListener('click', () => openEditPicker('drilled'));
    document.getElementById('edit-applied-add').addEventListener('click', () => openEditPicker('applied'));

    // Cancel
    document.getElementById('edit-cancel-btn').addEventListener('click', () => {
      const fresh = SessionStore.getById(session.id);
      if (fresh) renderViewMode(fresh);
    });

    // Save
    document.getElementById('edit-save-btn').addEventListener('click', () => {
      const changes = {
        date:      document.getElementById('edit-date').value,
        time:      document.getElementById('edit-time').value,
        duration:  document.getElementById('edit-duration').value,
        gi:        document.querySelector('#edit-gi-control .seg-btn.active')?.dataset.value,
        intensity: document.querySelector('#edit-intensity-control .seg-btn.active')?.dataset.value,
        energy:    parseInt(document.getElementById('edit-energy').value),
        notes:     document.getElementById('edit-notes').value.trim(),
        drilled:   _editDrilled,
        applied:   _editApplied,
      };
      const updated = SessionStore.update(session.id, changes);
      if (updated) {
        renderSessionsList();
        renderTechniquesView();
        renderViewMode(updated);
      }
    });
  }

  // ─── Edit technique tags ──────────────────────────
  function renderEditTechTags(section) {
    const list = section === 'drilled' ? _editDrilled : _editApplied;
    const el   = document.getElementById(`edit-${section}-tags`);
    if (!el) return;
    el.innerHTML = list.map(t => `
      <span class="edit-tech-tag edit-tech-tag--${section}" data-id="${t.id}">
        ${t.name}
        <button class="edit-tech-tag-remove" aria-label="Remove">×</button>
      </span>
    `).join('');
    el.querySelectorAll('.edit-tech-tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.edit-tech-tag').dataset.id;
        if (section === 'drilled') _editDrilled = _editDrilled.filter(t => t.id !== id);
        else                       _editApplied = _editApplied.filter(t => t.id !== id);
        renderEditTechTags(section);
      });
    });
  }

  // ─── Inline technique picker for edit mode ────────
  function openEditPicker(section) {
    const sheet = document.getElementById('session-view-sheet');
    if (!sheet) return;

    const overlay = document.createElement('div');
    overlay.id        = 'edit-picker-overlay';
    overlay.className = 'edit-picker-overlay';
    overlay.innerHTML = `
      <div class="edit-picker-panel" id="edit-picker-panel">
        <div class="edit-picker-header">
          <span class="edit-picker-title">${section === 'drilled' ? 'Drills' : 'Applied in Sparring'}</span>
          <button class="tech-picker-done" id="edit-picker-done">Done</button>
        </div>
        <div class="edit-picker-list" id="edit-picker-list"></div>
      </div>
    `;
    sheet.appendChild(overlay);

    const currentList = section === 'drilled' ? _editDrilled : _editApplied;
    const listEl      = document.getElementById('edit-picker-list');

    TechniquePicker.TECHNIQUES_DATA.categories.forEach(cat => {
      const heading = document.createElement('div');
      heading.className   = 'tech-picker-category';
      heading.textContent = `${cat.icon} ${cat.name}`;
      listEl.appendChild(heading);

      cat.techniques.forEach(tech => {
        const isSelected = currentList.some(t => t.id === tech.id);
        const isApplied  = section === 'applied';
        const row        = document.createElement('div');
        row.className    = `tech-picker-row${isSelected ? (isApplied ? ' selected--applied' : ' selected') : ''}`;
        row.dataset.id   = tech.id;
        row.innerHTML    = `
          <div>
            <div class="tech-picker-row-name">${tech.name}</div>
            <div class="tech-picker-row-desc">${tech.description}</div>
          </div>
          <div class="tech-picker-check">
            <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5l3.5 3.5L11 1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        `;
        row.addEventListener('click', () => {
          const list = section === 'drilled' ? _editDrilled : _editApplied;
          const idx  = list.findIndex(t => t.id === tech.id);
          if (idx > -1) {
            list.splice(idx, 1);
            row.classList.remove('selected', 'selected--applied');
          } else {
            list.push(tech);
            row.classList.add(isApplied ? 'selected--applied' : 'selected');
          }
          renderEditTechTags(section);
        });
        listEl.appendChild(row);
      });
    });

    requestAnimationFrame(() => overlay.classList.add('visible'));

    document.getElementById('edit-picker-done').addEventListener('click', () => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 320);
    });
  }

  // ─── Date format helper (edit mode + technique expand) ───
  function formatFullDateShort(dateStr, timeStr) {
    if (!dateStr) return '';
    const d   = new Date(dateStr + 'T00:00:00');
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleDateString('en-GB', { month: 'short' });
    const datePart = `${day} ${mon} ${d.getFullYear()}`;
    return timeStr ? `${datePart} · ${timeStr.slice(0, 5)}` : datePart;
  }

  // ─── Open session detail ──────────────────────────
  function openDetail(id) {
    const session = SessionStore.getById(id);
    if (!session) return;

    const sheet = document.getElementById('session-view-sheet');
    const body  = document.getElementById('session-view-body');
    if (!sheet || !body) return;

    renderViewMode(session);

    sheet.classList.add('open');
    const backdrop = document.getElementById('session-view-backdrop');
    if (backdrop) backdrop.classList.add('visible');
    document.getElementById('sessions-list-view')?.style.setProperty('overflow', 'hidden');
    document.getElementById('sessions-techniques-view')?.style.setProperty('overflow', 'hidden');
  }

  // ─── Close detail ─────────────────────────────────
  function closeDetail() {
    const sheet    = document.getElementById('session-view-sheet');
    const backdrop = document.getElementById('session-view-backdrop');
    if (sheet)    sheet.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
    document.getElementById('sessions-list-view')?.style.removeProperty('overflow');
    document.getElementById('sessions-techniques-view')?.style.removeProperty('overflow');
  }

  // ─── Render techniques view ───────────────────────
  // ─── Open technique id tracker ────────────────────
  let _openTechId = null;

  function renderTechniquesView() {
    const container = document.getElementById('sessions-techniques-view');
    if (!container) return;

    _openTechId = null;
    const sessions = SessionStore.getAll();

    // Build usage map + session history per technique
    const usageMap = {}; // id -> { count, sessions: [{date, time, formatType, gi}] }
    sessions.forEach(s => {
      (s.drilled || []).forEach(t => {
        if (!usageMap[t.id]) usageMap[t.id] = { count: 0 };
        usageMap[t.id].count++;
      });
    });

    // Get all techniques from picker data
    const allTechs = [];
    TechniquePicker.TECHNIQUES_DATA?.categories.forEach(cat => {
      cat.techniques.forEach(t => {
        allTechs.push({ ...t, catName: cat.name, catIcon: cat.icon });
      });
    });

    const trained   = allTechs.filter(t => usageMap[t.id]);
    const untrained = allTechs.filter(t => !usageMap[t.id]);

    trained.sort((a, b) => (usageMap[b.id]?.count || 0) - (usageMap[a.id]?.count || 0));

    if (trained.length === 0 && sessions.length === 0) {
      container.innerHTML = `
        <div class="sessions-empty">
          <div class="sessions-empty-emoji">📚</div>
          <div class="sessions-empty-title">No techniques yet</div>
          <div class="sessions-empty-sub">Log sessions to track your technique library</div>
        </div>
      `;
      return;
    }

    const trainedByCategory = {};
    trained.forEach(t => {
      if (!trainedByCategory[t.catName]) {
        trainedByCategory[t.catName] = { icon: t.catIcon, techniques: [] };
      }
      trainedByCategory[t.catName].techniques.push(t);
    });

    function renderBars(count, max = 6) {
      const filled = Math.min(count, max);
      return Array.from({ length: max }, (_, i) =>
        `<div class="tech-bar ${i < filled ? 'tech-bar--filled' : ''}"></div>`
      ).join('');
    }

    function renderTechRow(t, unused = false) {
      const usage    = usageMap[t.id];
      const count    = usage?.count || 0;
      const recentSessions = usage?.sessions || [];

      return `
        <div class="technique-row-item ${unused ? 'technique-row-item--unused' : ''}" data-tech-id="${t.id}">
          <div class="technique-row-top">
            <div class="technique-row-name">${t.name}</div>
            <div class="technique-row-chevron">
              <svg viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5l5 4 5-4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="technique-row-desc">${t.description}</div>
          <div class="tech-bars">${renderBars(count)}</div>
          <div class="technique-row-expand">
            <div class="tech-expand-detail">${t.detail || ''}</div>
          </div>
        </div>
      `;
    }

    const trainedHtml = trained.length > 0 ? `
      <div class="techniques-section">
        ${Object.entries(trainedByCategory).map(([catName, cat]) => `
          <div class="techniques-section-sub">${catName}</div>
          ${cat.techniques.map(t => renderTechRow(t)).join('')}
        `).join('')}
      </div>
    ` : '';

    const untrainedHtml = untrained.length > 0 ? `
      <div class="techniques-not-yet">
        <button class="techniques-not-yet-toggle" id="not-yet-toggle">
          <span class="techniques-not-yet-label">Not Yet Trained (${untrained.length})</span>
          <span class="techniques-not-yet-chevron" id="not-yet-chevron">▼</span>
        </button>
        <div class="techniques-not-yet-list" id="not-yet-list">
          ${untrained.map(t => renderTechRow(t, true)).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = trainedHtml + untrainedHtml;

    // ── Accordion tap handler ──
    container.querySelectorAll('.technique-row-item').forEach(row => {
      row.addEventListener('click', () => {
        const techId = row.dataset.techId;

        // If already open — close it
        if (_openTechId === techId) {
          collapseRow(row);
          _openTechId = null;
          return;
        }

        // Close any previously open row
        if (_openTechId) {
          const prev = container.querySelector(`.technique-row-item[data-tech-id="${_openTechId}"]`);
          if (prev) collapseRow(prev);
        }

        // Open this row
        expandRow(row);
        _openTechId = techId;
      });
    });

    // ── Not-yet toggle ──
    const toggle  = document.getElementById('not-yet-toggle');
    const chevron = document.getElementById('not-yet-chevron');
    const list    = document.getElementById('not-yet-list');
    if (toggle) {
      toggle.addEventListener('click', () => {
        // Close any open technique when collapsing the section
        if (_openTechId) {
          const prev = container.querySelector(`.technique-row-item[data-tech-id="${_openTechId}"]`);
          if (prev) collapseRow(prev);
          _openTechId = null;
        }
        list.classList.toggle('open');
        chevron.classList.toggle('open');
      });
    }
  }

  // ─── Expand / collapse helpers ────────────────────
  function expandRow(row) {
    const expand  = row.querySelector('.technique-row-expand');
    const chevron = row.querySelector('.technique-row-chevron');
    if (!expand) return;
    expand.style.height  = expand.scrollHeight + 'px';
    expand.classList.add('open');
    if (chevron) chevron.classList.add('open');
    row.classList.add('open');
  }

  function collapseRow(row) {
    const expand  = row.querySelector('.technique-row-expand');
    const chevron = row.querySelector('.technique-row-chevron');
    if (!expand) return;
    expand.style.height  = expand.scrollHeight + 'px'; // pin before animating
    requestAnimationFrame(() => {
      expand.style.height = '0px';
    });
    expand.classList.remove('open');
    if (chevron) chevron.classList.remove('open');
    row.classList.remove('open');
  }

  // ─── Switch view ──────────────────────────────────
  function switchView(view) {
    currentView = view;

    // Always close detail when switching views
    closeDetail();

    document.querySelectorAll('.sessions-seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    const viewId = view === 'sessions' ? 'sessions-list-view' : 'sessions-techniques-view';
    document.querySelectorAll('.sessions-view').forEach(v => {
      v.classList.toggle('active', v.id === viewId);
    });
    if (view === 'sessions') renderSessionsList();
    if (view === 'techniques') renderTechniquesView();
  }

  // ─── Refresh (called after saving a session) ──────
  function refresh() {
    if (currentView === 'sessions') renderSessionsList();
    if (currentView === 'techniques') renderTechniquesView();
  }

  // ─── Drag to dismiss ──────────────────────────────
  function initDragToDismiss() {
    const sheet      = document.getElementById('session-view-sheet');
    const backdrop   = document.getElementById('session-view-backdrop');
    const handleArea = sheet?.querySelector('.session-view-handle-area');
    const body       = document.getElementById('session-view-body');
    if (!sheet || !handleArea || !body) return;

    let startY    = 0;
    let startTime = 0;
    let dragging  = false;

    const DISMISS_THRESHOLD  = 120;
    const VELOCITY_THRESHOLD = 0.5;

    handleArea.addEventListener('touchstart', e => {
      startY    = e.touches[0].clientY;
      startTime = Date.now();
      dragging  = true;
      sheet.classList.add('dragging');
    }, { passive: true });

    document.addEventListener('touchmove', e => {
      if (!dragging) return;
      e.preventDefault();
      const delta = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = `translateY(${delta * 0.88}px)`;
      if (backdrop) backdrop.style.opacity = (0.35 * (1 - Math.min(delta / 300, 1))).toString();
    }, { passive: false });

    document.addEventListener('touchend', e => {
      if (!dragging) return;
      dragging = false;
      sheet.classList.remove('dragging');
      sheet.style.transform = '';
      if (backdrop) backdrop.style.opacity = '';

      const delta    = e.changedTouches[0].clientY - startY;
      const velocity = delta / (Date.now() - startTime);

      if (delta > DISMISS_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
        closeDetail();
      }
    }, { passive: true });

    // Prevent sheet scroll from propagating to page behind
    body.addEventListener('touchmove', e => {
      e.stopPropagation();
    }, { passive: true });
  }

  // ─── Init ─────────────────────────────────────────
  function init() {
    const seg = document.getElementById('sessions-seg');
    if (seg) {
      seg.querySelectorAll('.sessions-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
      });
    }

    const closeBtn = document.getElementById('session-view-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);

    const backdrop = document.getElementById('session-view-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDetail);

    initDragToDismiss();
    renderSessionsList();
  }

  return { init, refresh };

})();