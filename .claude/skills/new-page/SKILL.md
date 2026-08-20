---
name: new-page
description: Cria uma nova rota no Next.js App Router (page.tsx, e opcionalmente layout.tsx/loading.tsx/error.tsx) seguindo as convenções do projeto. Use quando o usuário pedir para criar uma nova página, rota, ou tela do SaaS.
---

# new-page

Cria uma nova rota dentro de `app/` seguindo o App Router do Next.js e as convenções em `CLAUDE.md`.

## Passos

1. Determine o caminho da rota a partir do pedido do usuário. Segmentos de rota em `kebab-case` (ex: "página de configurações de cobrança" → `app/settings/billing/`).
   - Rotas dinâmicas usam colchetes: `app/projects/[projectId]/`.
   - Se a rota deve exigir autenticação ou compartilhar layout com outras rotas relacionadas, verifique se já existe um route group (`app/(dashboard)/...`) apropriado antes de criar um novo.

2. Crie `page.tsx` na pasta da rota:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "{Título da página}",
};

export default function {NomeDaPagina}Page() {
  return (
    <div className="flex flex-col gap-6">
      {/* TODO: implementar {NomeDaPagina}Page */}
    </div>
  );
}
```

- `export default` é obrigatório aqui (exigência do App Router) — única exceção à regra de "export nomeado" do resto do projeto.
- Nome da função: `{NomeDaRota}Page` em PascalCase.
- Server Component por padrão. Só adicione `"use client"` se a própria página precisar de interatividade direta (o mais comum é isolar isso em um componente filho client, mantendo a page como Server Component).

3. Busque dados diretamente no Server Component com `fetch`/chamada a `@/lib/*` — não crie `useEffect` para carregar dados iniciais.

4. Só crie `layout.tsx`, `loading.tsx` ou `error.tsx` se o usuário pediu explicitamente ou se a rota claramente precisa (ex: um `loading.tsx` para uma página que faz fetch pesado). Não crie arquivos especiais "por via das dúvidas".

5. Para o conteúdo da página, componha usando componentes de `@/components/ui`, `@/components/layout` ou `@/components/<domínio>` já existentes em vez de duplicar UI. Se um componente novo for necessário, use a skill `new-component`.

6. Depois de criar os arquivos, rode `pnpm lint` no que foi criado e corrija o que acusar.
