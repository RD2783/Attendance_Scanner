const CACHE = 'attendance-scanner-v1';
const CORE_ASSETS = [
  '/Attendance_Scanner/',
  '/Attendance_Scanner/style.css',
  '/Attendance_Scanner/app.js',
  '/Attendance_Scanner/manifest.json',
  '/Attendance_Scanner/icon-192.png',
  '/Attendance_Scanner/icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
