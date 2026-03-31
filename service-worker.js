const VERSION = 'v11';
const CACHE_NAME = `latt-calc-${VERSION}`;

const APP_STATIC_RESOURCES = [
	'./index.html',
	'./script.js',
	'./main.css',
	'./jquery-3.7.1.min.js',
	'./manifest.json'
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			cache.addAll(APP_STATIC_RESOURCES);
		})(),
	);
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const names = await caches.keys();
			await Promise.all(
				names.map((name) => {
					if (name !== CACHE_NAME) {
						caches.delete(name);
					}
				}),
			);
			await clients.claim();
		})(),
	);
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
	// For all other requests, go to the cache first, and then the network.
	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			const cachedResponse = await cache.match(event.request.url);
			if (cachedResponse) {
				// Return the cached response if it's available.
				return cachedResponse;
			}
			return;
		})(),
	);
});