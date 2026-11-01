# Validação do header fixo, lettering e raio

Data: 01/11/2026. Branch: `layout-test`. Alteração local, sem commit, push ou deployment nesta execução.

## Escopo executado

O [plano aprovado](fixed-header-lettering-plan.md) mantém a identidade e o conteúdo da landing. O header de `/`, `/instagram` e `/privacidade` agora é fixo. A Home e a entrada do Instagram começam com a navegação transparente sobre o gradiente verdadeiro da hero; durante a rolagem, a superfície opaca reproduz o gradiente na mesma escala e posição. As outras faixas adotam creme, carvão, amarelo e o neutro do rodapé.

As cores estão em `src/utils/config/site-themes.ts`. Conteúdo e header permanecem em Server Components; `SiteHeaderTheme` é uma ilha de cliente sem interface própria. `IntersectionObserver` identifica a faixa junto à borda inferior do header; `ResizeObserver` mede sua altura real, incluindo safe area. Apenas na hero há acompanhamento passivo da rolagem com `requestAnimationFrame`, para alinhar o gradiente, sem renderizações React por pixel.

A interpolação usa três propriedades de cor registradas em CSS. Quando muda a polaridade, passa por `#757575`, inverte a tinta preta/branca nesse ponto e conclui a transição em aproximadamente 200 ms. Eventos de término de uma única propriedade coordenam as fases, evitando encerrar a segunda fase com eventos remanescentes da primeira. Uma nova faixa cancela a fase pendente. Movimento reduzido ou ausência de registro de propriedades aplica o tema diretamente.

O controlador também atualiza `theme-color` e o canvas do documento. Quando o rodapé aparece na borda inferior, o canvas assume `#f0eee7`, mesmo que a faixa curta ainda não alcance o header. O menu aberto usa carvão e restaura o tema ao fechar. Mudanças de rota, substituição de metadados pelo Next, restauração da página e redimensionamento atualizam as medições.

As âncoras compensam a altura real do header; o formulário recebe mais 16 px. O helper compartilhado de cadastro conserva `/instagram`, rola para o formulário e foca o e-mail sem uma segunda rolagem. O menu executa isso depois de fechar.

O H1 usa Plus Jakarta Sans no peso real 800, com entrelinha 1,04 e as três frases preservadas. O raio decorativo reutiliza o path arredondado original de `public/home/product/lightning.svg`, em um componente SVG tipado da biblioteca existente. Mede 32 × 40 px, é laranja `#ff8a00`, tem `aria-hidden` e não recebe foco, hover ou clique. Os controles de expandir o FAQ continuam iguais.

## Verificações

`format:check` passou no repositório completo. O foco do CTA também foi conferido por teclado com hover simultâneo nos dois motores: contorno sólido de 2 px, recuo externo de 4 px, tinta escura sobre hero/creme e clara sobre carvão.

| Verificação                                    | Resultado                                                                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unitários                                      | 244 aprovados, em 29 arquivos                                                                                                                              |
| Build normal de produção                       | Aprovado, incluindo TypeScript; refeito após os testes com configuração simulada                                                                           |
| Lint                                           | Aprovado, com limite de zero avisos                                                                                                                        |
| E2E em build de produção, provedores simulados | 28 aprovados; 2 ignorados porque o menu mobile não aparece em desktop/tablet                                                                               |
| Matriz visual e funcional Chromium + WebKit    | 320, 390, 768, 1024 e 1440 px, altura 1000 px                                                                                                              |
| Responsividade                                 | Sem overflow horizontal; H1 em três frases; campo e foco abaixo do header                                                                                  |
| Navegação                                      | Cadastro na mesma landing; entrada Instagram preservada; menu abre/fecha; Privacidade por navegação cliente com tema correto                               |
| Movimento reduzido e sistema escuro            | Temas legíveis e sem interpolação do header                                                                                                                |
| Contraste durante transições normais           | Chromium: 215 amostras; WebKit: 186. Mínimo dos links e CTA: 4,5577:1; nenhuma amostra abaixo de 4,49:1                                                    |
| Interrupções rápidas entre faixas              | Chromium: 61 amostras; WebKit: 46, com saltos a cada 60 ms. Nenhuma amostra abaixo de 4,49:1                                                               |
| Console                                        | Zero erros de página na matriz. Aviso de LCP do SVG decorativo já existente em desenvolvimento; o aviso do canvas de medição foi eliminado no script de QA |
| Detector de design, uma execução               | Um aviso no fallback Arial já existente; sem troca da tipografia aprovada da marca                                                                         |

O teste E2E adicionado cobre posição fixa, peso 800, raio decorativo, tema escuro, canvas do rodapé, foco do cadastro e substituição de `theme-color` ao abrir Privacidade. Não envia e-mails reais nem grava eventos nos provedores durante a validação.

A [revisão independente](fixed-header-finish-review.md) inspecionou os 30 PNGs e os arquivos alterados no recorte de header, lettering e raio. A conferência final de teclado abriu F1, sobre o contraste externo do foco do CTA. Após a correção, a mesma matriz foi recapturada e o verdict pass retornou **ship — F1 resolvido**. Esse último parecer avalia a correção listada e não substitui a validação em Safari físico.

## Capturas

As capturas finais estão em `output/playwright/fixed-header/{chromium,webkit}/`, diretório ignorado pelo Git. Todos os 30 arquivos foram abertos para conferir carregamento e conteúdo antes da revisão independente:

- `hero-{320,390,768,1024,1440}.png`: hero completa a partir do topo.
- `dark-{320,390,768,1024,1440}.png`: header e seção escura alinhada abaixo dele.
- `product-{390,1440}.png`: raio e composição da seção clara.
- `privacy-{390,1440}.png`: rota de privacidade com header claro.
- `menu-mobile.png`: menu totalmente aberto, após a entrada terminar.

O WebKit de desktop usa uma barra de rolagem com largura de 6 px: no viewport de 768 px, o breakpoint existente mantém a composição mobile. Ambos os layouts permanecem legíveis e sem overflow.

## Limites

Após a correção do foco, a mesma matriz foi recapturada no build normal de produção, servido localmente na porta 3101; as capturas desktop mostram o CTA focado. O servidor de desenvolvimento na porta 3000 ainda entregava a folha anterior à última correção, por isso não foi usado como evidência dessa correção. No WebKit, o script aguarda o prefetch antes de carregar a próxima rota/tamanho: recarregar imediatamente a página anterior gerava mensagens de cancelamento de fetch na automação. A rodada final completa terminou sem erros de página, sem filtrar mensagens.

WebKit automatizado verifica o motor, CSS e sinais fornecidos ao navegador; não certifica a aparência da barra nativa em um iPhone físico. Safari pode escolher como aplicar `theme-color`, amostrar as bordas do documento e animar sua interface, conforme a versão e as preferências do aparelho. Uma única meta representa uma cor sólida; o site não controla um gradiente nativo independente em cada borda.

O site continua sem indexação. Formulário, envio por e-mail, instrumentação e preferências de privacidade preservam o comportamento anterior. Nenhum novo raster ou dependência foi adicionado.
