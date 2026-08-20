---
name: new-hook
description: Cria um custom hook React em src/hooks/ seguindo as convenções do projeto (nome com prefixo use, camelCase, kebab-case no arquivo, tipagem explícita de retorno). Use quando o usuário pedir para criar um hook customizado.
---

# new-hook

Cria um custom hook seguindo as convenções em `CLAUDE.md`.

## Passos

1. Nome do hook em `camelCase` com prefixo `use` (ex: `useDebounce`, `useCurrentPlan`).

2. Nome do arquivo: kebab-case, dentro de `src/hooks/` (ex: `use-debounce.ts`).

3. Gere o arquivo seguindo o template abaixo, adaptando ao propósito do hook:

```ts
"use client";

import { useEffect, useState } from "react";

export function {useHookName}(/* params */) {
  // TODO: implementar {useHookName}

  return {
    // TODO: valores retornados
  };
}
```

4. Regras a respeitar sempre:
   - `"use client"` no topo — hooks que usam `useState`/`useEffect`/`useRef` só funcionam em Client Components. Se o hook não usa nenhuma API client-only (ex: é um helper puro), avalie se realmente precisa ser um hook ou se pode ser uma função simples em `src/lib/`.
   - Export **nomeado**.
   - Tipar explicitamente o valor de retorno quando não for óbvio por inferência (principalmente se retorna um objeto/tupla).
   - Sem lógica de negócio de domínio específico misturada com lógica genérica — se o hook é específico de uma feature (ex: `useBillingStatus`), avalie se não faz mais sentido morar perto do domínio (`src/components/billing/`) em vez de `src/hooks/` genérico. Pergunte ao usuário se não estiver claro.

5. Depois de criar o arquivo, rode `pnpm lint` e corrija o que acusar.
