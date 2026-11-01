# Landing de produto e captação — validação

Data: 31/10/2026. Implementação local, sem publicação. Escopo: Home, `/instagram`, cadastro, origem dos contatos, preferências de análise e alinhamento do e-mail de confirmação. O [plano](home-conversion-redesign-plan.md) registra as decisões posteriores que prevalecem sobre a proposta inicial.

## Resultado implementado

- Conteúdo principal em Server Component, com ilhas pequenas para formulário, foco dos CTAs, exploração manual dos recursos e preferências.
- Hero explica app com identidade do restaurante e painel de cardápio, pedidos e contatos. SVGs locais dos posts do Figma substituem as fotografias e a prova social fictícia.
- CTAs “Cadastrar-se” chegam ao mesmo campo, sem nova aba. A navegação mantém `/instagram` e sua origem, inclusive no menu mobile.
- “A marca é sua. A estrutura é Pápum.”, FAQ “Dúvidas frequentes” e cinco respostas sobre personalização, público, próximos passos, gratuidade e cancelamento.
- Dado comercial com período e grupo analisado na própria frase. Por revisão posterior do usuário, referência, aviso e metodologia foram retirados do layout; a fonte segue registrada no plano interno. O resultado observado de receita de clientes no estudo interno UpMenu não é uma garantia da Papum ou do faturamento total de um restaurante.
- O estado inicial da landing não carrega SDK ou widget Turnstile. E-mail válido inicia verificação sob demanda; um token válido continua o mesmo envio. Falha preserva o e-mail e não chega ao provedor. A rota antiga `/lancamento` mantém o fluxo anterior.
- E-mails com origem controlada e perfil oficial [@usepapumdelivery](https://www.instagram.com/usepapumdelivery/). **Sem banco de leads**, conforme solicitado: sucesso representa aceitação das duas mensagens pelo Resend, e não criação de uma pessoa única em uma base.
- `/privacidade`, controles de análise no rodapé quando há integração configurada e análise limitada com armazenamento negado por padrão. Não há banner inicial nem consentimento fabricado. Uma recusa anterior impede a análise.
- Canonical da Home na entrada `/instagram`, metadados sociais e imagem Open Graph de marca. `noindex` em metadados e cabeçalho preservado.

## Verificações

- `npm test -- --reporter=dot`: **244 testes aprovados em 29 arquivos**. Cobrem envio, origem, rejeição de origem desconhecida, falhas, privacidade, ausência de dados pessoais nos eventos, hidratação com recusa já salva e ciclo de vida do widget.
- `npm run lint`: aprovado sem avisos.
- `npm run build`: aprovado, incluindo tipos e geração das rotas estáticas. Build normal restaurado depois da execução E2E com configuração fictícia.
- E2E: **16 aprovados e 2 ignorados intencionalmente**, em três projetos de viewport. Os dois casos ignorados são o menu mobile em contextos de desktop. Provedores simulados; nenhum e-mail real foi enviado. Inclui fluxo da verificação sob demanda, recuperação de falha, confirmação, rejeição do provedor, preservação da origem e foco dos CTAs.
- Navegador real por Playwright CLI: Chromium e WebKit, em **320, 390, 768, 1024 e 1440 px**, com preferência de cores escuras e movimento reduzido. Sem overflow horizontal, exceções de página ou imagens incompletas. FAQ opera por teclado; seletor de recursos responde à ação; CTA final e menu mobile focam o e-mail na mesma rota. Hero não acumula rolagem interna nem fica sob o header após essas ações.
- Capturas locais: `output/playwright/conversion/{chromium,webkit}/{home,hero}-*.png`. Capturadas a partir do topo, com fontes e imagens carregadas e animações desativadas. O foco visível no e-mail é intencional na conferência dos CTAs.
- Detector de design executado uma vez: apontamento de Arial no estilo global preexistente; as fontes efetivas da landing vêm do layout do site. Não foi usado como substituto da inspeção visual.
- Revisão independente: encontrou quebra do CTA final em tablet. Correção aplicada e recapturada nas mesmas larguras/motores. A continuação também conferiu a correção da hidratação/recusa anterior; veredito **ship**, com F1 e F2 resolvidos, restrito à lista de correções. Registro em [home-conversion-finish-review.md](home-conversion-finish-review.md).
- Preferências no build de produção local, com todas as chamadas externas interceptadas: sem banner inicial, fechar devolve foco, desativação persiste após reload sem carregar tags, reativação explícita e controle também disponível na política de privacidade. Sem overflow no painel em 390 e 1440 px. Corrigida a inicialização antes de ler a escolha persistida: as tags agora aguardam a hidratação, evitando recarregamentos repetidos para quem havia recusado. Capturas `privacy-mobile.png` e `privacy-desktop.png` na mesma pasta de validação.

## Limites e configuração externa

Revisão posterior: removidos do layout o link da fonte, o aviso e o detalhamento da metodologia, conforme solicitado. Mantidos o percentual, o período e o grupo analisado. Fonte preservada no plano interno. Build, lint e formatação aprovados; seção conferida em Chromium a 390, 768 e 1440 px, sem overflow ou elementos adicionais. Capturas `data-only-{390,768,1440}.png`. Essa revisão pontual é posterior aos pareceres F1/F2 e não é coberta por eles.

- Não houve deploy, envio real, inspeção de caixa de entrada, validação dos painéis GA4/Clarity ou teste em Safari físico/navegador interno do Instagram. Desempenho de campo depende de publicação e tráfego; não há certificação de Core Web Vitals nesta etapa.
- O erro Cloudflare `110200` depende de autorização do hostname no painel do widget e da configuração de `WAITLIST_ALLOWED_HOSTNAMES`. A verificação sob demanda remove o bloco inicial; não contorna essa exigência nem autoriza domínios automaticamente.
- A entrada da bio estará em `https://www.papum.app.br/instagram` após publicação. O endereço local permite conferir a rota. Sem banco, não há contagem permanente ou deduplicação própria de interessados únicos; idempotência do envio não substitui cadastro durável.
- GA4 e Clarity são habilitados conforme os IDs do ambiente e, normalmente, apenas em produção. GA4 recebe URLs sem query/fragmento e campos de campanha controlados. Clarity mantém bloqueio de URLs/referências com query ou fragmentos não permitidos, reduzindo a cobertura de alguns acessos sociais. Nenhuma URL arbitrária foi liberada para aumentar gravações.
- Revogação, concessão de cookies e respeito a recusas anteriores foram exercitados com testes de componentes e browser com SDKs externos interceptados. Isso valida os controles e comandos locais; os recursos disponíveis no modo sem cookies e a cobertura de gravação dependem do provedor e da região. Não se promete replay de toda visita.
- Pedidos de cancelamento das mensagens são atendidos manualmente pela equipe ao receber resposta por e-mail. Não há descadastro automático ou audiência gerenciada nesta entrega.
