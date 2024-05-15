const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',  // CSSファイルがある場合の例
  '/src/index.js'   // JavaScriptファイルがある場合の例
];

self.addEventListener('install', event => {
  console.log('[service-worker.js] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[service-worker.js] Opened cache');
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error(`[service-worker.js] Failed to cache ${url}:`, err);
            });
          })
        );
      })
  );
});


self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }

        // Not in cache - fetch from the network
        return fetch(event.request);
      })
  );
});
