---
name: new-tests
description: Gera testes (Vitest + React Testing Library) para uma feature recém-implementada, seguindo as convenções do projeto. Use sempre depois de implementar ou alterar um componente, hook, formulário ou função de lib — não só quando o usuário pedir "teste" explicitamente.
---

# new-tests

Garante que código novo (componente, hook, formulário, função de `src/lib/`) tenha teste, seguindo o padrão Vitest + React Testing Library do projeto.

## Passos

1. Descubra o que foi implementado/alterado:
   - Se o usuário apontou os arquivos, use-os.
   - Senão, rode `git status` / `git diff` para identificar arquivos novos ou modificados em `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`.
   - Ignore arquivos que não são código de aplicação (config, `.md`, etc.) e arquivos de teste já existentes.

2. Para cada arquivo relevante, decida se merece teste dedicado:
   - **Testar:** componentes com lógica condicional, estado ou interação (clique, submit, toggle); hooks; funções de `src/lib/` (utilitários, parsers, formatadores); formulários RHF+Zod (validação e submissão); schemas Zod com regras não triviais.
   - **Não testar isoladamente:** componentes puramente apresentacionais sem branch nem interação (ex: um wrapper que só aplica `cn()` e renderiza `children`); `page.tsx`/`layout.tsx` do App Router (Server Components assíncronos — não são testáveis diretamente com Vitest/jsdom). Se a página tiver lógica relevante, ela deve estar extraída em um componente ou função testável; teste essa unidade extraída, não a página.
   - Na dúvida, pergunte ao usuário em vez de gerar teste supérfluo ou pular algo importante.

3. Caminho do arquivo de teste: espelha o caminho de origem dentro de `src/__tests__/`, trocando a extensão por `.test.ts`/`.test.tsx`.
   - `src/components/ui/pricing-card.tsx` → `src/__tests__/components/ui/pricing-card.test.tsx`
   - `src/hooks/use-debounce.ts` → `src/__tests__/hooks/use-debounce.test.ts`
   - `src/lib/format-currency.ts` → `src/__tests__/lib/format-currency.test.ts`

4. Estrutura do teste — sempre importar de `"vitest"` explicitamente (o projeto não usa `globals: true`):

   **Componente simples:**

   ```tsx
   import { render, screen } from "@testing-library/react";
   import { describe, expect, it } from "vitest";

   import { PricingCard } from "@/components/ui/pricing-card";

   describe("PricingCard", () => {
     it("renderiza o título recebido", () => {
       render(<PricingCard title="Pro" />);
       expect(screen.getByText("Pro")).toBeInTheDocument();
     });
   });
   ```

   **Componente com interação:**

   ```tsx
   import { render, screen } from "@testing-library/react";
   import userEvent from "@testing-library/user-event";
   import { describe, expect, it, vi } from "vitest";

   import { Toggle } from "@/components/ui/toggle";

   describe("Toggle", () => {
     it("chama onChange com o novo valor ao clicar", async () => {
       const user = userEvent.setup();
       const onChange = vi.fn();
       render(<Toggle checked={false} onChange={onChange} />);

       await user.click(screen.getByRole("switch"));

       expect(onChange).toHaveBeenCalledWith(true);
     });
   });
   ```

   **Hook:**

   ```ts
   import { renderHook } from "@testing-library/react";
   import { describe, expect, it } from "vitest";

   import { useDebounce } from "@/hooks/use-debounce";

   describe("useDebounce", () => {
     it("retorna o valor inicial imediatamente", () => {
       const { result } = renderHook(() => useDebounce("a", 200));
       expect(result.current).toBe("a");
     });
   });
   ```

   **Função de lib:**

   ```ts
   import { describe, expect, it } from "vitest";

   import { formatCurrency } from "@/lib/format-currency";

   describe("formatCurrency", () => {
     it("formata centavos em reais", () => {
       expect(formatCurrency(1050)).toBe("R$ 10,50");
     });
   });
   ```

   **Formulário (RHF + Zod):** valide que erros aparecem quando o campo é inválido e que o submit é chamado com os valores corretos quando válido. Renderize o form real, preencha os campos com `user.type`/`user.click` e leia mensagens de erro via `getByText`/`findByText` (são assíncronas após a validação rodar).

5. Boas práticas obrigatórias:
   - Consultar por `getByRole`/`getByLabelText`/`getByText`, nunca por classe CSS, `data-testid` (só como último recurso) ou seletor de estrutura do DOM.
   - Interações via `@testing-library/user-event` (`userEvent.setup()`), não `fireEvent` diretamente.
   - Um comportamento por `it`; nomes de teste descrevem o comportamento esperado, em português.
   - Sem mocks desnecessários — só mocke o que cruza a borda do que está sendo testado (ex: uma Server Action ou `fetch` chamado pelo componente), nunca a própria unidade testada.
   - Não usar snapshot tests como estratégia principal.

6. Depois de gerar os testes, rode `pnpm test` e `pnpm lint`, e corrija qualquer falha antes de considerar a tarefa concluída.

Use [`src/__tests__/components/ui/button.test.tsx`](../../../src/__tests__/components/ui/button.test.tsx) e [`src/__tests__/lib/utils.test.ts`](../../../src/__tests__/lib/utils.test.ts) como referência de estilo.
