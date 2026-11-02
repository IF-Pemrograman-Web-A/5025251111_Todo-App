const CACHE = "todo-app-v1";
const SHELL = [
    "./", 
    "./index.php",
    "./style.css", 
    "./script.js",
    "./manifest.json",
    "./img/icon.png" 
];

self.addEventListener("install", e => {
    self.skipWaiting(); 
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(SHELL))
    );
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(ks => 
            Promise.all(ks.filter(k => k.startsWith("todo-app-") && k !== CACHE)
            .map(k => caches.delete(k)))
        )
    );
});

self.addEventListener("fetch", e => {
    if (e.request.method !== "GET") return;
    e.respondWith(
        caches.match(e.request)
        .then(r => r || fetch(e.request))
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: '/favicon.ico', 
            vibrate: [200, 100, 200]
        });
    }
});