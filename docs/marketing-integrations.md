# Analytics e contato da página de lançamento

## O que está conectado

- “Planos”, “Começar agora”, “Explorar Planos” e “Ver Planos” abrem `/lancamento` em outra aba. Os rótulos e a composição original da Home foram restaurados a pedido do usuário em 30/10/2026.
- GA4 gratuito para cliques nos CTAs e conversões do formulário.
- Microsoft Clarity para mapas de calor e reprodução de sessões consentidas na Home e em `/lancamento`, independente do GA4.
- Resend para notificação interna e confirmação ao interessado, com texto e identidade Pápum Delivery.
- Cloudflare Turnstile para verificar o visitante antes de permitir envios. O token é validado no servidor, incluindo hostname e ação `launch_waitlist`.

Sem IDs de analytics não há aviso nem coleta. Com ao menos uma integração habilitada, o aviso permite aceitar ou recusar; sem configuração de envio não há e-mails nem confirmação falsa de cadastro. A integração de marketing é independente de `DELIVERY_DATA_SOURCE`: o dashboard continua na prévia local.

## 1. Google Analytics 4 — gratuito

1. Crie uma conta/propriedade em [Google Analytics](https://analytics.google.com/) e um fluxo de dados da Web para `https://www.papum.app.br`.
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

A tag só é carregada após “Permitir análise”. “Recusar” mantém a coleta desativada. O botão “Preferências de privacidade”, no rodapé, permite mudar a escolha; revogar desativa novos envios e remove os cookies `_ga`, `_ga_*`, `_clck` e `_clsk` acessíveis nesse domínio. A preferência fica no localStorage, com fallback por sessão quando ele estiver bloqueado. A chave `papum:analytics-consent:v2` exige nova escolha de quem havia aceitado apenas as estatísticas anteriores.

Bloqueadores de anúncios e visitantes que recusarem analytics não entram nessas estatísticas. O formulário de contato funciona independentemente da escolha. Não espere que o número de conversões do GA4 corresponda a todos os contatos recebidos por e-mail.

Referências: [GA4 gratuito](https://marketingplatform.google.com/about/analytics/), [eventos](https://developers.google.com/analytics/devguides/collection/ga4/events), [consentimento básico](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic).

## Microsoft Clarity — sessões e mapas de calor

O usuário forneceu o ID público `z5hqjof5ys`. Ele está configurado em `.env.local`; na Vercel, definir `NEXT_PUBLIC_CLARITY_PROJECT_ID=z5hqjof5ys` antes de um novo build. O ID identifica o projeto e não é uma chave secreta.

O script oficial carrega após consentimento, somente em builds de produção, em `/` e `/lancamento`. Desenvolvimento e E2E comuns não gravam. Não é necessário configurar GA4 para usar Clarity. O aviso compartilhado informa reprodução de sessões, mascaramento do formulário, recusa e revogação pelo rodapé.

- `consentv2` recebe `analytics_Storage: granted` no aceite e `ad_Storage: denied` sempre. A revogação nega analytics e encerra o runtime com `stop`; negar cookies isoladamente não garante ausência de gravação.
- A saída para uma área privada interrompe a gravação e abre um documento novo antes de renderizar o destino. Login e admin também têm mascaramento preventivo e não carregam a tag.
- O formulário, suas mensagens e a verificação Turnstile ficam sob `data-clarity-mask="true"`. Não são enviados campos, e-mails, hashes, tokens nem mensagens livres em eventos.
- URLs com query, fragmentos não previstos ou referência com query/fragmento não iniciam Clarity. Isso também exclui visitas com parâmetros UTM; é uma limitação deliberada desta entrega para evitar captura de dados em URLs. Links com fragmentos públicos `#proposta` e `#como-funciona` são permitidos.
- Se o visitante revogar enquanto o script ainda estiver carregando, a página é recarregada para encerrar o documento com a requisição pendente.

| Evento                        | Momento                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `cta_start_now` / `cta_plans` | Clique em CTA; nomes internos preservados, mesmo com rótulos voltados ao lançamento        |
| `waitlist_submit`             | Uma tentativa de envio do formulário                                                       |
| `waitlist_success`            | Resposta positiva real da ação de cadastro                                                 |
| `waitlist_error`              | Categoria fixa: e-mail inválido, verificação pendente, indisponibilidade ou falha de envio |

O contexto do CTA e a categoria do erro usam tags controladas. Depois da publicação, conferir no painel do projeto sessões consentidas, eventos, mapas de calor e o mascaramento, com dados fictícios. O acesso ao painel não esteve disponível nesta execução. O runtime oficial 0.8.72 foi testado localmente com uploads bloqueados: aceite, parada na revogação, retomada e ausência de runtime no login foram confirmados.

Referências: [instalação](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup), [consentimento](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2), [mascaramento](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking), [API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api).

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

> Seu contato chegou.
>
> Que bom ter você por aqui!
>
> Recebemos seu contato e ficamos felizes com seu interesse no Pápum Delivery.
>
> Estamos preparando uma forma simples, rápida e inteligente de colocar seu delivery no ar. Assim que tivermos novidades sobre o lançamento, vamos avisar por este e-mail.
>
> Obrigado por acompanhar a gente desde o início!
>
> Até já, Equipe Pápum Delivery

Há versões HTML e texto simples. A mensagem também orienta responder ao e-mail para cancelar os avisos ou informar uma solicitação não reconhecida. Esses pedidos precisam ser atendidos pela equipe; não existe gerenciamento automático de inscrições nesta entrega.

Os dois templates usam a logo Pápum em PNG, fundo claro e links de Instagram e site com ícones e rótulos de texto. A logo está em `public/email/papum-logo.png` e precisa estar disponível em `https://www.papum.app.br/email/papum-logo.png` após a publicação, assim como os ícones `instagram.png` e `website.png` da mesma pasta. A URL do Instagram em `siteConfig.social.instagram` é fictícia, autorizada para demonstração; substitua-a quando houver um perfil oficial. Conteúdo e links dos e-mails ficam em `src/utils/contents/launch-emails.ts`. A notificação interna tem uma ação de resposta e um rodapé próprio para a equipe.

O envio usa um batch de duas mensagens com chave HMAC idempotente e payload determinístico. Tentativas equivalentes durante a janela de 24 horas do Resend não reenviam o par. Não há repetição automática de requisições de envio. Só retornamos sucesso quando a resposta contém dois IDs válidos; aceitação pelo provedor não garante entrega na caixa de entrada. Confira entregas, rejeições e bounces no painel.

O plano gratuito consultado oferece **3.000 e-mails/mês e 100/dia**. Com duas mensagens por contato, o teto é até 1.500 contatos/mês e 50/dia, descontando outros envios da conta. Verifique a política vigente no painel.

Os contatos chegam à caixa interna. **Não há banco de leads ou cadastro automático em uma audiência do Resend.** Preserve/organize esses contatos para avisar sobre o lançamento posteriormente; o histórico de envios do provedor não substitui um cadastro durável. Não usamos o endpoint de registro de usuários da API do dashboard para essa finalidade.

Referências: [preços](https://resend.com/pricing), [domínio verificado](https://resend.com/docs/dashboard/domains/introduction), [batch](https://resend.com/docs/api-reference/emails/send-batch-emails), [idempotência](https://resend.com/docs/dashboard/emails/idempotency-keys).

## 3. Turnstile — proteção gratuita do formulário

1. Crie um widget em Cloudflare → Turnstile, no modo Managed. Não é necessário transferir o DNS do site para a Cloudflare.
2. Autorize os hostnames utilizados (`papum.app.br`, `www.papum.app.br`, `papumappbr.vercel.app`) no gerenciamento de hostnames do widget. Para testar com envio real localmente, autorize também `localhost` no widget e em `WAITLIST_ALLOWED_HOSTNAMES`.
3. Configure a sitekey pública em `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e a secret key em `TURNSTILE_SECRET_KEY`, somente no servidor.
4. Tokens expiram e são de uso único. O formulário reinicia a verificação após uma tentativa de envio; tokens inválidos, repetidos, de outra ação ou hostname não chegam ao Resend.

### Falhas na verificação

O widget mostra a referência numérica do erro e permite repetir desafios com falha de conexão ou expiração sem apagar o e-mail. Se o próprio script não carregar, oferece recarregar a página. Erros de configuração pedem intervenção da equipe, preservando o bloqueio de envio.

- `110200`: domínio não autorizado no painel do Turnstile. Adicione o hostname exato usado no navegador (inclusive o hostname próprio da Vercel, se utilizar esse endereço).
- `110100` / `110110`: conferir a sitekey e o widget no painel.
- `200500`: o iframe não carregou; conferir bloqueio a `challenges.cloudflare.com`, extensões, rede e navegador.
- `200100`: conferir data/hora e cache do aparelho.
- `110600` / `110620`: reiniciar desafio expirado.

Cloudflare e `WAITLIST_ALLOWED_HOSTNAMES` são verificações separadas: autorize o domínio no widget e inclua-o também na configuração do servidor. Use apenas hostnames, sem `https://`, porta ou `/lancamento`. Não autorize `vercel.app` inteiro. Alterações em variáveis da hospedagem precisam de novo deploy; mudanças da sitekey pública precisam de novo build. Não há bypass da verificação nem envio de e-mail quando ela falha.

Referências: [códigos de erro](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/), [hostnames](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/).

O envio também tem honeypot, validação Zod no servidor, destinatário interno definido por configuração, escape de HTML, timeouts e erros públicos sem mensagens internas dos provedores. Turnstile não substitui controle de abuso/limites de infraestrutura se o volume crescer; acompanhe consumo e bloqueios no painel.

Referências: [plano gratuito](https://developers.cloudflare.com/turnstile/plans/), [widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [validação no servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## Variáveis para ativação

Use `.env.example` como modelo. No `.env.local`/ambiente de hospedagem:

```dotenv
NEXT_PUBLIC_GA4_ID=G-SEU_ID
NEXT_PUBLIC_CLARITY_PROJECT_ID=z5hqjof5ys
SITE_INDEXING_ENABLED=false
RESEND_API_KEY=sua_chave_secreta
RESEND_FROM_EMAIL=contato@binaryinc.com.br
RESEND_NOTIFICATION_EMAIL=contato@binaryinc.com.br
NEXT_PUBLIC_TURNSTILE_SITE_KEY=sua_sitekey_publica
TURNSTILE_SECRET_KEY=sua_chave_secreta
WAITLIST_ALLOWED_HOSTNAMES=papum.app.br,www.papum.app.br,papumappbr.vercel.app
```

Reinicie `pnpm dev` após configurar o ambiente. Variáveis públicas entram no bundle: em produção, configure-as antes de executar um novo build/deploy. Não substitua esses valores por chaves de teste em produção.

## Organização e testes

- `src/components/analytics/marketing-analytics.tsx`: tags, preferências e limite de gravação.
- `src/lib/analytics.ts`: eventos permitidos, consentimento e URLs sem query.
- `src/lib/clarity.ts`: fila oficial, consentimento, parada/retomada e eventos do Clarity.
- `src/utils/config/analytics.ts`: IDs independentes e ambientes permitidos.
- `src/lib/actions/subscribe-to-launch.ts`: entrada pública da Server Action, mantendo as proteções de origem do Next.
- `src/lib/email/subscribe-to-launch.ts`: validação, Turnstile e envio no servidor.
- `src/lib/email/launch-templates.ts`: conteúdo dos dois e-mails.
- `src/components/forms/turnstile-verification.tsx`: ciclo de vida do widget.

Os testes simulam as chamadas aos provedores; nenhum e-mail real é enviado por eles. A validação final com domínio verificado, credenciais reais e entrega na caixa de entrada deve ser feita após a configuração das contas.

Conferência inicial, anterior à integração Clarity: 226 testes passaram; consentimento, recusa, retorno do foco, abertura de novas abas e falha sem confirmação de cadastro foram verificados em navegador real. A LP foi conferida em 390, 768 e 1440 px e o e-mail em 390 e 1440 px, sem overflow horizontal. Na prévia de analytics foi usado um ID fictício com o script Google interceptado, sem coleta real. A validação mais recente está em [SEO e Clarity](seo-improvements-validation.md), com 237 testes aprovados e verificações adicionais nos dois motores de navegador.

A recuperação do Turnstile foi conferida com SDK simulado e envio desativado: repetição por teclado, retorno do foco ao widget, preservação do e-mail, remoção do aviso de verificação pendente após sucesso e mensagem de domínio não autorizado. Na página publicada em `papumappbr.vercel.app/lancamento`, o Cloudflare retornou `110200` em 16/10/2026; liberar esse hostname no widget e atualizar a variável na Vercel são etapas de configuração das contas.
