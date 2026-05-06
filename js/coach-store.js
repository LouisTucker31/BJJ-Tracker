/**
 * coach-store.js
 * Persists coaches to localStorage.
 */

const CoachStore = (() => {

  const KEY = 'bjj_coaches';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch { return []; }
  }

  function save(coach) {
    const all = getAll();
    coach.id = Date.now().toString();
    all.push(coach);
    localStorage.setItem(KEY, JSON.stringify(all));
    return coach;
  }

  function remove(id) {
    const all = getAll().filter(c => c.id !== id);
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  return { getAll, save, remove };

})();