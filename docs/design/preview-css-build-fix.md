# Correção do CSS no preview e do lint no CI

Data: 31/10/2026. Branch `layout-test`, diagnóstico do preview gerado a partir de `7cbabb7`. Correções locais; nenhum novo deploy disparado nesta execução.

## Evidência e causa provável

- O preview autenticado na Vercel servia o HTML da nova landing, mas as duas folhas CSS carregadas não continham `.landing-page`, `.landing-hero` ou `.hero-grid`. O navegador aplicava `position: static`, fundo transparente e grid como `block`.
- O `app/globals.css` do mesmo commit no GitHub contém essas regras. O build local emitia as regras corretamente.
- O log da Vercel confirma commit `7cbabb7`, Next.js 16.3.1 e restauração do cache de um deploy anterior. O comportamento é compatível com o [relato de CSS antigo após restauração do cache do Turbopack](https://github.com/vercel/next.js/issues/100326), inclusive com PostCSS. A perda dos estilos publicados foi observada diretamente; a atribuição ao mecanismo interno de cache é uma inferência apoiada pelo log e pelo relato, sem execução instrumentada na infraestrutura da Vercel.

## Correções

- `experimental.turbopackFileSystemCacheForBuild: false` em `next.config.ts`. A opção existe na versão instalada e é descrita na documentação local e na [documentação do Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache). O cache de desenvolvimento e as dependências permanecem com a configuração existente. Builds podem perder a aceleração do cache persistente de compilação.
- Removido o comentário `eslint-disable-next-line` que virava aviso de diretiva sem uso no CI. A exceção de `@next/next/no-img-element` agora fica restrita a `app/opengraph-image.tsx` na configuração do ESLint, pois a árvore do `ImageResponse` usa imagem estática. As outras páginas continuam com a regra ativa.
- Corrigida a formatação de `waitlist-form.test.tsx`, detectada ao executar o mesmo comando usado no CI.
- O teste de navegação da landing agora confere os estilos computados do hero: posicionamento, fundo e grid. Isso detecta o caso de HTML novo com CSS ausente no build de produção, além de testar o cadastro.

## Validação e publicação

Lint, formatação, build e 244 testes de unidade/componentes aprovados. Nos E2E, 25 testes de navegador passaram, com 2 casos ignorados intencionalmente para menu mobile em viewports maiores. As chamadas aos provedores são simuladas; nenhum e-mail real foi enviado.

O build normal foi restaurado após os E2E e servido localmente em modo de produção. Conferência em Chromium a 390, 768 e 1440 px confirmou grid, fundo, posicionamento, fontes/imagens carregadas e ausência de overflow. Capturas em `output/playwright/conversion/production-fixed-{390,768,1440}.png`; chamadas externas foram interceptadas. O preview remoto não foi republicado nem certificado após a alteração.

O preview publicado continuará com os arquivos antigos até um novo build/deploy com estas alterações. Não é necessário mudar os textos, refazer o layout ou liberar indexação para corrigir esse problema.
