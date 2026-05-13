let ultimoContato = null;
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "DOWNLOAD_INTENT") {
      ultimoContato = {
        name: limparContato(msg.contact),
        time: msg.timestamp
      };
    }
  });

  chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
    const now = Date.now();
    
    if (ultimoContato && (now - ultimoContato.time) < 8000) {
      const novoNome = criarNomeArquivo(item.filename, ultimoContato.name);
      suggest({ filename: novoNome });
    } else {
      suggest();
    }
  });

function limparContato(input) {
  if (!input) return "desconhecido";

  const digitos = input.replace(/\D/g, "");
  if (digitos.length >= 8) return digitos;

  return input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")    // remove acentos
    .replace(/[^\w\s-]/g, "")           // remove tudo que não for hífen, texto ou espaço
    .replace(/\s+/g, "_")               // transforma espaço em _
    .toLowerCase()
  }

function criarNomeArquivo(nomeOriginal, contato) {
  const extensaoMatch = nomeOriginal.match(/\.[^.]+$/);
  const extensao = extensaoMatch ? extensaoMatch[0] : "";

  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  const segundo = String(agora.getSeconds()).padStart(2, "0");

  const dataFormatada =
    `${dia}-${mes} às ${hora}-${minuto}-${segundo}`;

  const contatoFormatado = /^\d+$/.test(contato) 
  ? contato.slice(-4) 
  : contato;

  return `${contatoFormatado} (${dataFormatada})${extensao}`;
}