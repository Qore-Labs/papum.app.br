This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Organização das campanhas

As páginas continuam separadas por grupos de rotas:

```text
app/
  (site)/       # Site institucional e sua navegação
  (auth)/       # Páginas de autenticação
  (marketing)/  # Landing pages de campanhas
    layout.tsx
    lancamento/
      page.tsx  # URL: /lancamento
```

Os nomes entre parênteses organizam o código e não fazem parte da URL. Cada nova campanha deve ter sua própria pasta dentro de `(marketing)`, com conteúdo e metadados específicos. O layout do grupo compartilha a tipografia; cada landing define sua composição, header e footer.

A landing de lançamento usa `WaitlistForm`, em `src/components/forms/waitlist-form.tsx`, com validação em `src/schemas/waitlist-form.ts`. Neste estágio, a entrega é somente frontend: nenhum e-mail é gravado e o formulário não confirma um cadastro sem resposta da integração. A propriedade `subscribeAction` está preparada para receber a futura Server Action. A integração deverá também validar os dados no servidor.

## Integração com a API

O cliente da API e os fluxos de autenticação estão preparados no servidor, com mocks como padrão. As telas continuam na prévia frontend, sem requisições ao backend. Consulte [configuração, contratos e pendências da integração](docs/api-integration.md) e o arquivo `.env.example` antes de conectar os dados reais.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
