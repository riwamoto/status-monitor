// 🔖 キャッシュの名前（バージョン管理用）
// キャッシュの内容を更新したいときは名前を変えてね♪
const CACHE_NAME = "status-monitor-cache-v3";

// 📦 最初にキャッシュしておきたいファイルの一覧
// ここに書いたファイルは Service Worker の「インストール時」に保存されるよ
const urlsToCache = [
  "/", // ルート（index.htmlへのショートカット）
  "/index.html", // メインHTML
  "/dashboard.html", // 🆕 ダッシュボード
  "/settings.html", // 🆕 管理画面
  "/styles.css", // スタイルシート
  "/app.js", // アプリのメインスクリプト
  "/manifest.json", // PWAのマニフェスト
  "/icons/icon-192.png", // アイコン（PWA用）
  "/icons/icon-512.png", // 大きいアイコン
];

// 🛠️ installイベント（初回登録時などに呼ばれる）
// キャッシュの準備をするのがこのタイミング！
self.addEventListener("install", (event) => {
  event.waitUntil(
    // 📦 キャッシュを開いて、指定したファイルを全部保存するよ
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// 🌐 fetchイベント（リソースへのリクエストがあったとき）
// キャッシュがあればそれを返し、なければネットから取得する
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request) // 🔍 キャッシュに該当のリクエストがあるかチェック
      .then((response) => {
        // ✅ キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // 🌍 なければネットワークから取得！
        return fetch(event.request);
      })
  );
});

self.addEventListener("message", (event) => {
  const { title, body } = event.data;
  self.registration.showNotification(title, {
    body,
    icon: "icons/icon-192.png",
  });
});
