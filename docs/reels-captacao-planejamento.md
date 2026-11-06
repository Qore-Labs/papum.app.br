# Papum Delivery — planejamento de Reels de captação

Data: 06/11/2026. Status: vídeo produzido e verificado localmente; publicação no Instagram não realizada.

Entrega em `output/reels/papum-captacao-2026-11-06/`: MP4 principal com legendas, master sem legendas da narração, capa PNG, SRT, trilha/narração e fonte editável. O filme usa narração sintética local Microsoft Maria em pt-BR e trilha instrumental original criada para a peça. A verificação confirmou 25 segundos, 1080×1920, H.264/AAC, 30 fps, 750 quadros, decodificação completa sem erros e reprodução em Chromium a 390×844 sem overflow. As fontes originais carregaram; os seis quadros e a reprodução final foram inspecionados visualmente. Os registros estão em `verificacao-tecnica.json`, `verificacao-navegador.json` e `visual-check.json` junto à entrega.

## Decisão criativa

Produzir um Reels de **25 segundos**, vertical 9:16, com animação gráfica 2D dos assets originais da Papum. O limite solicitado é de 1 minuto; a versão principal usa 25 segundos para concentrar a mensagem em uma proposta e uma ação.

Público: donos e gestores de restaurantes e negócios de alimentação. Objetivo: gerar cadastros de interesse no pré-lançamento. A conversão é um cadastro confirmado, não uma venda ou abertura de conta operacional.

Conceito: **Seu restaurante. Sua marca. Seu app.**

Mensagem: a proposta conecta um app com a identidade do restaurante a um painel para organizar cardápio, pedidos e contatos. A animação explica essa relação. O vídeo deve continuar compreensível sem áudio.

CTA orgânico único: **Cadastre seu interesse no link da bio.**

Destino recomendado para a bio: `https://www.papum.app.br/instagram#cadastro`. O endereço é o mesmo formulário de interesse da landing; conferir o link publicado antes de divulgar. A origem `/instagram` é atribuição do link e não identifica, sozinha, qual Reels gerou o cadastro.

## Identidade visual

Fonte de identidade: `DESIGN.md`, landing atual e assets originais, conferidos no repositório. A referência mobile `output/playwright/fixed-header/chromium/hero-390.png` foi inspecionada nesta preparação. O Figma não foi reaberto nesta etapa de planejamento.

| Elemento | Direção |
| --- | --- |
| Fundo principal | Gradiente 125 graus: `#FFC400` 20%, `#FFBC00` 65%, `#FF9500`. |
| Contraponto | Carvão `#191817`, com texto creme `#FFFAF2`. |
| Superfície clara | Creme `#FAF9F5`; tinta `#1B1C1C`. |
| Destaque | Raio original em laranja `#FF8A00`. |
| Títulos | Plus Jakarta Sans 700/800; entrelinha compacta e poucas palavras. |
| Apoios e legendas | Be Vietnam Pro; peso 400/600 e contraste alto. |
| Formas | Peças gráficas com cantos arredondados, pílulas pontuais e linhas discretas. |
| Logo | Vetor original PapumLogo/LogoWhite/LogoColored em `src/components/ui/icons.tsx`; preservar desenho e proporção. |

A cor é parte da composição: amarelo identifica a proposta e o fechamento; carvão diferencia a organização no painel. O creme dá contraste às peças. Não criar outra marca para o filme.

## Roteiro por cena

Os intervalos abaixo somam exatamente 25 segundos. Narração total: 43 palavras. A leitura deve ser gravada e cronometrada, com pausas naturais, antes de fixar a edição.

| Tempo | Texto principal na tela | Narração | Visual e animação |
| --- | --- | --- | --- |
| 00–03 s | Seu restaurante. / Sua marca. / Seu app. | Seu restaurante. Sua marca. Seu app. | Começar com texto e composição já reconhecíveis. Fundo amarelo, marca pequena e peça de app ilustrada. Revelar as três frases em blocos inteiros, com entradas curtas e pequenos deslocamentos; a última frase permanece. Sem vinheta de abertura. |
| 03–07 s | A marca é sua. / Nome · Logo · Cores | A proposta da Papum Delivery: um app com sua identidade. | Aproximar a peça clara da arte atual, com o rótulo genérico “Seu restaurante”. Nome, logo e cores ganham destaque em sequência. Usar uma ilustração conceitual, sem criar cliente fictício. Exibir “Pré-lançamento” de forma legível. |
| 07–11 s | Seu cardápio, / com a sua cara. | Seu cardápio, com a sua cara. | A peça mantém a mesma posição enquanto produtos/categorias são representados por blocos gráficos simples. Um destaque percorre as categorias. Texto de apoio curto, sem preços, avaliações ou dados inventados. |
| 11–16 s | Cardápio. Pedidos. Contatos. / Em um painel. | Pedidos e contatos organizados em um painel. | A peça do app se desloca para um lado e se conecta ao conjunto da operação. Trocar para carvão. Destacar pedidos com `orders.svg` e depois contatos com `contacts.svg`. Apresentação explicativa da proposta, sem simular pedidos reais ou integrações. |
| 16–19 s | Menos bagunça. / Mais controle. | Menos bagunça. Mais controle. | As três partes se alinham em uma composição estável. O movimento termina assim que a organização fica clara. Dar tempo de leitura; não mover os dados continuamente. |
| 19–25 s | Cadastre seu interesse. / Link na bio. | Estamos em pré-lançamento. Cadastre seu interesse no link da bio. | Fechamento amarelo, logo original e CTA em alto contraste no centro. Apoio: “Pré-lançamento · Cadastro de interesse gratuito”. Manter CTA e marca até o último quadro, com pelo menos 4 segundos de leitura estável. |

O aviso de pré-lançamento deve acompanhar as cenas que apresentam o produto e o fechamento. Se for incluída qualquer captura do painel, acrescentar **Prévia demonstrativa** e conferir legibilidade no celular.

## Narração pronta

> Seu restaurante. Sua marca. Seu app.
> A proposta da Papum Delivery: um app com sua identidade.
> Seu cardápio, com a sua cara.
> Pedidos e contatos organizados em um painel.
> Menos bagunça. Mais controle.
> Estamos em pré-lançamento. Cadastre seu interesse no link da bio.

Voz em português brasileiro, próxima e confiante, com clareza de apresentação e sem locução excessivamente acelerada. As pausas ajudam a entender as cenas. A Papum deve ser reconhecida pelo nome e pelo visual até o segundo 7.

Legendas iniciais em `docs/reels-captacao-legendas.srt`. São uma base de sincronização do planejamento; ajustar ao áudio real gravado. As legendas não devem disputar com as chamadas principais. Reservar uma faixa estável e usar no máximo duas linhas.

## Retenção e gatilhos

- **Identificação no primeiro quadro:** “Seu restaurante” seleciona quem interessa à campanha.
- **Projeção:** “Sua marca. Seu app.” ajuda o gestor a visualizar seu negócio na proposta.
- **Demonstração:** mostrar a ligação entre app e painel explica o mecanismo; evita depender só de adjetivos.
- **Alívio operacional:** as partes se organizam visualmente junto da mensagem “Menos bagunça. Mais controle.”
- **Baixo compromisso:** o próximo passo é conhecer e cadastrar interesse, com estágio explícito.

Mudanças de composição nos segundos 3, 7, 11, 16 e 19 acompanham mudanças de assunto. Não tratar cortes frequentes como garantia de retenção. Logo e identidade aparecem desde o começo; o primeiro impacto é a proposta.

Omitir escassez artificial, contadores, clientes, avaliações, resultados financeiros, preços e descontos sem comprovação. O percentual externo de 88% não entra neste filme. Não anunciar integração com WhatsApp/iFood, zero comissão, aplicativos publicados ou uso imediato.

## Movimento e som

Função principal do movimento: explicação da relação app/painel e indicação do que está em foco. Frequência de exposição: peça de marketing; há espaço para expressão gráfica, preservando leitura.

- Entradas de texto/peças: 200 ms, deslocamento curto e opacidade; curva `cubic-bezier(0.23, 1, 0.32, 1)`.
- Reorganização entre app/painel: aproximadamente 480 ms; curva `cubic-bezier(0.77, 0, 0.175, 1)`.
- Usar escala contida, de 0,97 para 1, somente quando ajudar a enfatizar. Sem entrada desde escala zero.
- Uma passagem do raio original pode conectar produto e fechamento. Sem flashes, tremores ou zooms contínuos.
- Manter o texto imóvel durante a leitura. Não animar cada letra, cada palavra da legenda ou cada item ao mesmo tempo.
- Trilha instrumental discreta, com licença para o uso pretendido; fala em primeiro plano e música reduzida sob a narração.
- Usar poucos efeitos: toques curtos nas entradas e um som de encaixe quando as peças se organizam. Não criar volume falso de notificações de pedidos.
- O vídeo deve funcionar sem áudio. Se houver prévia interativa em uma página, respeitar `prefers-reduced-motion`; um MP4 publicado não se adapta automaticamente a essa preferência.

## Assets para produção

| Asset | Uso |
| --- | --- |
| `src/components/ui/icons.tsx` — PapumLogo e variantes | Exportar o vetor correto da marca, sem redesenho por IA. |
| `public/home/product/orders.svg` | Peça de recibo e sacola para a parte de pedidos. Preservar proporção 4:3. |
| `public/home/product/contacts.svg` | Peça de contatos; preservar proporção 4:3. |
| `public/home/product/lightning.svg` | Raio decorativo original. |
| `src/components/home/landing-page.tsx` e `product-explorer.tsx` | Referência da arte e da separação entre app e painel. |
| `output/playwright/fixed-header/chromium/hero-390.png` | Referência de composição e identidade; não ampliar como master de vídeo. |

Não usar `public/home/app-screen.png`: é material legado com marketplace, restaurante, avaliação e condições fictícios. Evitar PNGs pequenos da marca e cenas de entregador que possam sugerir frota própria. A preferência é animar os vetores atuais.

## Produção e exportação

1. Montar um animatic de 25 segundos com blocos de texto, assets e narração provisória.
2. Gravar a voz e ajustar os tempos dentro da duração definida. Preservar o fechamento de 6 segundos.
3. Animar os elementos originais em camadas; manter textos, fontes e logo sob controle do editor.
4. Conferir a prévia no celular, com e sem áudio, e na interface de Reels/Ads. Mensagem e CTA devem ficar livres dos controles laterais e da legenda inferior.
5. Exportar em 1080 × 1920, 9:16, 30 fps, MP4 H.264 com áudio AAC; verificar texto e logo depois da compressão. Esses são parâmetros escolhidos para esta produção.

A recomendação de vertical 9:16, som, zonas seguras e gancho nos primeiros segundos está alinhada ao material oficial da Meta. Não foi validada uma margem universal em pixels; conferir a prévia da publicação efetiva.

Se usar geração por IA, produzir movimentos de apoio por cena e preservar as peças originais na composição. Logo, textos e telas devem ser montados na edição, para evitar alterações no desenho e informações ilegíveis. Não gerar o produto inteiro como se fosse uma captura real.

## Brief pronto para um editor ou gerador de cenas

```text
Criar um Reels vertical 9:16 de EXATAMENTE 25 segundos para Papum Delivery,
voltado a donos e gestores de restaurantes. Objetivo: cadastro de interesse
no pré-lançamento. Conceito: “Seu restaurante. Sua marca. Seu app.”

Usar a identidade original anexada: amarelo #FFC400, amarelo quente #FFBC00,
laranja #FF9500 e #FF8A00, carvão #191817, creme #FAF9F5 e tinta #1B1C1C.
Títulos Plus Jakarta Sans 700/800; apoios Be Vietnam Pro. Usar a logo e os
SVGs originais de pedidos, contatos e raio. Não redesenhar a marca.

Animação gráfica 2D, clara e editorial. Textos grandes e poucas palavras,
peças arredondadas, movimento curto com desaceleração, som discreto.
Preservar leitura e área livre dos controles do Instagram.

Seguir os seis blocos:
0–3 s: “Seu restaurante. Sua marca. Seu app.”
3–7 s: “A marca é sua.” Mostrar nome, logo e cores como proposta.
7–11 s: “Seu cardápio, com a sua cara.”
11–16 s: “Cardápio. Pedidos. Contatos. Em um painel.”
16–19 s: “Menos bagunça. Mais controle.”
19–25 s: “Cadastre seu interesse. Link na bio.”

Aviso legível: “Pré-lançamento”. No fechamento: “Cadastro de interesse gratuito”.
As cenas são ilustrações conceituais. Se houver captura do painel, identificá-la
como “Prévia demonstrativa”. Não inserir preços, clientes, avaliações,
integrações, métricas ou promessas de faturamento. Não sugerir uso imediato.

Narração:
“Seu restaurante. Sua marca. Seu app. A proposta da Papum Delivery: um app
com sua identidade. Seu cardápio, com a sua cara. Pedidos e contatos
organizados em um painel. Menos bagunça. Mais controle. Estamos em
pré-lançamento. Cadastre seu interesse no link da bio.”

Entregar master 1080×1920 a 30 fps, versão legendada e versão sem legendas
embutidas, além da voz, trilha e projeto editável. Os textos e a logo devem
ser compostos a partir dos arquivos originais, sem geração de lettering por IA.
```

## Publicação e teste

Legenda sugerida:

> A marca do seu restaurante merece estar na frente.
> Conheça a proposta da Papum: app com a sua identidade e painel para
> organizar cardápio, pedidos e contatos.
> Estamos em pré-lançamento. Cadastre seu interesse no link da bio.

Capa: “Seu restaurante. Seu app.”, com logo e fundo amarelo; validar a leitura do recorte no perfil.

Criar duas variantes trocando somente a abertura de 0–3 segundos, mantendo corpo, duração, CTA e condições de distribuição:

- A — “Seu restaurante. Sua marca. Seu app.”
- B — “Organizar seu delivery virou outro trabalho?”

A versão A destaca identidade; a B testa identificação com dificuldade operacional. Não escolher vencedor apenas por visualizações.

Avaliar retenção nos segundos 3, 11 e 19, tempo médio, visitas ao perfil e cadastros confirmados atribuíveis. Em mídia paga, acompanhar custo por cadastro e qualidade dos interessados. Em orgânico, a origem `/instagram` não distingue cada Reels; usar janelas de comparação ou instrumentação específica antes de atribuir causalidade. Eventos de sucesso do formulário não equivalem a pessoas únicas.

Na adaptação para anúncio pago, alinhar **narração, texto na tela e legendas** ao mesmo destino: **“Cadastre seu interesse pelo botão do anúncio.”** Configurar o botão para a landing e retirar “Link na bio” dessa versão. O SRT entregue acompanha a versão orgânica e precisa desse ajuste no último bloco para o anúncio pago. Não combinar, no mesmo criativo, pedido de seguir, comentar, mandar mensagem e se cadastrar.

## Fontes oficiais consultadas

- [Meta Blueprint: produção e desempenho de Reels](https://www.facebookblueprint.com/student/activity/641202?sid=71f69c33-1031-4566-a090-fedb9cdab6fe&sid_i=4).
- [Meta: recursos de áudio e CTA em Reels Ads](https://about.fb.com/br/news/2023/10/atualizacoes-do-reels-ads-novos-recursos-de-desempenho-criacao-automatizada-e-solucoes-de-adequacao/).
- [Meta: gráfico de retenção de Reels](https://about.fb.com/news/2023/11/new-ways-to-create-content-on-instagram/).

O roteiro é uma hipótese criativa para testar. A duração e os ganchos não garantem retenção, cadastros ou vendas.
