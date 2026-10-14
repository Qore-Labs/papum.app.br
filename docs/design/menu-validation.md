# Validação do cardápio

Referência: [Figma Pápum!, frame 31:737](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=31-737).

Registro da entrega em 14 de outubro de 2026. `/dashboard/cardapio` estende o admin existente no modo Operate: o gerente encontra pratos e administra os itens da prévia. `PRODUCT.md` e `DESIGN.md` foram preservados; as decisões abaixo descrevem somente esta superfície.

## Composição e sistema observado

A página conserva o header laranja, a sidebar, a toolbar, as áreas brancas e o footer compartilhado. A sequência é busca, apresentação com “Novo Item”, filtros de categoria, cards agrupados por categoria e footer. No desktop, busca e título começam em x = 288 px; o header mede 82 px de altura.

Os tokens existentes usados nesta tela incluem `--admin-header` (`#fb8d01`), `--admin-surface` (`#f2f2f2`), `--admin-input` (`#e7e7e7`), `--admin-control` (`#e8e8e8`), `--admin-accent` (`#ff7900`) e `--admin-accent-ink` (`#9a4600`). O laranja mais escuro aparece em preços, navegação ativa e foco. O botão principal mantém o gradiente laranja/vermelho da referência.

Inter aparece nos controles e dados, Plus Jakarta Sans nos títulos e Be Vietnam Pro no footer compartilhado. O título principal usa 26 px/32 px abaixo de 640 px e 30 px/36 px a partir desse breakpoint. Os nomes dos produtos usam 18 px/28 px; os preços, 16 px/28 px; as descrições, 12 px/19,5 px. Os títulos de categoria reproduzem a caixa alta e as linhas laterais do Figma; esse tratamento permanece específico do cardápio.

Os cards têm cantos de 12 px, imagens recortadas em proporção 270/192, espaçamento de 24 px na grade e altura determinada pelo conteúdo. A página conserva os recortes das sete fotos originais e os SVGs tipados; a origem está em [menu-assets.md](menu-assets.md).

## Responsividade observada

As capturas e as medições do navegador cobriram os quatro tamanhos abaixo. Não houve overflow horizontal, e as dez imagens renderizadas — nove fotos de produtos e o avatar do gerente — estavam carregadas em todos eles. A reserva do scrollbar reduz em 15 px a largura disponível; não foi tratada como overflow.

| Viewport   | Grade        | Navegação | Margem do conteúdo   |
| ---------- | ------------ | --------- | -------------------- |
| 1280 × 900 | Três colunas | Sidebar   | 32 px após a sidebar |
| 768 × 1024 | Duas colunas | Drawer    | 32 px                |
| 390 × 844  | Uma coluna   | Drawer    | 16 px                |
| 320 × 700  | Uma coluna   | Drawer    | 16 px                |

A grade passa a duas colunas em 640 px e a três em 1280 px. A sidebar aparece a partir de 1024 px; abaixo disso, a navegação usa o drawer existente. Filtros e informações dos cards quebram linha conforme o espaço disponível. O formulário tem scroll interno e foi conferido nos dois celulares.

## Interações e acessibilidade

A busca filtra nomes sem distinguir acentos e combina com a categoria selecionada. “Limpar filtros” restaura a listagem. Os nove produtos iniciais pertencem a Hambúrguers, Pizzas e Pokes; Bebidas começa vazia porque o Figma não fornece produtos nessa categoria. Esse estado vazio oferece uma instrução para “Novo Item”.

Os switches respondem imediatamente, têm texto de estado, nome acessível e `aria-checked`. Os filtros usam `aria-pressed`, e a navegação atual usa `aria-current="page"`. A contagem de resultados e as alterações são anunciadas por uma região de status. Após salvar, a busca e o filtro são limpos, e o card salvo recebe foco.

Criação e edição usam um diálogo modal nativo e validação com React Hook Form/Zod. O usuário autorizou esse formulário local; o frame não contém um layout de formulário. Ele permite editar nome, descrição, preço, categoria, foto da prévia, disponibilidade e destaque. Os erros identificam seus campos; preço aceita vírgula ou ponto e é exibido em reais. A imagem é opcional e pode usar uma foto existente ou o estado “Sem imagem”.

O diálogo protege o foco, bloqueia o scroll do fundo e fecha por Cancelar, botão de fechar, Escape ou clique fora. Cancelar descarta a edição, e Escape devolve foco ao controle que abriu o formulário. Os controles de disponibilidade e edição têm alvos de 44 px nos tamanhos abaixo de 1024 px e de 24 px no desktop. Busca, filtros e ações da toolbar também mantêm alvos adequados e foco visível.

O drawer conserva a transição de 260 ms do admin, desativada com preferência de movimento reduzido. A listagem e seus controles fornecem feedback imediato. O layout administrativo mantém `noindex, nofollow`; a página declara o título “Cardápio | Pápum! Gestão”, descrição e canonical `https://papum.app.br/dashboard/cardapio`.

## Verificações concluídas

No ciclo da implementação, a suíte passou com 59 testes em 11 arquivos. Após o ajuste para montagem síncrona do formulário, os sete testes de `MenuWorkspace` passaram novamente. ESLint, Prettier e build do Next.js 16.3.1 com TypeScript também passaram.

Os 36 checks de Playwright cobriram listagem inicial, busca com acentos, combinação de filtros, estados vazios, disponibilidade por teclado, criação, edição, preço localizado, imagem opcional, validação, cancelamento, foco protegido, Escape, clique fora, restauração dos dados após reload, ajuda, troca entre Pedidos e Cardápio, toolbar compartilhada, drawer, movimento reduzido e formulário no celular. O console não registrou erros.

Um reviewer independente examinou a superfície e as capturas e pediu o escurecimento do placeholder de preço. A correção usa `placeholder:text-stone-500`, e os quatro viewports foram recapturados. Na revisão dessa correção, o mesmo reviewer retornou `verdict: resolved`, contraste de 4,80:1, `remaining: clear` e `disposition: ship`. Esse retorno encerra a correção avaliada; não representa uma nova aprovação integral de toda a superfície.

As evidências visuais e os relatórios de navegador usados no encerramento eram artefatos temporários. Este registro preserva seus resultados em texto, sem depender de links para capturas.

## Diferenças intencionais e limites

Textos pequenos e rótulos em laranja foram escurecidos para contraste. Os alvos de toque e a altura natural dos cards tornam alguns elementos maiores que no frame, preservando legibilidade e interação nos tamanhos menores. Essas adaptações descrevem esta implementação; não instituem novos tokens ou regras globais.

Produtos, textos, preços e imagens são fixtures do Figma. Criação, edição e disponibilidade ficam apenas no estado local até recarregar a página; não há upload, autenticação ou persistência nesta etapa.

O formato anterior de `DESIGN.md`, sem frontmatter de tokens e sem a estrutura canônica de seções, permanece como drift preexistente. Esta extensão comum do admin não autorizou uma migração do documento nem a criação de um sidecar. Nenhum defeito ou diferença específica do cardápio foi canonizado como orientação para outras superfícies.
