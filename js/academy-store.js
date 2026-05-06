/**
 * academy-store.js
 * Persists academies to localStorage.
 */

const AcademyStore = (() => {

  const KEY = 'bjj_academies';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch { return []; }
  }

  function save(academy) {
    const all = getAll();
    academy.id = Date.now().toString();
    all.push(academy);
    localStorage.setItem(KEY, JSON.stringify(all));
    return academy;
  }

  function remove(id) {
    const all = getAll().filter(a => a.id !== id);
    localStorage.setItem(KEY, JSON.stringify(all));
  }

  return { getAll, save, remove };

})();