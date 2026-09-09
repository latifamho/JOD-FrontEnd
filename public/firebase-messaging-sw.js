importScripts("https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBH7Vow9Gz3fbbHUgSgJflOcUXVjsPUGEs",
  authDomain: "jawad-b4fcd.firebaseapp.com",
  projectId: "jawad-b4fcd",
  storageBucket: "jawad-b4fcd.firebasestorage.app",
  messagingSenderId: "403366748330",
  appId: "1:403366748330:web:42d2cdaaa8bad0fee5b0d3",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification?.title || "JOD", {
    body: payload.notification?.body || "لديك إشعار جديد.",
    data: { referencePath: payload.data?.referencePath || "/dashboard" },
  });
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const referencePath = event.notification.data?.referencePath || "/dashboard";
  const safePath = referencePath.startsWith("/dashboard/") ? referencePath : "/dashboard";
  const targetUrl = new URL(safePath, self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((items) => {
    const existing = items.find((client) => client.url.startsWith(self.location.origin));
    if (existing) { existing.navigate(targetUrl); return existing.focus(); }
    return clients.openWindow(targetUrl);
  }));
});
