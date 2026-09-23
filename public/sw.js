// Service worker: makes the site installable and readable offline.
// Pages are network-first (fresh content after every deploy, cached copy when offline);
// hashed build assets are cache-first; images are stale-while-revalidate.
const VERSION = 'v1';
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const IMAGES = `images-${VERSION}`;
const PRECACHE = ['/', '/en/', '/404.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  const keep = [PAGES, ASSETS, IMAGES];
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const home = new URL(request.url).pathname.startsWith('/en/') ? '/en/' : '/';
    return (await cache.match(home)) || (await cache.match('/404.html')) || Response.error();
  }
}

async function cacheFirst(request, name) {
  const cache = await caches.open(name);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, name) {
  const cache = await caches.open(name);
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || fresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith('/_astro/') || url.pathname.endsWith('.woff2')) {
    event.respondWith(cacheFirst(request, ASSETS));
  } else if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, IMAGES));
  }
});
