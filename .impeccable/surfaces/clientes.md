# Clientes

## Escopo e direção

Operate. `/dashboard/clientes`, grupo `(admin)`, referência Figma `146:85`. Estender o shell existente: header laranja, sidebar e toolbar, superfícies neutras, listagem branca e footer compartilhado. Inter nos controles, Jakarta nos títulos e Be Vietnam Pro no footer.

## Conteúdo e interação

Preservar sete linhas da demonstração e os quatro avatares originais, inclusive as repetições do frame, com IDs distintos. Busca por nome, e-mail e telefone; Recentes seleciona pedidos das últimas 48 horas; Mais Ativos ordena ativos e VIP pelo gasto. Cadastro e edição locais com RHF/Zod, sem persistência, seguindo o padrão confirmado da prévia administrativa. Ações permitem editar ou ativar/desativar. Nenhum novo cliente recebe pedidos ou gasto inventados.

## Composição

Título, descrição e Novo Cliente; listagem com filtros, cabeçalhos, sete linhas e paginação. Tabela a partir de 1280 px; abaixo disso, cards sem rolagem horizontal. Sidebar a partir de 1024 px; drawer herdado nos tamanhos menores. Paginação usa os dados disponíveis (sete inicialmente), sem afirmar os 2.840 clientes ilustrativos do Figma. Novos cadastros habilitam páginas adicionais. Textos e controles ganham contraste e alvos adequados.

## Encerramento

Concluído nos viewports 1280 × 900, 768 × 1024, 390 × 844 e 320 × 700, sem overflow horizontal. Passaram 75 testes e 39 checks de Playwright, além de ESLint, Prettier e build. O reviewer independente encerrou com `disposition: ship` e nenhuma correção material pendente. Resultados e limites registrados em [customers-validation.md](../../docs/design/customers-validation.md); mapa de origem em [customers-assets.md](../../docs/design/customers-assets.md).
