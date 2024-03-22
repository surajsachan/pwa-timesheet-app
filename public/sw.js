console.log("sw from public folder")
let cacheData = "appv1";

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                "static/js/bundle.js",
                "favicon.ico",
                "logo192.png",
                "/home",
                "/timesheet",
                "/adminHome"
            ])
        })
    )
})

this.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
                .then((result) => {
                    if (result) { return result }
                    return fetch(event.request);
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    return new Response('An error occurred', { status: 500 });
                })
        )
    }
})
