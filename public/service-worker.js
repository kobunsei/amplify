const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// キャッシュのインストール
self.addEventListener('install', event => {
  console.log('[service-worker.js] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[service-worker.js] Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// キャッシュのアクティベート
self.addEventListener('activate', event => {
  console.log('[service-worker.js] Activate event');
});

// リソースのフェッチ
self.addEventListener('fetch', event => {
  console.log('[service-worker.js] Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[service-worker.js] Found in cache', event.request.url);
          return response;
        }
        console.log('[service-worker.js] Network request for ', event.request.url);
        return fetch(event.request);
      })
  );
});

// Firebase メッセージングのインポート
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyCznRcpO0AyCJIL0qwrMGbnHQXEx27X-YI',
  authDomain: 'amplity-test.firebaseapp.com',
  projectId: 'amplity-test',
  storageBucket: "amplity-test.appspot.com",
  messagingSenderId: '1038543419902',
  appId: '1:1038543419902:web:dcea33dbe03e1aa85068af'
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  console.log('[firebase-messaging-sw.js] Showing notification');
  self.registration.showNotification(notificationTitle, notificationOptions);
});
