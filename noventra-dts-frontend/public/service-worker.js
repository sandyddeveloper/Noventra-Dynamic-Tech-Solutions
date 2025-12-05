/* eslint-disable no-restricted-globals */

const APP_VERSION = "ndts-v1";
const STATIC_CACHE = `${APP_VERSION}-static`;
const RUNTIME_CACHE = `${APP_VERSION}-runtime`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/logo.svg"
  // you can add built asset paths here if you want, or let runtime cache handle them
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Network-first for HTML; cache-first for others
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const isHTML =
    request.headers.get("accept") &&
    request.headers.get("accept").includes("text/html");

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/offline.html"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});

/* ---------- PUSH NOTIFICATIONS ---------- */

// When a push notification arrives
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "New notification", body: event.data?.text() };
  }

  const title = data.title || "Noventra notification";
  const options = {
    body: data.body || "You have a new update.",
    icon: "/icons/logo-192.png",
    badge: "/icons/logo-192.png",
    data: {
      url: data.url || "/notifications",
      type: data.type || "generic",
      ...data
    }
  };

  event.waitUntil(
    (async () => {
      // Show system notification
      await self.registration.showNotification(title, options);

      // Also broadcast to open tabs so your React Notifications page can update
      const clientsList = await self.clients.matchAll({ type: "window" });
      clientsList.forEach((client) => {
        client.postMessage({
          type: "NEW_PUSH_NOTIFICATION",
          payload: options.data
        });
      });
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      const hadWindow = clientsArr.some((client) => {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(url);
          return true;
        }
        return false;
      });

      if (!hadWindow && self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
      return null;
    })
  );
});
