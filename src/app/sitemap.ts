import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata";
import { COMPARISONS } from "@/lib/learn/comparisons";
import { PROGRESSION_SLUG_MAP } from "@/types/ChordProgressions/progressionRegistry";
import { SCALE_SLUG_MAP } from "@/types/ScaleModes/ScaleModeRegistry";
import { legalTonicsForProgression, tonicToSlug } from "@/utils/slug/progressionSelection";
import { legalTonicsForScaleMode } from "@/utils/slug/scaleSelection";

/**
 * Every canonical, indexable URL on the site. Deliberately excludes the redirect-only routes
 * (/, /default, /scales, /scales/[tonic], /progressions) - a sitemap entry that 30x's elsewhere
 * wastes crawl budget instead of pointing it at content. Scale and progression combinations are
 * derived from the same registries their own generateStaticParams use, so this can't drift from
 * the routes that actually exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const url = (path: string) => `${siteUrl}${path}`;

  const staticPages = [url("/harmony"), url("/learn"), url("/learn/comparisons")];

  const comparisonPages = COMPARISONS.map(({ href }) => url(href));

  const scalePages = Object.entries(SCALE_SLUG_MAP).flatMap(([modeSlug, scaleMode]) =>
    legalTonicsForScaleMode(scaleMode).map((tonic) =>
      url(`/scales/${tonicToSlug(tonic)}/${modeSlug}`),
    ),
  );

  const progressionPages = Object.entries(PROGRESSION_SLUG_MAP).flatMap(
    ([progressionSlug, progressionType]) =>
      legalTonicsForProgression(progressionType).map((tonic) =>
        url(`/progressions/${tonicToSlug(tonic)}/${progressionSlug}`),
      ),
  );

  return [...staticPages, ...comparisonPages, ...scalePages, ...progressionPages].map((loc) => ({
    url: loc,
  }));
}
