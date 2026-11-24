/**
 * BUSDIGIT CODEVERSE — Progressive Web App (PWA) Service Worker
 * Version: 1.0.0
 * Strategy: Cache-First App Shell + Stale-While-Revalidate for Static Assets
 */

const CACHE_NAME = 'codeverse-shell-v1.0.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './404.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

// 1. INSTALL: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE: Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. FETCH: Smart Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Jangan cache request non-GET (POST, PUT, dll)
  if (req.method !== 'GET') {
    return;
  }

  // Lewati langsung API eksternal agar data transaksi selalu real-time (Firestore & Apps Script)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('script.google.com') ||
    url.hostname.includes('script.googleusercontent.com') ||
    url.hostname.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // Navigasi Halaman Utama (HTML): Network-First dengan Cache Fallback untuk mode offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // Asset Statis (CSS, Fonts, Images, Icons): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cachedRes);

      return cachedRes || fetchPromise;
    })
  );
});
