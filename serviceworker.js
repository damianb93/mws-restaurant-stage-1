const mainCacheStorage = 'main-storage';
const detailsPageCacheStorage = 'details-page-storage';
const iamgeCacheStorage = 'image-storage';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(mainCacheStorage).then(cache => {
            return cache.addAll([
                '/',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'data/restaurants.json',
                'css/styles.css',
                'css/responsive.css',
            ]);
        })
    );
})

self.addEventListener('fetch', (event) => {

    if (event.request.url.includes('restaurant.html?id=')) {
        event.respondWith(getDetailsPage(event.request));
        return;
    }

    if (event.request.url.endsWith('.jpg')) {
        event.respondWith(getImage(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    )
});

getDetailsPage = (request) => {
    return caches.open(detailsPageCacheStorage).then(cache => {
        return cache.match(request).then(response =>{
            if (response) return response;

            return fetch(request).then(fetchResponse => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
            });
        });
    });
}

getImage = (request) => {
    return caches.open(iamgeCacheStorage).then(cache => {
        return cache.match(request).then(response =>{
            if (response) return response;

            return fetch(request).then(fetchResponse => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
            });
        });
    });
}