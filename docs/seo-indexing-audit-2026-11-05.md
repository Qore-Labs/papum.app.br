# Auditoria de indexação pública — 05/11/2026

Consulta HTTP em produção: aproximadamente 18h18, horário de Brasília.

## Conclusão

A produção já permite indexação. A resposta pública confirma o efeito esperado de `SITE_INDEXING_ENABLED=true`; não há evidência de que seja necessário outro deploy para remover o bloqueio nas URLs verificadas.

O histórico do projeto registra um bloqueio deliberado de pré-lançamento por `noindex`. Esse bloqueio pode explicar o desaparecimento, caso tenha sido processado pelo Google. A causa e a última coleta ainda precisam de confirmação no Search Console; indexabilidade atual não comprova presença no índice nem recuperação de posição.

## Respostas públicas verificadas

| Recurso | Resultado |
| --- | --- |
| `https://papum.app.br/` | Redireciona para a versão com `www`; destino HTTP 200. |
| `https://www.papum.app.br/` | HTTP 200; título `Papum Delivery - Gestão de Delivery`; meta robots `index, follow`; canonical `https://www.papum.app.br`; ausência de `X-Robots-Tag: noindex`. |
| Home com User-Agent de Googlebot | Mesmos sinais de indexação e HTTP 200. Essa simulação não substitui um acesso real do Google ou o teste publicado do Search Console. |
| `/robots.txt` | HTTP 200; `User-Agent: *`, `Allow: /` e anúncio de `https://www.papum.app.br/sitemap.xml`. |
| `/sitemap.xml` | HTTP 200; XML contendo Home e `/lancamento`. |
| `/lancamento` | HTTP 200; `index, follow`, canonical próprio e ausência de cabeçalho `noindex`. |
| `/login` | HTTP 200; `noindex, follow`, conforme a regra intencional da área de acesso. |

O conteúdo principal da Home está presente no HTML, incluindo apresentação, funcionalidades e FAQ. Não foi identificado, nas respostas verificadas, bloqueio de acesso ou conteúdo principal dependente exclusivamente de JavaScript.

## Código e build

- `src/utils/config/indexing.ts` aceita apenas o valor exato `true`.
- A chave controla os metadados raiz, o cabeçalho global em `next.config.ts`, o anúncio no robots e a resposta do sitemap.
- As respostas estáticas dependem de novo build com a variável correta. Alterar a configuração de um ambiente não modifica automaticamente um deployment anterior.
- A produção consultada já apresenta os sinais de liberação. O artefato `.next` local ainda contém `noindex`; ele não representa o domínio publicado.
- Não foram encontrados overrides indevidos nas páginas públicas. Login e área administrativa conservam suas regras próprias.

## Pesquisa e acesso aos relatórios

Na consulta direta ao Google por `papum delivery`, o domínio `papum.app.br` não apareceu na primeira página observada. Havia resultados de outros domínios e serviços com nomes semelhantes; não foi verificado vínculo entre eles e este projeto.

Na consulta `site:papum.app.br`, o Google informou que não encontrou documentos correspondentes. Esse operador não fornece uma lista exaustiva do índice e não substitui a Inspeção de URL.

A sessão disponível do Search Console abriu a tela de adicionar um site, sem propriedade da Papum consultável. O usuário confirmou nesta conversa que o Search Console ainda não foi configurado. Essa ausência não impede indexação, mas limita o diagnóstico pela falta de acesso ao relatório oficial. Não houve criação de propriedade, alteração de DNS, envio de sitemap ou solicitação de indexação nesta auditoria.

## Próxima verificação necessária

Cadastrar a propriedade do tipo **Domínio** com `papum.app.br` e concluir a verificação com o registro TXT gerado pelo Google no provedor DNS responsável. Depois, inspecionar `https://www.papum.app.br/` e registrar:

1. Status da indexação e motivo de eventual exclusão.
2. Data da última coleta e se o Google ainda registra `noindex`.
3. Canonical declarado e canonical selecionado pelo Google.
4. Resultado de **Testar o URL publicado**.
5. Existência de remoção temporária ativa para o domínio ou seu prefixo.
6. Estado do sitemap e, se já indexado, impressões/posição no relatório de desempenho.

Se o teste publicado estiver aprovado, solicitar indexação e enviar o sitemap, caso ainda não tenha sido enviado. Se houver remoção temporária ativa que conflite com a retomada, ela precisa de cancelamento próprio. O novo rastreamento pode levar dias a semanas, sem garantia de retorno à posição anterior.

## Referências oficiais

- [Google: bloqueio por noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=pt-br).
- [Google: Inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-BR).
- [Google: ferramenta de remoção](https://support.google.com/webmasters/answer/9689846?hl=pt-BR).
- [Google: solicitar novo rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=pt-br).
- [Google: limites do operador site:](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site).
- [Vercel: variáveis de ambiente e novos deployments](https://vercel.com/docs/environment-variables).

Não foram alterados código da aplicação, variáveis ou configurações de produção. A auditoria se baseia na leitura do repositório e nas respostas HTTP públicas.
