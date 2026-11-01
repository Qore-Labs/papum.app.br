# Direção visual existente

- O Figma fornecido pelo usuário é a referência para cada tela; preservar a identidade já implementada no site e no login.
- Logos e ícones ficam na biblioteca SVG `src/components/ui/icons.tsx`.
- O dashboard mantém o header laranja, superfícies neutras claras, sidebar, banner do restaurante e tabela de pedidos do frame `27:3`.
- Usar Inter nos controles e dados administrativos, Plus Jakarta Sans nos títulos e Be Vietnam Pro no footer compartilhado.
- No desktop, preservar medidas e alinhamentos do frame. Abaixo de 1024 px, usar o drawer de navegação; abaixo de 768 px, apresentar os pedidos como cards legíveis. O tablet a partir de 768 px mantém a tabela.
- Menus e controles têm teclado, foco visível, estados acessíveis e alvos de toque adequados. O movimento deve ser sutil, responder à ação e respeitar `prefers-reduced-motion`.
- Ajustar contraste de textos pequenos quando necessário para acessibilidade.

Referência do dashboard: https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=27-3

## Overview

A Home e a entrada `/instagram` compartilham uma landing de produto para restaurantes. A reformulação completa aprovada em 31/10/2026 estende a identidade Papum: logo e SVGs originais, Plus Jakarta Sans, Be Vietnam Pro, amarelo, laranja, carvão e superfícies claras. A composição é gráfica e editorial, com áreas de cor, divisores e controles em pílula. A arte explica a relação entre o app com a marca do restaurante e o painel Papum; não representa uma tela operacional.

As decisões confirmadas no [plano e Direction contract atuais](docs/design/home-conversion-redesign-plan.md) e o [brief da superfície](.impeccable/surfaces/home.md) governam esta landing. Sua composição não redefine dashboard ou autenticação, cujas referências e regras acima permanecem válidas. Esta atualização documenta os padrões de marketing implementados, sem criar outra identidade ou converter valores locais em tokens globais.

O plano de [`#proposta`](docs/design/home-product-section-plan.md) e as decisões anteriores sobre o telefone são históricos. A proposta Vila Burger já havia sido revogada na [restauração do celular original](docs/design/home-phone-restoration-validation.md); a aprovação posterior da Home inteira substitui também aquela composição restaurada. Essas seções, o mockup PNG e os CTAs para `/lancamento` em nova aba não descrevem a landing atual. O inventário dos SVGs preserva sua proveniência.

## Colors

A landing combina os campos quentes da marca com carvão e creme. As atribuições abaixo são locais ao marketing; a fonte implementada está em `app/globals.css`.

- **Amarelo e laranja:** o hero usa gradiente a 125° de amarelo (`#ffc400`, a 20%) por amarelo quente (`#ffbc00`, a 65%) até laranja (`#ff9500`); o fechamento usa amarelo sólido. O mesmo amarelo identifica o recurso selecionado e a ação sobre a seção escura.
- **Carvão e tinta:** carvão (`#191817`) sustenta a seção de recursos e a peça de pedidos da arte; tinta (`#1b1c1c`) serve à leitura e às ações principais sobre fundos claros ou amarelos. O destaque final do h1 usa marrom (`#715000`) para conservar contraste.
- **Neutros claros:** creme (`#faf9f5`) no corpo da landing, creme claro (`#fffaf2`) no formulário, nas ilustrações e no texto sobre carvão; o footer usa neutro quente (`#f0eee7`).
- **Apoio e divisores:** cinza quente (`#625c53`) nos textos de apoio claros, neutros claros nos apoios sobre carvão e divisores discretos (`#dedbd2` nas superfícies claras; branco com transparência na área escura).

A scrollbar do documento reutiliza o laranja da Home (`#ff8a00`) no indicador e o laranja escuro existente (`#e5690a`) no hover, com trilha e canto transparentes. No site público, o canvas do documento e a indicação `theme-color` acompanham as seções, com `color-scheme: light`: amarelo inicial na Home e em `/instagram`, creme em `/privacidade`. Quando o rodapé aparece na borda inferior, o canvas assume seu neutro quente, mesmo que essa faixa curta ainda não alcance o header. O menu aberto usa carvão e restaura o tema ao fechar. São sinais fornecidos ao navegador; a aparência das barras nativas do Safari em iPhone permanece sob controle do navegador e sem validação física.

## Typography

Títulos da landing usam Plus Jakarta Sans; corpo e controles herdam Be Vietnam Pro do layout do site. Preservar as famílias existentes, com fallback sans-serif. O uso administrativo de Inter permanece conforme as regras iniciais.

- **Título principal:** peso real extraforte (800), escala fluida (`clamp(2.6rem, 5.2vw, 4.7rem)`), entrelinha compacta (1,04) e espaçamento entre letras (−0,04 em). Abaixo de 768 px, a escala é `clamp(2.05rem, 9.3vw, 3.6rem)`, com espaçamento de −0,035 em. O layout carrega Plus Jakarta Sans em 700 e 800; o H1 preserva “Seu delivery.”, “Menos bagunça.” e “Mais controle.” em três linhas.
- **Títulos de seção:** peso forte (700), escala fluida (`clamp(2rem, 3.4vw, 3.1rem)`), entrelinha (1,12), espaçamento (−0,035 em) e quebra equilibrada.
- **Corpo:** descrições principais em 18 px, reduzidas a 16 px no mobile, com entrelinhas de 1,7 a 1,75 e largura de leitura controlada (420–480 px conforme o bloco).
- **Controles e apoio:** ações em peso 600; legendas da arte e contexto da evidência têm escala menor e contraste próprio. Não aplicar a escala de títulos aos avisos de disponibilidade junto ao cadastro.

## Layout

A landing usa contêiner centralizado com largura máxima de 1.232 px e recuo lateral de 48 px; abaixo de 768 px, o recuo é de 24 px. O header compartilhado é fixo em desktop, tablet e mobile, preservando suas dimensões e alinhamentos compactos, com navegação desktop a partir de 768 px e menu mobile abaixo desse limite, respeitando as áreas seguras.

O hero tem texto e formulário à esquerda, arte à direita, em colunas de proporção 1,1:1. A partir de 768 px preserva duas colunas; abaixo desse limite, a ordem é título, explicação, cadastro e arte. O recuo superior reserva espaço para o header: no mínimo 160 px no desktop e 124 px no mobile, ou sua altura real mais 42 px quando esse valor for maior. Abaixo de 1.100 px, arte e espaçamento se ajustam sem exigir a composição de um desktop largo.

As seções alternam explicação app/painel, exploração dos recursos em carvão, contexto do canal próprio, FAQ e fechamento amarelo. Divisores e mudanças de densidade organizam a leitura. Os respiros principais são de 90–100 px no desktop e 52–64 px no mobile. O conteúdo determina a altura; não há carrossel automático ou rolagem interna no hero.

O seletor de recursos fica à esquerda do conteúdo no desktop e acima dele no mobile. Abaixo de 1.100 px, ilustração e texto do recurso se empilham. FAQ, evidência e fechamento passam a uma coluna abaixo de 768 px. O formulário conserva campo e botão lado a lado até 360 px; abaixo disso, empilha os controles. O CTA final preserva o rótulo e a seta em uma linha, sem encolher no flex. Conferir também 320 px, ausência de overflow e legibilidade das legendas da arte.

## Elevation & Depth

As seções são predominantemente planas, separadas por cor, espaço e divisores. A profundidade fica concentrada na arte do hero: peças levemente inclinadas e sobrepostas, órbita fina e sombras quentes suaves. A peça do app usa sombra (`0 18px 38px -22px #71450066`) e a peça de pedidos (`0 25px 46px -27px #71450088`). O formulário recebe uma sombra discreta própria. Não transformar esses tratamentos ilustrativos em uma regra de elevação para o dashboard.

O raio original aparece ampliado, recortado e com opacidade reduzida (0,16) no fundo quente. Ele é decorativo e não intercepta ponteiro. Não compete com texto ou formulário.

## Shapes

Botões e campo de e-mail mantêm a forma de pílula (999 px). As peças ilustradas têm cantos suaves (18–24 px); a seção de recursos tem apenas os cantos superiores arredondados (36 px no desktop; 24 px no mobile). Linhas finas delimitam conteúdo sem cercar cada seção num card. A órbita elíptica e a inclinação das peças pertencem à arte, não aos controles.

## Components

### Navegação e temas do site

O header de `/`, `/instagram` e `/privacidade` permanece visível nas duas direções da rolagem, sem borda ou sombra acrescentada. No topo da hero, é transparente; ao rolar sobre ela, recebe o mesmo gradiente opaco, alinhado à escala e à posição da seção. As demais faixas usam creme no produto, dado comercial, FAQ e privacidade; carvão nos recursos; amarelo no fechamento; neutro quente no rodapé. Os temas explícitos estão em `src/utils/config/site-themes.ts`.

Logo, navegação e menu acompanham a tinta ativa por `currentColor`; os contornos de foco contrastam com a superfície ao redor. O CTA do header usa carvão com texto claro nas faixas claras/quentes e amarelo com texto escuro na faixa escura. Hover, foco, setas e estado pressionado preservam legibilidade; o diálogo mobile mantém sua superfície própria em carvão.

As cores registradas em CSS fazem a transição com a curva de saída existente em 200 ms. Mudanças de polaridade passam por cinza neutro (`#757575`) em duas fases de 100 ms, invertendo tinta preta/branca no ponto neutro; novas mudanças interrompem a fase anterior. Movimento reduzido ou ausência de suporte ao registro de propriedades aplica o tema diretamente, em 0 ms. O header estrutural permanece no servidor; `SiteHeaderTheme` é uma ilha pequena de cliente, sem interface própria.

### Arte e ilustrações de produto

Reutilizar os SVGs originais locais: [`orders.svg`](public/home/product/orders.svg) (recibo e sacola), [`contacts.svg`](public/home/product/contacts.svg) (cartões de contatos) e [`lightning.svg`](public/home/product/lightning.svg) (raio). Origem, camadas, dimensões e hashes estão no [inventário de assets](docs/design/home-product-section-assets.md). As referências dos posts, conferidas pelo MCP do Figma, são os frames [30:22](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-22), [30:397](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-397) e [30:491](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-491).

A arte atual combina “Sua marca. Seu app.”, pedidos e contatos; é uma figura com descrição acessível e SVGs decorativos com texto alternativo vazio. Não usa o telefone Vila Burger, pizza, parceiros, depoimentos ou métricas fictícias. Pedido e contatos preservam a proporção 4:3; as imagens têm dimensões reservadas e `sizes` conforme sua apresentação, priorizando apenas o recibo do hero. O inventário registra a exportação original; o uso atual está em `src/components/home/landing-page.tsx` e `product-explorer.tsx`.

Entre “Na mão do cliente” e “Na sua operação”, o raio arredondado original substitui o sinal de “+”. O componente tipado `BrandBoltIcon` reutiliza o path de `lightning.svg`, com 32 × 40 px e laranja (`#ff8a00`), solto no fundo, sem interação e com `aria-hidden`. Os ícones expansíveis do FAQ permanecem iguais.

Não há novo raster estático na landing. A rota `app/opengraph-image.tsx` gera a imagem social PNG a partir do logo local e do SVG original de pedidos.

### CTAs de captação

O rótulo principal é “Cadastrar-se”. Header, menu mobile, seção de recursos e fechamento levam ao campo de e-mail em `#cadastro`, na própria página, mantendo a entrada `/instagram` quando aplicável. As âncoras compensam a altura real do header em `scroll-padding`; o cadastro acrescenta 16 px de `scroll-margin`. O helper compartilhado `src/lib/focus-signup.ts` conserva a rota de origem e foca o e-mail sem uma segunda rolagem; no menu, é acionado depois do fechamento. A rolagem é suave, ou imediata sob movimento reduzido. Não abrir outra aba para cadastrar.

As ações são escuras com texto claro sobre amarelo e amarelas com tinta escura sobre carvão. Botões de navegação ao formulário têm altura mínima de 52 px, recuo de 14 × 26 px e feedback de cor/pressão em 150 ms. Preservar a instrumentação de clique, contorno de foco visível e rótulo completo com seta, inclusive no fechamento a 768 px.

### Formulário de interesse

O formulário fica junto da explicação do hero, com rótulo de e-mail visível, fundo creme, controles de 48 px e largura máxima de 520 px. Avisos de disponibilidade, cancelamento por resposta ao e-mail e privacidade ficam imediatamente abaixo. Estados de verificação, envio, erro e sucesso recebem feedback textual acessível; uma falha conserva o e-mail.

Na landing, o SDK e widget Turnstile são montados somente após envio de e-mail válido, com aparência `interaction-only`. O desafio pode aparecer quando necessário, com estado “Verificando...” e opção de cancelar. Essa apresentação não altera a validação obrigatória no servidor. O fluxo legado de `/lancamento` mantém o desafio anterior.

### Exploração dos recursos e movimento

Cardápio, Pedidos e Contatos vêm de dados tipados e são selecionados manualmente por botões semânticos com `aria-pressed` e `aria-controls`. O conteúdo atualizado tem anúncio `aria-live="polite"`. Não há avanço automático: a mudança responde imediatamente à ação, com transição de cor em 160 ms e entrada discreta do conteúdo em 200 ms.

A arte do hero entra uma única vez em 480 ms; o conteúdo principal permanece visível sem depender dessa animação. `prefers-reduced-motion` remove as animações da arte e do conteúdo e as transições dos controles afetados. Conteúdo estático permanece em Server Component; formulário, foco do CTA, seletor e preferências são ilhas pequenas de cliente.

### Evidência, FAQ e rodapé

A evidência mostra apenas o dado, com o período e o grupo analisado na própria frase. Por revisão do usuário, referência, aviso e metodologia não aparecem no layout; a origem permanece na documentação interna. Sua hierarquia não a apresenta como prova social Papum. “Dúvidas frequentes” usa cinco itens nativos `details`/`summary`, com divisores, foco visível e ícone que acompanha o estado aberto.

O rodapé claro contém o Instagram oficial, link de privacidade e “Preferências de privacidade”, sempre disponível nas páginas públicas, inclusive em `/privacidade` e sem integrações de análise configuradas. O painel permite salvar a escolha independentemente do carregamento das tags, abre por ação e devolve o foco ao controle ao fechar. Não há banner inicial de análise.

### E-mails de cadastro

Confirmação ao interessado e notificação interna estendem a identidade da landing conforme o [plano aprovado](docs/design/signup-emails-redesign-plan.md) e o [brief dos e-mails](.impeccable/surfaces/signup-emails.md). A apresentação compartilhada está em `src/lib/email/launch-templates.ts`; textos, assuntos e links ficam no conteúdo tipado de `src/utils/contents/launch-emails.ts`. Os valores abaixo pertencem a esta superfície de e-mail.

A coluna principal é fluida, centralizada e limitada a 560 px, com tabelas de apresentação, cores essenciais inline e alternativa em texto simples. O cabeçalho amarelo (`#ffc400`) conecta logo monocromática original e raio arredondado laranja (`#ff8a00`); corpo e rodapé usam creme (`#faf9f5`) sobre entorno neutro quente (`#f0eee7`). Tinta (`#1b1c1c`), apoio (`#625c53`) e divisores (`#dedbd2`) preservam a hierarquia. A ação principal é uma pílula carvão (`#191817`) com texto claro (`#fffaf2`), de 48 px no layout normal. Cantos do contêiner (16 px) e da ação são aprimoramentos progressivos; a leitura não depende deles.

Arial/Helvetica com fallback sans-serif é uma exceção deliberada para compatibilidade de e-mail. Títulos têm 32/37 px na confirmação e 28/34 px na notificação; corpo usa 16/26 px e apoios, 13–14 px. O conteúdo tem recuo lateral de 36 px, reduzido a 24 px abaixo de 600 px. Não depender de webfonts, SVG ou imagens para comunicar recebimento, dados e ação. Os links preservam rótulos textuais; a regra de foco fornece contorno de 2 px onde o cliente a mantém. Não há animação.

Na confirmação, “Que bom ter você por aqui.” fica no cabeçalho; recebimento e próximo passo abrem o corpo. “A marca é sua. A estrutura é Pápum.” acompanha a pequena arte original de pedidos, antes do convite opcional “Acompanhar no Instagram”, da despedida pessoal e do aviso de cancelamento manual por resposta. A sublinha de produto reserva 30% para a imagem em telas amplas e empilha abaixo de 480 px; sem media queries, a proporção permite reduzir a arte e conservar o texto. A notificação usa cabeçalho compacto e título no corpo, destaca e-mail e origem validada entre divisores e oferece “Responder ao interessado”, por `mailto:` e Reply-To. Dispensa a arte de produto, a despedida e o aviso de cancelamento destinado ao interessado.

Os derivados PNG preservam os vetores originais: `papum-logo-yellow.png` (456 × 177, exibido a 152 × 59 px), `papum-orders.png` (420 × 315, até 140 × 105 px) e `papum-bolt.png` (84 × 105, exibido a 28 × 35 px), em `public/email/`. Logo e raio têm proteção amarela; pedidos conservam proporção 4:3 sobre creme. O rodapé compartilha os PNGs de Instagram e site com rótulos visíveis e links oficiais. Os seis rasters têm origem incorporada; nos três arquivos anteriores, pixels e URLs foram preservados. Os novos assets devem acompanhar os templates na publicação, pois o HTML usa URLs HTTPS absolutas.

A [validação](docs/design/signup-emails-validation.md) registra Chromium e WebKit em 320, 390, 560 e 768 px, endereço longo, imagens bloqueadas, fallback somente inline e preferência de sistema escuro. A [revisão independente](docs/design/signup-emails-finish-review.md) retornou **ship**, com lista de correções vazia, nesse escopo. Prévias em `output/playwright/email-redesign/` não certificam Gmail, Apple Mail, Outlook ou inversão nativa de cores; não houve publicação nem envio real de mensagens.

### Scrollbar do documento

Aplicar a aparência no `html`, mantendo a rolagem nativa. Em Blink/WebKit, o indicador tem espessura de 6 px, cantos arredondados e botões ocultos; trilha e canto ficam transparentes. Os demais navegadores recebem o fallback padrão fino e laranja por `scrollbar-width` e `scrollbar-color`. Em cores forçadas, a personalização não se aplica. Não há interceptação do gesto por JavaScript.

## Do's and Don'ts

- Preservar fontes, logo, SVGs e paleta Papum; manter a distinção entre o app do restaurante e o painel da operação.
- Manter o cadastro junto da explicação inicial, os CTAs na mesma página e o aviso de pré-lançamento junto do formulário.
- Preservar ritmo editorial, contraste, largura de leitura, teclado, foco, estados semânticos e movimento reduzido. Não transformar todos os blocos em cards iguais ou acrescentar movimento contínuo.
- Não reintroduzir parceiros, clientes, avaliações, números, preço ou resultados Papum sem comprovação; preservar o período e o grupo analisado no dado externo e sua origem na documentação interna.
- Não aplicar as medidas locais da landing ao admin ou à autenticação, nem usar os planos históricos de `#proposta` e Vila Burger como contrato atual.
- Consultar a [validação atual](docs/design/home-conversion-validation.md) para testes, capturas e limites. Na revisão visual inicial, o [finish review](docs/design/home-conversion-finish-review.md) encontrou um ajuste material no CTA final; o verdict pass marcou **ship**, com **F1 resolvido** nas cinco larguras em Chromium e WebKit. Esse fechamento avalia a correção listada, não certifica provedores reais ou desempenho de campo.
