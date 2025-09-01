const CACHE_NAME = 'file-tracker-cache-v2';
const FILES_TO_CACHE = [
  '.',                    // index.html
  'index.html',
  'manifest.json',
  'sw.js',
  'assets/css/bootstrap.min.css',
  'assets/js/bootstrap.bundle.min.js'
];

// Install event: cache all required files
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event: remove old caches
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve from cache first, then network
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => response || fetch(evt.request))
  );
});
