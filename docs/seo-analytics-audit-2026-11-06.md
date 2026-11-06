# Auditoria de indexação e medição — 06/11/2026

Verificação iniciada às 16h38, horário de Brasília. Escopo: repositório, respostas públicas do site e leitura dos painéis disponíveis no navegador. Nenhuma configuração de produção foi alterada.

## Resultado

O site publicado permite indexação. O GA4 apresenta uma interrupção de dados reportados: zero nos últimos sete dias e aviso de ausência de dados no fluxo nas últimas 48 horas. O Clarity tem histórico de tráfego: 34 sessões nos últimos 30 dias; o período de um dia consultado inicialmente estava zerado.

A configuração do consentimento é uma hipótese forte para a baixa medição no GA4. A causa da ausência no índice do Google depende da Inspeção de URL no Search Console. A sessão disponível mostra a tela de adicionar um site, sem uma propriedade consultável. O usuário informou que não sabe confirmar se o domínio foi verificado em outra conta.

## Respostas públicas atuais

| Recurso                          | Evidência                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `https://papum.app.br/`          | HTTP 308 para `https://www.papum.app.br/`.                                                                                                                   |
| Home com `www`                   | HTTP 200; título `Papum Delivery - Gestão de Delivery`; `robots=index, follow`; canonical `https://www.papum.app.br`; sem cabeçalho `X-Robots-Tag: noindex`. |
| Home com User-Agent de Googlebot | HTTP 200 e os mesmos sinais. Simulação de User-Agent não comprova acesso de um Googlebot real.                                                               |
| `/lancamento`                    | HTTP 200; `index, follow`; canonical próprio; sem cabeçalho `noindex`.                                                                                       |
| `/robots.txt`                    | HTTP 200; `User-Agent: *`, `Allow: /`; anuncia o sitemap com `www`.                                                                                          |
| `/sitemap.xml`                   | HTTP 200; XML com a Home e `/lancamento`.                                                                                                                    |
| HTML da Home                     | Conteúdo principal e H1 presentes na resposta do servidor.                                                                                                   |

As respostas foram salvas em `output/seo-analytics-audit-2026-11-06/`. A idade do cache não caracteriza bloqueio: o conteúdo efetivamente entregue já contém `index, follow`.

O histórico Git confirma que a política global de bloqueio foi introduzida no commit `2018182`, em 30/10/2026 às 13h57 de Brasília. A data de liberação pela variável de produção não pode ser inferida do Git. O bloqueio anterior pode ter causado desindexação, mas isso ainda não foi confirmado pelo Google.

`SITE_INDEXING_ENABLED` aceita apenas o valor exato `true` e é avaliado no build. O `.env.local` contém duas definições com `false`; isso não representa o deployment atual, mas exige atenção em futuros builds locais que carreguem esse arquivo. Login e área administrativa mantêm `noindex` intencionalmente.

## Painéis consultados

| Ferramenta           | Observação                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search Console       | Na conta aberta, tela de boas-vindas com “Adicionar um site”; sem propriedade disponível para inspeção. Não foi criada propriedade nem alterado DNS.                                                                         |
| GA4                  | Propriedade `559262397`, fluxo `16138576221`, medição `G-1K5QS8FPJ8`. ID do painel corresponde ao HTML e ao script instalado no site.                                                                                        |
| GA4 — período        | Home mostra zero usuários, eventos e visualizações nos últimos sete dias, de 30/10 a 05/11. Um cartão de país para os últimos 30 dias mostra cinco usuários no Brasil, indicando dados históricos.                           |
| GA4 — fluxo          | Avisos de coleta inativa e de nenhum dado recebido nas últimas 48 horas.                                                                                                                                                     |
| GA4 — filtros        | Único filtro listado: `Internal Traffic`, exclusão, estado `Testing`. Não é uma exclusão ativa que explique o zero.                                                                                                          |
| GA4 — URL cadastrada | Ainda `https://papumappbr.vercel.app`. O Clarity está conectado a esse mesmo fluxo. Recomenda-se atualizar para `https://www.papum.app.br`, sem atribuir a interrupção apenas a esse cadastro: o ID de destino está correto. |
| Clarity              | Projeto `z5hqjof5ys`, URL `www.papum.app.br`. Últimos 30 dias: 34 sessões, 34 usuários únicos e 35 sessões classificadas como bots excluídas.                                                                                |
| Clarity — páginas    | Home de produção com 30 sessões; `/instagram` com duas; um endereço de preview da Vercel com duas. O projeto mistura algum tráfego de preview e produção.                                                                    |
| Clarity — exclusões  | Nenhum endereço IP bloqueado.                                                                                                                                                                                                |

Na aba pública já aberta, os scripts GA4, tag do Clarity e runtime do Clarity estavam presentes. Isso comprova carregamento nessa visita, mas não confirma processamento dos eventos pelo GA4.

## Limitações de medição encontradas no código

1. **Consentimento permanece negado por padrão.** `src/lib/analytics.ts` configura `analytics_storage: denied`. `MarketingAnalytics` inicia as preferências fechadas; aceitar cookies exige abrir o controle do rodapé. A recusa persistida desativa integralmente GA4 e Clarity.
2. **Pings sem cookies não equivalem a usuários reportados.** O Google usa esses pings para modelagem. A modelagem exige volume mínimo elevado; sem dados consentidos suficientes, os eventos negados podem não aparecer nos relatórios. Isso é compatível com um site pequeno que registra visitas no Clarity e permanece zerado no GA4, mas não confirma sozinho a causa da conta. [Google: modelagem comportamental](https://support.google.com/analytics/answer/11161109?hl=pt-BR), [modo de consentimento](https://support.google.com/analytics/answer/13802165?hl=pt-BR).
3. **Origem das visitas removida.** O GA4 recebe `page_referrer: ""` e URLs sem query. Isso prejudica atribuição de busca, referências e UTMs convencionais. `/instagram` recebe uma campanha definida no código. A limpeza da origem, isoladamente, não explica o total zero.
4. **Clarity exclui URLs com parâmetros.** `src/lib/clarity.ts` impede carregamento se a página tiver qualquer query, incluindo UTMs e identificadores de anúncios; também exclui referrers com query ou fragmento. É uma proteção deliberada do código que reduz a cobertura de campanhas.
5. **Rotas medidas limitadas.** Somente `/`, `/instagram` e `/lancamento`. Visitas ao login, painel e privacidade não entram nessa medição.

O Clarity suporta coleta limitada sem cookies; portanto, consentimento de armazenamento negado não explica sozinho zero sessões nessa ferramenta. [Microsoft: ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2).

## Validação em navegador real

Foi usada uma sessão isolada do Playwright CLI. As chamadas de coleta do Google Analytics e do Clarity foram interceptadas localmente antes da navegação, para não gerar visitas artificiais nos relatórios.

| Cenário                           | Resultado                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home sem escolha de consentimento | Scripts oficiais HTTP 200; `page_view` do GA4 preparado para o ID correto com armazenamento de análise negado; Clarity carregado e tentativa de coleta presente. |
| Home com parâmetros UTM           | GA4 prepara `page_view`, removendo os parâmetros da URL enviada. Clarity não carrega, conforme o bloqueio do código.                                             |
| Recusa persistida                 | Nenhum script GA4/Clarity ou tentativa de coleta.                                                                                                                |
| Aceite persistido                 | Ambos os scripts carregam; GA4 prepara `page_view` com armazenamento de análise concedido e publicidade negada.                                                  |

Na rodada final, concluída às 16h46, cada cenário começou com documento e cookies limpos. Não foram observados erros de JavaScript. Os registros `ERR_ABORTED` são cancelamentos provocados pela navegação preparatória do teste, não evidência de falha do site. O teste confirma a execução e a tentativa de envio; como a coleta foi interceptada, não comprova recebimento ou processamento pelo Google. Evidência estruturada em `output/playwright/papum-analytics-audit/runtime.json`.

## Próximos passos concretos

1. Verificar se existe propriedade do domínio em outra conta do Search Console. Se não houver, cadastrar e verificar `papum.app.br`.
2. Inspecionar `https://www.papum.app.br/`: motivo de exclusão, última coleta, canonical selecionado e eventual remoção temporária. Testar a URL publicada; após aprovação, solicitar indexação e enviar `https://www.papum.app.br/sitemap.xml`. Permitir indexação não garante inclusão imediata; um novo rastreamento pode levar dias a semanas. [Inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-BR), [solicitação de rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=pt-br).
3. Corrigir a experiência de consentimento para apresentar uma escolha visível na primeira visita, preservando recusas e mantendo publicidade desativada. Não conceder consentimento automaticamente.
4. Atualizar a URL cadastrada do fluxo GA4 e revisar a atribuição com dados permitidos e sanitizados, em vez de remover toda origem de navegação.
5. Revisar o bloqueio integral do Clarity em campanhas e separar tráfego de preview. Validar novas visitas consentidas no GA4 após eventual publicação das correções.

Esta entrega é uma auditoria. Não houve edição do código da aplicação, deploy, alteração dos painéis, envio de sitemap ou solicitação de indexação.
