# Header fixo adaptativo e lettering da hero

Planejamento: 31/10/2026. Execução autorizada pelo usuário e implementada em 01/11/2026 na branch `layout-test`, sem publicação. Ver [validação](fixed-header-validation.md) e [revisão visual](fixed-header-finish-review.md).

## Direção

Preservar a linguagem gráfica da Papum e a continuidade entre header e hero. O header permanece visível durante toda a navegação, muda de superfície conforme a faixa da página e mantém logo, links, menu e CTA legíveis. O título ganha densidade e personalidade sem trocar a identidade tipográfica da landing.

Aplicar o comportamento à Home e à entrada `/instagram`. Como o header é compartilhado com `/privacidade`, essa rota recebe o mesmo posicionamento fixo com tema claro. Login, dashboard e a campanha independente `/lancamento` mantêm seus layouts próprios.

Referências de repertório consultadas: [Linear](https://linear.app/), pela separação clara entre navegação de produto e ação de cadastro; [Apple — iPhone](https://www.apple.com/iphone/), pela hierarquia entre apresentação do produto e ações curtas. A autoridade visual da solução é a identidade Papum já implementada e os posts originais registrados no plano da landing.

## 1. Header sempre visível e sem bordas

- Trocar o posicionamento absoluto por fixo, em desktop, tablet e mobile. Preservar dimensões, alinhamentos, largura do conteúdo, logo, navegação e CTA atuais.
- No topo da hero, manter o fundo transparente: o gradiente verdadeiro da seção continua por trás do header, sem linha, sombra ou recorte que separe as áreas.
- Ao começar a rolar, introduzir uma superfície que impeça o texto e as ilustrações da página de atravessarem a navegação. Enquanto estiver sobre a hero, reproduzir o mesmo gradiente e seu alinhamento, evitando a emenda de duas faixas de amarelo diferentes.
- Nas demais seções, usar a cor da superfície principal da faixa. O header acompanha o fundo da seção, não as cores dos cards, imagens ou ilustrações dentro dela.
- Permanecer visível tanto ao descer quanto ao subir; manter altura estável durante a rolagem.

## 2. Cores e contraste

| Faixa                         | Superfície do header                                     | Logo, navegação e menu | CTA                      |
| ----------------------------- | -------------------------------------------------------- | ---------------------- | ------------------------ |
| Hero                          | Transparente no topo; continuidade do gradiente ao rolar | Tinta escura           | Carvão com texto claro   |
| Produto, dado comercial e FAQ | Creme `#faf9f5`                                          | Tinta escura           | Carvão com texto claro   |
| Recursos / “Menos espalhado”  | Carvão `#191817`                                         | Creme claro            | Amarelo com texto escuro |
| Chamada final                 | Amarelo `#ffc400`                                        | Tinta escura           | Carvão com texto claro   |
| Rodapé                        | Neutro quente `#f0eee7`                                  | Tinta escura           | Carvão com texto claro   |
| Privacidade                   | Creme `#faf9f5`                                          | Tinta escura           | Carvão com texto claro   |

Centralizar essas combinações em temas explícitos. Substituir as cores fixas do logo, links e botão do menu pelas cores do tema ativo. Incluir hover, foco, estado pressionado, setas e ícones; preservar a paleta própria do diálogo mobile quando ele estiver aberto. Escopar as variantes do CTA ao header para preservar os botões das demais seções.

Meta de contraste: texto e rótulos pequenos com pelo menos 4,5:1; ícones e indicadores de foco com contraste adequado. Conferir também o percurso entre os temas. Interpolar texto escuro para claro ao mesmo tempo que o fundo escurece pode criar um intervalo ilegível: coordenar o momento da inversão com a luminância da superfície e usar cores seguras durante a passagem.

## 3. Transições e detecção das seções

- Usar transições CSS curtas, inicialmente em 200 ms, com a curva de saída já existente no projeto. Para a entrada/saída do gradiente, usar camadas de fundo com opacidade, pois gradientes não devem depender de uma troca discreta de `background-image`.
- Uma nova mudança deve interromper a anterior e partir do estado visual atual. Não formar uma fila de animações em rolagem rápida.
- Definir uma linha de detecção de 1–2 px junto à borda inferior do header, com pequena margem de estabilidade para evitar alternância repetida na mesma divisa. Usar a faixa que cruza essa linha, não a maior seção visível da tela. Conferir a direção de subida e descida.
- Observar as faixas com `IntersectionObserver` e medir a altura real do header com `ResizeObserver`, incluindo safe area. Marcar as seções com seu tema, sem varrer todos os elementos para adivinhar cores.
- Se a continuidade exata do gradiente exigir acompanhar sua posição, limitar essa atualização à hero, com listener passivo e `requestAnimationFrame`, atualizando apenas a camada de fundo. Não renderizar componentes React a cada pixel rolado.
- Respeitar `prefers-reduced-motion`: remover a interpolação e aplicar o tema correto diretamente.
- Fornecer aparência inicial correta no HTML/CSS e fallback legível sem JavaScript. Tratar carregamento direto com âncora, restauração da posição pelo navegador, mudança de rota e retorno à página.

## 4. Lettering da hero

Preservar o texto e sua leitura em três linhas:

> Seu delivery.
> Menos bagunça.
> Mais controle.

- Manter Plus Jakarta Sans e adicionar seu peso real **800** ao carregamento das fontes. Hoje a família está carregada apenas em 700; evitar negrito sintetizado pelo navegador.
- Ajustar entrelinha, espaçamento entre letras e largura do bloco para que o conjunto fique mais compacto e dialogue com a densidade da logo. Começar com entrelinha entre 1,02 e 1,05 e tracking entre −0,03 e −0,04 em, validando opticamente.
- Manter a cor de destaque de “Mais controle.” e conferir o equilíbrio com as duas linhas anteriores.
- Priorizar peso e desenho das letras antes de aumentar o tamanho. Preservar espaço para explicação, campo de e-mail e arte. Nas telas menores, ajustar a escala para manter as três frases sem corte ou uma quarta linha involuntária.
- Texto permanece como H1 real, selecionável e acessível, com dimensões estáveis durante o carregamento da fonte.

## Complemento: símbolo entre app e painel

O usuário apontou que o sinal de “+” entre “Na mão do cliente” e “Na sua operação” parece um controle clicável. A preferência é por um elemento mais encorpado e alaranjado, integrado à composição.

- Direção recomendada para validação: substituir o “+” por um **raio sólido laranja Papum**, com o desenho arredondado original dos posts, já reutilizado na hero. A silhueta da marca reforça a ligação entre as duas partes do produto.
- Usar largura visual aproximada de 28–32 px, com ajuste óptico no espaço atual. Preservar a proporção original e o alinhamento do grid; no mobile, conferir a posição entre os dois blocos empilhados.
- Manter o símbolo solto no fundo da seção, sem cápsula, círculo, contorno, sombra ou fundo de botão. Estático, sem hover, foco ou cursor de ação; tratá-lo como decoração acessível (`aria-hidden`).
- Reutilizar o path original em um componente SVG tipado da biblioteca existente. O `LightningIcon` atual tem outro contorno, mais pontudo; para esta proposta, a referência é o raio arredondado de `public/home/product/lightning.svg`.
- Conferir o conjunto com os ícones do restaurante, logo, textos e espaços. O elemento deve conectar as colunas sem competir com elas ou repetir o sinal usado nos controles expansíveis do FAQ.

Proposta aprovada e aplicada à interface em 01/11/2026. O raio decorativo original está no componente `BrandBoltIcon`; validação e limites constam no relatório desta execução.

## 5. Integração e cuidados

- Manter o header estrutural e a landing em Server Components; isolar observação e estado dos temas em uma ilha pequena de cliente.
- Reservar espaço suficiente na hero e nas páginas claras para a altura do header, inclusive com notch. Atualizar offsets de âncoras e rolagem de foco para não encobrir títulos, campo de e-mail ou mensagens de formulário, sem somar a mesma compensação em `scroll-padding` e `scroll-margin`.
- Preservar menu mobile, Escape, clique externo, bloqueio da rolagem, retorno do foco e a prioridade do diálogo. Preferências de privacidade também devem continuar acessíveis.
- Manter os CTAs na mesma página e a origem `/instagram`, assim como a instrumentação e o `noindex` existentes.
- Não adicionar dependência de animação. Não alterar textos, outras seções, formulário ou serviços de coleta como parte desta revisão.

Arquivos principais previstos: `header.tsx`, `main-nav.tsx`, `mobile-nav-toggle.tsx`, `signup-link.tsx`, um controlador pequeno de tema, `landing-page.tsx`, `footer.tsx`, `app/globals.css` e o carregamento de fontes em `app/(site)/layout.tsx`.

### Complemento: fundo e barras do Safari

O usuário identificou que o entorno do Safari permanece laranja em todas as seções. Há duas definições fixas no código atual: `themeColor: "#fb8d01"` no layout do site e o fundo de `html:has([data-site-shell])` vinculado à cor laranja do header antigo. O plano passa a incluir sua sincronização com os temas da página.

- Reutilizar o mesmo controlador de temas do header para atualizar a cor do canvas da página (`html`/`body`), as áreas seguras e a indicação `theme-color` nos navegadores que a utilizam. Não criar outro observador com um tema concorrente.
- Definir a aparência inicial no servidor: amarelo da hero na Home e em `/instagram`, creme em `/privacidade`. Durante a rolagem, acompanhar a paleta da tabela: creme, carvão, amarelo e neutro do rodapé, sem manter a faixa laranja em todas elas.
- Tratar a cor de `theme-color` como uma cor sólida representativa da seção. A continuidade exata do gradiente pertence à página e ao header; a interface nativa do navegador não recebe um gradiente por essa indicação.
- Revisar as regras fixas de canvas, inclusive o override branco de ponteiro fino, para não anularem o tema dinâmico. Preservar a scrollbar fina e as regras próprias do admin/login, restaurando o estado ao sair do site público.
- Manter `viewport-fit=cover`, os quatro safe-area insets e o esquema de cores atual do conteúdo. Conferir notch, indicador inferior, rotação e overscroll no início e no fim da página. Ao abrir o menu mobile de tela inteira, alinhar a superfície ao carvão do diálogo e restaurar o tema da seção ao fechar.
- Atualizar a indicação existente ao mudar de tema, sem acumular metas conflitantes ou reescrevê-la a cada frame da animação. `viewport`/`generateViewport` são APIs de servidor do Next; a sincronização por scroll pertence ao controlador cliente. Reaplicar o estado após mudança de rota, retorno pelo histórico e restauração de rolagem.
- Suavizar as superfícies da página junto com o header. A atualização das barras, seus efeitos de translucidez e a cor dos ícones nativos ficam a cargo do Safari; não prometer a mesma duração de 200 ms ou controle independente de cada barra pelo site.

Compatibilidade: o [WebKit documenta `theme-color` desde o Safari 15](https://webkit.org/blog/11989/new-webkit-features-in-safari-15/). Relatos técnicos do Safari 26 mostram influência do fundo da página e de elementos fixos, inclusive uma [regressão ao voltar/navegar entre páginas](https://bugs.webkit.org/show_bug.cgi?id=305546). Por isso, alterar apenas a meta é insuficiente como estratégia. A solução deve cuidar também do canvas e das áreas efetivamente pintadas nas bordas.

Conferir o comportamento em Safari de iPhone real: barras expandidas/recolhidas, rolagem nas duas direções, menu aberto/fechado, retorno pelo histórico, tema claro/escuro do aparelho e seções diferentes ocupando as bordas superior e inferior. Em versões que derivam a cor das bordas visíveis, preservar essa adaptação natural. Testes Playwright/WebKit validam os sinais da página e o layout, mas não reproduzem a interface nativa do Safari; sem um aparelho disponível, essa parte permanece registrada como validação pendente.

## 6. Ordem de execução e aceite

1. Definir os temas e preparar o header fixo, offsets e estados de foco.
2. Implementar observação das faixas, continuidade da hero, transições coordenadas e sincronização do canvas/indicação de cor do navegador.
3. Aplicar o peso 800 real e refinar o título nos tamanhos previstos.
4. Validar a página completa em Chromium e WebKit a 320, 390, 768, 1024 e 1440 px. Conferir scroll lento/rápido nas duas direções, divisas das seções, topo, rodapé, reload no meio da página, âncoras, rotação, zoom, menu, teclado, safe area e movimento reduzido.
5. Rodar lint, formatação, tipos/build e testes relevantes do tema, âncoras e menu, com um teste de navegador confirmando header fixo e legível ao atravessar uma seção escura.
6. Conferir o build de produção e registrar capturas. Uma futura publicação deve incluir a correção de cache já preparada; o preview remoto precisa ser conferido após seu novo build.

Aceite visual: no topo, header e hero formam uma superfície contínua; durante a navegação, o header permanece visível e legível, sem piscadas, trocas bruscas, conteúdo atravessando os links ou oscilação nas divisas. O entorno do navegador recebe sinais coerentes com a seção, sem uma cor laranja permanente imposta pelo site. O novo título tem mais peso e preserva a leitura, a conversão e o equilíbrio com a marca.
