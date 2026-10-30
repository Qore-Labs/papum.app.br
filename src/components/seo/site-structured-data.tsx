import { siteConfig } from "@/utils/config/site";

export function SiteStructuredData() {
  const organizationId = `${siteConfig.url}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: new URL("/email/papum-logo.png", siteConfig.url).href,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        alternateName: ["Pápum Delivery", "Pápum!"],
        url: siteConfig.url,
        inLanguage: "pt-BR",
        publisher: { "@id": organizationId },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
