# Analytics e contato da página de lançamento

## O que está conectado

- “Começar agora”, “Planos”, “Explorar Planos” e “Ver Planos” abrem `/lancamento` em outra aba, inclusive no header, footer e menu mobile.
- GA4 gratuito para cliques nos CTAs e conversões do formulário.
- Resend para notificação interna e confirmação ao interessado, com texto e identidade Pápum Delivery.
- Cloudflare Turnstile para verificar o visitante antes de permitir envios. O token é validado no servidor, incluindo hostname e ação `launch_waitlist`.

Os IDs e as chaves não vêm preenchidos. Sem ID GA4 não há banner ou coleta; sem configuração de envio não há e-mails nem confirmação falsa de cadastro. A integração de marketing é independente de `DELIVERY_DATA_SOURCE`: o dashboard continua na prévia local.

## 1. Google Analytics 4 — gratuito

1. Crie uma conta/propriedade em [Google Analytics](https://analytics.google.com/) e um fluxo de dados da Web para `https://papum.app.br`.
2. Copie o ID de medição (formato `G-...`) para `NEXT_PUBLIC_GA4_ID` em `.env.local` e no ambiente de hospedagem.
3. **Desative a medição otimizada/Enhanced Measurement desse fluxo.** O código envia as visualizações e eventos manualmente. Isso evita duplicação por mudanças de histórico e coleta automática de formulários, busca e URLs que podem conter dados pessoais. Mantenha Google Signals, personalização de anúncios e recursos de dados fornecidos por usuários desativados.
4. Em Administrador → Eventos/Eventos principais, marque `generate_lead` como evento principal. Se o objetivo for uma conversão por visitante em cada sessão, configure a contagem como uma vez por sessão.
5. Crie dimensões personalizadas de escopo Evento para `cta_name`, `cta_location` e, se necessário, `form_name`.
6. Publique/reinicie o ambiente e confira o relatório Em tempo real. Depois, use Explorações → Funil para acompanhar visita à home → `cta_click` → visita a `/lancamento` → `generate_lead`.

| Evento          | Momento                                                               | Parâmetros                                                                                                       |
| --------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `page_view`     | Visualização de uma página pública permitida, após consentimento      | `page_path`, `page_location`, título fixo                                                                        |
| `cta_click`     | Clique em um CTA instrumentado                                        | `cta_name`: `start_now` ou `plans`; `cta_location`: `header`, `mobile_menu`, `benefits`, `final_cta` ou `footer` |
| `generate_lead` | A Server Action retorna sucesso após o Resend aceitar os dois e-mails | `form_name`: `launch_waitlist`; `page_path`: `/lancamento`                                                       |

Os eventos próprios não incluem e-mail, hash de e-mail, token de segurança ou valores dos campos. As URLs enviadas por eles não incluem query ou fragmento. Login e dashboard não recebem eventos de marketing. Os relatórios permitem contar usuários e eventos; não identificam o e-mail de cada visitante.

A tag só é carregada após “Permitir estatísticas”. “Recusar” mantém a coleta desativada. O botão “Preferências de privacidade”, no rodapé, permite mudar a escolha; revogar desativa novos envios e remove os cookies `_ga` acessíveis nesse domínio. A preferência fica no localStorage, com fallback por sessão quando ele estiver bloqueado.

Bloqueadores de anúncios e visitantes que recusarem analytics não entram nessas estatísticas. O formulário de contato funciona independentemente da escolha. Não espere que o número de conversões do GA4 corresponda a todos os contatos recebidos por e-mail.

Referências: [GA4 gratuito](https://marketingplatform.google.com/about/analytics/), [eventos](https://developers.google.com/analytics/devguides/collection/ga4/events), [consentimento básico](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic).

## 2. Resend — notificação e confirmação

1. Crie uma conta em [Resend](https://resend.com/) e adicione o domínio `binaryinc.com.br`.
2. Publique no DNS os registros de verificação indicados no painel. Preserve os registros de recebimento já utilizados pelo domínio; siga os nomes exatos fornecidos pelo Resend para envio. Aguarde o status de domínio verificado.
3. Crie uma API key com permissão de envio, limitada ao domínio necessário quando disponível, e configure `RESEND_API_KEY` somente no servidor. Não envie essa chave pelo chat nem a coloque em variáveis `NEXT_PUBLIC_`.
4. Configure os endereços abaixo e também o Turnstile da próxima seção antes de liberar o formulário.

| Mensagem    | Destinatário               | Assunto                                                             | Responder para                    |
| ----------- | -------------------------- | ------------------------------------------------------------------- | --------------------------------- |
| Notificação | `contato@binaryinc.com.br` | Cliente interessado nos serviços PAPUM Delivery                     | E-mail informado pelo interessado |
| Confirmação | E-mail do interessado      | Recebemos seu contato. Obrigado por chegar junto! \| Pápum Delivery | `contato@binaryinc.com.br`        |

O nome exibido do remetente é **Pápum Delivery**. O corpo e o assunto da confirmação não mencionam Binary. O endereço aparece nos cabeçalhos porque o domínio utilizado é `binaryinc.com.br`.

### Texto da confirmação

> Olá!
>
> Recebemos seu contato e ficamos felizes com seu interesse no Pápum Delivery.
>
> Estamos preparando uma forma simples, rápida e inteligente de colocar seu delivery no ar. Assim que tivermos novidades sobre o lançamento, vamos avisar por este e-mail.
>
> Obrigado por acompanhar a gente desde o início!
>
> Até já, Equipe Pápum Delivery

Há versões HTML e texto simples. A mensagem também orienta responder ao e-mail para cancelar os avisos ou informar uma solicitação não reconhecida. Esses pedidos precisam ser atendidos pela equipe; não existe gerenciamento automático de inscrições nesta entrega.

O envio usa um batch de duas mensagens com chave HMAC idempotente e payload determinístico. Tentativas equivalentes durante a janela de 24 horas do Resend não reenviam o par. Não há repetição automática de requisições de envio. Só retornamos sucesso quando a resposta contém dois IDs válidos; aceitação pelo provedor não garante entrega na caixa de entrada. Confira entregas, rejeições e bounces no painel.

O plano gratuito consultado oferece **3.000 e-mails/mês e 100/dia**. Com duas mensagens por contato, o teto é até 1.500 contatos/mês e 50/dia, descontando outros envios da conta. Verifique a política vigente no painel.

Os contatos chegam à caixa interna. **Não há banco de leads ou cadastro automático em uma audiência do Resend.** Preserve/organize esses contatos para avisar sobre o lançamento posteriormente; o histórico de envios do provedor não substitui um cadastro durável. Não usamos o endpoint de registro de usuários da API do dashboard para essa finalidade.

Referências: [preços](https://resend.com/pricing), [domínio verificado](https://resend.com/docs/dashboard/domains/introduction), [batch](https://resend.com/docs/api-reference/emails/send-batch-emails), [idempotência](https://resend.com/docs/dashboard/emails/idempotency-keys).

## 3. Turnstile — proteção gratuita do formulário

1. Crie um widget em Cloudflare → Turnstile, no modo Managed. Não é necessário transferir o DNS do site para a Cloudflare.
2. Autorize os hostnames de produção (`papum.app.br`, `www.papum.app.br`). Para testar com envio real localmente, autorize também `localhost` no widget e em `WAITLIST_ALLOWED_HOSTNAMES`.
3. Configure a sitekey pública em `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e a secret key em `TURNSTILE_SECRET_KEY`, somente no servidor.
4. Tokens expiram e são de uso único. O formulário reinicia a verificação após uma tentativa de envio; tokens inválidos, repetidos, de outra ação ou hostname não chegam ao Resend.

O envio também tem honeypot, validação Zod no servidor, destinatário interno definido por configuração, escape de HTML, timeouts e erros públicos sem mensagens internas dos provedores. Turnstile não substitui controle de abuso/limites de infraestrutura se o volume crescer; acompanhe consumo e bloqueios no painel.

Referências: [plano gratuito](https://developers.cloudflare.com/turnstile/plans/), [widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [validação no servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## Variáveis para ativação

Use `.env.example` como modelo. No `.env.local`/ambiente de hospedagem:

```dotenv
NEXT_PUBLIC_GA4_ID=G-SEU_ID
RESEND_API_KEY=sua_chave_secreta
RESEND_FROM_EMAIL=contato@binaryinc.com.br
RESEND_NOTIFICATION_EMAIL=contato@binaryinc.com.br
NEXT_PUBLIC_TURNSTILE_SITE_KEY=sua_sitekey_publica
TURNSTILE_SECRET_KEY=sua_chave_secreta
WAITLIST_ALLOWED_HOSTNAMES=papum.app.br,www.papum.app.br
```

Reinicie `pnpm dev` após configurar o ambiente. Variáveis públicas entram no bundle: em produção, configure-as antes de executar um novo build/deploy. Não substitua esses valores por chaves de teste em produção.

## Organização e testes

- `src/components/analytics/marketing-analytics.tsx`: tag e preferências.
- `src/lib/analytics.ts`: eventos permitidos, consentimento e URLs sem query.
- `src/lib/actions/subscribe-to-launch.ts`: entrada pública da Server Action, mantendo as proteções de origem do Next.
- `src/lib/email/subscribe-to-launch.ts`: validação, Turnstile e envio no servidor.
- `src/lib/email/launch-templates.ts`: conteúdo dos dois e-mails.
- `src/components/forms/turnstile-verification.tsx`: ciclo de vida do widget.

Os testes simulam as chamadas aos provedores; nenhum e-mail real é enviado por eles. A validação final com domínio verificado, credenciais reais e entrega na caixa de entrada deve ser feita após a configuração das contas.

Conferência local: 209 testes passaram; consentimento, recusa, retorno do foco, abertura de novas abas e falha sem confirmação de cadastro foram verificados em navegador real. A LP foi conferida em 390, 768 e 1440 px e o e-mail em 390 e 1440 px, sem overflow horizontal. Na prévia de analytics foi usado um ID fictício com o script Google interceptado, sem coleta real.
