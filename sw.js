// Permite usar la app sin internet. Cambiar VERSION en cada actualización.
const VERSION = "rf-v2.1";
const FILES = ["./", "index.html", "config.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png", "img/arroz-caramelo.jpg", "img/arroz-tradicional.jpg", "img/azucar.jpg", "img/budin-ddl.jpg", "img/budin-mixto.jpg", "img/budin-naranja.jpg", "img/budin-vainilla.jpg", "img/cer-anillitos-fruta.jpg", "img/cer-anillitos-miel.jpg", "img/cer-bolitas.jpg", "img/cer-copitas.jpg", "img/chocolatada.jpg", "img/gal-frutitas-durazno.jpg", "img/gal-frutitas-naranja.jpg", "img/gal-letritas-chocolate.jpg", "img/gal-letritas-vainilla.jpg", "img/gal-semillitas.jpg", "img/leche.jpg", "img/logo-saber-nutrir.png", "img/logo-teknofood.png", "img/menu-semanal-grande.jpg", "img/menu-semanal.jpg", "img/sab-chocolate.jpg", "img/sab-flan.jpg", "img/sab-malta.jpg", "img/sab-vainilla.jpg", "img/yerba.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.hostname.includes("google-analytics") || url.hostname.includes("googletagmanager")) return; // la medición no se guarda offline
  // Primero intenta internet (para recibir actualizaciones); sin señal usa la copia guardada.
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      if (r.ok || r.type === "opaque") caches.open(VERSION).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
