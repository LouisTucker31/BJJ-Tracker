/**
 * sw.js — Service Worker
 * Caches the app shell for offline use.
 */

const CACHE_NAME = 'bjj-app-v1';

const SHELL_ASSETS = [
  './',
  './index.html',
  './css/reset.css',
  './css/variables.css',
  './css/app.css',
  './css/navbar.css',
  './css/transitions.css',
  './js/router.js',
  './js/navbar.js',
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
