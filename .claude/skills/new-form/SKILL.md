---
name: new-form
description: Cria um formulário completo com React Hook Form + Zod seguindo as convenções do projeto (schema de validação, mensagens de erro em português, estado de submit). Use quando o usuário pedir para criar um formulário, tela de cadastro, ou campo de captura de dados.
---

# new-form

Cria um formulário usando React Hook Form + Zod, no padrão do projeto.

## Passos

1. Identifique os campos do formulário e suas regras de validação a partir do pedido do usuário. Se não estiver claro, assuma campos razoáveis para o contexto (ex: um form de "criar projeto" provavelmente tem `name` e `description`).

2. Nome do arquivo: kebab-case, dentro de `src/components/forms/` (ex: `create-project-form.tsx`).

3. Crie o schema em `src/schemas/{form-name}.ts` (mesmo kebab-case do componente) — o schema **não** mora no arquivo do componente:

```ts
import { z } from "zod";

export const {formName}Schema = z.object({
  // TODO: campos do formulário, mensagens de erro em português
});

export type {FormName}Values = z.infer<typeof {formName}Schema>;
```

4. Gere o componente seguindo o template abaixo, adaptando campos:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { {formName}Schema, type {FormName}Values } from "@/schemas/{form-name}";

export function {FormName}() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{FormName}Values>({
    resolver: zodResolver({formName}Schema),
  });

  const onSubmit = async (values: {FormName}Values) => {
    // TODO: Server Action ou chamada de API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* TODO: campos, seguindo o padrão de src/components/forms/contact-form.tsx */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
```

5. Regras a respeitar sempre:
   - Sempre `"use client"` no topo do arquivo do componente.
   - Schema Zod e tipo derivado (`z.infer`) moram em `src/schemas/<form>.ts`, **exportados** e importados pelo componente — nunca definidos inline no `.tsx`, nunca com tipagem manual duplicada.
   - Mensagens de erro do Zod em português.
   - Cada campo: `label` com `htmlFor`, `input`/`textarea`/`select` com `{...register("campo")}`, e mensagem de erro condicional (`errors.campo && <span>...</span>`) logo abaixo.
   - Botão de submit usa `Button` de `src/components/ui/button.tsx` e reflete `isSubmitting`.
   - Preferir Server Action no `onSubmit`; usar `fetch` só se não houver Server Action aplicável (pergunte ao usuário se não estiver claro qual API/endpoint usar).

6. Use [src/components/forms/contact-form.tsx](../../../src/components/forms/contact-form.tsx) e [src/schemas/contact-form.ts](../../../src/schemas/contact-form.ts) como referência completa de estilo e estrutura.

7. Depois de criar os arquivos, rode `pnpm lint` e corrija o que acusar. Considere gerar testes com a skill `new-tests` (validação do schema + submissão).
