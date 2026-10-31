# Pápum! Delivery

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users and purpose

- Donos de restaurantes conhecem a proposta da Papum Delivery e cadastram seu e-mail para receber novidades do lançamento.
- O admin atende à gestão de pedidos e à operação de um delivery, conforme o layout do Figma fornecido pelo usuário.

## Operating context

- O projeto está sendo desenvolvido primeiro no frontend; as integrações serão configuradas depois.
- A Home encaminha seus CTAs à campanha `/lancamento`. Em 30/10/2026, o usuário pediu primeiro a restauração do layout original e depois aprovou substituir somente a faixa de parceiros e o bloco pizza/depoimento por uma apresentação do produto, além de atualizar os botões para captação de interesse no lançamento.
- Em aprovação posterior, o usuário autorizou substituir somente o antigo bloco do celular/prova social e suas métricas por uma prévia estática do Vila Burger, identificado como app demonstrativo, e convite ao cadastro por e-mail. Essa aprovação revoga a preservação anterior do celular/métricas apenas nesse bloco; hero, etapas, oferta, rodapé, imagem do CTA final e seção `#proposta` (inclusive o texto já editado pelo usuário) permanecem preservados. Os conteúdos da Home permanecem demonstrativos durante a preparação; o produto continua em pré-lançamento.
- Na revisão posterior de 30/10/2026, o usuário escolheu o PNG `vilaburguer.png` enviado na conversa como a prévia do aparelho, substituindo a reconstrução em HTML/CSS. A identificação demonstrativa, os textos e o CTA de cadastro permanecem iguais; Vila Burger não é apresentado como cliente ou parceiro. Também foi autorizada a scrollbar nativa fina, laranja Papum e com trilha transparente, preservando o comportamento do sistema em cores forçadas. Escopo e evidências constam do [plano revisado](docs/design/home-app-preview-plan.md) e da [validação](docs/design/home-app-preview-validation.md).
- A indexação está desativada por padrão. O monitoramento público exige consentimento e fica limitado à Home e à campanha; não grava login ou dashboard.
- O usuário autorizou abrir `/dashboard` depois da validação dos campos de login para testar o frontend, sem criar uma sessão de autenticação.
- A primeira tela administrativa apresenta a visão geral e os pedidos recentes. As próximas telas serão definidas pelos respectivos layouts do Figma.

## Capabilities and constraints

- Preservar os grupos de rotas `(site)`, `(auth)` e `(marketing)` e separar o admin em `(admin)`.
- Manter os dados do dashboard como demonstração baseada no Figma até existir uma integração.
- Autenticação, persistência, permissões e atualização de pedidos ainda não estão implementadas.
- Não registrar credenciais no console nem simular uma sessão autenticada.
- Evitar novas dependências e abstrações sem necessidade.

## Brand commitments and accessibility

- Seguir os layouts e assets originais do Figma do Pápum!.
- Usar SVG para logos e ícones, reutilizando a biblioteca tipada do projeto.
- Garantir uso em mobile, tablet e desktop, foco visível, teclado e preferência de movimento reduzido.
