# Validação de Clientes

Referência: [Figma Pápum!, frame 146:85](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=146-85).

Registro da entrega em 14 de outubro de 2026. `/dashboard/clientes` estende o admin existente no modo Operate: o gerente busca e administra clientes na prévia. `PRODUCT.md` e `DESIGN.md` foram preservados; este registro descreve somente a superfície entregue.

## Composição e sistema observado

A sequência é busca, título e “Novo Cliente”, filtros, listagem, paginação e footer. A página conserva header laranja, sidebar, toolbar, superfícies neutras e listagem branca. No desktop, o header mede 82 px, a sidebar 256 px e a busca 448 × 40 px; o título começa em y = 194 px, a listagem em y = 306 px e o footer em y = 1105,5 px, ante 1105 px no frame.

Os tokens administrativos existentes governam fundos, controles, laranja e foco. Inter aparece nos controles e dados, Plus Jakarta Sans nos títulos e Be Vietnam Pro no footer. O título usa 28 px/36 px no celular e 36 px/40 px a partir de 640 px; nomes usam 16 px/20 px, contatos secundários e badges 12 px/16 px. A listagem tem cantos de 32 px, fundo branco, cabeçalho e paginação neutros, com sombra difusa.

Título, ações da toolbar e avatares são produzidos no Server Component; busca, filtros, paginação e edição ficam no workspace cliente. As sete linhas iniciais reproduzem o Figma, inclusive três repetições com IDs únicos. Os quatro avatares originais de 80 × 80 são renderizados em 40 × 40. Payloads JPEG sob nomes `.png` e a geometria dos SVGs originais foram preservados; o scan de origem encontrou cinco rasters e nenhuma origem ausente. O mapa está em [customers-assets.md](customers-assets.md).

## Responsividade observada

| Viewport   | Listagem | Navegação |
| ---------- | -------- | --------- |
| 1280 × 900 | Tabela   | Sidebar   |
| 768 × 1024 | Cards    | Drawer    |
| 390 × 844  | Cards    | Drawer    |
| 320 × 700  | Cards    | Drawer    |

A tabela aparece a partir de 1280 px; abaixo disso, os cards mantêm contato, status, último pedido, gasto e ações legíveis. A sidebar aparece a partir de 1024 px. Os quatro tamanhos ficaram sem overflow horizontal, e os formulários foram conferidos nos dois celulares. O gutter estável de 15 px e as colunas percentuais acomodam a largura disponível.

## Interações e limites da prévia

A busca aceita nome, e-mail e telefone e combina com os filtros. Recentes seleciona pedidos das últimas 48 horas; Mais Ativos ordena clientes ativos e VIP pelo total gasto. A ajuda explica os critérios e a duração dos dados. O estado vazio permite limpar filtros.

Cadastro e edição usam diálogo nativo com React Hook Form/Zod, seguindo o padrão de frontend confirmado em Cardápio. As ações permitem editar e ativar/desativar. O diálogo protege o foco, bloqueia o scroll do fundo e fecha por Cancelar, botão de fechar, Escape ou clique fora. Há foco visível, estados ARIA e anúncios de resultado; desativar no filtro Mais Ativos devolve foco ao filtro, e salvar leva foco ao cadastro salvo. O drawer respeita movimento reduzido.

Existem sete clientes e uma página inicialmente, com setas desabilitadas; um novo cadastro cria a segunda página. Os 2.840 clientes e três páginas do frame são ilustrativos. Novos clientes recebem “Sem pedidos”, gasto zero e placeholder SVG. Cadastro, edição e status duram até reload; não há backend, persistência ou upload nesta etapa.

## Verificações concluídas

A suíte passou com 75 testes em 13 arquivos. ESLint, Prettier e build do Next.js 16.3.1 também passaram. Os 39 checks de Playwright cobriram busca, filtros, vazio, e-mail, telefone, criação, edição, status, segunda página, validação, teclado, foco, reload, ajuda, navegação, drawer e movimento reduzido. O console registrou zero erros. A conferência local confirmou o título “Clientes | Pápum! Gestão”, somente Clientes como aba ativa, gutter estável e geometria correta dos SVGs.

O reviewer independente encerrou com `disposition: ship`, `persistence: pass`, fidelidade correspondente ou com adaptações intencionais, `ceilingReached` e nenhuma correção material pendente. Sua amostragem não incluiu types, lib, schema, conteúdo do dashboard ou icons; esse retorno não representa uma auditoria completa do código. Dez capturas finais e relatórios sustentaram a validação. Eram evidências temporárias; seus resultados ficam registrados aqui sem links para os arquivos.

## Adaptações e drift preservado

Cards responsivos, conteúdo e paginação derivados dos dados locais, texto preto no CTA, VIP em vermelho escuro, rótulos com contraste ajustado e colunas percentuais são adaptações desta tela. As duas marcações do detector para texto quase preto sobre laranja foram mantidas após a confirmação de contraste adequado. Header e footer preexistentes permaneceram fora do escopo.

O formato incumbente de `DESIGN.md`, sem frontmatter e sem seções canônicas, permanece como drift preexistente. Esta extensão comum não autorizou migração do documento ou sidecar; nenhum defeito ou adaptação local foi canonizado como regra global.
