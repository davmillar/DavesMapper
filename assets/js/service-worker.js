var CACHE_NAME="81208e4850-3b64d9f3ac-fa1c6",now=Date.now(),urlsToCache=["/","/assets/css/compiled.css","/assets/css/compiled_print.css","/assets/icons/sprites.png","/assets/icons/sprites.svg","/assets/js/compiled_app.js","/assets/js/global.js","/assets/js/keyboard.js","/content/keyboard.html","/grid_15.png","/grid_30.png","/images/hex.png"].map(function(a){return a+"?cache-bust="+now});self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(b){console.log("Opened cache");return b.addAll(urlsToCache)}))});self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){if(b){return b}return fetch(a.request)}))});self.addEventListener("activate",function(a){a.waitUntil(caches.keys().then(function(b){return Promise.all(b.map(function(c){if(c!==CACHE_NAME){return caches["delete"](c)}}))}))});self.addEventListener("message",function(a){if(a.data.action==="skipWaiting"){self.skipWaiting()}});