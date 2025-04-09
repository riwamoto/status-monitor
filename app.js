let urls = JSON.parse(localStorage.getItem("urls")) || [];
let statuses = {}; // 状態記録用（前回との変化を比較）

function saveUrls() {
  localStorage.setItem("urls", JSON.stringify(urls));
}

function addUrl() {
  const input = document.getElementById("url-input");
  const url = input.value;
  if (url && !urls.includes(url)) {
    urls.push(url);
    input.value = "";
    saveUrls();
    renderUrls();
  }
}

function renderUrls() {
  const list = document.getElementById("url-list");
  list.innerHTML = "";
  urls.forEach((domain) => {
    const li = document.createElement("li");
    li.innerHTML = `
            🌐 ${domain}
            <button onclick="manualCheck('${domain}', this)">チェック</button>
            <span id="status-${domain}">未チェック</span>
        `;
    list.appendChild(li);
  });
}

function notify(domain, status) {
  const msg = status
    ? `✅ ${domain} がオンラインになりました！`
    : `❌ ${domain} がオフラインになりました…`;
  new Notification("📡 ステータス監視くん", {
    body: msg,
    icon: "icons/icon-192.png",
  });
}

async function checkDomain(domain) {
  const timeout = 5000;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeout);
    fetch(`https://${domain}`, { mode: "no-cors" })
      .then(() => {
        clearTimeout(timer);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(false);
      });
  });
}

async function checkAllDomains() {
  for (const domain of urls) {
    const currentStatus = await checkDomain(domain);
    const previousStatus = statuses[domain];

    // 状態が変わったら通知！
    if (previousStatus !== undefined && currentStatus !== previousStatus) {
      if (Notification.permission === "granted") {
        notify(domain, currentStatus);
      }
    }

    // 表示更新
    const statusElem = document.getElementById(`status-${domain}`);
    if (statusElem) {
      statusElem.textContent = currentStatus
        ? "✅ オンライン"
        : "❌ オフライン";
    }

    // 状態を保存
    statuses[domain] = currentStatus;
  }
}

// 手動チェック用（ボタン用）
async function manualCheck(domain, btn) {
  btn.nextElementSibling.textContent = "🔄 チェック中...";
  const status = await checkDomain(domain);
  btn.nextElementSibling.textContent = status
    ? "✅ オンライン"
    : "❌ オフライン";
  statuses[domain] = status;
}

// 🔄 定期チェック（5分ごと）
setInterval(checkAllDomains, 0.5 * 60 * 1000);

// 🔔 通知許可を最初にリクエスト
if (
  Notification.permission !== "granted" &&
  Notification.permission !== "denied"
) {
  Notification.requestPermission();
}

renderUrls();
checkAllDomains(); // 起動時にも一度チェック
