"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useGlobalMode } from "@/lib/hooks";

import { initPH, ph } from "./ph";

/**
 * Site-wide pageview tracking, mounted at the true root so it covers every route - the
 * interactive app under (app) and the static /learn articles alike. Split out of RootProvider
 * (now scoped to the (app) group) because it depends only on the pathname, not on any of the
 * music/audio contexts those routes mount.
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const globalMode = useGlobalMode();
  const pathname = usePathname();

  useEffect(() => {
    initPH();
  }, []);

  useEffect(() => {
    if (ph.__loaded && pathname) {
      ph.capture("$pageview", {
        $current_url: window.location.href,
        pathname: pathname,
        global_mode: globalMode,
      });
    }
  }, [pathname, globalMode]);

  return <>{children}</>;
}
