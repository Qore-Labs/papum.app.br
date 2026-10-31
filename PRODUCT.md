# Pápum! Delivery

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users and purpose

- Donos de restaurantes e negócios de alimentação conhecem a proposta da Papum Delivery: um app com nome, logo e cores do restaurante, conectado a um painel para cardápio, pedidos e contatos.
- A landing transforma interesse nesse produto em cadastro de e-mail para receber informações e aviso de disponibilidade. O produto está em pré-lançamento; o cadastro não cria conta operacional, contratação ou acesso imediato.
- O admin atende à gestão de pedidos e à operação de um delivery, conforme o layout do Figma fornecido pelo usuário.

## Operating context

- A reformulação completa da Home foi aprovada e implementada localmente em 31/10/2026, conforme as decisões confirmadas no [plano atual](docs/design/home-conversion-redesign-plan.md). Ela substitui a composição histórica de `#proposta`, o telefone original restaurado após a rejeição do Vila Burger e os CTAs que abriam `/lancamento` em outra aba. O [plano da seção de produto](docs/design/home-product-section-plan.md) e a [validação da restauração](docs/design/home-phone-restoration-validation.md) permanecem como histórico, sem limitar a Home atual.
- A Home e `/instagram` servem a mesma landing. “Cadastrar-se” leva ao mesmo campo de e-mail na página, com foco visível e sem abrir outra aba. O aviso de pré-lançamento fica junto do cadastro, sem dominar todos os títulos. `/lancamento` permanece disponível para links antigos.
- A entrada planejada para a bio é `https://www.papum.app.br/instagram`, com canonical da Home e origem de catálogo (`instagram`, `social`, `validacao`, `bio`). A rota mantém a origem ao navegar até o formulário e a envia à notificação interna e aos eventos GA4/Clarity, sem e-mail ou texto livre nos eventos. O link pode ser compartilhado fora do Instagram; atribuição ao link não comprova o aplicativo de origem nem identifica pessoas entre dispositivos.
- O Instagram oficial, no site e nos e-mails, é [@usepapumdelivery](https://www.instagram.com/usepapumdelivery/).
- A comunicação apresenta app e painel como partes conectadas, com o título “A marca é sua. A estrutura é Pápum.” e exploração manual de Cardápio, Pedidos e Contatos. A FAQ “Dúvidas frequentes” responde sobre personalização, público, o que acontece após o cadastro, gratuidade do cadastro e cancelamento dos e-mails. Cadastro gratuito não equivale a uma oferta de uso gratuito da plataforma.
- O dado “+88%” vem do [estudo interno UpMenu de junho de 2026](https://www.upmenu.com/case-studies/restaurant-mobile-app/): receita dos clientes analisados nos seis meses antes/depois de adotarem o app do restaurante. Por revisão do usuário, a página mostra somente o dado com período e grupo analisado; fonte e método ficam na documentação interna. Não é resultado Papum, crescimento causal comprovado ou garantia para o faturamento total de um restaurante.
- As integrações de captação e análise estão implementadas e dependem da configuração externa, descrita em [marketing-integrations.md](docs/marketing-integrations.md). Na landing, Turnstile é carregado somente ao enviar e-mail válido, com aparência `interaction-only`; desafios necessários e verificações estritas no servidor permanecem. O erro `110200` exige autorização do hostname no painel Cloudflare e configuração correspondente no servidor. A apresentação sob demanda não resolve essa autorização. `/lancamento` conserva o fluxo anterior do desafio.
- A análise pública limitada começa com armazenamento negado e sem banner inicial quando há IDs configurados, normalmente apenas em produção. As tags aguardam a hidratação e a leitura da escolha persistida antes de inicializar. Preferências no rodapé permitem desativar a análise ou permitir cookies de análise; recusas anteriores no formato v2 são respeitadas, e o formato legado v1 não concede consentimento. Publicidade permanece desativada. Formulários são mascarados, eventos não recebem e-mail ou URLs brutas com query/fragmento e login/dashboard ficam fora da coleta. A proteção do Clarity contra queries na URL ou no referrer reduz a cobertura de algumas entradas sociais.
- A indexação continua desativada por padrão. A implementação não foi publicada nesta execução. A [validação atual](docs/design/home-conversion-validation.md) registra 244 testes unitários, lint e build aprovados, 16 E2E aprovados e 2 ignorados intencionalmente, com provedores simulados; Chromium e WebKit foram conferidos em 320, 390, 768, 1024 e 1440 px. O [finish review](docs/design/home-conversion-finish-review.md) fechou o ajuste visual do CTA final com **ship / F1 resolvido**. Preferências, retorno de foco, recusa persistida após reload e reativação foram conferidos no build de produção local, com terceiros interceptados, em 390 e 1440 px. Não houve envio real de e-mails, upload a SDKs externos, verificação dos painéis dos provedores, Safari físico, navegador interno do Instagram ou comprovação de metas numéricas de desempenho.
- O usuário autorizou abrir `/dashboard` depois da validação dos campos de login para testar o frontend, sem criar uma sessão de autenticação.
- A primeira tela administrativa apresenta a visão geral e os pedidos recentes. As próximas telas serão definidas pelos respectivos layouts do Figma.

## Capabilities and constraints

- **Sem banco de leads**, por escolha expressa do usuário. O formulário solicita ao Resend uma notificação interna e uma confirmação ao interessado; sucesso significa que o provedor aceitou as duas mensagens, não que houve entrega comprovada ou criação de uma pessoa única em uma base.
- Não há contagem permanente de interessados únicos, deduplicação própria durável, audiência gerenciada ou qualificação posterior. A idempotência do provedor limita envios equivalentes por 24 horas; não substitui um cadastro persistente. Os contatos chegam à caixa interna e sua organização posterior cabe à equipe.
- Cancelamento das mensagens é solicitado por resposta ao e-mail e tratado manualmente pela equipe; não há descadastro automático nesta entrega.
- Preservar os grupos de rotas `(site)`, `(auth)` e `(marketing)` e separar o admin em `(admin)`.
- Manter os dados do dashboard como demonstração baseada no Figma até existir uma integração.
- Autenticação operacional, persistência dos dados do dashboard, permissões e atualização de pedidos ainda não estão implementadas.
- Não registrar credenciais no console nem simular uma sessão autenticada.
- Evitar novas dependências e abstrações sem necessidade.

## Brand commitments and accessibility

- Preservar identidade, fontes e assets originais do Figma do Pápum!, respeitando a referência de cada superfície. A nova Home é uma extensão da marca com composição aprovada; dashboard e login mantêm seus contratos existentes.
- Usar SVG para logos e ícones, reutilizando a biblioteca tipada do projeto.
- A landing reutiliza os SVGs de pedidos, contatos e raio dos posts originais, com proveniência no [inventário de assets](docs/design/home-product-section-assets.md). Não apresenta Vila Burger como cliente/parceiro, nem usa mockup de telefone, fotografias de pizza, avaliações ou números fictícios como prova social.
- Garantir uso em mobile, tablet e desktop, foco visível, teclado e preferência de movimento reduzido.
- Preservar a scrollbar nativa fina e laranja com trilha transparente e comportamento padrão em cores forçadas. As regras visuais atuais e a proveniência dos SVGs estão em [DESIGN.md](DESIGN.md).
