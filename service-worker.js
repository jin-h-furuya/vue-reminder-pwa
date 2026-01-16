self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

// 通知を表示する
self.addEventListener('push', (event) => {
  console.log('Service Worker: pushed');
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon.png',
    data: { url: data.url }, // 子ページのURL
    actions: [
      { action: 'open_detail', title: '詳細を見る' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知またはボタンをクリックした時の処理
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: clicked');
  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 既にアプリが開いていればそこにフォーカス、なければ新規で開く
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});