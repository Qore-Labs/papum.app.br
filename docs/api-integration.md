# Integração com a API delivery-app

## Estado atual

A integração foi preparada a partir da documentação fornecida da API Laravel/Sanctum. **As telas continuam usando a prévia frontend, sem chamadas ao backend.** Login, navegação e alterações locais do cardápio, clientes e configurações mantêm o comportamento atual.

O cliente de servidor `getDeliveryApi()` usa mocks por padrão. Ele ainda não foi conectado às páginas ou aos formulários. Trocar a variável de ambiente seleciona o transporte desse cliente; **não ativa automaticamente a integração das telas**.

Não há credenciais reais, URL de produção, novas rotas de proxy ou Server Actions públicas nesta entrega. O acesso real ao backend ainda precisa ser validado com uma instância disponível.

## Organização

| Caminho                         | Responsabilidade                                                    |
| ------------------------------- | ------------------------------------------------------------------- |
| `src/schemas/api/delivery.ts`   | Validação de entradas, respostas e envelopes com Zod                |
| `src/types/api.ts`              | Tipos derivados dos contratos e interfaces do transporte            |
| `src/lib/api/client.ts`         | Operações da API, rotas, verbos e validação dos argumentos          |
| `src/lib/api/http.ts`           | Fetch, autenticação Bearer, timeout e normalização de erros         |
| `src/lib/api/mock.ts`           | Simulação em memória com os mesmos contratos                        |
| `src/lib/api/index.ts`          | Seleção de mock ou HTTP no servidor                                 |
| `src/lib/api/auth.ts`           | Login → `/me` → cookie, consulta da sessão e logout                 |
| `src/lib/api/session-cookie.ts` | Leitura e escrita da credencial em cookie HttpOnly                  |
| `src/lib/api/upload.ts`         | Validação preliminar de arquivos antes do upload                    |
| `src/lib/api/adapters.ts`       | Conversão dos valores dos formulários para os payloads documentados |

Os módulos de transporte, sessão, upload e mocks são exclusivos do servidor (`server-only`). Não devem ser importados em Client Components. Os grupos de rotas `(site)`, `(auth)`, `(marketing)` e `(admin)` permanecem preservados.

## Configuração

Copie `.env.example` para `.env.local` e mantenha o modo atual:

```dotenv
DELIVERY_DATA_SOURCE=mock
DELIVERY_API_BASE_URL=
DELIVERY_API_TIMEOUT_MS=10000
```

Para usar futuramente o cliente HTTP no servidor:

```dotenv
DELIVERY_DATA_SOURCE=api
DELIVERY_API_BASE_URL=https://seu-backend.example/api
DELIVERY_API_TIMEOUT_MS=10000
```

A URL deve terminar em `/api`, sem usuário, senha, query ou fragmento. HTTP só é aceito em loopback (`localhost`, `127.0.0.1` ou `::1`) fora de produção. Timeout permitido: 100 a 60000 ms. Configurações inválidas falham explicitamente; não há fallback silencioso para mock.

Não use `NEXT_PUBLIC_` para essas variáveis nem para tokens. Nunca registre senhas, tokens Google, Bearer ou corpos de requisições com dados pessoais nos logs.

## Operações preparadas

Todos os caminhos abaixo são relativos ao prefixo `/api`.

| Grupo do cliente | Rotas e métodos                                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `auth`           | `POST login`, `GET me`, `POST logout`, `POST register`, `POST google/login`, `POST password/forgot`, `POST password/reset` |
| `firms`          | `GET/POST firms`, `GET/PUT/DELETE firms/{id}`, `GET public/firm/{slug}`                                                    |
| `categories`     | `GET/POST firms/{id}/category`, `PUT/DELETE firms/{id}/category/{categoryId}`                                              |
| `products`       | `POST firms/{id}/products`, `GET/PUT/DELETE firms/{id}/products/{productId}`, `GET product/{slug}`                         |
| `images`         | `POST images/upload`, `DELETE images/{path codificado}`                                                                    |
| `orders`         | `GET orders/{firmId}?page=N`                                                                                               |
| `customers`      | `GET customers/{firmId}?page=N`                                                                                            |

Os métodos recebem IDs numéricos positivos e slugs validados, não URLs arbitrárias. `category` é singular no endpoint. Não existe listagem separada de produtos no contrato: use categorias ou o detalhe do estabelecimento.

### Uso no servidor

```ts
import { getDeliveryApi } from "@/lib/api";

const api = getDeliveryApi();
const { data: firms } = await api.firms.list();
const { data: customers, meta } = await api.customers.list(1, 1);
```

Mantenha a mesma instância de `api` durante um fluxo de teste com múltiplas operações mock. Cada chamada a `getDeliveryApi()` cria um mock isolado; alterações não persistem entre requisições, recargas ou instâncias. Os dados iniciais reaproveitam os conteúdos demonstrativos existentes. Nenhum mock acessa a rede.

Os métodos retornam o envelope validado `{ success, message, data }`. Pedidos e clientes também retornam `meta` na raiz (`current_page`, `last_page`, `per_page`, `total`), com páginas de 10 itens. Não calcule totais globais ou indicadores usando apenas uma página.

## Autenticação e segurança

- `signIn(input)` envia e-mail/senha, valida o usuário com `/me` e só então grava a credencial. Para Google, `signIn({ token }, "google")` prepara a troca do ID token pelo Bearer da API. O SDK Google ainda não está configurado.
- A função devolve apenas o usuário validado; o token não deve entrar em props, JSON para o navegador ou localStorage. Cada login revoga os tokens anteriores, conforme o backend.
- Cookie com `HttpOnly`, `SameSite=Lax`, `Path=/` e validade local de 8 horas; em produção também `Secure` e prefixo `__Host-`. O backend pode revogar a credencial antes desse prazo; não há refresh token documentado.
- `getSessionUser()` pode ser usado durante renderização no servidor: sem credencial ou em 401 retorna `null`, sem tentar escrever cookies durante a renderização. O layout futuro deverá tratar esse resultado com redirecionamento ao login.
- `withDeliverySession(api => ...)` prepara operações autenticadas em Server Actions/Route Handlers e limpa a credencial em 401. Argumentos são revalidados pelo método da API; ownership e autorização continuam sendo verificados pelo backend.
- `signOut()` tenta revogar o token e sempre remove o cookie local, inclusive em falhas. Um 401 no logout já significa sessão encerrada.
- Escritas de cookie (`signIn`, `signOut`, `withDeliverySession`) devem ocorrer em Server Actions ou Route Handlers. Ao criar essas entradas, preserve as verificações de origem/CSRF do Next.js, a validação dos argumentos e os limites de tentativas do backend. Não exponha um proxy genérico que aceite endpoint ou URL enviados pelo navegador.
- No modo mock, `signIn()` recusa a criação de uma sessão real; o login de prévia existente continua validando seus campos e navegando localmente para o dashboard.

O transporte usa `cache: no-store`, `credentials: omit`, `redirect: error`, timeout e limite de 2 MB por resposta. O Bearer vai apenas para as rotas autenticadas do backend configurado; rotas públicas não o recebem. Mutações não são repetidas automaticamente.

Respostas são validadas em runtime e campos desconhecidos são removidos. `ApiError` preserva status, código, campos de validação e `Retry-After` em segundos. `toApiFailure(error)` produz um objeto serializável para uma futura Server Action, com mensagens seguras em português. Mensagens internas, stack traces e `info` do backend não são repassados. Erros Laravel 422 são associados aos campos com mensagens locais.

Registro aceita tanto 201 com JSON quanto 204 vazio como sucesso. Recuperação de senha normaliza o erro de e-mail inexistente para o mesmo resultado genérico, evitando revelar contas pela interface.

## Payloads e arquivos

- Valores monetários são **inteiros em centavos**. `priceToCents("19,99")` resulta em `1999`, sem arredondamento binário. A resposta também deve cumprir esse contrato.
- Atualizações de estabelecimento e produto usam `PUT` com o corpo completo; o contrato não oferece edição parcial efetiva mesmo com `PATCH`.
- `prepareProductPayload(values, context)` exige `categoryId` real e `preparationTime` explícito. Não envie o slug da categoria de demonstração, `photoId`, `topSeller` ou `firm_id` no corpo do produto.
- `prepareFirmPayload(values, context)` normaliza telefone, CEP, CNPJ, dias e horários. O tipo do estabelecimento deve ser um `FirmType` explícito. Dados bancários e complemento do formulário não são enviados.
- Upload: `api.images.upload(firmId, file)` envia `FormData` com `image` e `firm_id`; não fixe `Content-Type`, pois o runtime gera o boundary.
- São aceitos JPEG, PNG, GIF e WebP até 1 MB. Há checagem preliminar de MIME e assinatura; a validação completa e os limites de armazenamento continuam no backend. SVGs de logos e ícones do próprio código permanecem preservados; o endpoint de upload não aceita SVG.
- Salve o `path` retornado no campo `logo`/`image`; a `url` serve para exibição. `api.images.remove(firmId, path)` codifica o caminho inteiro uma vez e envia `firm_id` no corpo do DELETE.
- Ao substituir uma imagem por outra, o backend já remove a anterior. Não adicione uma segunda exclusão automática. O mock também simula o limite de 30 imagens por estabelecimento.

## Pendências antes de conectar as telas

| Área                  | Diferença ou dependência                                                                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Login                 | A UI atual aceita e-mail ou telefone; `/login` documenta apenas e-mail. Ajustar a entrada para o modo real.                                                                                                                                      |
| Proteção do admin     | Conectar a sessão ao layout e implementar redirecionamento/expiração antes de servir dados reais. A prévia atual permanece acessível sem autenticação.                                                                                           |
| Cardápio              | Categorias da UI têm IDs de demonstração; vincular IDs reais e oferecer tempo de preparo. Fotos prontas da prévia não equivalem a uploads. `topSeller` não existe no contrato.                                                                   |
| Clientes              | Existem somente endpoints de leitura. Novo cliente, edição e alterações de status continuam locais. VIP, gasto total e último pedido não aparecem no recurso documentado.                                                                        |
| Pedidos               | A API tem cinco estados (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`) e histórico. A UI atual tem três agrupamentos; definir a apresentação dos demais estados antes de conectá-la. Não há ação documentada para alterar status. |
| Configurações         | Não há dados bancários ou complemento do estabelecimento. Os tipos de cozinha da UI não correspondem integralmente ao enum de 14 valores da API.                                                                                                 |
| CNPJ                  | O frontend aceita formato alfanumérico; a API documenta apenas CNPJ numérico formatado. O adaptador recusa formatos incompatíveis sem modificar o documento silenciosamente.                                                                     |
| Preços                | Um exemplo de detalhe de estabelecimento usa `"25.90"`, em conflito com a regra de centavos e os exemplos de produto. Confirmar a resposta real; o cliente recusa esse formato em vez de adivinhar a escala.                                     |
| Recuperação de senha  | O e-mail do backend aponta para `/reset-password?token=...&email=...`; essa tela ainda não existe. O link atual `/esqueci-senha` também precisa de implementação.                                                                                |
| Verificação de e-mail | O link assinado `GET /email/verify/{id}/{hash}?signature=...` pertence ao backend e deve ser aberto pelo usuário. Não reconstruir assinatura no frontend. A API retorna JSON; combinar o redirecionamento/tela de confirmação.                   |
| Lançamento            | A documentação não fornece endpoint de lista de espera. Não utilizar `/register` como cadastro de leads.                                                                                                                                         |

Depois dessas definições, conectar as páginas no servidor e as mutações por Server Actions, aplicar os erros aos formulários e validar com o backend de homologação. A configuração real por si só não realiza esses passos.

## Verificações

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Os testes em `src/__tests__/lib/api/` cobrem contratos, conversões, isolamento dos mocks, CRUD simulado, paginação, transporte, upload e ciclo de sessão. O `fetch` dos testes HTTP é simulado; eles não fazem chamadas ao backend real. O alias de `server-only` no Vitest usa a implementação vazia fornecida pelo Next apenas dentro do runner de testes; a proteção de importação continua ativa no build da aplicação.

Na conferência em navegador real, login → dashboard → configurações e criação/edição de produtos e clientes continuaram funcionando sem chamadas ao backend ou criação de sessão real. Cardápio e clientes também foram conferidos em 390, 768 e 1440 px, sem overflow horizontal da página.
