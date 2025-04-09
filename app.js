let urls = JSON.parse(localStorage.getItem("urls")) || [];

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

function checkOnline(domain, timeout = 5000) {
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

function renderUrls() {
  const list = document.getElementById("url-list");
  list.innerHTML = "";
  urls.forEach((domain) => {
    const li = document.createElement("li");
    li.innerHTML = `
            🌐 ${domain}
            <button onclick="check('${domain}', this)">チェック</button>
            <span></span>
        `;
    list.appendChild(li);
  });
}

async function check(domain, btn) {
  btn.nextElementSibling.textContent = "🔄 チェック中...";
  const isOnline = await checkOnline(domain);
  btn.nextElementSibling.textContent = isOnline
    ? "✅ オンライン"
    : "❌ オフライン";
}

renderUrls();
