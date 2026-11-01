# Proposta de reformulação da landing Papum

Data: 31/10/2026. Planejamento aprovado e implementado localmente; sem publicação. As decisões de execução abaixo prevalecem sobre as alternativas históricas deste documento.

## Decisões confirmadas durante a execução

- **Somente envio de e-mail, sem banco de leads**, por escolha expressa do usuário. Não implementar qualificação posterior, contagem de interessados únicos ou promessa de deduplicação permanente. Sucesso significa aceitação das duas mensagens pelo Resend; a idempotência do provedor limita reenvios equivalentes por 24 horas.
- CTA único “Cadastrar-se”, com formulário na própria Home e na entrada `/instagram`. A origem controlada segue para os eventos e para a notificação interna.
- Instagram oficial: [@usepapumdelivery](https://www.instagram.com/usepapumdelivery/), compartilhado entre site e e-mails.
- Texto aprovado: **“A marca é sua. A estrutura é Pápum.”** FAQ **“Dúvidas frequentes”**, com personalização, público, próximos passos, gratuidade e cancelamento dos e-mails.
- O usuário rejeitou o dado de adoção de 39%. A versão implementada usa o resultado de receita observado no [estudo interno UpMenu, junho de 2026](https://www.upmenu.com/case-studies/restaurant-mobile-app/), identificado como comparação antes/depois. Em revisão posterior, pediu remover do layout a referência, a explicação e o aviso, mantendo somente o dado com período e grupo analisado. A origem e o método permanecem nesta documentação: comparação observacional dos mesmos clientes nos seis meses antes/depois, com 72.468 clientes de 1.337 restaurantes em 69 países. Não é uma promessa da Papum nem aumento comprovadamente causal de todo o faturamento.
- Na landing, a verificação Turnstile só é montada ao enviar um e-mail válido e usa `interaction-only`. A validação de segurança no servidor permanece obrigatória. Isso remove o bloco do estado inicial; a autorização de hostnames no painel Cloudflare continua necessária.
- Análise limitada sem cookies por padrão, sem banner inicial; rodapé permite desativar ou conceder cookies de análise. Recusas anteriores continuam sendo respeitadas. Login e dashboard ficam fora da coleta.
- Indexação continua desativada. Credenciais externas, entrega real de e-mails e painéis não foram alterados nem validados com envios reais.

## Direction contract

THESIS: apresentar app com a marca do restaurante e painel Papum como partes conectadas; conduzir a um único cadastro de e-mail, sem clientes ou resultados inventados.

OWN-WORLD: preservar logo, Plus Jakarta Sans, Be Vietnam Pro, amarelo `#ffc400`, laranja, carvão `#191817` e creme. SVGs originais dos posts; composição gráfica editorial e divisores, com controles em pílula.

STORY: entender o produto, explorar cardápio/pedidos/contatos, avaliar o valor de um canal próprio e deixar o e-mail. A informação sobre disponibilidade fica junto do cadastro.

FIRST VIEWPORT: desktop com título e formulário à esquerda e arte do produto à direita. No mobile, título, explicação e cadastro precedem a arte. Header compacto, sem sobreposição com o título.

FORM: execução em código a partir do plano aprovado e das referências originais da marca; sem comp gerado ou seed de catálogo. Interação principal: troca manual entre Cardápio, Pedidos e Contatos, com feedback imediato e sem avanço automático. Entrada da arte em 480 ms e transições de 160–220 ms, respeitando movimento reduzido.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Objetivo e escopo

Explicar a proposta da Papum para donos de restaurantes e transformar interesse em e-mails registrados de forma confiável. A página apresenta app com a identidade do restaurante e painel para cardápio, pedidos e contatos. A linguagem principal descreve esse produto; não repete avisos de lançamento em todos os blocos.

O novo pedido autoriza planejar a Home inteira. As decisões anteriores de preservar determinados blocos deixam de limitar esta proposta, mas as rejeições do mockup Vila Burger orientam a qualidade e a clareza da próxima composição. A execução depende da validação deste planejamento. Dashboard, autenticação e operação real do delivery ficam fora do escopo.

O produto ainda está em desenvolvimento, conforme o usuário e o código. Isso não precisa dominar o marketing, mas o cadastro não pode sugerir conta operacional, contratação ou acesso imediato. A informação fica concentrada junto ao formulário. Não haverá oferta gratuita, resultado comercial, disponibilidade, avaliação ou cliente inventado.

## Diagnóstico do estado atual

| Hoje                                                                              | Proposta                                                                | Motivo                                                                    |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Scooter, fotografia de entregadora e comunicação próxima de um serviço de entrega | Ilustrações e demonstrações que expliquem app, pedidos e painel         | Tornar claro o que a Papum oferece ao restaurante                         |
| Números de clientes/pedidos, avaliações e oferta sem comprovação                  | Benefícios explicados e, opcionalmente, um dado de mercado identificado | Evitar prova social ou promessa comercial fictícia                        |
| CTAs abrem outra aba em `/lancamento`                                             | Cadastro na própria landing, alcançado por âncoras                      | Manter a continuidade da visita, especialmente no navegador do Instagram  |
| Contatos enviados por e-mail sem base durável                                     | Registro deduplicado de interessados, com origem                        | Contar pessoas interessadas sem depender do total de eventos ou mensagens |
| Clarity bloqueia queries; GA4 remove queries e não envia campanha normalizada     | Entrada `/instagram` com origem controlada e integração explícita       | Um UTM sozinho não produz atribuição correta no código atual              |

Os documentos PRODUCT.md e DESIGN.md ainda contêm decisões históricas sobre Vila Burger que não descrevem a seção restaurada atual. Na execução aprovada, atualizar somente a documentação relacionada à nova Home, sem normalizar outras áreas como efeito colateral.

## Direção visual

Leitura: landing de produto B2B para restaurantes, com linguagem acolhedora e gráfica, orientada à compreensão e ao cadastro.

- Preservar logo, raio, laranja Papum, amarelo dos posts, carvão e superfícies claras. Usar carvão para contraste e para a ação principal sobre amarelo; evitar um CTA com cor diferente em cada seção.
- Manter as famílias já carregadas: Plus Jakarta Sans nos títulos e a fonte atual da landing no corpo. Trabalhar hierarquia, largura de texto e respiro antes de adicionar fontes.
- Hero em duas colunas no desktop: mensagem e formulário à esquerda; composição do produto à direita. No mobile: título, explicação e cadastro antes da arte.
- Composição editorial, com divisores e áreas de cor, sem converter toda a página numa sequência de cards iguais.
- Priorizar SVGs originais e demonstrações com contexto. Fotos de comida podem aparecer dentro da interface de exemplo, em vez de ocupar o papel de imagem principal do produto.
- Caso uma tela de app seja necessária, exportar o frame correto em resolução adequada ao tamanho e à densidade de exibição. Preservar a proporção e identificar a demonstração; a qualidade deve ser validada em desktop e mobile antes da integração.

Referências conferidas pelo MCP do Figma:

- [Tela 01 — Seu delivery, mais controle](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-22): hierarquia forte, campos de cor e raio como assinatura.
- [Tela 04 — Pedidos e clientes em um só painel](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-397): SVGs de recibo/sacola e contatos, contraste e explicação por assunto. Já existem equivalentes locais em `public/home/product/`.
- [Tela 05 — Sua marca, estrutura Pápum](https://www.figma.com/design/muyat2CqsPDNHdEvRQy2VC/?node-id=30-491): relação entre identidade do restaurante e tecnologia Papum. Aproveitar a ideia visual, sem importar os avisos de lançamento do post como texto principal da LP.

Referências de sites reais consultadas em 31/10/2026:

- [Owner — How Owner Works](https://www.owner.com/how-owner-works): sequência curta liga cada etapa a uma imagem e a uma explicação concreta.
- [Toast — Online Ordering](https://pos.toasttab.com/products/online-ordering): categoria explícita, benefício curto, demonstração contextual e CTA recorrente.

Adaptar esses princípios à identidade Papum. Resultados, marcas e recursos desses serviços não são evidência nem promessa da Papum.

## Arquitetura da página proposta

Header compacto: logo, links para Produto e Como funciona, e ação “Cadastrar-se”. A página teria cinco blocos principais, mais rodapé.

| Bloco                           | Conteúdo                                                              | Composição e ação                                                                                             |
| ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1. Explicação imediata          | “Seu delivery. Menos bagunça. Mais controle.”                         | Campo de e-mail e CTA visíveis; arte conecta identidade do restaurante, cardápio e pedidos                    |
| 2. Produto em contexto          | “A marca é sua. A organização também.”                                | App do cliente e painel do restaurante apresentados como duas partes da proposta; demonstrações identificadas |
| 3. O que a Papum reúne          | Cardápio, pedidos e contatos, em explicações breves                   | Seção editorial com SVGs e uma interação guiada opcional; CTA volta ao cadastro                               |
| 4. Por que ter um canal próprio | Marca reconhecível e experiência organizada; dado de mercado opcional | Faixa curta com fonte e ano visíveis, sem depoimentos ou marcas fictícias                                     |
| 5. Dúvidas e fechamento         | Marca do app, conteúdo do painel e funcionamento do cadastro          | Respostas curtas; chamada final leva ao mesmo formulário, sem nova aba                                        |

Evitar repetir a mesma explicação nos blocos 2 e 3: o primeiro mostra a relação app/painel; o segundo detalha, em poucas linhas, o que cada frente organiza. Se a página ficar longa, unir esses dois blocos antes de aumentar o volume de texto.

### Exemplo de texto do primeiro bloco

Título: **Seu delivery. Menos bagunça. Mais controle.**

Apoio: **Um app com a sua marca e um painel para organizar cardápio, pedidos e contatos.**

CTA principal e ações compactas da navegação: **Cadastrar-se**. Usar o mesmo rótulo para a mesma jornada de cadastro de interesse.

Microtexto junto ao formulário: **Cadastro de interesse. Avisaremos por e-mail quando a plataforma estiver disponível.**

“Quero aproveitar” pode substituir o rótulo quando existir uma vantagem concreta aprovada. Não criar urgência, desconto ou promessa de acesso para justificar o botão.

## Cadastro e confirmação

- Um formulário principal com e-mail como único campo obrigatório. Label visível, teclado de e-mail, autocomplete e estados acessíveis.
- CTAs da página levam a `#cadastro` e dão foco útil ao campo. A página existente `/lancamento` continua funcionando para links antigos; pode compartilhar o mesmo formulário e texto de confirmação.
- Enquanto envia: impedir duplicação de submissão e informar o estado. Em falha: preservar o e-mail e permitir nova tentativa. Turnstile e validação no servidor permanecem.
- Sucesso somente após registro durável: “Seu interesse foi registrado. Você receberá informações da Papum por e-mail.” O envio da confirmação por Resend é acompanhado separadamente.
- Após sucesso, perguntar opcionalmente: “Hoje, como você recebe os pedidos do delivery?” com opções curtas e “Agora não”. Essa resposta qualifica a demanda sem bloquear o cadastro inicial.
- Informar finalidade das mensagens, política de privacidade e forma de cancelamento. Atualizar a confirmação por e-mail para o mesmo tom da nova página.

## Animações com propósito

Usar CSS e pequenos componentes de interação, sem instalar uma biblioteca para animar toda a página.

| Momento                | Proposta                                                                                 | Parâmetros iniciais                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Arte explicativa       | Uma sequência curta conecta cardápio, pedido e painel ao entrar na área visível          | Uma vez; 350–500 ms no conjunto, usando transform/opacity; texto e formulário já visíveis |
| Exploração de recursos | Se houver etapas selecionáveis, destacar a escolhida e trocar a explicação junto da ação | 160–220 ms, deslocamento máximo de 8 px; navegação por teclado e sem avanço automático    |
| Botões                 | Feedback de cor e pressão sutil                                                          | 100–160 ms; hover apenas em ponteiro compatível                                           |
| Envio do formulário    | Transição entre enviando, erro e sucesso sem salto de layout                             | 150–220 ms, mensagem anunciada de forma acessível                                         |

Curva de saída existente: `cubic-bezier(0.23, 1, 0.32, 1)`. Reduzir deslocamentos com `prefers-reduced-motion`; manter conteúdo e ação utilizáveis sem animação. Não esconder texto principal aguardando JavaScript, prender o scroll ou usar loops contínuos junto do formulário.

## Evidência numérica

Uma possibilidade é a pesquisa Abrasel publicada em 14/03/2025, com 2.176 donos de estabelecimentos: 39% investiam em aplicativos **ou sites** próprios, com respostas múltiplas. O dado serve como contexto de adoção, não como resultado da Papum nem como aumento causado pelo aplicativo. O artigo não detalha seleção/ponderação da amostra. [Fonte primária](https://abrasel.com.br/noticias/noticias/whatsapp-representa-26-do-faturamento-delivery-bares-restaurantes/).

Texto candidato: **“39% dos estabelecimentos pesquisados investiam em app ou site próprio.”** Apoio visível com Abrasel, 2025 e link para a pesquisa.

Não foi encontrada, nas fontes selecionadas, uma estimativa causal generalizável de aumento de vendas por criar app próprio. Se o dado não ajudar a explicação, a primeira versão pode dispensar números. Remover os atuais “+500”, “+50k”, “4.9”, “15 min”, “milhares já estão pedindo” e a oferta de primeiro mês grátis sem confirmação comercial.

## URL do Instagram e atribuição

URL proposta para a bio: **https://www.papum.app.br/instagram**. Será uma rota planejada; ainda não foi criada.

- Servir a mesma landing por componente compartilhado, com canonical da Home. Não criar uma segunda campanha com conteúdo diferente.
- A rota define valores controlados: origem `instagram`, mídia `social`, campanha `validacao` e posição `bio`.
- Levar essa origem ao formulário e ao registro do interessado. GA4 e Clarity recebem somente valores de catálogo, sem e-mail, identificador do lead ou texto livre.
- Ampliar as listas de rotas públicas permitidas para incluir essa entrada e os fragmentos seguros do novo layout, como `#cadastro` e os links do header. Hoje o Clarity só admite `#proposta` e `#como-funciona`; uma âncora nova sem essa atualização interromperia a gravação. Manter login e dashboard fora da coleta.
- A URL limpa evita depender de query no link principal. Tráfego com referrer contendo query ainda exige tratamento validado antes de ativar replay; não liberar URLs arbitrárias só para aumentar cobertura.
- Para anúncios, stories ou reels futuros, aceitar UTMs apenas por lista de parâmetros e valores conhecidos, normalizar a origem antes das tags e não enviar a URL bruta. Configurar explicitamente os campos de campanha suportados no GA4.
- Acesso pelo link significa **entrada atribuída ao link do Instagram**; o link pode ser compartilhado fora da rede social. Sem persistência autorizada, a atribuição entre dispositivos/visitas permanece limitada.
- Onde a política permitir persistir a campanha, guardar primeira e última origem com expiração definida; uma visita direta não deve apagar uma campanha anterior válida. Para o cadastro imediato em `/instagram`, a origem já é conhecida sem inventar uma identidade persistente do visitante.

## Base de interessados e medição

A fonte oficial de contagem será uma base durável de leads, não GA4, replay ou a quantidade de e-mails enviados.

- Tabela enxuta com e-mail normalizado e único, datas, origem, estado de inscrição e versão do texto informado. Eventual qualificação opcional fica separada. Escolher a instância de persistência conforme a infraestrutura disponível na execução.
- Deduplicação por índice único; não remover pontos ou aliases `+` do endereço. Repetição recebe resposta pública equivalente, sem expor quem já está inscrito.
- Separar gravação do lead e entrega de e-mail. Falha do provedor não pode apagar um contato salvo; registrar pendência de envio e permitir repetição idempotente.
- Exportação protegida ou relatório interno simples. Não construir um CRM ou um novo dashboard do produto para validar a landing.
- O cadastro e o registro da origem informada pela rota não dependem de o usuário aceitar gravações de navegação. A base precisa ter finalidade e política próprias.

Funil proposto: **visita → clique no CTA → início do formulário → tentativa → cadastro salvo**. Registrar erro por categoria controlada. O resultado atômico da inserção determina internamente `lead_created`, somente para um contato novo. Resposta pública e comportamento do formulário permanecem equivalentes para cadastro novo e repetido, sem revelar se um e-mail já existia. O `generate_lead` atual do GA4 pode continuar representando formulário aceito, inclusive repetição; documentar essa unidade e não usá-lo como contagem de pessoas interessadas.

Métricas: interessados únicos, interessados por origem, visitas atribuídas observadas, abandono, falhas de verificação/envio e respostas de qualificação. Toda taxa de conversão usa numerador e denominador da mesma população, período e campanha. A conversão observada no GA4 considera somente a população efetivamente medida; o total de leads persistidos aparece separadamente. Não dividir todos os leads do banco pelas visitas parciais do GA4. Cliques, eventos, sessões e pessoas não serão tratados como a mesma unidade.

Para decidir desenvolvimento: combinar essa demanda com entrevistas e teste de disposição a pagar. A hipótese de receita mensal é **leads qualificados × conversão estimada em pagantes × mensalidade**. Comparar com aquisição, operação, infraestrutura e suporte; cadastro de e-mail não equivale a venda nem a lucro. Preço, orçamento e critérios de avanço serão definidos antes da campanha de validação, sem apresentá-los como benchmarks de mercado.

## Coleta ativa e preferências no rodapé

O objetivo solicitado é remover a interrupção de um banner e manter medição disponível desde a entrada, com controle acessível no rodapé. Isso não equivale a registrar consentimento como concedido por ausência de escolha.

Planejar analytics de audiência minimizado, desativação efetiva no rodapé e respeito a recusas anteriores. A ativação automática de cookies/replay depende da base definida para esse tratamento e do visitante. A ANPD admite legítimo interesse para audiência em determinados contextos, sujeito à avaliação e transparência; cookies baseados em consentimento começam desativados. Um link no rodapé, isoladamente, não resolve toda essa avaliação. [Guia ANPD, seções sobre bases legais e banners](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file).

No Clarity, manter modo limitado quando não houver consentimento aplicável; gravações completas/cookies seguem a configuração e os requisitos pertinentes. A Microsoft exige sinal válido para funcionalidade completa em visitas do EEE, Reino Unido e Suíça. Esse ponto precisa ser resolvido antes de habilitar replay irrestrito sem aviso. [Consent Mode oficial](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode).

Manter mascaramento do formulário, nenhum e-mail/hash/token em eventos e publicidade desativada. “Desativar análise” deve interromper os envios e a gravação, persistir a preferência e permitir reativação consciente. A arquitetura da medição não pode depender de coletar tudo de todos para contar interessados.

## SEO, frontend e qualidade

- Manter Next.js 16.3.1, React 19.2.4 e Tailwind v4 atuais. Conteúdo estático em Server Components, conteúdo repetível em dados tipados e ilhas pequenas para formulário, preferências e interação explicativa.
- Revisar título, descrição e Open Graph para explicar Papum Delivery, app para restaurantes e gestão de delivery. Preservar favicon/logo corretos e gerar imagem social coerente com a nova composição.
- HTML semântico, um H1, hierarquia de títulos, conteúdo importante em texto real, imagens dimensionadas e links claros. Dados estruturados só com informações demonstráveis; sem notas/reviews, preços ou disponibilidade inventados.
- Preservar **noindex** até autorização posterior de liberação pública. Preparar canonical e sitemap para essa etapa sem ativar indexação durante o redesign.
- Conteúdo claro e fontes primárias ajudam a compreensão, inclusive por mecanismos de IA. Não existe marcação especial que garanta recomendação ou primeira posição. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).
- SVGs locais, raster otimizado quando necessário, `sizes` coerente, dimensões reservadas e prioridade só para recursos críticos. Conteúdo e cadastro têm precedência sobre animação e tags de terceiros.
- Metas de experiência: LCP até 2,5 s, INP até 200 ms e CLS até 0,1; medir em laboratório na entrega e acompanhar dados de campo quando houver tráfego suficiente. [Web Vitals](https://web.dev/articles/vitals).

## Sequência e critérios de aceite

1. Validar esta estrutura, os exemplos de texto e a política de coleta proposta.
2. Produzir proposta visual de desktop e mobile com assets corretos do Figma, antes de integrar a página inteira.
3. Após aprovação visual, implementar landing, formulário na página e rota `/instagram`.
4. Integrar base deduplicada, atribuição, eventos e estados de preferências; alinhar a confirmação por e-mail.
5. Validar lint, tipos, build e testes relevantes de envio, deduplicação, origem e desativação de coleta, com provedores simulados.
6. Usar Playwright em Chromium e WebKit, nas larguras 320, 390, 768, 1024 e 1440 px: carregamento, legibilidade, ausência de overflow, teclado/foco, erros, movimento reduzido e navegação pelo navegador interno do Instagram quando disponível para teste real.
7. Conferir GA4/Clarity em ambiente controlado e aprovação final; publicar somente após a autorização correspondente.

Aceite: o visitante entende app e painel em poucos segundos; cadastro está visível cedo no mobile; toda ação principal leva ao mesmo formulário; números têm fonte/contexto; um cadastro não vira dois interessados; a origem Instagram aparece no lead; preferências funcionam; nenhuma demonstração parece checkout operacional; nenhuma alteração reativa indexação por acidente.
