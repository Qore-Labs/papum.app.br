# Planejamento: e-mails de cadastro com a identidade da landing

Data: 01/11/2026. Status: aprovado pelo usuário e implementado na branch `layout-test`, sem publicação ou envio real de mensagens. Ver [validação](signup-emails-validation.md) e [revisão visual](signup-emails-finish-review.md).

## Direção e objetivo

Estender a linguagem atual da landing aos dois e-mails: campos de amarelo, creme e carvão, logo original escura, títulos de peso alto, espaçamento generoso, formas arredondadas e ações em pílula. A confirmação deve acolher o interessado e explicar o próximo passo; a notificação interna deve permitir que a equipe identifique o contato e responda rapidamente.

O e-mail é uma continuidade visual do site, com composição própria para a caixa de entrada. A base técnica existente já usa tabelas, estilos inline, HTML e texto simples; será aproveitada. O cadastro continua sendo de interesse, sem criar conta operacional ou registrar uma pessoa em banco de leads.

Aplicação das skills: `design-taste-frontend` para preservar a direção da landing e evitar um template genérico; `impeccable` para hierarquia, clareza e leitura; `emil-design-eng` para consistência e acabamento de estados e detalhes. A identidade existente e as limitações dos clientes de e-mail governam as escolhas.

## Diagnóstico

| Hoje                                                                          | Proposta                                                          | Motivo                                                           |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| Cartão branco, marfim e laranja, anterior à reformulação da landing           | Cabeçalho amarelo e corpo creme, com títulos e ação em carvão     | Reconhecer a mesma marca depois do cadastro                      |
| Logo colorida sobre um retângulo branco                                       | Derivado PNG da marca escura original sobre proteção amarela      | Aproximar a assinatura da landing sem redesenhar o logo          |
| Confirmação repete acolhimento, recebimento e agradecimento em vários trechos | Confirmação direta, dois blocos curtos e um convite opcional      | Reduzir a leitura necessária para entender o que acontece depois |
| O mesmo encerramento acolhedor aparece na mensagem interna                    | Variante interna compacta, com contato e origem em primeiro plano | Ajudar a equipe a agir, sem uma peça promocional extensa         |
| Assunto interno usa “Cliente interessado nos serviços”                        | “Novo cadastro de interesse”                                      | Descrever corretamente o contato recebido                        |

## Sistema visual comum

- **Cores:** amarelo `#ffc400` no cabeçalho; creme `#faf9f5` no corpo; carvão `#191817`/tinta `#1b1c1c` nos títulos e botões; laranja `#ff8a00` como acento gráfico; neutro `#f0eee7` no entorno e rodapé.
- **Composição:** uma coluna fluida, máximo de 560 px; aproximadamente 32 px de respiro interno no desktop e 20–24 px no mobile. Campos de cor conectados, sem bordas, sombras ou caixas repetidas em torno de cada parágrafo. Cantos suaves no contêiner como aprimoramento progressivo.
- **Tipografia:** títulos fortes de 28–32 px; corpo de 16 px, entrelinha de 25–26 px; apoio de 13–14 px com contraste. Fonte sans-serif segura para e-mail. A personalidade vem também da logo, das proporções e do ritmo, sem depender do carregamento de Plus Jakarta Sans ou Be Vietnam Pro.
- **Ações:** uma ação principal por mensagem, em pílula carvão com texto claro; altura de aproximadamente 48 px. Link real com rótulo visível, legível mesmo quando o cliente não preserva o arredondamento.
- **Marca:** logo original, sem reconstruir lettering em texto. Instagram e site com os ícones PNG existentes e rótulos. Preservar leitura quando as imagens estiverem bloqueadas.
- **Ilustração:** apenas na confirmação, uma versão pequena da sacola/pedido original da landing, exportada para PNG, como reforço do produto. Não contém texto essencial nem substitui a confirmação. A mensagem interna usa apenas a marca compacta e os dados.

### Assets

Reaproveitar `LogoWhite`/marca monocromática da biblioteca existente e `public/home/product/orders.svg`. Gerar derivados PNG próprios para e-mail; a marca recebe uma área de proteção amarela correspondente ao cabeçalho para conservar leitura em clientes que alteram as cores. Validar o resultado em modo escuro.

Logo com aproximadamente 140–152 px visuais e exportação em resolução superior; ilustração com aproximadamente 140–160 px visuais. Guardar dimensões e proporções no HTML. Os novos arquivos devem ter nomes próprios, preservando os assets referenciados por e-mails anteriores. Não usar os SVGs diretamente no HTML de e-mail.

A origem dos vetores dos posts e sua correspondência com a landing já estão registradas em `DESIGN.md` e `home-product-section-assets.md`. Esta proposta reutiliza esse material, sem criar outra identidade.

## 1. Confirmação para o interessado

**Função:** deixar evidente que o cadastro foi recebido, explicar o acompanhamento por e-mail e convidar a manter contato com a marca.

**Sequência visual:** cabeçalho amarelo com logo e título → corpo creme com confirmação e próximo passo → breve apresentação do produto com a pequena ilustração → CTA → assinatura → rodapé e orientação de cancelamento.

### Texto proposto

- **Assunto:** Recebemos seu cadastro | Papum Delivery
- **Preheader:** As novidades da Papum vão chegar por este e-mail.
- **Título:** Que bom ter você por aqui.
- **Confirmação:** Seu cadastro de interesse na Papum Delivery foi recebido. Vamos enviar novidades e avisar por aqui quando a plataforma estiver disponível.
- **Produto:** A marca é sua. A estrutura é Pápum.
- **Explicação:** Um app com a identidade do seu restaurante e um painel para organizar cardápio, pedidos e contatos.
- **CTA:** Acompanhar no Instagram
- **Assinatura:** Até já, / Equipe Papum Delivery
- **Aviso de rodapé:** Você recebeu esta mensagem porque se cadastrou para acompanhar a Papum Delivery. Para cancelar os avisos ou informar que não fez esse cadastro, responda a este e-mail.

O CTA aponta para `https://www.instagram.com/usepapumdelivery/`. É um convite opcional após o cadastro, sem nova verificação, cadastro duplicado ou promessa de acesso. A menção à disponibilidade fica concentrada na confirmação; a descrição do produto mantém a linguagem direta do site.

O rodapé conserva Instagram e site com seus ícones e rótulos; o botão principal recebe maior destaque que esses links. O site usa `https://www.papum.app.br`, conforme a configuração atual. A orientação de cancelamento por resposta continua visível, pois esse é o processo real da equipe.

## 2. Notificação para a equipe

**Função:** identificar rapidamente um novo cadastro de interesse e facilitar o contato, no endereço/grupo de e-mail já configurado.

**Sequência visual:** cabeçalho amarelo compacto com logo → título e uma linha de contexto → e-mail em destaque → origem → CTA de resposta → instrução curta → rodapé interno.

### Texto proposto

- **Assunto:** Novo cadastro de interesse | Papum Delivery
- **Preheader:** Um novo contato quer acompanhar as novidades da Papum.
- **Título:** Novo cadastro recebido.
- **Contexto:** Uma pessoa se cadastrou para receber novidades da Papum Delivery.
- **Campo principal:** E-mail do interessado
- **Campo de apoio:** Origem
- **CTA:** Responder ao interessado
- **Instrução:** Você também pode responder diretamente a esta mensagem.
- **Rodapé:** Notificação interna de um cadastro recebido pelo site da Papum Delivery.

O e-mail fica selecionável, legível e clicável, com quebra segura para endereços longos. A origem usa o valor real validado do envio: página principal, Instagram pelo link da bio ou página `/lancamento`. O botão usa `mailto:` e o `reply_to` continua apontando para o interessado.

A mensagem interna dispensa a ilustração de produto e o encerramento “Até já”. Instagram e site podem permanecer no rodapé compartilhado em nível secundário, sem competir com a resposta ao contato. Não há instrução de cancelamento destinada ao interessado nesta variante.

## Implementação prevista, após aprovação

1. Aprovar a direção e os textos dos dois e-mails apresentados acima.
2. Preparar a variante monocromática da logo e a pequena ilustração em PNG, a partir dos vetores existentes, com os fundos e dimensões definidos.
3. Evoluir `src/lib/email/launch-templates.ts`, mantendo uma base compartilhada com variações explícitas para confirmação e notificação. Cabeçalho, corpo, ação, assinatura e rodapé devem aceitar as diferenças sem duplicar o documento HTML inteiro.
4. Atualizar conteúdo e assuntos em `src/utils/contents/launch-emails.ts` ou na configuração tipada de conteúdo adotada pelo fluxo. A grafia editorial será “Papum Delivery”; o desenho original do logo e a frase já aprovada da landing permanecem preservados.
5. Gerar as duas prévias HTML e texto simples com dados fictícios, revisar desktop/mobile e compatibilidade, ajustar os testes existentes relacionados ao conteúdo e concluir as verificações técnicas.
6. Entregar as prévias para conferência antes de qualquer envio real de teste. Esta tarefa não configura outra audiência, grupo, banco, CRM ou automação de comunicação.

### Preservações técnicas e de produto

- Remetente, destinatário interno configurado, `reply_to` específico de cada mensagem, tags e lote de duas mensagens permanecem como no fluxo atual. A alteração de assunto proposta é intencional e ficará contemplada na revisão dos testes e de eventuais filtros internos.
- Os únicos dados de cadastro disponíveis são e-mail e origem validada. Não acrescentar nome, telefone, restaurante, UTMs, número de interessados ou informação de cliente inexistente.
- Não adicionar data/hora variável no corpo. O payload atual determina a chave HMAC de idempotência do envio; alterar o corpo a cada tentativa comprometeria sua estabilidade. A data da mensagem continua disponível nos cabeçalhos do e-mail.
- Preservar escape de HTML, URL de resposta segura, versão em texto simples, validações do formulário e Turnstile. Nenhuma promessa de contratação, conta operacional, entrega garantida, prazo, prioridade ou benefício não definido.
- A equipe continuará recebendo o contato por e-mail, sem uma nova base de leads. “Cadastro recebido” não significa interessado único contado em um banco.

## Compatibilidade e critérios de aceite

A implementação mantém tabelas de apresentação, estilos essenciais inline e imagens em URLs HTTPS absolutas. Esses cuidados, junto da largura estreita e da versão em texto simples, seguem a orientação de [HTML para e-mail da Mailchimp](https://mailchimp.com/help/about-html-email/). Formas e acabamentos são progressivos; confirmação, dados e ação permanecem legíveis no fallback.

- Conferir os dois templates em 320, 390, 560 e 768 px, incluindo e-mail longo, imagens bloqueadas e preferência de modo escuro. Não pode haver overflow horizontal nem dependência da ilustração para entender a mensagem.
- Corpo legível, contraste validado, botões com área confortável para toque, links descritivos e foco visível onde o cliente permitir. A referência de [e-mail mobile da Mailchimp](https://templates.mailchimp.com/design/mobile-friendliness/) orienta escala e alvos de toque.
- A confirmação mostra o recebimento e o próximo passo antes do conteúdo secundário. A notificação mostra e-mail e origem antes da ação e da informação de marca.
- Conferir o logo sobre o amarelo e seus fallbacks de modo escuro. Fontes remotas, fundo com imagem e SVG não serão dependências para a leitura; ver a referência de [tipografia para e-mail](https://templates.mailchimp.com/design/typography/).
- Testar assuntos, links oficiais, `mailto:`, destinatários/Reply-To, paridade de HTML/texto e estabilidade do payload nas tentativas equivalentes. Executar testes relevantes do fluxo, lint, TypeScript e build.
- Gerar e inspecionar capturas em navegador real com Playwright. Gmail, Apple Mail e Outlook devem ser conferidos quando houver ambiente/caixas de teste disponíveis; prévia em navegador não certifica esses clientes. Registrar precisamente o que foi validado.
- Qualquer teste com envio usa somente caixas indicadas para esse fim. Não enviar para interessados reais como parte da revisão de layout.

## Referências e o que será aproveitado

- **Landing Papum atual:** autoridade de cor, marca, proporção dos títulos, botões em pílula, arte e voz. Fontes locais: `DESIGN.md`, `src/components/home/landing-page.tsx` e `src/utils/contents/landing.ts`.
- **[Postmark — Welcome](https://postmarkapp.com/transactional-email-templates/welcome):** referência para separar acolhimento, informação útil e uma ação de continuação em um e-mail transacional. Aproveitar o princípio de hierarquia, sem importar seu layout ou sugerir ativação de conta na Papum.
- **[Mailchimp — Mobile Friendliness](https://templates.mailchimp.com/design/mobile-friendliness/):** leitura em uma coluna, escala confortável e links utilizáveis por toque.
- **[Mailchimp — About HTML Email](https://mailchimp.com/help/about-html-email/):** base técnica estreita e leve, estilos inline, texto simples e validação em clientes de e-mail.

## Entrega desta etapa

Os dois templates e seus assets foram implementados conforme este planejamento. A base de envio, as validações, os destinatários e a idempotência foram preservados. As prévias usam dados fictícios; a validação em navegador e os limites de clientes de e-mail reais constam no relatório desta execução.
