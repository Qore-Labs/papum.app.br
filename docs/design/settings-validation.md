# Validação de Configurações

Referência: [Figma Pápum!, frame 146:530](https://www.figma.com/design/2ZHixVPK8P16tYdzRmp4B9/P%C3%81PUM?node-id=146-530).

Registro da entrega em 14 de outubro de 2026. `/dashboard/configuracoes` estende o admin no modo Operate: o gerente preenche o cadastro de estabelecimento na prévia. `PRODUCT.md` e `DESIGN.md` foram preservados.

## Composição e sistema observado

A sequência é título e Novo Cadastro; informações; dias e horários; endereço; dados bancários; ações; footer. O frame tem header laranja (82 px), sidebar (256 px), quatro painéis brancos e campos cinza; a toolbar de busca está oculta no Figma e ausente na página. No desktop, o título começa em y = 114 px e o formulário em y = 218 px.

| Painel                         | Início vertical | Altura |
| ------------------------------ | --------------- | ------ |
| Informações do Estabelecimento | 218 px          | 282 px |
| Horário de Funcionamento       | 532 px          | 297 px |
| Endereço Completo              | 861 px          | 371 px |
| Dados Bancários                | 1264 px         | 371 px |

O footer começa em y = 1753 px, ante 1752 px na referência. Painéis têm cantos de 12 px, padding de 20 px no celular e 32 px a partir de 640 px, intervalo de 32 px e sombra difusa. `admin-field` (`#e2e2e2`) e `admin-yellow` (`#ffbb00`) estendem localmente os materiais do Figma. Jakarta aparece nos títulos, Inter nos controles e Be Vietnam Pro no footer. Arimo pertence somente ao painel bancário copiado do frame `217:1129`.

Título e headings permanecem no Server Component; estado e eventos ficam no formulário cliente. Arrays tipados definem 19 campos, renderizados pelo componente reutilizável, além do grupo controlado dos sete dias. Onze SVGs originais foram convertidos para a biblioteca tipada, com geometria e máscara bancária preservadas. Logos, avatar, navegação e footer foram reutilizados; nenhum raster novo. O scan de origem encontrou um raster e nenhuma origem ausente. Mapa em [settings-assets.md](settings-assets.md).

## Responsividade e acessibilidade

Foram conferidos 1280 × 900, 768 × 1024, 390 × 844 e 320 × 700, sem overflow horizontal; o gutter estável ocupa 15 px. Campos usam duas colunas a partir de 640 px e uma abaixo; endereço passa a 12 colunas a partir de 1024 px. Dias ocupam sete colunas no tablet e duas linhas de quatro e três no celular. O drawer herdado aparece abaixo de 1024 px.

As adaptações incluem bordas de 1 px em stone-500, placeholders stone-600, seleção dos dias em marrom com check branco, texto preto nos CTAs e controle nativo de horário. Campos usam 16 px no celular e 14 px a partir de 640 px. Labels, foco visível, teclado, estados ARIA e anúncios de erro/resultado foram conferidos; o drawer respeita movimento reduzido.

## Comportamento e limites da prévia

RHF/Zod valida os campos com erros em português e foco no primeiro erro pela ordem visual. Domingo e RS aparecem selecionados no primeiro HTML. Novo Cadastro limpa campos, erros e dados bancários, restaura os padrões e foca o nome. Cancelar retorna a `/dashboard`.

CEP verifica somente o formato e direciona o foco ao endereço para preenchimento manual. Horários distintos permitem operação noturna, como 18:00–02:00. CPF, CNPJ numérico e alfanumérico têm seus dígitos verificadores conferidos; o algoritmo alfanumérico segue o [manual da Receita Federal](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf), incluindo o exemplo `12.ABC.345/01DE-35`. A conferência de dígitos não comprova existência ou situação cadastral.

A confirmação local menciona somente o nome do estabelecimento. Dados duram até reload, sem backend, localStorage ou logs de dados bancários. A nota junto das ações explica a duração da prévia.

## Verificações e encerramento

Passaram 100 testes em 15 arquivos; os seis testes do formulário passaram novamente após os ajustes de foco e controle dos dias. ESLint, Prettier e build do Next.js 16.3.1 passaram. Os 22 checks de Playwright cobriram estrutura, seleção por teclado, envio inválido, foco, dias vazios, reset, CEP, horário noturno, documentos, confirmação, limpeza bancária, reload, Cancelar, navegação mobile e movimento reduzido. Console: zero erros. A conferência em desenvolvimento confirmou título, aba Configurações única ativa, quatro seções, fundo dos campos RGB 226, Domingo/RS, Arimo e ausência de overflow.

Nove capturas finais e os relatórios de geometria/interações sustentaram a validação; eram evidências temporárias, registradas aqui em texto sem links duráveis. O detector único retornou `[]`. O reviewer independente concluiu `disposition: ship`, `persistence: pass`, fidelidade correspondente com adaptações, `ceilingReached` e nenhuma correção material pendente. A tentativa anterior falhou por capacidade e foi repetida sem produzir revisão. Este encerramento não constitui auditoria formal legal, de segurança ou de integração com backend.

O texto preto do gerente no header compartilhado difere do branco da referência; header e footer preexistentes permanecem fora do escopo. O formato incumbente de `DESIGN.md`, sem frontmatter e sem seções canônicas, é drift preexistente. A extensão não migrou o documento nem criou sidecar; Arimo e adaptações locais não foram canonizadas como identidade global.
