## Disposition

**ship** — revisão completa dos dois templates de e-mail no escopo aprovado em `signup-emails-redesign-plan.md`. Nenhuma lacuna material exige correção nas evidências inspecionadas.

Revisão independente, sem navegador e sem alterações de implementação. O parecer cobre a extensão da identidade existente da landing para confirmação de cadastro e notificação interna. Não inclui as alterações pendentes de header/privacidade, publicação, envio real ou certificação de clientes de e-mail.

## Evidence inspected

Autoridades lidas: `PRODUCT.md`, `DESIGN.md`, `docs/design/signup-emails-redesign-plan.md` e as referências `new-work.md`, seção 7, e `craft-floor.md` da skill Impeccable. Implementação e diff lidos: `src/lib/email/launch-templates.ts` e `src/utils/contents/launch-emails.ts`. Conferidos também os rótulos de origem em `src/utils/config/attribution.ts`.

Base absoluta das capturas: `C:/Dev/binary/papum.app.br/output/playwright/email-redesign/`. Abri individualmente as 26 imagens abaixo; todas mostram o documento desde o topo, com a mensagem e o rodapé completos, sem captura vazia, seção errada ou conteúdo parcialmente carregado:

| Engine   | Confirmação                                                                                                                        | Notificação                                                                                                                        | Estados adicionais                                                                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chromium | `chromium-confirmation-320.png`, `chromium-confirmation-390.png`, `chromium-confirmation-560.png`, `chromium-confirmation-768.png` | `chromium-notification-320.png`, `chromium-notification-390.png`, `chromium-notification-560.png`, `chromium-notification-768.png` | `chromium-long-320.png`, `chromium-confirmation-blocked.png`, `chromium-notification-blocked.png`, `chromium-confirmation-inline-only.png`, `chromium-notification-inline-only.png` |
| WebKit   | `webkit-confirmation-320.png`, `webkit-confirmation-390.png`, `webkit-confirmation-560.png`, `webkit-confirmation-768.png`         | `webkit-notification-320.png`, `webkit-notification-390.png`, `webkit-notification-560.png`, `webkit-notification-768.png`         | `webkit-long-320.png`, `webkit-confirmation-blocked.png`, `webkit-notification-blocked.png`, `webkit-confirmation-inline-only.png`, `webkit-notification-inline-only.png`           |

Os arquivos `blocked` são testes intencionais de bloqueio: os indicadores nativos de imagem ausente e o texto alternativo não invalidam essas capturas. Nos arquivos `inline-only`, a ausência de media queries produz uma coluna de texto mais estreita e uma ilustração reduzida; todo o conteúdo e as ações continuam visíveis. Esse fallback não foi confundido com a composição mobile principal, que empilha a arte corretamente.

Abri os três novos PNGs em `public/email/`: `papum-logo-yellow.png`, `papum-orders.png` e `papum-bolt.png`. Conferi os HTMLs de origem `confirmation-source.html` e `notification-source.html`, os arquivos `confirmation.txt` e `notification.txt`, `origins.json` e o roteiro `inspect.txt` no diretório de evidências. O HTML de envio usa URLs HTTPS absolutas; as capturas de prévia usam os assets locais incorporados pelo construtor da prévia.

O pacote do construtor informa: 15 testes existentes do fluxo aprovados, lint aprovado, matriz sem overflow nem page errors, carregamento de 5/4 imagens e alvos de links medidos em pelo menos 45 px. Esses resultados foram recebidos, não executados novamente pelo revisor. O build final ainda estava sob responsabilidade do construtor ao iniciar esta revisão. O único aviso remanescente do detector é a família Arial, mantida deliberadamente pela compatibilidade de e-mail prevista no plano.

## Before / After / Why

O estado anterior abaixo foi conferido pelo diff do código, sem alegar uma comparação visual com capturas anteriores.

| Before                                                                                     | After                                                                                                                                    | Why                                                                                                          |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Contêiner branco, logo colorida e ação laranja.                                            | Campo amarelo, logo original escura, corpo creme e ação carvão em pílula.                                                                | Reconhece a landing e preserva uma assinatura própria da Papum na caixa de entrada.                          |
| Confirmação distribuída entre saudação, recebimento, explicação e agradecimento repetidos. | Acolhimento no título, recebimento e próximo passo no primeiro parágrafo, apresentação breve do produto e convite opcional ao Instagram. | Torna a situação do cadastro compreensível antes do conteúdo secundário.                                     |
| Notificação compartilhava o encerramento acolhedor da confirmação.                         | E-mail e origem entre divisores, ação de resposta e instrução direta, sem assinatura promocional.                                        | Prioriza o trabalho da equipe e evita misturar os objetivos das duas mensagens.                              |
| Assunto interno descrevia o contato como cliente interessado nos serviços.                 | Assunto descreve um novo cadastro de interesse.                                                                                          | Corresponde ao produto em pré-lançamento e aos dados efetivamente recebidos.                                 |
| Confirmação sem reforço visual específico do produto.                                      | Pequena arte original de pedidos; raio arredondado e logo originais na assinatura visual.                                                | Amplia o reconhecimento da marca sem inventar uma nova identidade nem transformar texto essencial em imagem. |

## Quality-bar assessment at approved scope

A extensão atende ao contrato code-led aprovado. A autoridade visual é a landing existente, não uma nova proposta de marca ou um comp gerado. Amarelo, creme, carvão, logo original, arte de pedidos, raio arredondado e pílulas aparecem com hierarquia coerente e sem caixas repetidas envolvendo cada trecho.

A confirmação explica recebimento e disponibilidade antes do produto e do convite opcional. O aviso de cancelamento manual permanece legível no encerramento. A notificação destaca o endereço selecionável/clicável e a origem antes do CTA; não inclui despedida ao interessado. Os dados continuam limitados a e-mail e origem validada, sem contagem, prazo, nome ou benefício inventado.

Nas larguras principais de 320, 390, 560 e 768 px, a escala de títulos, o corpo de 16 px e a separação entre grupos sustentam a leitura. Não há corte de texto ou overflow visível. O endereço longo quebra dentro da área de dados. A composição ampla aproxima arte e explicação; a principal mobile empilha os elementos. O fallback sem `<style>` conserva a leitura com menor refinamento, dentro do critério progressivo aprovado.

Contrastes calculados das cores de origem: tinta/amarelo **10,69:1**, tinta/creme **16,21:1**, apoio/creme **6,28:1**, apoio/entorno **5,70:1** e texto claro/ação carvão **17,06:1**. Títulos, corpo e controles são texto real. Imagens decorativas têm alternativa vazia; a marca tem identificação textual. Links têm rótulos explícitos; o código fornece foco visível onde o cliente preserva essa regra. Sem animação ou movimento a auditar neste artefato. Arial/Helvetica constitui a exceção explícita de compatibilidade do plano, não uma falha de direção tipográfica.

O fonte preserva tabelas de apresentação, estilos essenciais inline, texto simples, escape do conteúdo, resposta por `mailto:`, destinatários/Reply-To e tags. O assunto muda intencionalmente. A condição de preferência escura do sistema foi verificada pelo construtor em navegador com canvas claro; isso não valida a transformação de cores de clientes de e-mail. Gmail, Apple Mail e Outlook reais não foram testados. O parecer não certifica esses aplicativos, entrega das mensagens ou disponibilidade pública dos novos assets antes do deploy.

## Closed material fix list IDs

`[]`
