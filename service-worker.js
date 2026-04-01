const VERSION = 'v1.0.8';
const CACHE_NAME = `latt-calc-${VERSION}`;

const APP_STATIC_RESOURCES = [
	'./index.html',
	'./script.js',
	'./main.css',
	'./jquery-3.7.1.min.js',
	'static/manifest.json'
];

// Install: cache all static assets
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(APP_STATIC_RESOURCES))
			.then(() => self.skipWaiting())
	);
});

// Activate: delete any old caches from previous versions
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
			)
		).then(() => self.clients.claim())
	);
});

// Fetch: serve from cache first; fall back to network
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(cached => {
			if (cached) return cached;
			return fetch(event.request).then(response => {
				// Cache any new successful responses
				if (response && response.status === 200 && response.type === 'basic') {
					//const clone = response.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
				}
				return response;
			});
		})
	);
});