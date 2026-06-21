/** First-party path for PostHog API traffic (avoid obvious names like /analytics). */
export const POSTHOG_PROXY_PATH = "/ingest";

export function getPostHogApiHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_API_HOST ?? "https://us.i.posthog.com";
}

export function getPostHogAssetsHost(): string {
  return getPostHogApiHost().replace(".i.posthog.com", "-assets.i.posthog.com");
}

export function getPostHogUiHost(): string {
  return getPostHogApiHost().includes("eu.i.posthog.com")
    ? "https://eu.posthog.com"
    : "https://us.posthog.com";
}
