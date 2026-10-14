# Dashboard

## Escopo e modo

Operate. Primeira tela de gestão em `/dashboard`, dentro de `(admin)`, com a composição do Figma `27:3`.

## Tarefa e conteúdo

O gerente acompanha os pedidos recentes, encontra um pedido ou cliente e exporta o relatório do período. Os quatro pedidos e os avatares são demonstrações fornecidas pelo Figma. Busca, estados vazios, seleção de período e exportação devem funcionar no frontend.

## Composição e adaptação

Manter o header laranja, sidebar de 256 px, banner, toolbar e tabela no desktop. No mobile, abrir a navegação pela direita e apresentar todos os campos dos pedidos em cards. Preservar o footer compartilhado.

A implementação usa tabela a partir de 768 px e cards abaixo desse tamanho. A sidebar aparece a partir de 1024 px; abaixo disso, a navegação usa o drawer modal pela direita. Assim, o tablet de 768 px combina tabela e navegação pelo drawer.

## Movimento

A abertura ocasional do menu explica sua posição espacial. Usar o diálogo nativo, transform e backdrop com 260 ms e os easings existentes. Interações por teclado e movimento reduzido são instantâneos. Não animar os dados nem a entrada da página.

## Encerramento

Comparar desktop e mobile com o Figma, verificar todos os assets, navegação, teclado, menu, estados de busca e CSV. Registrar a origem dos assets em `docs/design/dashboard-assets.md`. Autenticação e áreas futuras continuam fora da integração desta etapa.

As medidas e o resultado da validação desta entrega estão registrados em `docs/design/dashboard-validation.md`.
