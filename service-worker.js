const CACHE_NAME = 'latt-calculator-v1.0.3';

const PRECACHE = [
	'index.html',
	'script.js',
	'main.css',
	'jquery-3.7.1.min.js',
	'manifest.json'
];

// Install: pre-cache all static assets
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
	event.waitUntil(
		//Check cache number, clear all assets and re-add if cache number changed
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames
					.filter(cacheName => (cacheName !== CACHE_NAME))
					.map(cacheName => caches.delete(cacheName))
			);
		})
	);
});

// Fetch: serve from cache first; fall back to network
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(cached => {
			if (cached) return cached;
			return fetch(event.request).then(response => {
				// Cache any new successful responses (e.g. fonts falling back online)
				if (response && response.status === 200 && response.type === 'basic') {
					const clone = response.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
				}
				return response;
			});
		})
	);
});