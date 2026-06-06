const CACHE_NAME = "campusos-cache-v1";

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/revise",
  "/notes",
  "/profile",
  "/live",
  "/login",
  "/manifest.json",
  "/favicon.ico",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

// Dynamic API endpoints and external resources to always bypass caching
const EXCLUDED_URLS = [
  "/api/live",
  "/api/connect",
  "/api/seed",
  "chrome-extension:",
  "firebasedatabase.app",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com"
];

// Service Worker Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("Pre-caching some assets failed (some routes might be dynamically generated):", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Service Worker Activate Event (clears all caches aggressively on activation)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Service Worker Fetch Event
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Check if this URL is explicitly excluded
  const isExcluded = EXCLUDED_URLS.some((exclude) => url.href.includes(exclude) || url.pathname.includes(exclude));
  if (isExcluded) return;

  // Ignore Next.js server actions (which use x-next-action headers)
  if (event.request.headers.get("x-next-action")) return;

  // 1. Navigation Requests (Page routes) - Network First, fallback to Cache
  if (event.request.mode === "navigate" || (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html"))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, load page from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback offline shell
            return caches.match("/revise") || caches.match("/");
          });
        })
    );
    return;
  }

  // 2. Static Assets (CSS, JS, images, fonts) - Cache First, update in background (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update cache
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });
    })
  );
});

// Update skipWaiting trigger message listener
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Push notification received event
self.addEventListener("push", (event) => {
  let data = { title: "CampusOS Notification", body: "Check your academic updates!" };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "CampusOS Notification", body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/"
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const clickUrl = event.notification.data ? event.notification.data.url : "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(clickUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(clickUrl);
    })
  );
});
