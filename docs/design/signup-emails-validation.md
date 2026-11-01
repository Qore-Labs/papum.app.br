# E-mails de cadastro: implementação e validação

Data: 01/11/2026. Branch `layout-test`. [Planejamento aprovado](signup-emails-redesign-plan.md). Sem commit, push, deployment ou envio de mensagens reais nesta execução.

## Resultado

A [revisão visual independente](signup-emails-finish-review.md) retornou **ship**, sem correções materiais, no escopo dos dois templates e dos fallbacks demonstrados. Esse parecer não certifica clientes de e-mail reais.

Os e-mails adotam o amarelo, creme, carvão e o raio laranja arredondado da landing. A base compartilhada mantém uma coluna principal de até 560 px, estilos essenciais inline, tabelas de apresentação e alternativa em texto simples. Cabeçalho, título e assinatura têm variações explícitas para cada destinatário.

A confirmação apresenta o recebimento e o próximo passo em primeiro lugar, a frase do produto e uma pequena ilustração original de pedido, seguida de “Acompanhar no Instagram”. O rodapé mantém Instagram e site com ícones e rótulos, além da orientação real de cancelamento por resposta.

O aviso interno apresenta título, e-mail do interessado, origem validada e “Responder ao interessado”. Não herda a assinatura acolhedora do cliente. O `mailto:` e o `reply_to` continuam levando ao interessado; a confirmação mantém o `reply_to` do remetente configurado. Remetente, destinatário interno, tags, lote de duas mensagens, validação/Turnstile e escape de HTML foram preservados. Os assuntos foram atualizados intencionalmente conforme o plano aprovado.

Conteúdo está em `src/utils/contents/launch-emails.ts`; apresentação em `src/lib/email/launch-templates.ts`. Não há novos campos de cadastro ou data variável no corpo: e-mail e origem continuam sendo os únicos dados do interessado no envio. O teste de idempotência confirma payload e chave estáveis para tentativas equivalentes.

## Assets

| PNG novo                             | Fonte original                                                                    | Exportação / exibição        |
| ------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------- |
| `public/email/papum-logo-yellow.png` | `LogoWhite`, `src/components/ui/icons.tsx`, com tinta `#1b1c1c` e fundo `#ffc400` | 456 × 177 / 152 × 59 px      |
| `public/email/papum-orders.png`      | `public/home/product/orders.svg`, Figma frame `30:397`, camada `30:445`           | 420 × 315 / até 140 × 105 px |
| `public/email/papum-bolt.png`        | `BrandBoltIcon`, path original do raio arredondado, em `#ff8a00` sobre `#ffc400`  | 84 × 105 / 28 × 35 px        |

Exportados dos vetores com Sharp já disponível na dependência do Next, sem instalar dependência nem gerar outra ilustração. A logo e o raio têm o mesmo fundo amarelo do cabeçalho como área de proteção. A ilustração usa o creme do corpo e conserva proporção 4:3. Os PNGs estão ligados por URLs HTTPS absolutas da configuração do site.

A origem foi incorporada aos metadados dos seis PNGs em `public/email/`. Nos três assets anteriores (`papum-logo.png`, `instagram.png`, `website.png`), a mudança é somente de proveniência, preservando pixels e caminhos para e-mails anteriores. A licença do Instagram foi mantida. A varredura final encontrou seis rasters e nenhum sem proveniência.

A exportação e as prévias foram preparadas pelo script local ignorado `output/playwright/email-redesign/prepare.txt`. A opção `--previews-only` regenera apenas as amostras HTML/texto, preservando os metadados dos PNGs. Os novos assets precisam acompanhar o deployment dos templates para que seus URLs públicos estejam disponíveis em envios de produção.

## Verificações

| Verificação                         | Resultado                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Testes do fluxo de e-mail           | 15 aprovados: origem validada, destinatários/Reply-To, lote, verificação, erros, escape e idempotência |
| Build de produção                   | Aprovado, incluindo TypeScript                                                                         |
| Lint                                | Aprovado, zero avisos                                                                                  |
| Matriz de navegador                 | Chromium e WebKit, ambos os templates a 320, 390, 560 e 768 px                                         |
| Imagens normais                     | Cinco na confirmação, quatro na notificação; todas carregadas                                          |
| Responsividade                      | Sem overflow horizontal; endereços longos conferidos a 320 px                                          |
| Imagens bloqueadas                  | Conteúdo, identificação textual da marca e ações continuam disponíveis a 390 px                        |
| CSS do cabeçalho removido           | Fallback apenas com inline, ambos os templates a 320 px, sem overflow                                  |
| Preferência de sistema escuro       | Canvas claro preservado nos dois motores; não equivale à inversão de cores de um cliente de e-mail     |
| Teclado e ações                     | Foco visível de 2 px; Instagram oficial e `mailto:` conferidos sem abrir aplicações externas           |
| Contraste dos textos/links          | Mínimo medido de 6,278:1 nos dois templates e motores                                                  |
| Alvos de toque                      | Links de rodapé acima de 45 px e CTA de 48 px no layout normal                                         |
| HTML enviado, sem imagens embutidas | Confirmação: 6.473 bytes; notificação: 6.231 bytes                                                     |
| Console de execução                 | Nenhum erro de página; falhas de rede de imagens são intencionais somente nos cenários de bloqueio     |

O único aviso do detector de design foi o uso de Arial. A fonte foi mantida como escolha deliberada de compatibilidade de e-mail, já prevista no plano. A marca é transmitida pela logo original, paleta, composição e hierarquia, sem depender de webfonts.

O bloco ilustrado tem largura proporcional de 30% no desktop e empilha no mobile. Essa proporção também permite que a mensagem continue utilizável em uma caixa estreita que ignore media queries; a imagem pode ficar menor e o texto mais longo nesse fallback.

## Prévias e capturas

Em `output/playwright/email-redesign/`, ignorado pelo Git:

- `confirmation.html` e `notification.html`: prévias locais com imagens incorporadas apenas para inspeção, sem requests externos.
- `confirmation-source.html` e `notification-source.html`: HTML real com URLs HTTPS das imagens.
- `confirmation.txt` e `notification.txt`: versões em texto simples.
- `long-address.html`: amostra com endereço extenso.
- `origins.json`: versões em texto do aviso interno para as três origens válidas.
- Capturas de cada motor: `{engine}-{confirmation,notification}-{320,390,560,768}.png`, `{engine}-long-320.png`, `{engine}-{confirmation,notification}-blocked.png` e `{engine}-{confirmation,notification}-inline-only.png`.

As 26 capturas finais foram abertas e conferidas antes da revisão independente. Os indicadores de imagem indisponível nos arquivos `blocked` fazem parte do cenário, mantendo texto e ação; os arquivos `inline-only` mostram deliberadamente o fallback sem stylesheet. Nenhuma mensagem real foi enviada e as prévias usam endereços fictícios `.example`/`example.com`.

## Limites

Não houve acesso a Gmail, Apple Mail ou Outlook reais nesta execução. Chromium e WebKit verificam o HTML e os fallbacks descritos; não certificam sanitização, inversão automática de cores, modo escuro ou comportamento de cada aplicativo de e-mail. A aparência nesses clientes precisa de conferência em ambiente/caixas de teste disponíveis antes de afirmar compatibilidade integral.

O fluxo continua enviando dois e-mails pelo provedor existente, sem banco de leads ou contagem de pessoas únicas. Aceitação do lote não é comprovação de entrega na caixa de entrada.
