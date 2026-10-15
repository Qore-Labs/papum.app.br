# Validação das interações do admin

Registro da entrega em 14 de outubro de 2026. Ações de clientes, notificações, perfil e ajuda/suporte estendem o admin existente no modo Operate.

## Escopo preservado

O ajuste mantém a identidade, os conteúdos e a composição administrativa existentes. `PRODUCT.md` e `DESIGN.md` foram preservados, sem migração de formato, sidecar ou nova regra global. Não houve mudança de rotas, backend, assets ou dependências.

`AdminPopover` concentra a interação em uma fronteira cliente pequena; o conteúdo estático continua recebido por composição. O componente usa a API nativa de popover, e o cálculo de posição fica na função pura `getPopoverPosition`.

## Posição e interação

O menu fica a 8 px do botão e mantém margem de 12 px da área visível. Abre abaixo quando cabe ou há mais espaço disponível nesse lado; caso contrário, abre acima. A posição horizontal é limitada à viewport, e painéis altos recebem altura máxima e rolagem interna. A medição invisível antes da abertura posiciona a primeira pintura junto ao acionador.

Enquanto aberto, o painel acompanha scroll, resize, `visualViewport` e mudanças de dimensão, com atualizações agrupadas por `requestAnimationFrame`. Fecha quando o botão sai da área visível. Os listeners e o `ResizeObserver` são removidos ao fechar.

Controles acionáveis ativos do admin usam cursor `pointer`; campos de escrita mantêm cursor de texto e controles desabilitados ficam excluídos dessa regra.

## Movimento e acessibilidade

A entrada e a saída combinam fade com deslocamento de 8 px orientado pelo botão e pelo espaço disponível, em 180 ms com a curva de saída existente. Com `prefers-reduced-motion`, o deslocamento é removido e permanece um fade de 100 ms.

Os painéis têm título acessível, botão de fechar e foco visível. A abertura leva o foco ao botão de fechar com `preventScroll`; Escape, clique fora e retorno de foco seguem o comportamento nativo. Na saída, o painel fica `inert` e sem eventos de ponteiro, evitando ações em conteúdo visualmente oculto.

## Verificações concluídas

A suíte final passou com 110 testes em 17 arquivos, incluindo sete testes do cálculo e três do componente com a API nativa simulada no jsdom. ESLint, Prettier, TypeScript e build do Next.js 16.3.1 passaram.

O Playwright CLI conferiu a versão de produção local em quatro tamanhos:

| Viewport   | Contexto principal      |
| ---------- | ----------------------- |
| 1280 × 900 | Desktop                 |
| 768 × 1024 | Tablet                  |
| 390 × 844  | Mobile                  |
| 320 × 500  | Mobile com pouca altura |

Os 76 checks em 12 contextos passaram, com zero erros de console. Cobriram menus do shell e de clientes, toolbar, suporte no drawer, inversão para cima e deslocamento lateral, scroll e resize, fechamento ao sair da visão, Escape, clique fora, teclado, Tab, retorno de foco, reabertura rápida, edição de cliente no mobile, conteúdo longo, movimento reduzido, cursores e ausência de overflow horizontal nos tamanhos conferidos.

Nove capturas finais e o relatório de navegador sustentaram a conferência do autor e do reviewer independente. As evidências são temporárias; os resultados ficam registrados aqui sem links para arquivos que serão removidos.

## Revisão e limites

O reviewer independente encerrou com `disposition: ship`, `persistence: pass`, fidelidade correspondente à interface existente com adaptações de rolagem e movimento reduzido, `ceilingReached` e nenhuma correção material pendente. A revisão abrangeu os estados e tamanhos registrados; não representa uma auditoria formal ou exaustiva do admin ou do código.

O detector foi executado uma vez e apontou somente um aviso sobre Arial no `body` global preexistente, fora da tipografia administrativa. Esse trecho permaneceu preservado e não foi canonizado como orientação. Avisos preexistentes de preload do Next.js não foram erros de console. A documentação usa as verificações já concluídas, sem repetir detector, navegador ou testes.
