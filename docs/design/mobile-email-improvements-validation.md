# Home mobile e e-mails: validação

Implementado em 29/10/2026 conforme o [planejamento aprovado](mobile-email-improvements-plan.md).

## Entrega

- A Home define `themeColor: #fb8d01`, `viewportFit: cover` e esquema claro por segmento, mantendo o zoom disponível.
- O fundo do documento acompanha o laranja do cabeçalho somente enquanto o layout público da Home está presente. Login, lançamento e admin mantêm seus próprios fundos e metadados.
- Cabeçalho, hero, menu, conteúdo e rodapé consideram as áreas seguras. O hero mantém a imagem escura existente.
- Confirmação e notificação interna compartilham uma base de e-mail clara, com logo, tipografia de sistema, links descritivos e espaçamento responsivo. Cada uma tem conteúdo e rodapé adequados ao destinatário.
- O PNG da marca deriva de `LogoColored` em `src/components/ui/icons.tsx`: 456 × 177 px, aproximadamente 12 KB, exibido em 152 × 59 px, com fundo branco para preservar a leitura da marca em clientes que alteram cores.
- Instagram e site estão presentes. O perfil `https://www.instagram.com/papum.delivery/` é fictício e está identificado como provisório na configuração; o site usa `https://papum.app.br`.
- Remetentes, destinatários, assuntos, `reply_to`, tags, escape de HTML e idempotência do envio foram preservados. As versões de texto acompanham o novo conteúdo.

## Verificações técnicas

- ESLint sem avisos e Prettier nos arquivos alterados: aprovados.
- `next typegen` e `tsc --noEmit`: aprovados.
- Build de produção: aprovado, inclusive no preparo dos testes de navegação.
- Testes existentes de inscrição por e-mail e menu mobile: **18 aprovados**.
- Testes existentes de marketing em desktop, tablet e mobile: **10 aprovados**, com dois cenários exclusivos de menu mobile ignorados intencionalmente em desktop/tablet.
- `git diff --check`: sem problemas.
- Detector de design executado: a fonte Arial de sistema foi mantida deliberadamente para compatibilidade com e-mail e por já integrar o fallback do site. A faixa espessa sugerida como problema pelo detector foi retirada da composição final.

## Navegadores e capturas

Playwright CLI em Chromium e WebKit, incluindo contexto de iPhone 17 no WebKit: **16 cenários por motor**, sem falhas nas verificações finais.

- Home em 390 × 844, 768 × 1024, 1440 × 1000 e 844 × 390: sem overflow horizontal; fundos de documento/cabeçalho coerentes; imagens visíveis carregadas.
- Temas claro e escuro, movimento reduzido, abertura/fechamento do menu, Escape e retorno de foco. A abertura por teclado foi conferida no Chromium; no contexto de iPhone do WebKit, por toque/clique.
- `/lancamento`, `/login` e `/dashboard`: sem propagação do novo layout ou dos metadados de viewport da Home.
- E-mails em 320, 390 e 768 px de viewport; a mensagem permanece limitada a 560 px. Logo carregada, corpo de 16 px, links sociais com 44 px de área vertical e ausência de overflow, inclusive com endereço longo.
- Capturas foram conferidas visualmente. As prévias têm dados fictícios e logo incorporada para visualização local; o HTML enviado usa a URL pública HTTPS.

Contrastes medidos:

| Uso                | Combinação            | Contraste |
| ------------------ | --------------------- | --------- |
| Texto principal    | `#1b1c1c` / `#ffffff` | 17,08:1   |
| Botão laranja      | `#1b1c1c` / `#ff8a00` | 7,23:1    |
| Aviso de rodapé    | `#61564a` / `#f7f5f2` | 6,57:1    |
| Texto sobre marfim | `#61564a` / `#fff6e9` | 6,67:1    |

Prévias e relatórios locais, não versionados:

- `output/playwright/email-confirmation.html` e `email-notification.html`.
- `output/playwright/final-chromium/` e `output/playwright/final-webkit/`.
- `output/playwright/chromium-validation.log` e `webkit-validation.log`.

## Limites de validação

A cor e a translucidez das barras nativas ainda precisam ser conferidas em Safari num iPhone físico, incluindo a expansão/retração das barras, rolagem elástica e notch. A emulação verifica o layout e o motor, mas não reproduz essa interface nativa.

Não houve acesso a Apple Mail, Gmail ou Outlook reais nesta execução. Os templates usam tabelas, estilos essenciais inline, fallback de largura para Outlook e conteúdo legível sem imagens, mas a renderização nesses clientes permanece uma conferência recomendada antes do primeiro envio de produção. Nenhuma mensagem foi enviada para uma caixa real; os testes do cadastro usaram provedores simulados.

## Complemento: ícones dos links

Adicionados ícones de Instagram e site aos dois rodapés, preservando os rótulos e a área de toque. O globo reutiliza `GlobeIcon`; o Instagram foi integrado como componente tipado à biblioteca do projeto a partir de Bootstrap Icons, com licença preservada em `public/email/instagram-LICENSE.txt`. Os e-mails recebem derivados PNG de 48 × 48 px exibidos em 16 × 16 px, com texto alternativo vazio por serem decorativos junto aos rótulos.

Os dois templates foram conferidos em WebKit a 320, 390 e 768 px: seis cenários aprovados, imagens carregadas, sem overflow e links com pelo menos 44 px de altura. ESLint, TypeScript e os 13 testes existentes do fluxo de e-mail passaram novamente. As prévias locais e capturas do WebKit foram atualizadas.
