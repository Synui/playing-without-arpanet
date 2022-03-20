const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "./index.html",
    "./js/idb.js",
    "./js/index.js",
    "./css/styles.css",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",
];

// installs the service worker
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                console.log('installing cache : ' + CACHE_NAME)
                return cache.addAll(FILES_TO_CACHE)
            })
    )
});

// allows the service worker to be activated
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches
            .keys()
            .then(function (keyList) {
                let cacheKeeplist = keyList.filter(function (key) {
                    return key.indexOf(APP_PREFIX);
                });

                cacheKeeplist.push(CACHE_NAME);

                // returns a Promise that resolves once all old versions of the cache have been deleted.
                return Promise.all(
                    keyList.map(function (key, i) {
                        if (cacheKeeplist.indexOf(key) === -1) {
                            console.log('deleting cache : ' + keyList[i]);
                            return caches.delete(keyList[i]);
                        }
                    })
                );
            })
    );
});

// Here, we listen for the fetch event, log the URL of the requested resource, and then begin to define how we will respond to the request.
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        // we use .match() to determine if the resource already exists in caches
        caches.match(e.request).then(function (request) {
            if (request) { // if it does, we'll log the URL to the console with a message and then return the cached resource
                console.log('responding with cache : ' + e.request.url)
                return request
            } else { // if the resource is not in caches, we allow the resource to be retrieved from the online network as usual 
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    )
});