# papum.app.br — Convenções do projeto

Front-end de um SaaS construído com **Next.js (App Router)**, **React**, **TypeScript** e **Tailwind CSS**. Este documento define os padrões que todo código novo deve seguir.

## Stack

- **Next.js 16** (App Router, React Server Components por padrão)
- **React 19**
- **TypeScript** em modo `strict`
- **Tailwind CSS v4** (config via `@theme` em `app/globals.css`, sem `tailwind.config.js`)
- **React Hook Form + Zod** para formulários e validação
- **Vitest + React Testing Library** para testes de unidade e componente
- **Prettier** (+ `prettier-plugin-tailwindcss`) para formatação e ordenação de classes
- **ESLint** (`eslint-config-next`) para lint

Gerenciador de pacotes: **pnpm** (ver `pnpm-workspace.yaml`). Rode `pnpm install`, `pnpm dev`, `pnpm lint`, `pnpm format`. Não use `npm`/`yarn` neste projeto — evita lockfiles divergentes.

## Estrutura de pastas

Organização **por tipo**. `app/` fica na raiz (convenção do App Router); o restante do código da aplicação vive em `src/`, alinhado ao `tsconfig.json` (`@/*` aponta pra `./src/*`). `public/` fica na raiz porque o Next.js exige isso, independente do uso de `src/`.

```
app/                      # Rotas do App Router (page.tsx, layout.tsx, route.ts...) — na raiz
public/                   # Assets estáticos — na raiz (exigência do Next.js)
src/
  components/
    ui/                   # Primitivos de UI reutilizáveis e sem regra de negócio (Button, Input, Card...)
    forms/                # Formulários completos (RHF + Zod)
    layout/               # Header, Footer, Sidebar, shells de página
  hooks/                  # Custom hooks reutilizáveis (usePlanoAtual, useDebounce...)
  lib/                    # Utilitários puros, clients de API, helpers (utils.ts com `cn`)
  types/                  # Tipos e interfaces compartilhados entre módulos
```

Regra prática: se um componente/hook é usado por **mais de uma rota**, ele vive em `src/components/`, `src/hooks/` ou `src/lib/`. Se é específico de uma única rota, pode ficar colocado dentro da própria pasta da rota em `app/`.

Import sempre via alias `@/` (nunca `../../../src/...`): `@/components/ui/button`, `@/lib/utils`, `@/hooks/use-debounce`, `@/types/...`.

## Nomenclatura

- **Arquivos e pastas:** `kebab-case` sempre (`user-profile-card.tsx`, `use-debounce.ts`). Evita problemas de case-sensitivity entre SO e segue a convenção de rotas do App Router.
- **Componentes:** `PascalCase` no código (`export function UserProfileCard() {}`), mesmo em arquivo kebab-case.
- **Hooks:** prefixo `use`, `camelCase` (`useDebounce`, `useCurrentPlan`).
- **Tipos/Interfaces:** `PascalCase`, sem prefixo `I` (`UserProfileCardProps`, não `IUserProfileCardProps`).
- **Constantes:** `SCREAMING_SNAKE_CASE` apenas para valores verdadeiramente constantes/globais (`MAX_UPLOAD_SIZE_MB`); demais valores em `camelCase`.

## Componentes React

- **Server Components por padrão.** Só adicione `"use client"` quando o componente realmente precisar de interatividade, hooks de estado/efeito, ou APIs de browser. Coloque a diretiva no arquivo mais específico possível (não em componentes de layout inteiros).
- **Export nomeado** para componentes reutilizáveis em `src/components/`. `export default` fica reservado para o que o Next.js exige (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc.) — isso evita nomes divergentes entre arquivo e import.
- Props tipadas com `interface Xxx­Props`, recebidas via destructuring:
  ```tsx
  interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
  }

  export function Button({ variant = "primary", ...props }: ButtonProps) { ... }
  ```
- Componentes de UI genéricos (`src/components/ui`) não devem conter lógica de negócio, fetch de dados ou dependência de contexto de domínio — apenas apresentação. Veja [src/components/ui/button.tsx](src/components/ui/button.tsx) como referência.
- Evite prop drilling além de 2-3 níveis: prefira composição (`children`) ou, se necessário, Context.

## TypeScript

- `strict` está ativo — não desative regras nem use `any`. Use `unknown` + type narrowing quando o tipo é genuinamente desconhecido.
- Prefira `type` para unions/props de componente e `interface` quando algo pode ser estendido (props que herdam de elementos HTML, por exemplo).
- Deixe o TypeScript inferir tipos de retorno sempre que possível; anote explicitamente em fronteiras públicas (funções exportadas de `src/lib/`, hooks).
- Use `satisfies` em vez de type assertion (`as`) quando quiser validar um literal contra um tipo sem perder a inferência.
- Nunca use `enum`; prefira union de literais (`type Status = "idle" | "loading" | "error"`) — mais leve e melhor interop com JSON/APIs.

## Tailwind CSS

- Use sempre o helper `cn()` de [src/lib/utils.ts](src/lib/utils.ts) (`clsx` + `tailwind-merge`) para compor classes condicionais — evita classes conflitantes quando um componente aceita `className` externo.
- Não escreva classes manualmente fora de ordem: o `prettier-plugin-tailwindcss` reordena automaticamente ao rodar `pnpm format`.
- Mobile-first: escreva o estilo base para mobile e adicione breakpoints (`sm:`, `md:`, `lg:`) para telas maiores, nunca o contrário.
- Prefira os tokens definidos em `@theme` (`app/globals.css`) a valores arbitrários (`w-[123px]`). Se um valor se repete, vira token.
- Dark mode hoje segue `prefers-color-scheme` (ver `app/globals.css`). Se o produto precisar de toggle manual no futuro, migrar para a estratégia `class` do Tailwind v4.
- Não crie um componente novo só para aplicar 2-3 classes; extraia em componente quando a combinação de classes se repete em 3+ lugares ou quando carrega lógica.

## Formulários (React Hook Form + Zod)

Todo formulário segue o padrão: schema Zod → `zodResolver` → `useForm` → `register`/`handleSubmit`. Veja [src/components/forms/contact-form.tsx](src/components/forms/contact-form.tsx) como referência completa (validação, mensagens de erro, estado de submit).

- Schema de validação sempre em Zod, com mensagens de erro em português.
- Tipo do formulário derivado do schema com `z.infer<typeof schema>` — nunca duplicar a tipagem manualmente.
- Formulários são Client Components (`"use client"`).
- Submissão preferencialmente via **Server Action**; use `fetch` para API externa apenas quando não houver Server Action aplicável.

## Estado e dados

- Busque dados no Server Component mais próximo dos dados (`fetch` direto ou Server Action), não em `useEffect` no client.
- Estado de UI local (aberto/fechado, aba ativa) fica em `useState` no próprio componente.
- Estado compartilhado entre poucos componentes próximos: eleve para o ancestral comum (lifting state up) antes de recorrer a Context.
- Context apenas para estado realmente global e de baixa frequência de mudança (tema, sessão do usuário, feature flags). Nunca para estado de formulário ou dados de servidor.

## Testes

Toda feature nova (componente com lógica/interação, hook, formulário, função de `lib/`) precisa de teste. Use a skill **new-tests** para gerar os testes automaticamente após implementar a feature.

- **Vitest** como test runner (`vitest.config.mts`) + **React Testing Library** para componentes.
- Testes ficam em `src/__tests__/`, espelhando a estrutura de `src/` (ex: `src/components/ui/button.tsx` → `src/__tests__/components/ui/button.test.tsx`; `src/lib/utils.ts` → `src/__tests__/lib/utils.test.ts`).
- `describe`/`it`/`expect`/`vi` são importados explicitamente de `"vitest"` (o projeto não usa `globals: true`).
- Componentes: renderize com `render()` e consulte por role/label (`getByRole`, `getByLabelText`), nunca por classe CSS ou estrutura do DOM. Interações via `@testing-library/user-event`, não `fireEvent` diretamente.
- Priorize testar comportamento (o que o usuário vê/faz), não detalhes de implementação.
- O que testar: componentes com lógica condicional/interação, hooks, funções de `src/lib/`, validação de schemas Zod e submissão de formulários. Componentes puramente apresentacionais e triviais (sem branch, sem interação) não precisam de teste dedicado.
- Server Components assíncronos (a maioria dos `page.tsx`) não são testados diretamente com Vitest — extraia a lógica/UI relevante para um componente ou função testável.
- Veja [`src/__tests__/components/ui/button.test.tsx`](src/__tests__/components/ui/button.test.tsx) e [`src/__tests__/lib/utils.test.ts`](src/__tests__/lib/utils.test.ts) como referência.

```bash
pnpm test         # roda a suíte de testes uma vez
pnpm test:watch   # modo watch
```

## Imports

- Use sempre o alias `@/` para imports absolutos (`@/components/ui/button`), nunca caminhos relativos longos (`../../../lib/utils`). Relativo só é aceitável para arquivos no mesmo diretório (`./types`).
- Ordem: (1) bibliotecas externas, (2) alias `@/`, (3) imports relativos — com uma linha em branco entre grupos. O Prettier não reordena imports; mantenha essa ordem manualmente ou peça revisão.

## Lint e formatação

```bash
pnpm lint           # ESLint (eslint-config-next + regras de TS)
pnpm format         # Prettier, com ordenação de classes Tailwind
pnpm format:check   # Verifica formatação sem alterar arquivos
```

Rode `pnpm lint`, `pnpm format:check` e `pnpm test` antes de qualquer commit.

## Commits

O histórico do projeto já segue **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`...). Mantenha esse padrão: `<tipo>: <descrição no imperativo>`.

## Skills disponíveis

Este projeto tem Skills do Claude Code em `.claude/skills/` que já aplicam essas convenções automaticamente:

- **new-component** — cria um novo componente em `src/components/ui`, `src/components/layout` ou domínio equivalente.
- **new-page** — cria uma nova rota no App Router (`page.tsx`, opcionalmente `layout.tsx`/`loading.tsx`).
- **new-form** — cria um formulário completo com React Hook Form + Zod.
- **new-hook** — cria um custom hook em `src/hooks/`.
- **new-tests** — gera testes (Vitest + React Testing Library) para uma feature recém-implementada.

Prefira usá-las (`/new-component`, `/new-page`, `/new-form`, `/new-hook`, `/new-tests`) em vez de criar esses arquivos manualmente, para manter consistência.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
