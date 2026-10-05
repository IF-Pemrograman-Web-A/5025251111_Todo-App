self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: '/favicon.ico', 
            vibrate: [200, 100, 200]
        });
    }
});