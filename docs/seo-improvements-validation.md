# SEO de pré-lançamento e Clarity: validação

Implementado em 29/10/2026 conforme o [planejamento aprovado](seo-improvement-plan.md). A entrega está no código local; não foi publicada no domínio nesta execução.

Atualização em 30/10/2026: por solicitação do usuário, a Home voltou à composição original, incluindo parceiros, depoimento, etapas, estatísticas e CTAs. Foram retiradas as seções de proposta e FAQ acrescentadas na revisão anterior. A remoção de conteúdo e as medições visuais/de desempenho registradas abaixo descrevem a versão de 29/10; não representam essa Home restaurada. As configurações técnicas de SEO, noindex, Clarity e mobile foram preservadas.

Validação da restauração: build de produção com TypeScript, ESLint, Prettier e 10 testes de menu/indexação aprovados. Chromium e WebKit conferidos em 390, 768 e 1440 px, com capturas revisadas, parceiros/depoimento presentes, menu por Escape, CTAs abrindo `/lancamento` e nenhum overflow horizontal ou erro JavaScript. Título, canonical, JSON-LD, meta/cabeçalho noindex e cores mobile confirmados. Evidências locais em `output/playwright/home-restored/`.

## Alterações

- Home com título `Papum Delivery - Gestão de Delivery`, descrição fiel ao estágio do produto e endereço principal `https://www.papum.app.br`.
- Canonical, Open Graph, Twitter e JSON-LD `Organization`/`WebSite` alinhados. Nenhuma avaliação, oferta ou rede social fictícia em dados estruturados. Favicon da marca preservado.
- `SITE_INDEXING_ENABLED` desativado por padrão. Metadata raiz com `noindex, follow` e cabeçalho global `X-Robots-Tag: noindex`; login e admin mantêm as próprias regras. Somente o valor exato `true`, com novo build, permite futura indexação pública.
- `robots.txt` permite rastrear a regra noindex. Sem anúncio de sitemap; `/sitemap.xml` responde 404 enquanto a indexação estiver desativada. A configuração futura publica somente Home e lançamento.
- Removidas marcas de parceiros, bloco de restaurantes, depoimento de Silva’s Pizza, estrelas, estatísticas e oferta de primeiro mês sem comprovação. Home e lançamento explicam que a plataforma ainda está em desenvolvimento e que o cadastro é para receber novidades.
- Clarity configurado localmente com `z5hqjof5ys`, independente do GA4, com escolha de consentimento versionada, formulário mascarado e eventos controlados. Login/dashboard fora da gravação. Detalhes em [integrações de marketing](marketing-integrations.md).
- Menos preload de fontes sem uso inicial e prioridade alta na imagem principal do scooter, preservando fontes e identidade existentes.

## Verificações

- 237 testes unitários/de componentes aprovados em 29 arquivos, incluindo configuração de indexação, eventos, consentimento antigo, recusa e parada do Clarity.
- 10 testes E2E de marketing aprovados; dois cenários de menu mobile ignorados intencionalmente nos projetos tablet e desktop. Provedores simulados, sem envio de e-mails reais.
- ESLint sem avisos, TypeScript e build de produção aprovados.
- Chromium e WebKit com contexto iPhone 17: Home em 390 × 844, 768 × 1024 e 1440 × 1000, sem overflow horizontal. Capturas revisadas; menu por teclado/Escape, FAQ por teclado, tema escuro e movimento reduzido conferidos.
- HTML e HTTP locais: título exato, canonical www, noindex na Home/lançamento/login, robots acessível e sitemap 404. JSON-LD parseado e identidade conferida.
- Clarity com transporte simulado: nenhum script antes do aceite ou após recusa; funcionamento sem GA4; tentativa e erro do formulário; revogação, retomada, saída para login e retorno pelo histórico; nenhum erro JavaScript nos dois motores.
- Runtime oficial Clarity 0.8.72: script do projeto carregado, parada efetiva na revogação, retomada no novo aceite e ausência de runtime no documento de login. Todos os destinos de upload foram interceptados/bloqueados; nenhuma gravação de QA foi enviada ao projeto.

## Desempenho mobile

Lighthouse no build local, com simulação mobile e sem consentimento de analytics:

| Medida              | Antes do ajuste de carregamento | Depois                  |
| ------------------- | ------------------------------- | ----------------------- |
| Desempenho          | 84                              | 85                      |
| LCP                 | aproximadamente 4,5 s           | aproximadamente 4,2 s   |
| CLS                 | 0                               | 0                       |
| TBT                 | 40 ms                           | 30 ms                   |
| Fontes transferidas | aproximadamente 162 KiB         | aproximadamente 108 KiB |

Uma execução em cada versão: resultados de laboratório sujeitos a variação, sem dados de usuários reais. O LCP simulado ainda merece acompanhamento na hospedagem; não é uma certificação de Core Web Vitals nem promessa de ranking.

Evidências locais ignoradas pelo Git: `output/playwright/seo-release/`, `inspect-seo-clarity.txt` e `inspect-clarity-runtime.txt`. As medições usam a configuração local de produção com GA4 explicitamente desabilitado para conferir a independência do Clarity.

## Publicação e pendências externas

1. Publicar pela integração Git existente da Vercel, no projeto já associado ao domínio. Nenhum projeto paralelo foi criado nem alteração remota executada nesta sessão.
2. Configurar na hospedagem `NEXT_PUBLIC_CLARITY_PROJECT_ID=z5hqjof5ys` e `SITE_INDEXING_ENABLED=false`, preservando as demais variáveis. Executar um novo build; `.env.local` não é versionado.
3. Conferir no domínio final o noindex, canonical, robots, sitemap 404 e favicon acessível. Só então a alteração poderá ser lida pelo Google. A remoção não é instantânea.
4. Se a retirada for urgente, usar Remoções no Search Console da propriedade verificada. Não houve acesso a essa conta nesta execução nem solicitação de remoção.
5. Conferir sessões consentidas e mascaramento no painel Clarity com dados fictícios. Ainda não foi possível inspecionar gravações no painel ou mapas de calor agregados.
6. Conferir as barras nativas em Safari num iPhone físico e os templates nos clientes reais de e-mail, conforme os limites da [validação mobile/e-mails](design/mobile-email-improvements-validation.md).

Não reativar indexação, enviar sitemap ou solicitar indexação até autorização explícita para o lançamento. Nenhuma posição no Google ou recomendação por IA foi prometida.
