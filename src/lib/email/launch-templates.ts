interface LaunchEmail {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
  tags: { name: string; value: string }[];
}

interface LaunchEmailsInput {
  email: string;
  sender: string;
  notificationEmail: string;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

function emailLayout(
  preheader: string,
  heading: string,
  content: string,
): string {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${heading}</title></head>
<body style="margin:0;background:#f7f5f2;color:#25221e;font-family:Arial,Helvetica,sans-serif;line-height:1.6">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${preheader}</div>
<table role="presentation" style="width:100%;border-collapse:collapse"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" style="width:100%;max-width:560px;border-collapse:collapse;background:#ffffff">
<tr><td style="background:#ff8a00;padding:28px 32px;color:#352000;font-size:30px;font-weight:800">Pápum! <span style="font-size:14px;font-weight:400">Delivery</span></td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 24px;font-size:28px;line-height:1.2">${heading}</h1>${content}<p style="margin:28px 0 0">Até já,<br><strong>Equipe Pápum Delivery</strong></p></td></tr>
<tr><td style="padding:20px 32px;background:#fff6e9;font-size:13px;color:#68533c">Você recebeu esta mensagem por um contato feito na página de lançamento do Pápum Delivery. Para cancelar os avisos ou informar que não fez essa solicitação, responda a este e-mail.</td></tr>
</table></td></tr></table></body></html>`;
}

export function buildLaunchEmails({
  email,
  sender,
  notificationEmail,
}: LaunchEmailsInput): LaunchEmail[] {
  const from = `Pápum Delivery <${sender}>`;
  return [
    {
      from,
      to: [notificationEmail],
      reply_to: email,
      subject: "Cliente interessado nos serviços PAPUM Delivery",
      html: emailLayout(
        "Novo interesse no lançamento do Pápum Delivery.",
        "Mais um delivery quer fazer parte.",
        `<p>Uma pessoa pediu para receber novidades sobre o lançamento do Pápum Delivery.</p><p><strong>E-mail:</strong> ${escapeHtml(email)}</p><p><strong>Origem:</strong> página /lancamento.</p><p>Você pode responder a esta mensagem para entrar em contato com ela.</p>`,
      ),
      text: `Novo interesse no lançamento do Pápum Delivery.\n\nE-mail: ${email}\nOrigem: página /lancamento.\nA pessoa pediu para receber novidades sobre o lançamento.\n\nResponda a esta mensagem para entrar em contato.\nEquipe Pápum Delivery`,
      tags: [
        { name: "flow", value: "launch_waitlist" },
        { name: "message", value: "notification" },
      ],
    },
    {
      from,
      to: [email],
      reply_to: sender,
      subject:
        "Recebemos seu contato. Obrigado por chegar junto! | Pápum Delivery",
      html: emailLayout(
        "Seu interesse já chegou por aqui. Obrigado por fazer parte desse começo.",
        "Você já faz parte desse começo.",
        "<p>Olá!</p><p>Recebemos seu contato e ficamos felizes com seu interesse no <strong>Pápum Delivery</strong>.</p><p>Estamos preparando uma forma simples, rápida e inteligente de colocar seu delivery no ar. Assim que tivermos novidades sobre o lançamento, vamos avisar por este e-mail.</p><p>Obrigado por acompanhar a gente desde o início!</p>",
      ),
      text: "Olá!\n\nRecebemos seu contato e ficamos felizes com seu interesse no Pápum Delivery.\n\nEstamos preparando uma forma simples, rápida e inteligente de colocar seu delivery no ar. Assim que tivermos novidades sobre o lançamento, vamos avisar por este e-mail.\n\nObrigado por acompanhar a gente desde o início!\n\nAté já,\nEquipe Pápum Delivery\n\nPara cancelar os avisos ou informar que não fez essa solicitação, responda a este e-mail.",
      tags: [
        { name: "flow", value: "launch_waitlist" },
        { name: "message", value: "confirmation" },
      ],
    },
  ];
}
