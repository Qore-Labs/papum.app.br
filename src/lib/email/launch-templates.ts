import {
  CONFIRMATION_EMAIL_CONTENT,
  LAUNCH_EMAIL_BRAND,
  LAUNCH_EMAIL_FOOTER_LINKS,
  NOTIFICATION_EMAIL_CONTENT,
} from "@/utils/contents/launch-emails";

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

interface EmailLayoutInput {
  preheader: string;
  heading: string;
  content: string;
  footerNotice: string;
}

const colors = {
  canvas: "#f7f5f2",
  paper: "#ffffff",
  ink: "#1b1c1c",
  secondary: "#61564a",
  accent: "#ff8a00",
  soft: "#fff6e9",
  border: "#e9e2d9",
};

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

function paragraph(content: string): string {
  return `<p style="margin:0 0 20px;font-size:16px;line-height:26px">${escapeHtml(content)}</p>`;
}

function emailLayout({
  preheader,
  heading,
  content,
  footerNotice,
}: EmailLayoutInput): string {
  const footerLinks = LAUNCH_EMAIL_FOOTER_LINKS.map(
    (link) =>
      `<td style="padding:0 8px"><a href="${escapeHtml(link.href)}" style="display:inline-block;padding:12px 0;color:${colors.ink};font-size:14px;line-height:20px;font-weight:600;text-decoration:underline;text-underline-offset:3px;white-space:nowrap"><img src="${escapeHtml(link.iconUrl)}" alt="" role="presentation" width="16" height="16" style="display:inline-block;width:16px;height:16px;margin-right:6px;border:0;vertical-align:middle"><span style="vertical-align:middle">${escapeHtml(link.label)}</span></a></td>`,
  ).join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(heading)}</title>
<style>
  :root { color-scheme:light; supported-color-schemes:light; }
  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  a:focus-visible { outline:2px solid ${colors.ink}; outline-offset:4px; }
  @media only screen and (max-width:600px) {
    .email-outer { padding:24px 12px !important; }
    .email-header { padding:28px 24px 24px !important; }
    .email-content { padding:28px 24px 32px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${colors.canvas};color:${colors.ink};font-family:Arial,Helvetica,sans-serif">
<div style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.canvas}" style="width:100%;border-collapse:collapse;background-color:${colors.canvas}">
<tr><td class="email-outer" align="center" style="padding:40px 16px">
<!--[if mso]><table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.paper}" style="width:100%;max-width:560px;table-layout:fixed;border:1px solid ${colors.border};border-radius:16px;border-spacing:0;background-color:${colors.paper}">
<tr><td class="email-header" style="padding:32px 36px 24px;border-bottom:1px solid ${colors.border}">
<img src="${escapeHtml(LAUNCH_EMAIL_BRAND.logoUrl)}" alt="${escapeHtml(LAUNCH_EMAIL_BRAND.logoAlt)}" width="152" height="59" style="display:block;width:152px;max-width:100%;height:auto;border:0;background-color:${colors.paper};color:${colors.ink};font-size:18px;font-weight:bold">
</td></tr>
<tr><td class="email-content" style="padding:32px 36px 36px;color:${colors.ink};font-size:16px;line-height:26px">
<h1 style="margin:0 0 24px;color:${colors.ink};font-size:28px;line-height:35px;font-weight:700;letter-spacing:-0.5px">${escapeHtml(heading)}</h1>
${content}
<p style="margin:28px 0 0;font-size:16px;line-height:25px">${escapeHtml(LAUNCH_EMAIL_BRAND.closing)}<br><strong>${escapeHtml(LAUNCH_EMAIL_BRAND.signature)}</strong></p>
</td></tr>
<tr><td align="center" bgcolor="${colors.soft}" style="padding:8px 12px;background-color:${colors.soft};border-top:1px solid ${colors.border};border-radius:0 0 16px 16px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tr>${footerLinks}</tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;border-collapse:collapse"><tr><td align="center" style="padding:20px 12px 0;color:${colors.secondary};font-size:13px;line-height:21px">${escapeHtml(footerNotice)}</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`;
}

export function buildLaunchEmails({
  email,
  sender,
  notificationEmail,
}: LaunchEmailsInput): LaunchEmail[] {
  const from = `Pápum Delivery <${sender}>`;
  const notification = NOTIFICATION_EMAIL_CONTENT;
  const confirmation = CONFIRMATION_EMAIL_CONTENT;
  const safeEmail = escapeHtml(email);
  const replyUrl = `mailto:${encodeURIComponent(email)}`;
  const textFooterLinks = LAUNCH_EMAIL_FOOTER_LINKS.map(
    (link) => `${link.label}: ${link.href}`,
  ).join("\n");

  return [
    {
      from,
      to: [notificationEmail],
      reply_to: email,
      subject: "Cliente interessado nos serviços PAPUM Delivery",
      html: emailLayout({
        preheader: notification.preheader,
        heading: notification.heading,
        content: `${paragraph(notification.introduction)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.soft}" style="width:100%;table-layout:fixed;background-color:${colors.soft};border-radius:12px;margin:24px 0"><tr><td style="padding:20px">
<p style="margin:0 0 6px;color:${colors.secondary};font-size:14px;line-height:21px">${escapeHtml(notification.contactLabel)}</p>
<a href="${replyUrl}" style="color:${colors.ink};font-size:17px;line-height:26px;font-weight:700;text-decoration:underline;word-break:break-all;overflow-wrap:anywhere">${safeEmail}</a>
<p style="margin:20px 0 4px;color:${colors.secondary};font-size:14px;line-height:21px">${escapeHtml(notification.originLabel)}</p>
<p style="margin:0;color:${colors.ink};font-size:15px;line-height:24px">${escapeHtml(notification.origin)}</p>
</td></tr></table>
${paragraph(notification.instruction)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-collapse:collapse"><tr><td align="center" bgcolor="${colors.accent}" style="border-radius:8px;background-color:${colors.accent};mso-padding-alt:12px 20px">
<a href="${replyUrl}" style="display:inline-block;padding:12px 20px;color:${colors.ink};font-size:15px;line-height:22px;font-weight:700;text-align:center;text-decoration:none">${escapeHtml(notification.actionLabel)}</a>
</td></tr></table>`,
        footerNotice: notification.footerNotice,
      }),
      text: [
        notification.heading,
        notification.introduction,
        `${notification.contactLabel}: ${email}\n${notification.originLabel}: ${notification.origin}`,
        notification.instruction,
        LAUNCH_EMAIL_BRAND.signature,
        textFooterLinks,
        notification.footerNotice,
      ].join("\n\n"),
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
      html: emailLayout({
        preheader: confirmation.preheader,
        heading: confirmation.heading,
        content: [
          confirmation.greeting,
          confirmation.introduction,
          confirmation.nextStep,
          confirmation.thanks,
        ]
          .map(paragraph)
          .join("\n"),
        footerNotice: confirmation.footerNotice,
      }),
      text: [
        confirmation.heading,
        confirmation.greeting,
        confirmation.introduction,
        confirmation.nextStep,
        confirmation.thanks,
        `${LAUNCH_EMAIL_BRAND.closing}\n${LAUNCH_EMAIL_BRAND.signature}`,
        textFooterLinks,
        confirmation.footerNotice,
      ].join("\n\n"),
      tags: [
        { name: "flow", value: "launch_waitlist" },
        { name: "message", value: "confirmation" },
      ],
    },
  ];
}
