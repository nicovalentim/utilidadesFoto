# O que é?
Script simples que funciona como extensão do chrome para renomear arquivos com o Nome/Número de um contato de whatsapp web.

# Como instalar
1. baixe a versão zipada do repositório;
2. dentro do Chrome, abra [a aba de extensões](chrome://extensions);
3. entre no Modo de Desenvolvedor / Developer Mode;
4. Clique em carregar fora de pacote / load unpacked, e escolha a pasta;
5. Recarregue o WhatsApp Web.

# Lógica da arquitetura 
```
Usuário clica em download
        ↓
content.js detecta o clique
        ↓
content.js extrai o número do contato
        ↓
content.js envia dados da formatação ao background.js
        ↓
background.js guarda:
(contato + hora + aba)
        ↓
Chrome começa o download
        ↓
background.js intercepta o nome do arquivo
        ↓
background.js encontra os dados de formatação
        ↓
e renomeia o arquivo
```
