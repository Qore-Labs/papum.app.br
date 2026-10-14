# Validação do dashboard

Referência: [Figma Pápum!, frame 27:3](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=27-3).

Esta entrega estende a identidade existente. `PRODUCT.md` e `DESIGN.md` permanecem como contexto herdado; as decisões abaixo descrevem somente `/dashboard`.

## Correspondência visual

A revisão independente concluiu **ship**: header, sidebar, banner, toolbar, tabela, avatares, status e footer correspondem ao Figma ou têm adaptações intencionais para responsividade e acessibilidade. A comparação preservou os PNGs originais, os recortes de imagem e os SVGs tipados. A origem dos assets está em [dashboard-assets.md](dashboard-assets.md).

O header usa `--admin-header` (`#fb8d01`) e tem 82 px de altura. A superfície administrativa usa `--admin-surface` (`#f2f2f2`), com campos `--admin-input` (`#e7e7e7`) e controles `--admin-control` (`#e8e8e8`). Inter aparece nos controles e dados; Plus Jakarta Sans nos títulos; Be Vietnam Pro no footer compartilhado. O título principal usa 26 px/32 px no mobile e 30 px/36 px a partir de 640 px; o título dos pedidos usa 20 px/28 px.

## Layout observado

O relatório de navegador registrou as seguintes larguras. Em cada tamanho, `scrollWidth` foi igual a `clientWidth`, sem overflow horizontal; todas as imagens visíveis estavam carregadas.

| Viewport | Conteúdo disponível                                      | Pedidos                   | Navegação         |
| -------- | -------------------------------------------------------- | ------------------------- | ----------------- |
| 1280 px  | Banner de 970 px, início em x = 288 px; tabela de 969 px | Tabela                    | Sidebar de 256 px |
| 768 px   | Banner e tabela de 704 px, margens de 32 px              | Tabela                    | Drawer            |
| 390 px   | Banner de 358 px, margens de 16 px                       | Cards com todos os campos | Drawer            |
| 320 px   | Banner de 288 px, margens de 16 px                       | Cards com todos os campos | Drawer            |

A tabela aparece a partir de 768 px; os cards, abaixo disso. A sidebar aparece a partir de 1024 px. Esses breakpoints correspondem à orientação registrada em `DESIGN.md` e no contrato da superfície.

## Comportamento e acessibilidade

A busca filtra ID e nome, com normalização de acentos. O período filtra os dados de demonstração, e o CSV contém somente os pedidos exibidos. O estado vazio desabilita a exportação; “Ver Todos os Pedidos” limpa a busca e restaura o período de 24 horas.

Notificações, ajuda e menu do gerente usam popovers nativos. O menu móvel usa diálogo modal nativo, ocupa a direita com largura `min(85vw, 20rem)`, bloqueia o scroll do fundo e devolve foco ao controle ao fechar. Drawer e backdrop usam 260 ms; abertura por teclado e preferência de movimento reduzido desativam a transição. Controles ocultos do drawer ficam inertes.

O fluxo “Entrar” valida os campos e abre `/dashboard` para testar o frontend, sem criar sessão. Os quatro pedidos são demonstração; Cardápio, Clientes e Configurações permanecem desabilitados até as respectivas telas. O layout administrativo declara `robots: { index: false, follow: false }` e a página mantém título, descrição e canonical `/dashboard`.

## Verificações concluídas

A entrega passou nos 39 testes da suíte, no ESLint de `app` e `src`, no Prettier dos arquivos alterados e no build do Next.js 16.3.1 com TypeScript. Os 30 checks de navegador cobriram login, filtros, estado vazio, CSV, popovers, drawer, teclado, foco, troca para desktop, movimento reduzido e console sem erros.

O aviso automático sobre fontes comuns não altera a identidade herdada: Inter e Plus Jakarta Sans são as famílias confirmadas para esta tela. Nenhum defeito ou novo princípio visual foi promovido a regra global do sistema.
