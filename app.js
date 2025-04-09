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
    li.className =
      "flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm";
    li.innerHTML = `
      <div class="font-medium text-gray-700 flex items-center">
        🌐 <span class="ml-2">${domain}</span>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="manualCheck('${domain}', this)"
          class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition duration-200">
          チェック
        </button>
        <span id="status-${domain}" class="text-sm font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-600">
          未チェック
        </span>
      </div>
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
  const statusElem = document.getElementById(`status-${domain}`);
  statusElem.textContent = "チェック中…";
  statusElem.className =
    "text-sm font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-600";

  const status = await checkDomain(domain);

  if (status) {
    statusElem.textContent = "オンライン";
    statusElem.className =
      "text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-700";
  } else {
    statusElem.textContent = "オフライン";
    statusElem.className =
      "text-sm font-medium px-2 py-1 rounded-full bg-red-100 text-red-700";
  }

  statuses[domain] = status;
}

// チェック間隔（settings.htmlで保存した値を使うよ）
const intervalMin = parseInt(localStorage.getItem("checkInterval")) || 5;
setInterval(checkAllDomains, intervalMin * 60 * 1000);

// 🔔 通知許可を最初にリクエスト
if (
  Notification.permission !== "granted" &&
  Notification.permission !== "denied"
) {
  Notification.requestPermission();
}

renderUrls();
checkAllDomains(); // 起動時にも一度チェック
