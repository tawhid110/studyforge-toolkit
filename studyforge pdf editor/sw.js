const CACHE_NAME = 'studyforge-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.css',
  '/app.js',
  '/manifest.json',
  '/components/merger/merger.html',
  '/components/merger/merger.css',
  '/components/merger/merger.js'
  // Add the paths for all your other module files here!
];

// Install the Service Worker and cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});