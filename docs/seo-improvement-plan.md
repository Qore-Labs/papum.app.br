# Planejamento de SEO e monitoramento: Papum Delivery

Status: execução autorizada e implementada no código em 29/10/2026. Validação local concluída; publicação no domínio e eventual remoção no Search Console ainda pendentes. Este documento preserva o planejamento aprovado; os resultados estão em [validação da entrega](seo-improvements-validation.md).

Data da auditoria pública e local: 29/10/2026.

Atualização de escopo em 30/10/2026: o usuário solicitou restaurar a Home no formato original, com a faixa de marcas, parceiros e depoimento. A remoção desses blocos e a recomposição editorial da Home previstas abaixo foram substituídas por essa decisão. SEO, noindex, Clarity, ajustes mobile e e-mails permanecem aplicados. A página separada `/lancamento` mantém a apresentação de pré-lançamento.

## Objetivo confirmado

- Consulta prioritária: **papum delivery**. A quinta posição foi relatada pelo usuário; não há acesso ao relatório da propriedade no Search Console para medir posição média, impressões e histórico.
- Produto em **pré-lançamento**, destinado a restaurantes.
- Título solicitado para a Home: **Papum Delivery - Gestão de Delivery**.
- Prioridade atual: deixar o site fora do índice do Google enquanto os ajustes de pré-lançamento são concluídos.
- Remover parcerias e depoimentos: o usuário confirmou que ainda não existem.
- Adicionar Microsoft Clarity para analisar ações, mapas de calor e reprodução de sessões de visitantes que consentirem, inicialmente na Home e em `/lancamento`.
- Preparar reconhecimento da marca, apresentação dos resultados e elegibilidade para links nas experiências de IA para depois da liberação pública. A indexação só será reativada mediante autorização explícita do usuário.

Primeira posição e citação em respostas de IA são metas de visibilidade, sem garantia de obtenção. O Google decide a seleção, o título exibido e a ordenação. [Orientação do Google sobre promessas de posição](https://developers.google.com/search/docs/fundamentals/do-i-need-seo).

## Diagnóstico: favicon e resultado antigo

O problema observado na imagem **não corresponde ao favicon atualmente publicado**:

- `app/favicon.ico` já contém o monograma Pápum, branco sobre amarelo, em 256 × 256 px.
- A URL pública `/favicon.ico` responde HTTP 200, e seu conteúdo é idêntico ao arquivo local, confirmado por SHA-256.
- O endereço completo de favicon informado pelo HTML, incluindo a query do Next.js, também responde HTTP 200 e entrega o mesmo arquivo.
- A Home publicada já tem o título `Pápum! | Seu delivery tá no ar`. A expressão `DeliveryApp - Gestão de Delivery` da captura não aparece no código atual.

**Hipótese principal:** o resultado mostrado ao usuário ainda reflete dados antigos coletados pelo Google. O histórico de coleta, o HTML indexado e o endereço escolhido pelo Google precisam ser confirmados no Search Console; uma requisição HTTP pública não comprova o estado do índice.

Não é necessário redesenhar ou substituir novamente o favicon para tratar esse diagnóstico. Manter o arquivo da marca acessível e uma URL estável. A atualização da apresentação nos resultados será retomada na etapa de liberação da indexação; a prioridade agora é retirar as páginas da pesquisa. [Regras de favicon](https://developers.google.com/search/docs/appearance/favicon-in-search), [atualização dos títulos](https://developers.google.com/search/docs/appearance/title-link).

## Outros achados concretos

| Achado                          | Evidência                                                                                                                                        | Consequência para o plano                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Domínio principal inconsistente | `https://papum.app.br/` responde 308 para `https://www.papum.app.br/`, mas o canonical publicado aponta para `https://papum.app.br`.             | Alinhar redirecionamentos, canonical e URLs de identidade.                                 |
| Sitemap ausente                 | `/sitemap.xml` responde 404 em produção e não existe no repositório.                                                                             | Preparar o mapa para a futura liberação; não enviar URLs com noindex.                      |
| Robots ausente                  | `/robots.txt` responde 404 e não existe no repositório.                                                                                          | Permitir a leitura de noindex; anunciar sitemap somente na futura liberação.               |
| Nome da marca pouco consistente | A Home usa variações de Pápum, Pá Pum e o slogan; a captura usa DeliveryApp.                                                                     | Padronizar o nome público como Papum Delivery, preservando a identidade gráfica.           |
| Proposta e estágio misturados   | Cardápio para restaurantes convive com linguagem de pedir comida, métricas de entrega e oferta de primeiro mês; os CTAs levam ao pré-lançamento. | Explicar o produto para donos de restaurantes e a lista de interesse de forma consistente. |
| Prova social provisória         | Há um depoimento com `Lorem ipsum`; marcas, avaliações e números não têm comprovação disponível no repositório.                                  | Remover parcerias e depoimentos confirmados como inexistentes; validar as demais métricas. |
| Identidade estruturada ausente  | Não há JSON-LD de `WebSite` ou `Organization`.                                                                                                   | Incluir identificação fiel da marca e do site.                                             |
| Redes sociais provisórias       | Instagram é fictício, Facebook é genérico e LinkedIn aponta para a Binary.                                                                       | Não tratar esses URLs como perfis oficiais da Papum Delivery nos dados estruturados.       |

Os arquivos com `noindex` de login e admin já existem e devem continuar assim. Links configurados para FAQ, termos e privacidade estão comentados no footer; não foram identificados como links quebrados atualmente expostos na Home.

## Primeira entrega proposta

### 0. Desindexar temporariamente antes de promover o site

Planejar `robots: { index: false, follow: true }` no metadata raiz, cobrindo a Home, `/lancamento` e novas páginas públicas por padrão. Manter as regras explícitas de login e admin. Centralizar a configuração com indexação desativada, consumida somente no servidor; a futura liberação exigirá novo build e publicação.

Conferir a herança dos metadados: no Next.js, uma definição de `robots` em uma página pode substituir integralmente a política herdada. A validação precisa conferir o HTML final de cada grupo de rotas e regras específicas de Googlebot.

O Google precisa acessar a página para ler `noindex`; portanto, não usar `Disallow: /` como substituto. A retirada do resultado existente depende de nova coleta. Se houver urgência, usar a remoção temporária no Search Console, mantendo o `noindex` durante a preparação. Isso exige a propriedade verificada. [Desindexação com noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [remoções temporárias](https://support.google.com/webmasters/answer/9689846?hl=pt-BR).

**Limite de escopo:** desindexação não restringe visitas pelo endereço. Se também for necessário impedir acesso público, planejar proteção de acesso separada na hospedagem. Não tratar `robots` como proteção de conteúdo.

### 1. Consolidar o domínio e os sinais técnicos

Recomendação: preservar **`https://www.papum.app.br`** como endereço principal, pois já é o destino público dos redirecionamentos. Alinhar `siteConfig.url`, `metadataBase`, canonical, Open Graph e dados estruturados a esse endereço. A configuração futura do sitemap seguirá a mesma escolha. Caso a preferência seja pelo endereço sem `www`, inverter o redirecionamento e alinhar todos esses sinais antes da futura liberação.

Preparar `app/robots.ts` e a futura geração de `app/sitemap.ts` usando as convenções do Next.js 16.3.1 já conferidas na documentação instalada. Enquanto o site estiver com `noindex`, não anunciar nem enviar um sitemap contendo essas URLs. A publicação do sitemap com a Home e `/lancamento` fica para a etapa de lançamento, somente se essas páginas forem aprovadas para indexação.

Preservar `noindex` em login e admin e excluí-los do sitemap. Não usar bloqueio de robots de uma forma que impeça o Google de ler esse `noindex`. O sitemap terá somente URLs válidas e datas de alteração reais, sem gerar uma data nova apenas a cada acesso.

Esses ajustes organizam os sinais e a descoberta de páginas; não transformam sitemap em fator de primeira posição. O Google ignora os campos `priority` e `changefreq`. [Canonicalização](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [robots e respostas 404](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

### 2. Atualizar nome, título e descrição

Título solicitado para a Home:

> Papum Delivery - Gestão de Delivery

Nome público preferido: **Papum Delivery**. As grafias da marca com acento podem ser usadas como variantes legítimas de identificação, sem alterar a logo.

Rascunho de descrição para revisão:

> Papum Delivery está em pré-lançamento. Conheça a proposta para organizar o cardápio digital e os pedidos do seu restaurante e receba novidades.

Aplicar metadados próprios para Home e lançamento, com consistência entre título, descrição, conteúdo visível e imagem de compartilhamento. Open Graph melhora a apresentação em compartilhamentos; não será tratado como garantia de ranking.

O título que fornecemos é um sinal para o Google, que pode escolher uma apresentação diferente. O nome do site exibido acima do título é outro elemento, tratado também pela identificação `WebSite`.

### 3. Tornar a Home fiel ao pré-lançamento

Preservar o design existente e fazer uma revisão editorial objetiva:

- Identificar a Papum Delivery como produto para restaurantes e explicar a proposta de gestão de delivery e cardápio digital.
- Apresentar funcionalidades planejadas como proposta de produto, sem sugerir que já estão liberadas.
- Explicar que o cadastro serve para receber novidades do lançamento. Alinhar o rótulo dos CTAs ao destino real.
- Rever a oferta de primeiro mês e referências a entregas em 15 minutos conforme a realidade do produto.
- Remover a faixa de marcas Burger King, Sushi Zen, Pizza Hut, Subway e Giraffas.
- Remover integralmente o bloco “Os melhores restaurantes estão aqui!”, incluindo a apresentação de restaurantes parceiros.
- Remover o card de Silva’s Pizza, “Cliente desde 2022”, estrelas e depoimento com `Lorem ipsum`. Não substituir por outro depoimento fictício.
- Reajustar espaçamentos e continuidade entre as seções restantes, sem deixar lacunas ou controles ligados aos blocos removidos. Limpar componentes, importações e conteúdo estático que deixarem de ter uso, preservando os assets existentes.
- Revisar separadamente métricas de clientes, pedidos e avaliações sem comprovação. Não usá-las como prova comercial enquanto não forem confirmadas.
- Acrescentar perguntas e respostas úteis sobre público, funcionamento proposto e recebimento de novidades. As respostas devem existir em texto visível.

Essa revisão é especialmente relevante para a busca de marca: o visitante precisa reconhecer que encontrou o projeto correto, compreender o que ele oferece e saber em que estágio está.

### 4. Identificar o site e a marca para os buscadores

Adicionar JSON-LD coerente com o conteúdo público:

- `WebSite`: nome Papum Delivery, URL canônica e variantes legítimas do nome.
- `Organization`: dados reais de identidade e logo da marca/operador, sem inventar dados legais ou contatos.
- Não incluir perfis sociais fictícios em `sameAs`.
- Avaliar marcação específica de software quando houver informações reais suficientes; não preencher avaliações, preços ou ofertas apenas para obter resultados destacados.

Validar a sintaxe no Schema Markup Validator e o que for aplicável no Rich Results Test. O tipo `WebSite` para nome do site não é validado pelo Rich Results Test. A presença de schema não garante destaque, posição ou citação por IA. [Nome do site](https://developers.google.com/search/docs/appearance/site-names), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).

### 5. Validar desempenho e publicar com consistência

- Medir uma linha de base de mobile com PageSpeed Insights/Lighthouse e verificar dados de usuários reais quando houver volume suficiente.
- Avaliar imagens do hero, quantidade de fontes carregadas, estabilidade de layout e resposta das interações. Só fazer ajustes de desempenho fundamentados pelas medições.
- Conferir HTML entregue pelo servidor, títulos, canonical, robots, sitemap, favicon e dados estruturados após o build.
- Validar mudanças visíveis e CTAs em mobile, tablet e desktop com Playwright.
- Rodar lint, tipos, build e testes relevantes. Após a publicação, repetir as verificações públicas de HTTP e metadados.

Executado Lighthouse mobile no build local: 84 → 85 pontos, LCP aproximado de 4,5 → 4,2 s e CLS 0 nas duas execuções. Reduzido o preload de fontes sem uso inicial e priorizada a imagem do scooter. São duas medições de laboratório, sem dados de campo ou garantia de repetibilidade em produção. Melhor desempenho ajuda a experiência, mas uma nota alta isolada não assegura liderança nas buscas. [Experiência de página](https://developers.google.com/search/docs/appearance/page-experience).

### 6. Adicionar Microsoft Clarity

Objetivo: entender como os visitantes usam a landing, onde clicam, até onde rolam e onde encontram dificuldades, usando mapas de calor e reprodução de sessões. O Clarity complementará os eventos quantitativos do GA4.

#### Configuração e escopo

- Usado o projeto informado pelo usuário, `z5hqjof5ys`, configurado em `NEXT_PUBLIC_CLARITY_PROJECT_ID` no ambiente local. Repetir a variável na hospedagem antes do build. Sem ID, a integração permanece desativada; nenhuma conta ou projeto foi criado por esta execução.
- Usar o snippet oficial, carregado de forma assíncrona após consentimento, sem adicionar dependência quando não houver necessidade.
- Começar apenas em `/` e `/lancamento`. Login, recuperação de conta, dashboard e demais áreas operacionais ficam fora da gravação.
- Manter Clarity e GA4 independentes: o Clarity poderá funcionar mesmo sem ID GA4, e vice-versa. O painel de preferências será único.
- Desativar coleta em desenvolvimento e testes automatizados comuns. Prever sessões de QA controladas para validar a integração sem misturar tráfego de desenvolvimento com visitas reais.
- O monitoramento consentido pode ser testado durante o pré-lançamento mesmo com `noindex`; ele não reativa indexação ou divulgação.

[Instalação oficial do Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup).

#### Consentimento, mascaramento e interrupção

Reaproveitar o consentimento existente, mas atualizar o aviso para explicar mapas de calor e reprodução de sessões. Versionar a escolha para que uma permissão antiga de estatísticas não seja ampliada silenciosamente. O formulário continuará funcionando mesmo quando o visitante recusar.

Carregar o Clarity somente após aceite. Integrar a API atual `consentv2` com `analytics_Storage` conforme a escolha e `ad_Storage` negado, preservando a decisão de não usar personalização de anúncios. A documentação informa que negar cookies pode manter coleta limitada sem cookies; portanto, essa chamada isolada não será considerada interrupção completa. Validar encerramento do runtime na revogação e ao sair das rotas permitidas, com transição de documento/recarga controlada se necessária. Remover apenas a tag de script não é suficiente para comprovar a parada. [ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

Aplicar mascaramento explícito ao formulário, mensagens com dados pessoais e widget de verificação, usando `data-clarity-mask` quando apropriado. Conferir as gravações com dados fictícios antes da coleta real. [Mascaramento de conteúdo](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking).

Não enviar e-mail, nome, telefone, hash de e-mail, credenciais, tokens ou valores dos campos em eventos, tags ou identificação de visitantes. A proteção de query/referrer do GA4 não se transfere ao Clarity: validar também URLs de página, links e referências. Revisar o aviso de privacidade para descrever o monitoramento e a mudança de preferência.

#### Ações e eventos

Os cliques e a rolagem observados pelo Clarity atenderão à análise geral. Para objetivos de negócio, reutilizar os pontos de instrumentação existentes e manter nomes controlados:

| Ação                           | Evento proposto    | Uso                                                                           |
| ------------------------------ | ------------------ | ----------------------------------------------------------------------------- |
| Clique em começar agora        | `cta_start_now`    | Relacionar intenção às sessões e ao ponto do CTA.                             |
| Clique em planos               | `cta_plans`        | Entender o interesse na proposta comercial.                                   |
| Tentativa de cadastro          | `waitlist_submit`  | Identificar início do envio, sem capturar o conteúdo informado.               |
| Cadastro confirmado pelo fluxo | `waitlist_success` | Encontrar sessões que concluíram o objetivo.                                  |
| Erro de validação ou envio     | `waitlist_error`   | Analisar dificuldades com categorias fixas, sem mensagens livres do servidor. |

O sucesso só será marcado depois da resposta positiva real do fluxo existente. Evitar eventos duplicados por re-renderização, clique e envio do mesmo formulário. Nomes e contexto de CTA serão reaproveitados das estruturas tipadas atuais. [Eventos e API do Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api).

#### Validação e arquivos prováveis

- Confirmar ausência de carregamento/coleta antes do aceite, após recusa, sem ID e nas rotas excluídas.
- Conferir o cenário Clarity habilitado com GA4 desabilitado, incluindo acesso às preferências pelo rodapé.
- Testar aceite, recusa, persistência da escolha, nova versão do consentimento e revogação.
- Testar navegação por SPA para login/admin depois de uma sessão consentida; comprovar que a gravação não acompanha essas áreas.
- Usar dados fictícios para verificar gravações, mapas de calor, eventos e mascaramento no painel do projeto. Nenhuma sessão real será gravada apenas para preparar este planejamento.
- Conferir que a integração não bloqueia formulário, menu ou renderização e não introduz erros de console ou impacto relevante de desempenho.

Pontos prováveis de integração: `src/components/analytics/marketing-analytics.tsx`, `src/lib/analytics.ts`, `app/layout.tsx`, controles de preferência do footer e da página de lançamento, formulário público, `.env.example`, testes de analytics existentes e `docs/marketing-integrations.md`. Manter a lógica interativa isolada nos componentes de cliente já apropriados.

## Search Console e atualização do resultado

Esta parte exige acesso à propriedade verificada do domínio, não disponível entre as ferramentas conectadas nesta sessão. O trabalho no código pode ser preparado sem esse acesso.

Durante o pré-lançamento, depois de publicar a proteção:

1. Confirmar ou verificar a propriedade do domínio.
2. Inspecionar o HTML público e confirmar que a Home e `/lancamento` entregam `noindex` sem bloqueio de rastreamento que impeça sua leitura.
3. Se a retirada precisar ser acelerada, solicitar remoção temporária dos URLs/prefixos pertinentes, considerando as versões com e sem `www`. Registrar exatamente o que foi solicitado.
4. Conferir nos relatórios a detecção da regra e a retirada das páginas. Não enviar sitemap para promover URLs com `noindex`.

### Liberação futura, somente quando autorizada

1. Remover o `noindex` apenas das páginas públicas aprovadas, mantendo login e admin desindexados.
2. Fazer novo build/publicação e conferir HTML, cabeçalhos e eventuais regras da hospedagem.
3. Publicar o sitemap com URLs públicas indexáveis. Cancelar eventual remoção temporária ainda ativa que conflite com a liberação.
4. Solicitar nova coleta da Home e das páginas aprovadas e conferir título, favicon e canonical selecionado.
5. Retomar métricas de impressões, cliques, CTR e posição média de **papum delivery**, usando filtros e períodos comparáveis.

Avaliar o crescimento somente depois da liberação e nova coleta, em janelas comparáveis de 28 dias quando houver dados suficientes. Durante a preparação, o critério de sucesso será a desindexação, não a melhora de posição.

## Visibilidade nas respostas de IA do Google

Essa frente fica preparada para o lançamento. Enquanto houver `noindex`, o objetivo é que as páginas não apareçam como resultados ou links de apoio nas experiências de pesquisa do Google; a nova prioridade substitui temporariamente a meta de crescimento.

AI Overviews e Modo IA usam os fundamentos de SEO. A página precisa estar indexada e elegível a exibir trechos. Não há arquivo especial, cadastro ou schema exclusivo que garanta presença nessas experiências. O trabalho será manter texto útil e acessível, informações verificáveis, identidade clara, navegação compreensível e boa experiência. [Orientação oficial para recursos de IA](https://developers.google.com/search/docs/appearance/ai-features).

Depois da base técnica e editorial, propor conteúdo original para dúvidas concretas dos restaurantes, por exemplo como organizar um cardápio digital e o que avaliar em um sistema de pedidos. Publicar gradualmente, a partir de conhecimento real do produto e das necessidades dos usuários, com identificação do responsável e revisão quando houver mudanças. Isso amplia as oportunidades de descoberta e de referência, sem garantir que o Google cite o site.

A pesquisa pública também encontrou [papum.app](https://www.papum.app/), com nome semelhante e uma proposta de cardápio digital. Não foi confirmada uma relação com este projeto; essa ocorrência reforça a necessidade de identificação consistente, sem assumir que outro domínio pertence à Papum Delivery.

## Critérios de conclusão da primeira entrega

- `noindex` confirmado no HTML público após a publicação, sem overrides que reativem indexação.
- Domínio final e canonical coerentes entre si, com sitemap reservado à futura liberação.
- Home com o título solicitado e conteúdo fiel ao pré-lançamento.
- Favicon da marca acessível e informado pelo HTML, sem regressão da versão já correta.
- Robots permitindo a leitura de `noindex`; páginas operacionais mantidas fora da indexação. Nenhum envio de sitemap para as páginas desindexadas.
- JSON-LD válido e apoiado em informações públicas reais.
- Faixa de marcas, seção de restaurantes parceiros e card/depoimento de Silva’s Pizza removidos.
- Layout e fluxo de cadastro preservados, com verificações técnicas aprovadas.
- Clarity configurável e independente do GA4, com consentimento informado, mascaramento verificado, eventos sem dados pessoais e interrupção efetiva na revogação ou saída do escopo.
- Publicação, verificação de desindexação e eventual remoção temporária documentadas quando houver acesso às ferramentas necessárias.

O primeiro ciclo passa a priorizar a desindexação temporária, a remoção das parcerias/depoimentos, os ajustes de identidade e a preparação do Clarity para testes consentidos. A divulgação, o envio de sitemap, a retomada do ranking e a expansão de conteúdo ficam para depois da autorização de lançamento.
