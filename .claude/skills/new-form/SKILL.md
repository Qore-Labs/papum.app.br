---
name: new-form
description: Cria um formulário completo com React Hook Form + Zod seguindo as convenções do projeto (schema de validação, mensagens de erro em português, estado de submit). Use quando o usuário pedir para criar um formulário, tela de cadastro, ou campo de captura de dados.
---

# new-form

Cria um formulário usando React Hook Form + Zod, no padrão do projeto.

## Passos

1. Identifique os campos do formulário e suas regras de validação a partir do pedido do usuário. Se não estiver claro, assuma campos razoáveis para o contexto (ex: um form de "criar projeto" provavelmente tem `name` e `description`).

2. Nome do arquivo: kebab-case, dentro de `src/components/forms/` (ex: `create-project-form.tsx`).

3. Gere o arquivo seguindo o template abaixo, adaptando campos e schema:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const {formName}Schema = z.object({
  // TODO: campos do formulário
});

type {FormName}Values = z.infer<typeof {formName}Schema>;

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

4. Regras a respeitar sempre:
   - Sempre `"use client"` no topo do arquivo.
   - Schema Zod primeiro, tipo do form derivado com `z.infer` — nunca duplicar tipagem manual.
   - Mensagens de erro do Zod em português.
   - Cada campo: `label` com `htmlFor`, `input`/`textarea`/`select` com `{...register("campo")}`, e mensagem de erro condicional (`errors.campo && <span>...</span>`) logo abaixo.
   - Botão de submit usa `Button` de `src/components/ui/button.tsx` e reflete `isSubmitting`.
   - Preferir Server Action no `onSubmit`; usar `fetch` só se não houver Server Action aplicável (pergunte ao usuário se não estiver claro qual API/endpoint usar).

5. Use [src/components/forms/contact-form.tsx](../../../src/components/forms/contact-form.tsx) como referência completa de estilo e estrutura.

6. Depois de criar o arquivo, rode `pnpm lint` e corrija o que acusar.
