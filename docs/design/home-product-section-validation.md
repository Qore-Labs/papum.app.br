# Seção de produto e CTAs: validação

Implementação local na branch `layout-test`, em 30/10/2026, conforme o [planejamento aprovado](home-product-section-plan.md). Sem publicação nesta execução.

## Entrega e escopo

- Faixa de marcas e bloco pizza/depoimento substituídos pela seção `#proposta`: composição integrada de amarelo/laranja e carvão, título “A marca é sua. A estrutura é Pápum.”, explicação de pré-lançamento e CTA.
- Recibo/sacola, cartões de contatos e raio originais do Figma, com origem, dimensões e hashes no [inventário de assets](home-product-section-assets.md). Os três SVGs somam 8.622 bytes e são servidos localmente.
- Navegação “Lançamento”; header/menu “Receber novidades”; hero “Acompanhar o lançamento”; seção e CTA final “Quero ser avisado”. Uma ação principal no bloco final.
- Links continuam abrindo `/lancamento` em nova aba, agora com aviso no nome acessível. Instrumentação `start_now`/`plans` e identificação do ponto do clique preservadas.
- Conteúdo estático em Server Component, com dados tipados e renderização das ilustrações por `.map()`. Sem novas dependências, carrossel ou animação contínua.
- Conforme a decisão do usuário, textos do hero, etapas, celular, métricas, oferta e demais composições foram preservados. Comparação automatizada com HEAD confirmou igualdade dos componentes de etapas/estatísticas, markup das seções “Como funciona” e prova social e seus arrays de conteúdo.
- SEO, noindex, canonical, JSON-LD, consentimento, Clarity, formulário e áreas seguras preservados. Não houve acesso ao painel Clarity nem envio de mensagens reais.

## Verificações técnicas

- Build final de produção com TypeScript: aprovado.
- ESLint do projeto sem avisos e Prettier: aprovados.
- 15 testes existentes de menu mobile, indexação e analytics: aprovados.
- Marketing E2E em desktop/tablet/mobile: 10 aprovados; dois cenários exclusivos do menu mobile ignorados intencionalmente nos outros tamanhos. Provedores simulados, sem envio real.
- Detector de design executado uma vez nos componentes alterados: `[]`.

## Navegadores e responsividade

Chromium e WebKit, com contexto iPhone 17 no WebKit: 320 × 740, 390 × 844, 768 × 1024, 1024 × 900, 1440 × 1000 e 844 × 390. Capturas de seção em todos os tamanhos e capturas completas em mobile, tablet e desktop.

- Sem overflow horizontal documental ou transbordamento interno dos dois painéis.
- SVGs carregados, proporções originais preservadas; recibo/sacola e contatos em 4:3, raio quadrado com transformação do wrapper.
- Conteúdo novo sem marcas, clientes ou depoimentos. Textos e números preservados nas outras seções.
- Metadados e HTTP com noindex, título solicitado, canonical www e fundo mobile laranja confirmados.
- CTAs testados abrindo o formulário em nova aba; mascaramento do formulário mantido.
- Menu mobile com Escape, retorno de foco e encerramento após CTA.
- Tema escuro do sistema e movimento reduzido conferidos; superfícies e leitura da seção permanecem na paleta aprovada.
- Nenhum erro JavaScript nas verificações finais. O indicador de desenvolvimento foi ocultado apenas nas capturas de QA.

O modo de desenvolvimento registrou aviso de LCP para a imagem preexistente `/home/app-screen.png` durante a rolagem automatizada da página completa. Esse asset pertence ao bloco do celular, fora do escopo, e foi preservado; o aviso não foi tratado como medição de desempenho de produção.

Uma correção visual material foi aplicada após a primeira revisão: `grid-cols-1` no wrapper, impedindo que o mínimo automático da grade comprimisse o padding em Chromium a 320 px. A rodada final confirmou o recuo correto e a ausência de transbordamento interno nos dois motores.

Contrastes das cores declaradas: texto escuro sobre o gradiente ≥ 7,77:1; legenda amarela no carvão 11,10:1; texto claro do CTA no carvão 17,06:1.

Evidências locais ignoradas pelo Git: `output/playwright/product-section/chromium/`, `webkit/`, `reference-post-04.png` e os scripts de verificação no mesmo diretório.

## Revisão e limites

Revisão independente concluída com disposição **ship** sobre a lista de correções: padding de 320 px resolvido nos dois motores e foco/ativação da nova captura WebKit desktop confirmados. Nenhuma correção adicional de interface na lista revisada. O fechamento documental registra a extensão localizada em `DESIGN.md` e o escopo confirmado em `PRODUCT.md`.

Chromium teve travessia real por Tab/Shift+Tab e foco visível confirmados. No contexto desktop do WebKit, foco direto seguido de tecla direcional mostrou contorno sólido de 2 px; Enter abriu `/lancamento` em nova aba. A sequência de Tab/Option+Tab do ambiente não incluiu os links, portanto a travessia nativa não foi certificada nesse motor. As preferências nativas do Safari devem ser conferidas em dispositivo físico; a Apple documenta [Tab e Option+Tab](https://support.apple.com/guide/safari/keyboard-shortcuts-and-gestures-cpsh003/mac) como comportamentos distintos conforme a configuração.

O servidor de desenvolvimento existente do usuário foi preservado. As primeiras tentativas de QA por `127.0.0.1` encontraram bloqueio de origem de desenvolvimento; a validação final usou `localhost`, sem alterar a configuração do Next.js para contornar essa proteção.

Não houve nova auditoria Lighthouse ou PageSpeed, alteração de infraestrutura, deploy ou reativação de indexação nesta entrega.
