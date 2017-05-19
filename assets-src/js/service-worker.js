var CACHE_NAME = 'my-site-cache-v1',
    now = Date.now(),
    urlsToCache = [
      '/',
      '/assets/css/compiled.css',
      '/assets/css/compiled_print.css',
      '/assets/icons/sprites.png',
      '/assets/icons/sprites.svg',
      '/assets/js/compiled_app.js',
      '/assets/js/global.js',
      '/assets/js/keyboard.js',
      '/content/keyboard.html',
      '/grid_15.png',
      '/grid_30.png',
      '/images/hex.png'
    ].map(function (resourceURL) {
      return resourceURL + '?cache-bust=' + now
    });

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches['delete'](cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});