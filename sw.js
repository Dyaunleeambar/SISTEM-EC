self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Estrategia mínima: dejar pasar a la red
self.addEventListener('fetch', (event) => {});
