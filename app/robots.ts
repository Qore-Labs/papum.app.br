import type { MetadataRoute } from "next";
import { searchIndexingEnabled } from "@/utils/config/indexing";
import { siteConfig } from "@/utils/config/site";

export default function robots(): MetadataRoute.Robots {
  // Crawlers must reach the pages to read noindex.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(searchIndexingEnabled
      ? { sitemap: `${siteConfig.url}/sitemap.xml` }
      : {}),
  };
}
