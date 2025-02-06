const CACHE_NAME = 'pwa-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch((error) => {
                console.error('Failed to fetch:', event.request, error);
                throw error;
            });
        })
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "VIBRATE") {
        if (self.navigator.vibrate) {
            self.navigator.vibrate(200);
        }
    } else if (event.data && event.data.type === "START_WEBOTP") {
        if ("OTPCredential" in window) {
            navigator.credentials.get({ otp: { transport: ["sms"] } })
                .then((credential) => {
                    self.clients.matchAll().then((clients) => {
                        clients.forEach(client => client.postMessage({ type: "OTP_RECEIVED", otp: credential.code }));
                    });
                })
                .catch((err) => console.error("Erreur WebOTP :", err));
        }
    }
});