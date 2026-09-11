import type { NextConfig } from "next";

import {
  getPostHogApiHost,
  getPostHogAssetsHost,
  POSTHOG_PROXY_PATH,
} from "./src/lib/tracking/posthogProxy";

const posthogApiHost = getPostHogApiHost();
const posthogAssetsHost = getPostHogAssetsHost();

const nextConfig: NextConfig = {
  devIndicators: false,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/learn/scales/melodic",
        destination: "/learn/scales/melodic-minor-modes",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: `${POSTHOG_PROXY_PATH}/static/:path*`,
        destination: `${posthogAssetsHost}/static/:path*`,
      },
      {
        source: `${POSTHOG_PROXY_PATH}/array/:path*`,
        destination: `${posthogAssetsHost}/array/:path*`,
      },
      {
        source: `${POSTHOG_PROXY_PATH}/:path*`,
        destination: `${posthogApiHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
