# Home e entrada do Instagram

Mode: Persuade. Rotas `/` e `/instagram`.

Preservar a identidade Papum e explicar app com a marca do restaurante + painel de cardápio, pedidos e contatos. Cadastro de interesse por e-mail na própria página; sem conta operacional, banco de leads, prova social fictícia ou oferta não confirmada. Login e admin não fazem parte desta superfície.

## Direction contract

O contrato e as decisões confirmadas estão em [home-conversion-redesign-plan.md](../../docs/design/home-conversion-redesign-plan.md#direction-contract). Sua execução é em código a partir do plano e dos assets originais do Figma, sem comp gerado. A validação e as limitações estão em [home-conversion-validation.md](../../docs/design/home-conversion-validation.md).

## Refinamento do header, lettering e conexão app/painel

Extensão local entregue em 01/11/2026, na branch `layout-test`, conforme o [plano do header fixo e lettering](../../docs/design/fixed-header-lettering-plan.md). Herda a identidade e a composição aprovadas da landing, preservando conteúdo, dimensões do header, alinhamentos, cadastro por e-mail e instrumentação. O header compartilhado também atende `/privacidade`, com tema claro.

O header é fixo em todos os tamanhos. No topo, fica transparente sobre o gradiente verdadeiro da hero; ao rolar sobre ela, reproduz o mesmo gradiente opaco de 125° e três cores, na escala e posição da seção. As outras faixas usam creme (`#faf9f5`), carvão (`#191817`), amarelo (`#ffc400`) e neutro do rodapé (`#f0eee7`). Logo, links, menu, CTA e foco acompanham o tema com contraste. A transição de cores dura 200 ms; a inversão de tinta passa por `#757575` em duas fases de 100 ms, usando preto/branco puros durante o percurso. Uma nova mudança interrompe a anterior; movimento reduzido aplica o tema em 0 ms.

`SiteHeaderTheme` retorna `null` e mantém a observação numa ilha pequena de cliente dentro do header de servidor. `IntersectionObserver` usa uma faixa de 2 px na borda inferior do header, e `ResizeObserver` mede a altura real, incluindo safe area. Apenas a hero acompanha a rolagem com listener passivo e `requestAnimationFrame` para alinhar o fundo. As âncoras usam a altura medida; o cadastro recebe mais 16 px e o helper de foco preserva a entrada `/instagram`.

O mesmo controlador sincroniza `theme-color` e o canvas do documento: amarelo inicial na Home e em `/instagram`, creme em `/privacidade`; neutro no canvas quando o rodapé aparece na borda inferior, mesmo se for curto; carvão com o menu aberto e restauração ao fechar. Navegação cliente e substituição de metadados pelo Next reaplicam o estado. O WebKit automatizado valida o motor e esses sinais; barras nativas do Safari em iPhone, overscroll e estados expandidos/recolhidos permanecem sem validação física e sob controle do navegador.

O H1 conserva suas três frases, com Plus Jakarta Sans no peso real 800 e entrelinha 1,04; o layout carrega 700 e 800. O sinal de “+” entre app e painel deu lugar ao `BrandBoltIcon` decorativo (32 × 40 px, `#ff8a00`), com o path arredondado original de `public/home/product/lightning.svg`. Não recebe interação; os controles do FAQ permanecem iguais. Não houve novo raster ou dependência.

Fontes da implementação: `app/(site)/layout.tsx`, `app/globals.css`, `src/components/layout/{header,site-header-theme,main-nav,mobile-nav-toggle,footer}.tsx`, `src/utils/config/site-themes.ts`, `src/lib/focus-signup.ts`, `src/components/home/{landing-page,signup-link}.tsx` e `src/components/ui/icons.tsx`.

A [validação do refinamento](../../docs/design/fixed-header-validation.md) registra 244 unitários aprovados, 28 E2E aprovados e 2 ignorados, com provedores simulados; matriz Chromium/WebKit em 320, 390, 768, 1024 e 1440 px. A [revisão independente](../../docs/design/fixed-header-finish-review.md) examinou os 30 PNGs do header, lettering e símbolo de conexão; a checagem complementar identificou F1 no foco do CTA. Após a correção e a recaptura da mesma matriz, o verdict pass retornou **ship — F1 resolvido**, avaliando exclusivamente a correção listada. Esse fechamento não equivale a uma nova aprovação da landing inteira nem certifica o Safari físico. A alteração continua local, sem publicação.
