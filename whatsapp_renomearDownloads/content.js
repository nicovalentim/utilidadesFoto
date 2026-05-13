function extrairContato() {
  /* versão 1 */
  const header = document.querySelector(
    '[data-testid="conversation-info-header"]'
  );

  if (header && header.innerText) {
    const texto = header.innerText
      .split("\n")[0]
      .trim();

    if (texto.length > 0) return texto;
  }

  /* versão 2, caso a 1 falhe */
  const title = document.title;

  if (title) {

    const nome = title
      .replace(/ \s* \|? \s* WhatsApp \s* /i, "")
      .trim();

    if (nome.length > 0) return nome;
  }

  return null;
}

function existeDownload() {
  const contato = extrairContato();
  if (!contato) return;

  chrome.runtime.sendMessage({
    type: "DOWNLOAD_INTENT",
    contact: contato,
    timestamp: Date.now()
  });
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!target) return;

  const botao = target.closest(
    'button, [role="button"], [data-testid]'
  );
  if (!botao) return;

  const aria =
    (botao.getAttribute("aria-label") || "")
    .toLowerCase();

  const testid =
    (botao.getAttribute("data-testid") || "")
    .toLowerCase();

  const pareceDownload =
    aria.includes("download") ||
    aria.includes("baixar") ||
    testid.includes("download");

  if (pareceDownload) {
    existeDownload();
  }
});