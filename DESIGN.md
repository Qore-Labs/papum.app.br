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

A seção de apresentação do produto na Home (`#proposta`) é uma extensão localizada da identidade existente. Sua composição integra a linguagem dos [posts originais da Papum no Figma](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/Papum-%7C-Posts-redes-sociais?node-id=0-1) à landing, conforme o [plano aprovado e seu Direction contract](docs/design/home-product-section-plan.md). Essa direção não redefine o dashboard, o login ou as demais seções da Home.

A aprovação posterior de `#app-preview` substitui somente o antigo bloco do celular/prova social e suas métricas por uma prévia do Vila Burger e convite ao cadastro por e-mail, conforme o [plano aprovado e sua revisão posterior](docs/design/home-app-preview-plan.md). O PNG fornecido pelo usuário é a autoridade visual para o acabamento atual do mockup. A identidade do restaurante ilustrativo fica na tela do aparelho; o entorno preserva a linguagem Papum. A seção `#proposta`, inclusive seu texto já editado pelo usuário, permanece intacta.

## Colors

Na seção `#proposta`, a zona principal usa amarelo (`#ffc400`) em transição por amarelo quente (`#ffbc00`) até laranja (`#ff9500`). A zona complementar e o CTA usam carvão (`#191817`); títulos e textos da zona quente mantêm o token existente de tinta da Home (`#1b1c1c`). As legendas são amarelas e o texto do CTA é claro (`#fffaf2`). O neutro externo (`#ebebe7`) integra o conjunto à página. Essas cores são locais à composição; preservar os tokens e as atribuições cromáticas das outras superfícies.

Em `#app-preview`, o verde escuro (`#184f3b`), o creme (`#f9f7ef`) e o verde claro (`#c6e88b`) pertencem apenas à tela do Vila Burger. O entorno tem superfície branca, tinta e fontes existentes da Home, apoio laranja discreto e CTA vermelho Papum. Não promover a paleta do restaurante a tokens globais.

A scrollbar do documento reutiliza o laranja da Home (`#ff8a00`) no indicador e o laranja escuro existente (`#e5690a`) no hover, com trilha e canto transparentes. No site, o canvas raiz fica branco em dispositivos com hover e ponteiro fino; o contexto de ponteiro grosso mantém o canvas laranja e `color-scheme: light` existentes.

## Typography

O título e as legendas usam a Plus Jakarta Sans já carregada no site, em peso forte (700). O título tem escala fluida de 36 a 56 px, entrelinha de 1,1 e espaçamento entre letras de −0,035 em. O corpo mantém a Be Vietnam Pro herdada da landing. Adaptar a hierarquia dos posts à leitura web, preservando as fontes existentes.

Em `#app-preview`, o título usa Plus Jakarta Sans em peso 700, com escala fluida de 32 a 48 px, entrelinha de 1,12 e espaçamento entre letras de −0,025 em. A descrição mantém a fonte da landing, em 18 px e entrelinha de 32 px.

## Layout

A seção reúne duas zonas contínuas num único contêiner centralizado, com largura máxima de 1.232 px. A partir de 1.024 px, o grid tem proporção 3:2: aproximadamente 60% para título, explicação, convite e CTA à esquerda, e 40% para as ilustrações à direita. As ilustrações aparecem em duas linhas, com legenda junto de cada SVG e um divisor discreto entre elas.

Abaixo de 1.024 px, incluindo tablet e mobile, usar uma coluna: título, explicação e CTA antes dos dois SVGs. Preservar o recuo interno em telas de 320 px, as áreas seguras e a ausência de overflow horizontal. O conteúdo determina a altura; não há carrossel.

Em `#app-preview`, o contêiner tem largura máxima de 1.120 px. A partir de 1.024 px, o aparelho fica à esquerda e título, descrição e CTA à direita. Abaixo desse limite, título, descrição e CTA precedem o telefone centralizado, que acompanha a largura disponível, com largura máxima de 320 px e altura automática, preservando a proporção 347:606. Manter a imagem inteira visível, a legenda legível e a rolagem apenas na página.

## Elevation & Depth

As duas zonas têm superfícies planas, unidas pela cor e pelo recorte externo. O raio original funciona como assinatura de fundo na zona quente, com rotação, recorte e opacidade reduzida, sem disputar a leitura. As ilustrações são estáticas.

O aparelho de `#app-preview` tem sombra suave acompanhando o contorno transparente e apoio laranja difuso. A inclinação já pertence ao PNG e permanece igual em todos os tamanhos, sem rotação adicional por CSS. A prévia é estática.

## Shapes

O conjunto tem cantos arredondados (32 px), com recorte das duas zonas no mesmo contorno. Os CTAs de captação mantêm a forma de pílula da landing. Na nova seção, o botão tem altura mínima de 48 px.

O contorno, os cantos e a transparência do aparelho de `#app-preview` vêm do PNG aprovado, sem moldura ou recorte adicional. Seu CTA mantém a pílula da landing e altura mínima de 48 px.

## Components

### Ilustrações de produto

Usar os SVGs originais locais: `public/home/product/orders.svg` (recibo e sacola), `contacts.svg` (cartões de contatos) e `lightning.svg` (raio). Recibo/sacola e contatos preservam a proporção 4:3 e acompanham as legendas “Pedidos organizados” e “Contatos em um só lugar”. O raio preserva a proporção quadrada. As imagens são decorativas junto dos textos equivalentes, com texto alternativo vazio. Origem, camadas, dimensões e hashes estão no [inventário de assets](docs/design/home-product-section-assets.md).

### CTAs de captação

Os rótulos são “Lançamento” na navegação, “Receber novidades” no header/menu, “Acompanhar o lançamento” no hero e “Quero ser avisado” na seção de produto, em `#app-preview` e no bloco final. O bloco final tem uma ação principal. Todos levam a `/lancamento` em nova aba, com essa abertura indicada no nome acessível. Em `#app-preview`, o CTA vermelho usa o ponto de instrumentação `app_preview`. Preservar a instrumentação de cliques, o foco visível e o feedback discreto de cor; respeitar movimento reduzido. O formulário continua na campanha própria.

### Prévia do app (`#app-preview`)

Usar `public/home/vila-burger/mockup.png`, o PNG de 347 × 606 px fornecido pelo usuário como `vilaburguer.png`, preservando pixels, transparência e inclinação. A seção continua estática em Server Component, com textos e dados do asset em `src/utils/contents/home-app-preview.ts`. Next Image reserva essas dimensões e usa `sizes="(max-width: 367px) calc(100vw - 48px), 320px"`. A imagem substitui a reconstrução em HTML/CSS e os três assets individuais removidos por falta de referências. Origem, hashes e preservação dos dados de imagem constam do [inventário de assets](docs/design/home-app-preview-assets.md).

A legenda explícita é “Vila Burger — app demonstrativo”. O conjunto é uma figura com legenda e descrição acessíveis, vinculadas por `aria-labelledby` e `aria-describedby`; a imagem tem texto alternativo vazio para evitar duplicação. Busca, categorias, adição e sacola são ilustrativas, sem controles tabuláveis: não há compra, checkout ou pedido operável. O CTA de cadastro é a única ação do bloco. A prévia não apresenta o restaurante como cliente ou parceiro, nem contém métricas de uso ou prova social.

### Scrollbar do documento

Aplicar a aparência no `html`, mantendo a rolagem nativa. Em Blink/WebKit, o indicador tem espessura de 6 px, cantos arredondados e botões ocultos; trilha e canto ficam transparentes. Os demais navegadores recebem o fallback padrão fino e laranja por `scrollbar-width` e `scrollbar-color`. Em cores forçadas, a personalização não se aplica. Não há interceptação do gesto por JavaScript. A [validação da revisão](docs/design/home-app-preview-validation.md) registra os motores conferidos e os limites para Safari físico e Firefox.

## Do's and Don'ts

- Preservar a presença gráfica conjunta de texto, CTA e ilustrações, sem converter a seção em uma lista de cards.
- Usar os assets aprovados para explicar pedidos e contatos, sem acrescentar marcas de parceiros, depoimentos, avaliações ou números de clientes à nova seção.
- Preservar os textos e a composição do hero, etapas, oferta, rodapé, imagem do CTA final e seção `#proposta`. A aprovação posterior substitui somente o antigo bloco do celular/prova social e suas métricas por `#app-preview`; a atualização dos botões permanece prevista no plano anterior.
- Consultar os registros de validação da [seção de produto](docs/design/home-product-section-validation.md) e da [prévia do app](docs/design/home-app-preview-validation.md) para as evidências de responsividade, acessibilidade e comportamento de cada extensão.
