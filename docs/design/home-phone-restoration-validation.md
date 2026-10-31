# Restauração da seção original do celular

Em 30/10/2026, o usuário rejeitou a reformulação do celular e pediu o formato inicial, preservando os CTAs de captação e a seção que substituiu parceiros/pizza. Essa instrução revoga a proposta Vila Burger, tanto em HTML/CSS quanto em PNG.

## Implementação

- Restaurado o bloco original `section[aria-labelledby="social-proof-title"]` a partir do HEAD inicial da branch: markup, texto, moldura, imagem `/home/app-screen.png`, efeitos de fundo, cards e dados de estatísticas. A comparação de código confirmou a seção e os dados iguais aos originais.
- `ProductIntroSection` e os CTAs existentes da navegação, hero, seção de produto e bloco final foram preservados. O CTA adicional do bloco Vila Burger foi removido junto da reformulação rejeitada.
- Removidos componente, conteúdo e asset exclusivos do Vila Burger, além dos documentos de implementação que ficaram superados. O contexto de analytics `app_preview` foi retirado das listas permitidas; o teste de clique com consentimento agora cobre `benefits`, usado na seção de produto preservada.
- E2E de CTA passa a apontar para `#proposta` e o bloco final, acompanhando os pontos reais de cadastro.
- A scrollbar solicitada separadamente, SEO/noindex, consentimento, Clarity, e-mails e formulário não receberam alterações nesta restauração.

## Verificações

- Prettier e ESLint dos arquivos alterados: aprovados.
- 11 testes de analytics e Clarity: aprovados.
- Build de produção com TypeScript: aprovado.
- Detector de design executado uma vez sobre página e conteúdo: sem achados.
- Chromium e WebKit em contexto iPhone 17, cada um nas larguras 320, 390, 768, 1024 e 1440 px: seção original presente, imagem carregada, sem Vila Burger e sem overflow horizontal.
- Texto e estatísticas restaurados; título/conteúdo da seção de produto preservados.
- CTAs da seção de produto e bloco final conferidos em 390 e 1440 px nos dois motores: abertura do formulário em nova aba e foco visível. Sem envio real de e-mail; serviços externos simulados.
- Tema escuro e movimento reduzido aplicados na matriz; nenhum erro JavaScript.
- Noindex no meta e no header HTTP preservado.

Evidências: `output/playwright/phone-restored/{chromium,webkit}/` e `inspect.txt`, ignorados pelo Git. Os conteúdos demonstrativos originais retornaram por pedido expresso do usuário; as métricas não foram verificadas como dados comerciais reais.

O servidor local existente foi preservado. Sem deploy ou alteração do domínio publicado. WebKit em contexto iPhone não certifica o Safari em aparelho físico.
