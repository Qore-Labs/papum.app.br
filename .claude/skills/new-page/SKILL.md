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

import { siteConfig } from "@/utils/config/site";

export const metadata: Metadata = {
  title: `{Título da página} | ${siteConfig.name}`,
};

export default function {NomeDaPagina}Page() {
  return (
    <main className="flex flex-1 flex-col">
      {/* TODO: implementar {NomeDaPagina}Page */}
    </main>
  );
}
```

- `export default` é obrigatório aqui (exigência do App Router) — única exceção à regra de "export nomeado" do resto do projeto.
- Nome da função: `{NomeDaRota}Page` em PascalCase.
- **A tag `<main>` é responsabilidade da `page.tsx`**, não da `app/layout.tsx`. O layout só fornece o slot flex (`<div className="flex flex-1 flex-col">`) entre `Header` e `Footer`; cada página renderiza o próprio `<main className="flex flex-1 flex-col">` (semântica correta, sem `<main>` aninhado, e um gancho para estilos específicos da página).
- Metadados default (nome do site, descrição, URL base, redes sociais) moram em `@/utils/config/site.ts` (`siteConfig`). Derive `title`/`description` a partir dele em vez de repetir strings soltas.
- Server Component por padrão. Só adicione `"use client"` se a própria página precisar de interatividade direta (o mais comum é isolar isso em um componente filho client, mantendo a page como Server Component).

3. Busque dados diretamente no Server Component com `fetch`/chamada a `@/lib/*` — não crie `useEffect` para carregar dados iniciais.

4. Só crie `layout.tsx`, `loading.tsx` ou `error.tsx` se o usuário pediu explicitamente ou se a rota claramente precisa (ex: um `loading.tsx` para uma página que faz fetch pesado). Não crie arquivos especiais "por via das dúvidas".

5. Para o conteúdo da página:
   - Reutilize componentes de `@/components/ui`, `@/components/layout` ou `@/components/<domínio>` já existentes em vez de duplicar UI.
   - **Escreva o markup das seções inline na própria `page.tsx`.** Não crie um componente para cada seção. Só extraia um componente quando (a) ele é reutilizado por 2+ rotas, ou (b) precisa ser Client Component (form, animação, scroll, drag — qualquer coisa disparada por evento do cliente). No caso (b), isole apenas a parte interativa num componente `"use client"` e mantenha a `page.tsx` como Server Component (permite `fetch`/Server Action assíncrono sem `useEffect`).
   - Dados estáticos que não vêm de API (listas de cards, passos, stats) podem ficar em constantes no topo do arquivo. Se forem "conteúdo do site" ou compartilhados entre rotas, mova para `src/utils/contents/<nome>.ts`.
   - Se ainda assim um componente novo for necessário, use a skill `new-component`.

6. Depois de criar os arquivos, rode `pnpm lint` no que foi criado e corrija o que acusar.
