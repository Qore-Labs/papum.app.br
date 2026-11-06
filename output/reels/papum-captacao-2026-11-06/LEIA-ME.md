# Papum Delivery — Reels de captação

Criado em 06/11/2026, seguindo o roteiro aprovado e a identidade visual atual da Papum.

## Arquivos

- `papum-delivery-reels.mp4`: versão principal para Reels orgânico, com legendas da narração.
- `papum-delivery-reels-sem-legendas.mp4`: mesmo filme e áudio, com os títulos gráficos, sem legendas adicionais da narração.
- `capa.png`: capa vertical.
- `legendas.srt`: legendas separadas.
- `papum-delivery-editavel.zip`: composição em HTML, fontes e assets locais, scripts, áudio e legendas para edição.
- `audio/narracao-e-trilha.mp3`: prévia da mixagem de voz e música.
- `source/README.md`: instruções da fonte editável e do pipeline.

## Especificações confirmadas

- Duração: 25,000 segundos.
- Resolução: 1080×1920, 9:16.
- Vídeo: H.264, 30 fps, 750 quadros, yuv420p.
- Áudio: AAC estéreo, 48 kHz; mixagem em aproximadamente −15,8 LUFS, pico verdadeiro aproximado de −1,45 dBTP depois da codificação.
- Narração sintética em português brasileiro: Microsoft Maria, motor local instalado no Windows.
- Trilha instrumental original sintetizada para esta peça, sem samples externos.

## Verificação

Inspecionados os seis quadros de referência, o fechamento no navegador móvel, o carregamento das fontes, a ausência de erros JavaScript e o enquadramento. O MP4 foi decodificado integralmente sem erros; o navegador reproduziu o arquivo e buscou oito posições, inclusive 24,9 segundos. Os registros JSON acompanham a entrega. A inspeção não mede retenção ou conversão reais no Instagram.

A tentativa do CLI de navegador não iniciou nesta máquina. A renderização e a conferência foram concluídas com o Chromium instalado e o runtime Playwright já presente no projeto, sem novos testes ou dependências na aplicação.

## Publicação

O CTA é “Link na bio” e a oferta é cadastro de interesse no pré-lançamento. Conferir o destino do link na bio antes de publicar. Para uso como anúncio com botão, produzir uma adaptação coerente de fala, texto na tela e legendas.

O vídeo ainda não foi publicado em nenhuma rede social.
