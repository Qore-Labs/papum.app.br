# Integração contínua e testes de navegador

## Plano aplicado

1. Usar Node.js 24 e pnpm 11.15.1, com instalação reproduzível pelo lockfile.
2. Conferir lint, formatação, tipos, testes de unidade/componentes e build de produção.
3. Exercitar os fluxos principais em Chromium, em desktop (1440 px), tablet (768 px) e mobile (390 px).
4. Propor atualizações semanais de dependências e GitHub Actions com Dependabot.
5. Manter o deploy na integração Git existente da Vercel.

## GitHub Actions

O workflow `.github/workflows/ci.yml` roda em pushes, pull requests e acionamento manual pela aba **Actions → CI → Run workflow**. Uma execução nova cancela a anterior da mesma branch para evitar trabalho duplicado.

As etapas são sequenciais: instalação com `--frozen-lockfile`, lint sem warnings, Prettier, TypeScript, Vitest, build de produção, instalação do Chromium e Playwright. A checagem de tipos executa `next typegen` antes do TypeScript, para funcionar em um checkout sem `.next`.

As Actions têm versões fixadas por SHA, o token tem acesso de leitura ao código e nenhuma credencial de produção é necessária. O relatório HTML, capturas e traces de falhas ficam nos artifacts da execução por sete dias. O job tem limite de 20 minutos; a suíte de navegador tem limite próprio de seis minutos, um worker e uma repetição em CI para diagnosticar falhas intermitentes.

O workflow publica os resultados no commit. As regras de merge e de revisão do repositório continuam sob controle da equipe.

## Rodar localmente

Use a versão de Node em `.node-version` (24.18.0) e o pnpm indicado em `package.json`. O campo `engines.node` mantém a Vercel na linha 24.x; o CI usa a versão exata do arquivo. As atualizações dessa versão precisam ser feitas conscientemente, com nova validação.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Em Linux, instale também as dependências do sistema: `pnpm exec playwright install --with-deps chromium`, como no CI. Em PowerShell que bloqueie o shim `.ps1`, use `pnpm.cmd` nos comandos.

`pnpm test:e2e:ui` abre a interface interativa. Para selecionar um cenário ou tamanho:

```sh
pnpm test:e2e --project=mobile
pnpm test:e2e e2e/marketing.spec.ts
pnpm exec playwright show-report
```

## Isolamento dos testes de navegador

O Playwright cria um build de produção com configuração de teste e sobe um servidor exclusivo em `http://127.0.0.1:3100`. Ele não reutiliza um servidor existente nessa porta. O servidor é encerrado ao terminar a suíte; o servidor de desenvolvimento em outra porta pode continuar aberto.

O ambiente do processo substitui explicitamente chaves, remetentes, hostnames e fonte de dados, inclusive quando existe `.env.local`. O dashboard usa mocks e o GA4 fica desativado. Os exemplos de contato usam `example.com`.

- O navegador recebe um SDK simulado do Turnstile e bloqueia outras chamadas externas.
- O servidor carrega `e2e/support/mock-providers.mjs` apenas pelo comando de teste. Esse preload exige as credenciais fictícias exatas e simula as respostas de verificação e envio, bloqueando outras requisições externas.
- O formulário e a Server Action reais continuam em execução: validação, exigência de token, hostname, ação, tratamento de erro e confirmação de sucesso são exercitados pelo fluxo.
- Nenhuma chave ou condição de teste foi adicionada à lógica da aplicação. A confirmação no E2E representa a resposta do provedor simulado; entrega de e-mails, domínio autorizado no Cloudflare e configuração das contas exigem conferência no ambiente publicado.

Ao terminar os E2E, `.next` contém um build com configuração de teste. Execute `pnpm build` antes de usar `pnpm start` para uma prévia com as configurações normais.

## Cobertura inicial

- Home: “Planos” e “Começar agora” abrem `/lancamento` em outra aba.
- Lançamento: e-mail inválido, envio bloqueado sem verificação, falha temporária, repetição por teclado, preservação do e-mail e confirmação de sucesso.
- Lançamento: rejeição do provedor mantém o e-mail e apresenta erro.
- Login da prévia: navegação para o dashboard e entre Pedidos, Cardápio, Clientes e Configurações, sem overflow horizontal.
- Cardápio: criação e edição local de item.
- Clientes: cadastro e edição pelo menu de ações.
- Menu público mobile: Escape, clique externo, botão de fechar e retorno do foco.

Os testes de menu público são executados apenas no mobile; tablet e desktop usam a navegação visível nesses tamanhos. Os testes de navegador ficam em `e2e/`; o Vitest coleta apenas `src/__tests__/**/*.test.{ts,tsx}`.

## Dependabot

O arquivo `.github/dependabot.yml` agenda verificações às segundas-feiras, às 09h de São Paulo, para pacotes npm/pnpm e Actions. Atualizações minor/patch de pacotes são agrupadas; major são propostas separadamente. As Actions são agrupadas. Os PRs são limitados e precisam ser revisados e validados antes de uma atualização ser aceita.

As configurações passam a ser utilizadas quando estiverem publicadas no GitHub; o Dependabot lê seu arquivo na branch padrão. Isso não habilita automaticamente outras opções de segurança da conta.

## Deploy na Vercel

Mantenha o repositório conectado em **Vercel → Project → Settings → Git**, com a branch de produção escolhida pela equipe (atualmente `main` no repositório). As demais branches seguem a configuração de previews da Vercel. Chaves de Resend e Turnstile ficam nas variáveis da Vercel, nos ambientes apropriados.

O `vercel.json` versiona os comandos `corepack pnpm install --frozen-lockfile` e `corepack pnpm build`. A chamada explícita ao Corepack usa o pnpm de `package.json`, evitando depender da versão inferida pela Vercel a partir do formato do lockfile. Esses comandos passam a valer no próximo deploy do código; o ambiente permanece na linha Node 24 definida em `engines.node`.

GitHub Actions e Vercel executam seus fluxos separadamente. O CI informa falhas; a integração Git da Vercel segue suas próprias regras de publicação. Uma falha no CI não impede automaticamente um deploy. Este workflow não cria deploys nem altera a configuração remota da Vercel.

Referências: [Playwright em CI](https://playwright.dev/docs/ci), [Next.js CLI](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options), [Dependabot](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates), [Vercel e GitHub](https://vercel.com/docs/git/vercel-for-github), [comandos de build na Vercel](https://vercel.com/docs/builds/configure-a-build).
