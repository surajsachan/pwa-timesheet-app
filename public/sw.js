const CACHE_NAME = 'v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/static/css/main.707e3d96.css',
    '/static/js/main.133e466c.js',
    // Add other assets and pages as needed
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Use fetch to get the response from the network, following redirects
                return fetch(event.request.clone(), { redirect: 'follow' })
                    .then(networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // To cache the new response, clone it and store it in the cache
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    });
            })
            .catch(error => {
                console.error('Fetching failed:', error);
                throw error;
            })
    );
});


self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

