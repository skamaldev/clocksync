/* Global ClockSync service worker: offline support. Cache name changes on every build. */
const V = 'cs-9bfa1303';
const CORE = ['./', 'assets/style.css?v=9bfa1303', 'assets/app.js?v=9bfa1303', 'assets/favicon.svg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(new URL(u, self.registration.scope).href).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function networkFirst(r) {
  return fetch(r).then(res => { if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match(new URL('./', self.registration.scope).href)));
}
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;                       // ads, fonts, calendars: always network
  if (r.mode === 'navigate' || u.pathname.endsWith('ads-config.js') || u.pathname.endsWith('sitemap.xml')) { e.respondWith(networkFirst(r)); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); } return res; })));
});
