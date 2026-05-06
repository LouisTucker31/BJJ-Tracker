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

  function formatFullDate(dateStr) {
    if (!dateStr) return '';
    const d   = new Date(dateStr + 'T00:00:00');
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleDateString('en-GB', { month: 'short' });
    return `${day} ${mon} ${d.getFullYear()}`;
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

  // ─── Open session detail ──────────────────────────
  function openDetail(id) {
    const session = SessionStore.getById(id);
    if (!session) return;

    const sheet = document.getElementById('session-view-sheet');
    const body  = document.getElementById('session-view-body');
    if (!sheet || !body) return;

    // Build detail content using same summary styles
    const drilled = session.drilled || [];
    const applied = session.applied || [];

    body.innerHTML = `
      <div class="summary-page-hero" style="padding: 0 0 16px 0;">
        <div class="summary-page-date">${formatFullDate(session.date)}</div>
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
          <span class="summary-stack-emoji">${COACH_ICONS[session.coach.icon] || '👨'}</span>
          <div class="summary-stack-text">
            <div class="summary-stack-label">Coached by</div>
            <div class="summary-stack-value">${session.coach.name}</div>
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
    `;

    // Set title
    const titleEl = sheet.querySelector('.session-view-title');
    if (titleEl) {
      titleEl.textContent = `${GI_LABELS[session.gi] || ''} ${session.formatType || session.sessionType}`.trim();
    }

    // Add floating action buttons to body
    const actionsHtml = `
      <div class="session-float-actions">
        <button class="session-action-btn session-action-btn--edit" id="session-view-edit">Edit</button>
        <button class="session-action-btn session-action-btn--delete" id="session-view-delete">Delete</button>
      </div>
    `;
    body.innerHTML += actionsHtml;

    // Wire delete
    const deleteBtn = document.getElementById('session-view-delete');
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        const confirmed = window.confirm('Delete this session?\nThis cannot be undone.');
        if (confirmed) {
          SessionStore.remove(id);
          closeDetail();
          renderSessionsList();
          renderTechniquesView();
        }
      };
    }

    // Show sheet and backdrop
    sheet.classList.add('open');
    const backdrop = document.getElementById('session-view-backdrop');
    if (backdrop) backdrop.classList.add('visible');
  }

  // ─── Close detail ─────────────────────────────────
  function closeDetail() {
    const sheet    = document.getElementById('session-view-sheet');
    const backdrop = document.getElementById('session-view-backdrop');
    if (sheet)    sheet.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
  }

  // ─── Render techniques view ───────────────────────
  function renderTechniquesView() {
    const container = document.getElementById('sessions-techniques-view');
    if (!container) return;

    const sessions = SessionStore.getAll();

    // Build usage map
    const usageMap = {};
    sessions.forEach(s => {
      (s.drilled || []).forEach(t => {
        if (!usageMap[t.id]) usageMap[t.id] = { count: 0, name: t.name };
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

    // Sort trained by usage count
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

    // Group trained by category
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

    const trainedHtml = trained.length > 0 ? `
      <div class="techniques-section">
        ${Object.entries(trainedByCategory).map(([catName, cat]) => `
          <div class="techniques-section-sub">${catName}</div>
          ${cat.techniques.map(t => `
            <div class="technique-row-item">
              <div class="technique-row-name">${t.name}</div>
              <div class="technique-row-desc">${t.description}</div>
              <div class="tech-bars">${renderBars(usageMap[t.id]?.count || 0)}</div>
            </div>
          `).join('')}
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
          ${untrained.map(t => `
            <div class="technique-row-item technique-row-item--unused">
              <div class="technique-row-name">${t.name}</div>
              <div class="technique-row-desc">${t.description}</div>
              <div class="tech-bars">${renderBars(0)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = trainedHtml + untrainedHtml;

    // Bind not-yet toggle
    const toggle  = document.getElementById('not-yet-toggle');
    const chevron = document.getElementById('not-yet-chevron');
    const list    = document.getElementById('not-yet-list');
    if (toggle) {
      toggle.addEventListener('click', () => {
        list.classList.toggle('open');
        chevron.classList.toggle('open');
      });
    }
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

  // ─── Init ─────────────────────────────────────────
  function init() {
    const seg = document.getElementById('sessions-seg');
    if (seg) {
      seg.querySelectorAll('.sessions-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
      });
    }

    const closeBtn   = document.getElementById('session-view-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDetail);

    const backdrop = document.getElementById('session-view-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeDetail);

    renderSessionsList();
  }

  return { init, refresh };

})();