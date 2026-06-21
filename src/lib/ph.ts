import posthog from "posthog-js";
import packageJson from "../../package.json";

import { getPostHogUiHost, POSTHOG_PROXY_PATH } from "./posthogProxy";

const isDevelopment = process.env.NODE_ENV === "development";

export function initPH() {
  if (typeof window === "undefined") return;

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY && !posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: POSTHOG_PROXY_PATH,
      ui_host: getPostHogUiHost(),
      person_profiles: "always", //include anonymous users
      loaded: (posthog) => {
        if (isDevelopment) {
          console.log("[PostHog] Successfully loaded!");
        }
        posthog.register({
          environment: isDevelopment ? "development" : "production",
          version: packageJson.version,
        });
      },
      autocapture: false,
      capture_pageview: false,
      persistence: "localStorage",
      debug: isDevelopment,
      disable_session_recording: true,
      disable_surveys: true,
    });
  } else if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY not found");
  }
}

export const ph = posthog;
