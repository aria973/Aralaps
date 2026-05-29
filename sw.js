// const CACHE_NAME = "aralaps-cache-v13";
// const BASE_PATH = "/Aralaps";

// const APP_ASSETS = [
//   `${BASE_PATH}/`,
//   `${BASE_PATH}/index.html`,
//   `${BASE_PATH}/style.css`,
//   `${BASE_PATH}/app.js`,
//   `${BASE_PATH}/manifest.json`,
//   `${BASE_PATH}/icons/icon-192.png`,
//   `${BASE_PATH}/icons/icon-512.png`,
//   `${BASE_PATH}/icons/icon-192-maskable.png`,
//   `${BASE_PATH}/icons/icon-512-maskable.png`
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
//   );
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys
//           .filter((key) => key !== CACHE_NAME)
//           .map((key) => caches.delete(key))
//       )
//     )
//   );
//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   const request = event.request;
//   if (request.method !== "GET") return;

//   const url = new URL(request.url);

//   // فقط فایل‌های همین پروژه را هندل کن
//   if (!url.pathname.startsWith(BASE_PATH)) return;

//   // برای navigation همیشه fallback به index همین پروژه
//   if (request.mode === "navigate") {
//     event.respondWith(
//       fetch(request)
//         .then((response) => {
//           const clone = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(`${BASE_PATH}/index.html`, clone);
//           });
//           return response;
//         })
//         .catch(() => caches.match(`${BASE_PATH}/index.html`))
//     );
//     return;
//   }

//   event.respondWith(
//     caches.match(request).then((cached) => {
//       if (cached) return cached;

//       return fetch(request)
//         .then((response) => {
//           if (!response || response.status !== 200 || response.type !== "basic") {
//             return response;
//           }

//           const clone = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(request, clone);
//           });

//           return response;
//         })
//         .catch(() => caches.match(`${BASE_PATH}/index.html`));
//     })
//   );
// });

const CACHE_NAME = "aralaps-cache-v15";
const BASE_PATH = "/Aralaps";

const APP_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/style.css`,
  `${BASE_PATH}/app.js`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-192.png`,
  `${BASE_PATH}/icons/icon-512.png`,
  `${BASE_PATH}/icons/icon-192-maskable.png`,
  `${BASE_PATH}/icons/icon-512-maskable.png`
];

// -------------------- INSTALL --------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_ASSETS);
    })
  );

  // Force activation immediately
  self.skipWaiting();
});

// -------------------- ACTIVATE --------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// -------------------- FETCH --------------------
// self.addEventListener("fetch", (event) => {
//   const request = event.request;

//   // Only GET requests
//   if (request.method !== "GET") return;

//   const url = new URL(request.url);

//   // Only handle our app scope
//   if (!url.pathname.startsWith(BASE_PATH)) return;

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (!url.pathname.startsWith(BASE_PATH)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200
        ) {
          const clone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }

        return networkResponse;
      });
    })
  );
});





  // ---------------- NAVIGATION ----------------
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(`${BASE_PATH}/index.html`);
      })
    );
    return;
  }

  // ---------------- STATIC FILES ----------------
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // Only fallback HTML for navigation context, NOT assets
          if (request.destination === "document") {
            return caches.match(`${BASE_PATH}/index.html`);
          }
        });
    })
  );
});
