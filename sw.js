// CLUBR PWA Service Worker v1.0.0
const CACHE_NAME = 'clubr-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './superadmin.html',
  './manifest.json',
  './icons/icon.svg'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[CLUBR SW] Pre-caching core app shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[CLUBR SW] Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[CLUBR SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network First with Cache Fallback for dynamic updates
self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Ignore non-GET requests or Firebase RTDB live websocket/api calls
  if (req.method !== 'GET' || req.url.includes('firebasedatabase.app') || req.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        // Cache successful GET responses of static assets
        if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
