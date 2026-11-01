import {
  CONFIRMATION_EMAIL_CONTENT,
  LAUNCH_EMAIL_BRAND,
  LAUNCH_EMAIL_FOOTER_LINKS,
  NOTIFICATION_EMAIL_CONTENT,
} from "@/utils/contents/launch-emails";
import { LEAD_ORIGINS, type LeadEntry } from "@/utils/config/attribution";

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
  entry?: LeadEntry;
}

interface EmailLayoutInput {
  variant: "confirmation" | "notification";
  preheader: string;
  heading: string;
  content: string;
  footerNotice: string;
}

const colors = {
  canvas: "#f0eee7",
  paper: "#faf9f5",
  ink: "#1b1c1c",
  secondary: "#625c53",
  yellow: "#ffc400",
  charcoal: "#191817",
  lightInk: "#fffaf2",
  border: "#dedbd2",
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

function action(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tr><td align="center" bgcolor="${colors.charcoal}" style="border-radius:999px;background-color:${colors.charcoal};mso-padding-alt:14px 24px"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 24px;color:${colors.lightInk};font-size:15px;line-height:20px;font-weight:700;text-align:center;text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`;
}

function emailLayout({
  variant,
  preheader,
  heading,
  content,
  footerNotice,
}: EmailLayoutInput): string {
  const confirmation = variant === "confirmation";
  const title = `<h1 style="margin:0;color:${colors.ink};font-size:${confirmation ? 32 : 28}px;line-height:${confirmation ? 37 : 34}px;font-weight:700;letter-spacing:-0.7px">${escapeHtml(heading)}</h1>`;
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
    .email-header { padding:28px 24px !important; }
    .email-content { padding:28px 24px 32px !important; }
  }
  @media only screen and (max-width:480px) {
    .email-product-image { display:block !important; width:100% !important; padding:0 0 20px !important; }
    .email-product-copy { display:block !important; width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${colors.canvas};color:${colors.ink};font-family:Arial,Helvetica,sans-serif">
<div style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.canvas}" style="width:100%;border-collapse:collapse;background-color:${colors.canvas}">
<tr><td class="email-outer" align="center" style="padding:40px 16px">
<!--[if mso]><table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${colors.paper}" style="width:100%;max-width:560px;table-layout:fixed;border-radius:16px;border-spacing:0;background-color:${colors.paper}">
<tr><td class="email-header" bgcolor="${colors.yellow}" style="padding:${confirmation ? "32px 36px 36px" : "24px 36px"};background-color:${colors.yellow};border-radius:16px 16px 0 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse"><tr><td valign="middle"><img src="${escapeHtml(LAUNCH_EMAIL_BRAND.logoUrl)}" alt="${escapeHtml(LAUNCH_EMAIL_BRAND.logoAlt)}" width="152" height="59" style="display:block;width:152px;max-width:100%;height:59px;border:0;background-color:${colors.yellow};color:${colors.ink};font-size:18px;font-weight:bold"></td><td width="28" align="right" valign="middle"><img src="${escapeHtml(LAUNCH_EMAIL_BRAND.boltUrl)}" alt="" role="presentation" width="28" height="35" style="display:block;width:28px;height:35px;border:0"></td></tr></table>
${confirmation ? `<div style="padding-top:28px">${title}</div>` : ""}
</td></tr>
<tr><td class="email-content" style="padding:32px 36px 36px;color:${colors.ink};font-size:16px;line-height:26px">
${confirmation ? "" : `<div style="padding-bottom:16px">${title}</div>`}
${content}
${confirmation ? `<p style="margin:28px 0 0;font-size:15px;line-height:25px">${escapeHtml(LAUNCH_EMAIL_BRAND.closing)}<br><strong>${escapeHtml(LAUNCH_EMAIL_BRAND.signature)}</strong></p>` : ""}
</td></tr>
<tr><td align="center" bgcolor="${colors.paper}" style="padding:10px 12px;background-color:${colors.paper};border-top:1px solid ${colors.border};border-radius:0 0 16px 16px">
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
  entry = "lancamento",
}: LaunchEmailsInput): LaunchEmail[] {
  const from = `Pápum Delivery <${sender}>`;
  const notification = NOTIFICATION_EMAIL_CONTENT;
  const origin = LEAD_ORIGINS[entry];
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
      subject: notification.subject,
      html: emailLayout({
        variant: "notification",
        preheader: notification.preheader,
        heading: notification.heading,
        content: `${paragraph(notification.introduction)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;margin:24px 0 28px"><tr><td style="padding:20px 0;border-top:1px solid ${colors.border};border-bottom:1px solid ${colors.border}">
<p style="margin:0 0 6px;color:${colors.secondary};font-size:14px;line-height:21px">${escapeHtml(notification.contactLabel)}</p>
<a href="${replyUrl}" style="color:${colors.ink};font-size:17px;line-height:26px;font-weight:700;text-decoration:underline;word-break:break-all;overflow-wrap:anywhere">${safeEmail}</a>
<p style="margin:20px 0 4px;color:${colors.secondary};font-size:14px;line-height:21px">${escapeHtml(notification.originLabel)}</p>
<p style="margin:0;color:${colors.ink};font-size:15px;line-height:24px">${escapeHtml(origin)}</p>
</td></tr></table>
${action(notification.actionLabel, replyUrl)}
<p style="margin:16px 0 0;color:${colors.secondary};font-size:14px;line-height:23px">${escapeHtml(notification.instruction)}</p>`,
        footerNotice: notification.footerNotice,
      }),
      text: [
        notification.heading,
        notification.introduction,
        `${notification.contactLabel}: ${email}\n${notification.originLabel}: ${origin}`,
        `${notification.actionLabel}: ${replyUrl}`,
        notification.instruction,
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
      subject: confirmation.subject,
      html: emailLayout({
        variant: "confirmation",
        preheader: confirmation.preheader,
        heading: confirmation.heading,
        content: `${paragraph(confirmation.introduction)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;border-collapse:collapse;margin:28px 0 32px"><tr>
<td class="email-product-image" width="30%" valign="middle" style="width:30%;padding-right:16px"><img src="${escapeHtml(LAUNCH_EMAIL_BRAND.illustrationUrl)}" alt="" role="presentation" width="140" height="105" style="display:block;width:100%;max-width:140px;height:auto;border:0"></td>
<td class="email-product-copy" valign="middle" style="color:${colors.ink}"><h2 style="margin:0 0 12px;color:${colors.ink};font-size:22px;line-height:28px;font-weight:700;letter-spacing:-0.4px">${escapeHtml(confirmation.productHeading)}</h2><p style="margin:0;color:${colors.secondary};font-size:16px;line-height:26px">${escapeHtml(confirmation.productDescription)}</p></td>
</tr></table>
${action(confirmation.action.label, confirmation.action.href)}`,
        footerNotice: confirmation.footerNotice,
      }),
      text: [
        confirmation.heading,
        confirmation.introduction,
        confirmation.productHeading,
        confirmation.productDescription,
        `${confirmation.action.label}: ${confirmation.action.href}`,
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
