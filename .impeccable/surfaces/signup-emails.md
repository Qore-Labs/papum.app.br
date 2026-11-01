# E-mails de cadastro de interesse

Mode: Read na confirmação ao interessado; Operate na notificação interna, com leitura dos dados e ação de resposta.

Extensão da identidade existente da landing, implementada em 01/11/2026 na branch `layout-test`. O [plano aprovado](../../docs/design/signup-emails-redesign-plan.md) governa direção, sequência e textos. A composição não redefine a marca ou os tokens das outras superfícies; as regras implementadas estão na seção de e-mails de [DESIGN.md](../../DESIGN.md#e-mails-de-cadastro).

## Artefatos e hierarquia

- `src/lib/email/launch-templates.ts`: base compartilhada, variações explícitas de cabeçalho, título, conteúdo e encerramento; tabelas de apresentação, estilos essenciais inline e texto simples.
- `src/utils/contents/launch-emails.ts`: assuntos, preheaders, textos, ações e links tipados. Confirmação: “Recebemos seu cadastro | Papum Delivery”. Aviso interno: “Novo cadastro de interesse | Papum Delivery”.
- Confirmação: recebimento e próximo passo → produto com pequena arte original → convite opcional ao Instagram oficial → despedida → links e orientação de cancelamento por resposta.
- Notificação: título → e-mail e origem real validada → resposta por `mailto:`/Reply-To → instrução e rodapé interno. Sem despedida ou aviso de cancelamento voltado ao interessado.

## Contrato de continuidade

Preservar coluna principal de até 560 px, amarelo, creme, carvão, logo original e raio arredondado. Arial/Helvetica é a exceção de compatibilidade desta superfície. Os PNGs derivados dos vetores originais ficam em `public/email/`, têm proveniência incorporada e precisam acompanhar a publicação dos templates. Texto e ações permanecem compreensíveis com imagens bloqueadas ou sem o stylesheet do cabeçalho.

O cadastro continua sendo de interesse. Os únicos dados recebidos são e-mail e origem validada; o fluxo não cria conta operacional, banco de leads ou contagem durável de pessoas únicas. A orientação de cancelamento descreve o tratamento manual por resposta. Não acrescentar campos, data variável, promessa de acesso ou prazo.

## Evidências e limites

A [validação](../../docs/design/signup-emails-validation.md) registra 15 testes do fluxo, lint e build aprovados, além de 26 capturas Chromium/WebKit em 320, 390, 560 e 768 px e cenários de fallback. A [revisão independente](../../docs/design/signup-emails-finish-review.md) retornou **ship**, sem correções materiais, no escopo dos dois templates e das evidências entregues.

As prévias locais ficam em `output/playwright/email-redesign/`. Gmail, Apple Mail e Outlook reais não foram testados; preferência escura do sistema em navegador não comprova inversão de cores do aplicativo de e-mail. Não houve publicação ou envio real. Aceitação do lote pelo provedor não comprova entrega na caixa de entrada.
