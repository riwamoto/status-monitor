// 初期化：画面にチェック間隔とドメイン一覧を反映✨
document.addEventListener("DOMContentLoaded", () => {
  initIntervalSetting();
  renderDomainList();
});

// 🌟 チェック間隔設定の読み込みと反映
function initIntervalSetting() {
  const select = document.getElementById("interval-select");
  const saved = localStorage.getItem("checkInterval");
  if (saved) {
    select.value = saved;
  }
  select.addEventListener("change", () => {
    localStorage.setItem("checkInterval", select.value);
  });
}

// 🌐 ドメイン一覧を表示＋削除ボタン追加
function renderDomainList() {
  const list = document.getElementById("domain-list");
  const urls = JSON.parse(localStorage.getItem("urls")) || [];

  list.innerHTML = "";

  urls.forEach((domain, index) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-gray-50 border px-3 py-2 rounded";

    li.innerHTML = `
        <span class="text-gray-700">${domain}</span>
        <button onclick="deleteDomain(${index})"
          class="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-sm">
          削除
        </button>
      `;

    list.appendChild(li);
  });
}

// ✂️ ドメイン削除
function deleteDomain(index) {
  let urls = JSON.parse(localStorage.getItem("urls")) || [];
  urls.splice(index, 1);
  localStorage.setItem("urls", JSON.stringify(urls));
  renderDomainList(); // 再描画
}

// 🧼 全データ削除
function clearAllData() {
  if (confirm("すべてのデータを削除します。よろしいですか？")) {
    localStorage.clear();
    renderDomainList();
    document.getElementById("interval-select").value = "5"; // デフォルト
  }
}

// 🔔 通知の許可リクエスト（iOS/Android/PC共通）
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      console.log("📣 通知の許可結果:", permission);
      if (permission === "granted") {
        alert("通知が有効になりました🎉✨");
      } else {
        alert("通知は有効にされませんでした🥲");
      }
    });
  } else if (Notification.permission === "granted") {
    alert("すでに通知は有効になっています🎊✨");
  } else {
    alert("お使いの環境では通知がサポートされていない可能性があります💦");
  }
}

// 🔁 テストモード：初期表示・切り替え保存
const testToggle = document.getElementById("testmode-toggle");
const testModeStored = localStorage.getItem("testMode");
testToggle.checked = testModeStored === "true";

testToggle.addEventListener("change", () => {
  localStorage.setItem("testMode", testToggle.checked ? "true" : "false");
});
