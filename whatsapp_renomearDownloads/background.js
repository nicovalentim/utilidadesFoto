const intencaoDownload = [];
chrome.runtime.onMessage.addListener((msg, sender) => {

  if (msg.type !== "DOWNLOAD_INTENT") {
    return;
  }

  if (!sender.tab) {
    return;
  }

  const contato = limparContato(msg.contact);

  if (!contato) {
    return;
  }

  intencaoDownload.push({
    contact: contato,
    timestamp: msg.timestamp,
    tabId: sender.tab.id
  });

  if (intencaoDownload.length > 30) {
    intencaoDownload.shift();
  }
});

chrome.downloads.onDeterminingFilename.addListener((baixado, suggest) => {

  if (!baixado.filename.toLowerCase().includes("whatsapp")) {
    suggest();
    return;
  }

  const hora = Date.now();
  let bestMatch = null;
  let bestDelta = Infinity;               // Smaller delta = better match
                                          // Testando essa variável para evitar renomear arquivos antigos

for (const intent of intencaoDownload) {

  const delta = Math.abs(hora - intent.timestamp);

    if (delta > 8000) {
      continue;
    }

      if (delta < bestDelta) {
        bestDelta = delta;
        bestMatch = intent;
      }
  }

  if (!bestMatch) {
    suggest();
    return;
  }

  const novoNome = criarNomeArquivo(
    baixado.filename,
    bestMatch.contact
  );

  const caminhoOriginal = baixado.filename;

  const pasta = caminhoOriginal.includes("/")
    ? caminhoOriginal.substring(
        0,
        caminhoOriginal.lastIndexOf("/") + 1
      )
    : "";

  suggest({
    filename: pasta + novoNome
  });
});

function limparContato(input) {

  if (!input) {
    return null;
  }

  const digits = input.replace(/\D/g, "");

  if (digits.length >= 8) {
    return digits;
  }

  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "")
    .replace(/_+/g, "_");
}

function criarNomeArquivo(nomeOriginal, contato) {

  const extensionMatch = nomeOriginal.match(/\.[^.]+$/);      // remove extensão
  const extension = extensionMatch ? extensionMatch[0] : "";

  let nomeBase = nomeOriginal
    .replace(/\.[^.]+$/, "")            // Remove a extensão
    .replace(/^whatsapp|[\s+]/gi, "_")  // Troca "whatsapp" (no início), espaços e "+" por "_"
    .replace(/[<>:"/\\|?*]/g, "")       // Remove caracteres proibidos pelo Windows
    .toLowerCase();

  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = String(agora.getFullYear()).slice(-2);

  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  const segundo = String(agora.getSeconds()).padStart(2, "0");

  const dataFormatada =
    `dia ${dia}-${mes} na hora ${hora}-${minuto}-${segundo}`;

  const contatoFormatado = /^\d+$/.test(contato) 
  ? contato.slice(-4) 
  : contato;

  return `Whats ${contatoFormatado} (baixado no ${dataFormatada}) ${extension}`;
}
