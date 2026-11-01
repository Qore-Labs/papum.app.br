# Planejamento: seção de produto e captação da Home

Status: aprovado e implementado na branch `layout-test`. Validação em [home-product-section-validation.md](home-product-section-validation.md). Nenhuma alteração no arquivo do Figma ou publicação nesta execução.

Branch conferida: `layout-test`.

## Direction contract

THESIS: apresentar app com a identidade do restaurante e painel Papum numa composição gráfica única, substituindo a faixa de marcas e o bloco pizza/depoimento. A seção não depende de clientes ou avaliações.

OWN-WORLD: amarelo/laranja dos posts, carvão, tipografia existente e SVGs originais de recibo/sacola e contatos. O raio é uma assinatura de fundo. Botões arredondados e contraste forte.

STORY: o visitante entende o que está sendo preparado e segue para cadastrar interesse no lançamento. As etapas e as métricas das demais seções preservam seu conteúdo.

FIRST VIEWPORT: aproximadamente 60% de apresentação e CTA na área quente; 40% de ilustrações na área carvão. No mobile, texto e botão precedem os dois SVGs.

FORM: composição editorial de duas zonas, escolhida pelo usuário no plano aprovado; execução diretamente em código. Sem sorteio de direção ou comp raster adicional, pois a composição e a referência já foram aprovadas.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Objetivo e limites

Substituir a faixa de parceiros e o bloco de pizza/depoimento por uma apresentação própria da Papum Delivery, que explique o produto e convide donos de restaurantes a acompanhar o lançamento. Recuperar os CTAs de captação da versão de pré-lançamento.

A direção preserva a identidade da landing. O usuário confirmou que as mudanças devem ficar limitadas à seção de parceiros/pizza e aos botões. A composição e os textos do hero, as etapas, o bloco do celular, as métricas, a oferta, o rodapé e a imagem do CTA final ficam fora do redesign e da revisão editorial. Preservar as configurações de SEO, noindex, Clarity, consentimento, formulário e áreas seguras no mobile.

## Diagnóstico da seção atual

- A faixa cinza mistura velocidade de entrega com marcas de restaurantes. Isso pode sugerir marketplace, serviço de entregas ou parcerias existentes.
- O bloco seguinte depende da foto de pizza e do depoimento de Silva’s Pizza para criar interesse. Remover esses elementos sem substituir sua presença visual enfraquece a seção.
- A tentativa anterior de revisão virou uma lista de funcionalidades em fundo branco. A nova proposta precisa manter força gráfica e explicar o produto por meio de imagem vetorial e texto curto.
- Os CTAs atuais falam em planos e uso imediato, embora levem à página de lançamento. A ação deve indicar cadastro de interesse.

## Referência principal: Figma da Papum

Arquivo consultado: [Papum | Posts redes sociais](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/Papum-%7C-Posts-redes-sociais?node-id=0-1).

Frames conferidos por metadados, contexto de design e imagem:

| Frame                                                                                                           | Princípio a adaptar                                                                                    |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [01 — Seu delivery, mais controle](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-22)          | Amarelo/laranja, título forte, texto escuro e raio como assinatura gráfica                             |
| [03 — Sua marca. Seu cardápio.](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-239)            | Explicar a identidade própria do restaurante; usar o fundo neutro como apoio, preservando legibilidade |
| [04 — Pedidos e clientes em um só painel](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-397)  | Fundo carvão e SVGs de recibo/sacola e contatos; benefícios associados a ilustrações específicas       |
| [05 — A marca é sua. A estrutura é Pápum.](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-491) | Síntese do produto: identidade do restaurante + tecnologia e painel Papum                              |
| [06 — Lista de lançamento](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-597)                 | Convite claro ao cadastro por e-mail, adequado ao pré-lançamento                                       |

Os posts são referência de linguagem, assets e hierarquia. A seção será adaptada à leitura horizontal e ao mobile; não será uma captura do carrossel inserida na página. A marca ilustrativa Vila Burger e as fotos de produtos presentes em alguns posts não entram nessa seção.

Referências secundárias atuais, consultadas apenas para estrutura de comunicação:

- [Mailchimp — Marketing Automation](https://mailchimp.com/solutions/marketing-automation-tools/): associar uma mensagem curta a uma composição visual que explica funções do produto.
- [Buffer](https://buffer.com/): ligar cada benefício a uma demonstração visual específica, em vez de imagens decorativas sem relação com o texto.

A paleta e os assets vêm da Papum. As referências externas não serão copiadas.

## Direção recomendada

Uma composição contínua em duas zonas, no lugar dos dois blocos atuais. Ela deve apresentar **o que a Papum está preparando**; a seção seguinte continua responsável por explicar o processo.

### Zona principal: amarelo e laranja

Aproximadamente 60% da largura no desktop, com título, explicação curta, CTA e o raio original como detalhe secundário. Não transformar a área em uma coleção de cards ou uma lista longa.

Texto proposto:

> A marca é sua.
> A estrutura é Pápum.
>
> Estamos preparando um app com a identidade do seu restaurante e um painel para organizar cardápio, pedidos e contatos.
>
> Cadastre seu e-mail para acompanhar o lançamento.

Ação principal: **Quero ser avisado**.

O texto deve deixar claro que é uma plataforma para restaurantes em preparação. “Clientes” nas ilustrações significa organização de contatos do restaurante, nunca prova de clientes que já usam a Papum.

### Zona complementar: carvão

Aproximadamente 40% da largura no desktop, integrada ao mesmo conjunto. Usar os SVGs originais do frame 04, com duas legendas curtas:

- Recibo e sacola: **Pedidos organizados**.
- Cartões de contatos: **Contatos em um só lugar**.

Os SVGs serão elementos visuais centrais, com espaço suficiente para leitura. Sem caixas internas repetidas, telas detalhadas, foto de comida, avaliações ou números de uso. Não haverá um substituto fictício para o antigo cliente do depoimento.

### Cor, tipo e forma

- Amarelo `#ffc400` e laranja até `#ff9500`, conforme a família cromática dos posts; avaliar a transição suave já usada no Figma.
- Carvão `#191817`, texto principal escuro `#1b1c1c`, texto claro `#fffaf2` e apoio `#e4ddd2`.
- Neutro `#ebebe7` apenas na transição externa, se necessário para integrar às seções existentes.
- Manter as fontes já carregadas no site. Usar o caráter forte de Plus Jakarta Sans do post nos títulos, sem importar as medidas fixas de uma arte de Instagram.
- Ajustar os cantos e o espaçamento ao sistema existente; as duas zonas devem parecer uma composição única, não dois anúncios independentes.
- CTA sobre amarelo com fundo carvão e texto claro. Preservar o estilo de botão arredondado da LP.

### Responsividade e interação

- Desktop: título/texto/CTA à esquerda; ilustrações à direita, com proporção inicial 60/40 ajustável pela legibilidade.
- Tablet: manter as duas zonas lado a lado somente enquanto texto e SVGs continuarem confortáveis; empilhar quando necessário.
- Mobile: título, explicação e CTA primeiro, seguidos das duas ilustrações. Sem carrossel ou rolagem horizontal.
- Evitar altura fixa que corte texto e arte. Manter áreas seguras e a paleta do navegador já corrigidas.
- Ilustrações estáticas. Feedback discreto de hover, foco e toque nos botões; movimento reduzido respeitado. Sem dependência nova de animação.

## Plano dos botões

| Ponto                      | Texto planejado             | Comportamento                                                                           |
| -------------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| Item “Planos” da navegação | **Lançamento**              | Abre a página de captação                                                               |
| Header e menu mobile       | **Receber novidades**       | Mesmo destino e intenção                                                                |
| Hero                       | **Acompanhar o lançamento** | Adicionar o CTA da revisão de pré-lançamento, preservando a arte e a composição do hero |
| Nova seção                 | **Quero ser avisado**       | Ação principal do bloco                                                                 |
| CTA final                  | **Quero ser avisado**       | Uma ação principal, substituindo os dois botões com o mesmo destino                     |

Todos mantêm `/lancamento` e a abertura em nova aba já usada pelo projeto. Os rótulos acessíveis devem indicar essa abertura de forma coerente, sem alterar o texto visual desnecessariamente. Preservar a instrumentação de cliques e a identificação do local; os nomes internos atuais de eventos não precisam acompanhar a troca de rótulo.

O formulário continua na página própria, com os estados de envio, verificação, sucesso e erro existentes. Não duplicar o formulário na nova seção.

## Decisão editorial fora do redesign

Decisão confirmada pelo usuário: limitar as mudanças à seção de parceiros/pizza e aos botões. As seguintes referências existentes nas demais seções serão preservadas nesta entrega:

- “Milhares de pessoas já estão pedindo”.
- `+500 restaurantes`, `+50k pedidos/mês`, nota `4.9` e `15 min`.
- “Seu primeiro mês é por nossa conta”.
- Hero “tá no ar” e etapas de escolha de plano/venda, que sugerem uso já disponível.

A explicação de pré-lançamento será aplicada à nova seção e aos rótulos dos botões. Não incluir nesta implementação revisão das métricas, da oferta ou dos textos das outras seções.

## Estratégia técnica aplicada

1. Conferir/exportar os assets originais do Figma na implementação, pois os URLs temporários do MCP expiram. Confirmar proporção e integridade dos dois SVGs, apresentados em áreas de 340 × 255 px no frame 04, e do raio. Conferir também as dimensões originais de cada arquivo exportado.
2. Reaproveitar os componentes e a biblioteca de ícones existentes. Ilustrações compostas podem ser assets locais; ícones de interface novos devem seguir a biblioteca React tipada. Não incorporar dezenas de arquivos separados da logo do Figma quando a marca do projeto já atende.
3. Manter conteúdo repetível tipado em `src/utils/contents/home.ts`, com IDs estáveis. Extrair a seção para um componente de servidor se isso tornar a página mais legível. Não criar estado de cliente para conteúdo estático.
4. Alterar apenas a Home, seus conteúdos, rótulos na configuração e componentes de header/menu necessários aos CTAs. Editar tokens ou estilos somente quando necessários à seção, com escopo local.
5. Preservar `noindex`, canonical, JSON-LD, consentimento, mascaramento do formulário e Clarity. Manter os eventos de CTA sem duplicação.
6. Atualizar seletores de testes existentes quando o rótulo mudar; não criar testes que apenas reproduzam o JSX.

Arquivos prováveis: `app/(site)/page.tsx`, `src/utils/contents/home.ts`, `src/utils/config/site.ts`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav-toggle.tsx`, assets vetoriais locais e testes existentes de marketing/menu.

## Critérios para validar a implementação

- A nova seção não apresenta marcas de parceiros, nomes de restaurantes, depoimentos, estrelas ou números de clientes.
- Em poucos segundos, um visitante entende: app com a identidade do restaurante + painel de gestão + produto em pré-lançamento.
- Os SVGs correspondem aos originais aprovados e continuam legíveis no mobile.
- A mensagem principal, as ilustrações e o CTA formam uma composição com presença visual; não volta a uma lista branca genérica.
- Mudanças visuais e editoriais ficam limitadas ao trecho solicitado e aos botões. Métricas, oferta e textos das outras seções permanecem preservados, conforme a decisão do usuário.
- Conferência em Chromium e WebKit em mobile, tablet e desktop, incluindo capturas, overflow, contraste, teclado, foco, menu e movimento reduzido.
- CTAs continuam chegando à página de lançamento; analytics e consentimento preservados.
- Lint, formatação, tipos, build e verificações de fluxo relevantes aprovados.

A implementação foi concluída na branch `layout-test`, com capturas comparáveis de desktop e mobile. O escopo editorial restrito confirmado pelo usuário foi preservado. Resultados, evidências e limitações constam na validação vinculada acima.
