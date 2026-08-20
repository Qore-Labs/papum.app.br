---
name: new-component
description: Cria um novo componente React seguindo as convenções do projeto (Server Component por padrão, export nomeado, kebab-case, Tailwind com cn()). Use quando o usuário pedir para criar/adicionar um componente, primitivo de UI, ou peça de layout.
---

# new-component

Cria um componente React novo seguindo as convenções descritas em `CLAUDE.md`.

## Passos

1. Pergunte (ou infira do pedido do usuário) três coisas, sem ficar repetindo perguntas óbvias:
   - **Nome do componente** em PascalCase (ex: `PricingCard`).
   - **Categoria/pasta**: `src/components/ui` (primitivo genérico, sem regra de negócio), `src/components/layout` (header/footer/shell), ou uma pasta de domínio dentro de `src/components/` (ex: `src/components/billing/`) se o componente for específico de uma feature.
   - **Se precisa ser Client Component** (usa `useState`, `useEffect`, event handlers, browser APIs) ou pode ser Server Component (padrão).

2. Nome do arquivo: kebab-case do nome do componente, dentro da pasta escolhida.
   Exemplo: `PricingCard` → `src/components/ui/pricing-card.tsx`.

3. Gere o arquivo seguindo o template abaixo. Adapte props conforme o pedido.

```tsx
import { cn } from "@/lib/utils";

interface {ComponentName}Props {
  className?: string;
}

export function {ComponentName}({ className }: {ComponentName}Props) {
  return (
    <div className={cn("", className)}>
      {/* TODO: implementar {ComponentName} */}
    </div>
  );
}
```

Se for Client Component, adicione `"use client";` como primeira linha do arquivo (antes dos imports).

4. Regras a respeitar sempre:
   - Export **nomeado**, nunca `export default` (a menos que seja um arquivo especial do App Router, o que não é o caso aqui).
   - Props tipadas com `interface {ComponentName}Props`.
   - Toda composição de classes Tailwind usa `cn()` de `@/lib/utils`, principalmente se o componente aceita `className` de fora.
   - Componentes em `src/components/ui` não devem importar hooks de dados, contexto de domínio ou fazer fetch — apenas apresentação. Se o pedido exigir lógica de negócio, sugira colocar em `src/components/<domínio>/` em vez de `src/components/ui`.
   - Não crie arquivo de teste ou storybook a menos que o usuário peça.

5. Depois de criar o arquivo, rode `pnpm lint` e `pnpm format:check` no arquivo criado (ou rode via ESLint/Prettier diretamente) para garantir que está de acordo com o padrão do projeto, e corrija o que acusar.

Use [src/components/ui/button.tsx](../../../src/components/ui/button.tsx) como referência de estilo de código.
