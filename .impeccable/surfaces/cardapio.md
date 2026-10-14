# Cardápio

## Escopo e modo

Operate. Implementar `/dashboard/cardapio` no grupo `(admin)`, seguindo o Figma `31:737` e herdando o shell administrativo existente.

## Tarefa e conteúdo

O gerente busca, filtra e acompanha a disponibilidade dos produtos. Os nove produtos, sete fotos, textos e preços são demonstrações do Figma. O usuário confirmou formulários locais de criação e edição; alterações duram até recarregar a página. Não há autenticação ou persistência nesta etapa.

## Direção e composição

Preservar o header laranja, sidebar, toolbar, três categorias e grade de três colunas no desktop. Usar duas colunas desde 640 px e três desde 1280 px; uma coluna nos celulares. A navegação usa o drawer existente abaixo de 1024 px. Preservar o footer compartilhado, os SVGs e os recortes originais. Escurecer textos pequenos e rótulos em laranja quando necessário para contraste.

## Interação

Busca por nome sem distinguir acentos, filtros combinados por categoria, estado vazio, switches com texto e ARIA, edição e criação validadas por RHF/Zod. Bebidas começa sem produtos porque o Figma não fornece itens nessa categoria. Formulários usam diálogo nativo com foco protegido, Escape, cancelamento e clique fora. Listagem, filtros e disponibilidade respondem imediatamente; manter a animação espacial existente no drawer e movimento reduzido.

## Encerramento

Comparar desktop, tablet e celulares com o Figma, conferir todas as fotos e ícones e validar os fluxos locais no navegador. Registrar a origem dos assets e a revisão final em `docs/design`.
