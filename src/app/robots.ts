import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata";
import { POSTHOG_PROXY_PATH } from "@/lib/tracking/posthogProxy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Not content - a rewritten proxy to PostHog's ingestion API (see next.config.ts).
      disallow: POSTHOG_PROXY_PATH,
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
