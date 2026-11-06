# Papum Delivery — Reels de captação

Composição de 25 segundos, 1080×1920, 30 fps. Direção aprovada em 06/11/2026.

## Fonte editável

`composition.html` contém as seis cenas, a tipografia, o layout e a função `renderAt(segundos)`.
`assets.js` e `assets/` contêm a logo vetorial extraída sem redesenho, ilustrações originais e fontes da landing Papum. Não dependem de rede.

Para revisar uma cena, abrir a composição e chamar `renderAt(tempo, {captions:true})` no ambiente de edição. O parâmetro `?play=1` reproduz a animação visual completa. Esta reprodução de composição não inclui a mixagem de áudio; o vídeo final inclui.

## Pipeline usado no repositório

1. `narrate.ps1`: sintetiza o roteiro com Microsoft Maria em português brasileiro, pelo motor local instalado no Windows, sem serviços pagos.
2. `node output/reels/papum-captacao-2026-11-06/source/prepare.mjs`: copia os assets e gera a trilha instrumental original.
3. `node output/reels/papum-captacao-2026-11-06/source/render.mjs --preview`: renderiza os seis quadros, a capa e as placas de legendas.
4. `node output/reels/papum-captacao-2026-11-06/source/render.mjs`: captura os quadros das animações com Chromium. Trechos de leitura permanecem estáveis.
5. `node output/reels/papum-captacao-2026-11-06/source/encode.mjs`: sincroniza áudio, codifica H.264/AAC e aplica as legendas com a fonte original. FFmpeg e FFprobe portáteis ficam em `../tools/`.

Os scripts de preparação e renderização usam as dependências já instaladas neste repositório. Nenhuma dependência foi adicionada à aplicação. O master sem legendas mantém os títulos gráficos do filme; a versão principal acrescenta as legendas da narração.

## Áudio e identidade

A narração é sintética, com voz do Windows em pt-BR. A trilha foi composta proceduralmente para esta peça, com notas sintetizadas e sem samples externos. A mixagem é entregue em WAV e no vídeo.

Logo, cores, ilustrações e fontes seguem a landing atual. As imagens são ilustrações da proposta, com aviso de pré-lançamento. O CTA é para cadastro de interesse gratuito, sem promessa de uso imediato ou resultados comerciais.

Para publicação orgânica, manter “Link na bio”. Em uma futura versão de anúncio pago, alinhar fala, texto na tela e legendas ao botão configurado. Esta versão não foi publicada no Instagram.
