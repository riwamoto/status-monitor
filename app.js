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

async function checkStatus(url) {
  try {
    const response = await fetch(url, { mode: "no-cors" });
    return response.status;
  } catch (e) {
    return "エラー";
  }
}

function renderUrls() {
  const list = document.getElementById("url-list");
  list.innerHTML = "";
  urls.forEach((url) => {
    const li = document.createElement("li");
    li.innerHTML = `
            🌐 ${url}
            <button onclick="check('${url}', this)">チェック</button>
            <span></span>
        `;
    list.appendChild(li);
  });
}

async function check(url, btn) {
  const status = await checkStatus(url);
  btn.nextElementSibling.textContent = `ステータス: ${status}`;
}

renderUrls();
