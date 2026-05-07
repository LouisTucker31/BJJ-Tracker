/**
 * session-store.js
 * Saves and retrieves sessions from localStorage.
 */

const SessionStore = (() => {

  const KEY = 'bjj_sessions';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch { return []; }
  }

  function save(session) {
    const all = getAll();
    session.id = Date.now().toString();
    all.unshift(session); // most recent first
    localStorage.setItem(KEY, JSON.stringify(all));
    return session;
  }

  function getById(id) {
    return getAll().find(s => s.id === id) || null;
  }

  function remove(id) {
    const all = getAll().filter(s => s.id !== id);
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  function update(id, changes) {
    const all     = getAll();
    const idx     = all.findIndex(s => s.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...changes };
    localStorage.setItem(KEY, JSON.stringify(all));
    return all[idx];
  }

  return { getAll, save, getById, remove, update };

})();