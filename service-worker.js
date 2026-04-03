const VERSION = 'v1.0.1';
const CACHE_NAME = `latt-calc-${VERSION}`;

const APP_STATIC_RESOURCES = [
	'./',
	'./index.html',
	'./static/img/LATT-192.png',
	'./static/img/LATT-512.png',
	'./static/css/main.css',
	'./static/js/script.js',
	'./manifest.json'
];

// Install: cache all static assets
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(APP_STATIC_RESOURCES))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!CACHE_NAME.includes(cacheName)) {
						return caches.delete(cacheName);
					}
					return undefined;
				}),
			),
		),
	);
});

// Activate: delete any old caches from previous versions
/*self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
			)
		).then(() => self.clients.claim())
	);
});*/

self.addEventListener("fetch", (event) => {
	event.respondWith(() => {
		try {
			fetch(event.request).then(response => {
				if (response.ok) {
					caches.open(CACHE_NAME).then(cache => {
						cache.put(request, response.clone());
					});
				}
				return response;
			});
		} catch (error) {
			caches.match(request).then(cachedResponse => {
				return cachedResponse || Response.error();
			});
		}
	});
});

// Fetch: serve from cache first; fall back to network
/*self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(cached => {
			if (cached) return cached;
			return fetch(event.request).then(response => {
				// Cache any new successful responses
				if (response && response.status === 200 && response.type === 'basic') {
					const clone = response.clone();
					caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
				}
				return response;
			});
		})
	);
});*/