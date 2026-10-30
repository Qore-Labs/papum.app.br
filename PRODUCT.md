# Pápum! Delivery

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users and purpose

- Donos de restaurantes conhecem a proposta da Papum Delivery e cadastram seu e-mail para receber novidades do lançamento.
- O admin atende à gestão de pedidos e à operação de um delivery, conforme o layout do Figma fornecido pelo usuário.

## Operating context

- O projeto está sendo desenvolvido primeiro no frontend; as integrações serão configuradas depois.
- A Home encaminha seus CTAs à campanha `/lancamento`. Em 30/10/2026, o usuário pediu a restauração do layout original, incluindo parceiros, depoimento, estatísticas e oferta visual. Esses conteúdos permanecem demonstrativos durante a preparação; o produto continua em pré-lançamento.
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
