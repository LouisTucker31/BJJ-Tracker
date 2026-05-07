/**
 * sw.js — Service Worker
 * Caches the complete app shell for full offline use.
 */

const CACHE_NAME = 'bjj-app-v3';

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',

  // CSS
  './css/reset.css',
  './css/variables.css',
  './css/app.css',
  './css/navbar.css',
  './css/transitions.css',
  './css/log-sheet.css',
  './css/log-pages.css',
  './css/sessions-page.css',

  // JS
  './js/session-store.js',
  './js/academy-store.js',
  './js/coach-store.js',
  './js/router.js',
  './js/navbar.js',
  './js/log-sheet.js',
  './js/log-pages.js',
  './js/log-academy.js',
  './js/log-coach.js',
  './js/technique-picker.js',
  './js/log-details.js',
  './js/log-summary.js',
  './js/sessions-page.js',
  './js/app.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});