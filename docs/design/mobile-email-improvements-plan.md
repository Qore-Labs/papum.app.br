# Planejamento: mobile da Home e e-mails Pápum

Status: aprovado e implementado em 29/10/2026. Resultados e limitações da validação em [mobile-email-improvements-validation.md](mobile-email-improvements-validation.md).

## Direção e escopo

Preservar a identidade da Pápum. Na Home `/`, integrar as bordas do Safari no iPhone ao laranja do cabeçalho. Nos e-mails, criar uma apresentação minimalista e acolhedora, com marca reconhecível, leitura confortável e uma ação clara quando necessária.

Preferências confirmadas:

- Prioridade de navegador: Safari no iPhone.
- E-mails com apenas Instagram e site no rodapé.
- Instagram pode usar link fictício, centralizado e identificado como provisório na configuração/documentação. O destino deverá ser substituído quando o perfil oficial existir.
- Site: usar o domínio já configurado, `https://papum.app.br`.
- Execução autorizada pelo usuário após a validação deste planejamento.

## Diagnóstico

| Antes                                                                                                       | Proposta                                                                 | Por quê                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| O fundo global muda para `#0a0a0a` no modo escuro; a Home não define uma cor para a interface do navegador. | Definir fundo explícito para a Home e metadados de cor compatíveis.      | Corrigir uma possível origem das bordas pretas; confirmar o resultado no Safari real. |
| Cabeçalho laranja sem tratamento superior de área segura.                                                   | Integrar o fundo à área segura e compensar o posicionamento do conteúdo. | Evitar emendas e sobreposição com notch e controles do iPhone.                        |
| Os dois templates usam o nome da Pápum em texto no lugar da logo.                                           | Usar uma imagem nítida derivada da marca existente.                      | Aumentar reconhecimento sem redesenhar a identidade.                                  |
| E-mail interno e confirmação compartilham até o texto do rodapé.                                            | Compartilhar a base visual e adaptar conteúdo e ação ao destinatário.    | Tornar cada mensagem útil e remover instruções inadequadas para a equipe.             |

O projeto usa Next.js **16.3.1**, React 19 e Tailwind CSS 4. A API de `viewport` foi conferida na documentação instalada. Os templates locais são somente a confirmação da lista de lançamento e a notificação interna de novo interessado.

## 1. Home no Safari do iPhone

### Resultado proposto

Dar continuidade ao laranja real do cabeçalho, **`#fb8d01`**, nas superfícies periféricas que a página consegue influenciar. Aproveitar a translucidez oferecida pelo próprio Safari quando disponível. O hero mantém sua imagem e seu fundo escuro intencional.

### Trabalho previsto

1. Reproduzir a ocorrência em modo claro e escuro, separando fundo exposto da página, área segura e interface nativa do Safari.
2. Aplicar fundo explícito ao documento na Home, com escopo por rota, para evitar a herança quase preta do tema global. Garantir que as seções continuem cobrindo esse fundo com suas próprias cores.
3. Exportar configuração estática e tipada de `viewport` no segmento apropriado, com `themeColor` laranja para navegadores que respeitam esse sinal.
4. Avaliar `viewportFit: "cover"` junto de `env(safe-area-inset-*)`. Ajustar cabeçalho, início do hero, menu e áreas expostas do rodapé como um conjunto, incluindo laterais em paisagem.
5. Conferir abertura e fechamento do menu, rolagem elástica, retorno de navegação e barra do Safari expandida/recolhida.

O site pode influenciar essas superfícies; a aparência final das barras pertence ao Safari e varia conforme versão e configuração do iOS. Não prometer translucidez idêntica em todos os aparelhos. Não usar scripts de rolagem, bibliotecas ou configuração de PWA para esta correção.

Arquivos prováveis: `app/(site)/layout.tsx`, `app/globals.css`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav-toggle.tsx` e pequenos ajustes de compensação em `app/(site)/page.tsx`, se necessários.

## 2. E-mails minimalistas e acolhedores

### Composição visual

- Fundo marfim suave já usado no template (`#f7f5f2`), superfície branca, texto escuro da marca (`#1b1c1c`) e laranja da Home (`#ff8a00`) como destaque. Vermelho da marca reservado a detalhes pontuais, se necessário.
- Largura máxima próxima dos atuais **560 px**, uma coluna, margens confortáveis e espaçamento consistente. Cerca de 32 px de respiro no desktop e 20–24 px no celular.
- Logo compacta no topo, título de 26–28 px, corpo de pelo menos 16 px e entrelinha confortável. Fontes de sistema confiáveis para e-mail.
- Bordas discretas e arredondamento moderado como melhoria progressiva. Hierarquia e espaçamento fazem o trabalho principal, sem decoração excessiva.
- Botões com texto escuro sobre laranja, ou outra combinação de contraste validado. Links descritivos e alvos de toque próximos de 44 px.

### Confirmação ao interessado

Sequência: logo → título acolhedor → confirmação explícita → próximos passos → assinatura → Instagram e site → orientação atual de cancelamento por resposta.

Título sugerido: **“Seu contato chegou. Que bom ter você por aqui!”**

Manter claro que a pessoa receberá novidades por e-mail quando estiverem disponíveis. Texto curto, humano e sem prometer data, conta criada ou acesso liberado. O site pode aparecer como link secundário; a confirmação já cumpre o objetivo sem exigir novo cadastro.

### Notificação interna

Mesma identidade, com apresentação funcional: logo → novo interesse recebido → e-mail do interessado em destaque → origem `/lancamento` → ação **“Responder ao interessado”**.

Usar link `mailto:` e preservar o `reply_to` atual. Adaptar a assinatura e o rodapé ao público interno, sem apresentar instruções de cancelamento destinadas ao interessado. Instagram e site ficam como links secundários.

### Logo e links

- Reaproveitar a marca vetorial existente em `src/components/ui/icons.tsx` para preparar um PNG próprio para e-mail, recortado corretamente, em resolução adequada e com proporção preservada.
- Hospedar o arquivo em caminho público HTTPS, definir largura/altura e texto alternativo. Evitar SVG inline nos e-mails por compatibilidade.
- Usar somente **Instagram** e **Site**, preferencialmente com rótulos de texto legíveis, sem depender de ícones para identificar os destinos.
- Centralizar URLs em configuração tipada. O Instagram será um destino fictício de demonstração, sem apresentá-lo na documentação como perfil verificado. Evitar usar acidentalmente o LinkedIn da Binary ou os links genéricos de Facebook/Instagram existentes.

### Implementação e compatibilidade

Refinar a base HTML compartilhada com tabelas de apresentação, estilos essenciais inline, larguras com fallback e adaptação mobile. Separar conteúdo, tokens e apresentação em estruturas pequenas, seguindo os diretórios atuais. Não adicionar uma biblioteca de templates apenas para estes dois e-mails.

Preservar versões em texto simples, preheader, escape de conteúdo dinâmico, remetente, destinatários, `reply_to`, assuntos e tags existentes. Revisar contraste e comportamento com imagens bloqueadas e modo escuro. Manter a instrução real de cancelamento por resposta; um fluxo automático de descadastro não faz parte deste trabalho.

Arquivo principal: `src/lib/email/launch-templates.ts`. Apoio provável: configuração de links, asset público de logo e documentação de integração.

## 3. Validação após implementação

### Home

- Playwright em mobile, tablet e desktop: layout, capturas, overflow horizontal, menu, foco, teclado e console. Cobrir Chromium e WebKit conforme disponibilidade do ambiente.
- Safari em iPhone real: modo claro/escuro, retrato/paisagem, barras expandidas/recolhidas, rolagem até o fim, elasticidade e navegação de ida/volta.
- A emulação de iPhone em Playwright não comprova a cor ou a translucidez da interface nativa do Safari. Se não houver aparelho disponível, registrar essa pendência explicitamente na entrega.
- Confirmar logo e controles fora do notch e do indicador inferior; verificar regressões em `/lancamento`, `/login` e dashboard.

### E-mails

- Gerar prévias dos dois templates com dados fictícios em 320, 390 e 560 px, incluindo endereço de e-mail longo.
- Conferir logo, contraste, quebras de linha, links absolutos, versão de texto e leitura com imagens bloqueadas.
- Conferir em Apple Mail, Gmail e Outlook quando houver ambiente de teste disponível. Prévia em navegador valida o HTML, mas não substitui os clientes reais.
- Usar mensagens de teste somente para caixas explicitamente indicadas para esse fim; não disparar para contatos da lista como parte da validação visual.
- Executar lint, typecheck, build e testes existentes relevantes ao fluxo de e-mail. Acrescentar cobertura apenas para comportamento material ainda não protegido.

## Referências de apoio

- [Stripe — recibos e personalização](https://docs.stripe.com/receipts): identidade compacta e hierarquia que coloca a informação principal da mensagem em primeiro lugar. Adaptar o princípio à Pápum, sem copiar a composição.
- [Mailchimp — Email Design Reference](https://templates.mailchimp.com/): simplicidade, foco da mensagem, tipografia e adaptação a clientes de e-mail.
- [Mailchimp — acessibilidade em e-mails](https://mailchimp.com/help/accessibility-in-email-marketing/): contraste, texto real, links claros e leitura com imagens bloqueadas.
- [WebKit — áreas seguras no iPhone](https://webkit.org/blog/7929/designing-websites-for-iphone-x/): integração das bordas com proteção do conteúdo em telas com recortes.
- [MDN — theme-color](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color): a cor é uma sugestão para navegadores compatíveis, não controle absoluto da interface nativa.

## Ordem de execução após validação

1. Ajustar e validar a integração mobile da Home.
2. Preparar a logo e construir a base visual dos e-mails.
3. Adaptar confirmação e notificação interna e conferir prévias lado a lado.
4. Fazer a rodada de validação, corrigir problemas encontrados e entregar evidências com eventuais limitações de ambiente.
