import { GlobalMode } from "@/types/enums/GlobalMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { classicalModeForScaleMode } from "@/types/Keys/MusicalKey";
import { KeySignature } from "@/types/Keys/KeySignature";

import { scaleTypeToSlug, slugToScaleType } from "./codecs";
import { DEMO_QUERY_PARAM, getBasePath } from "./paths";
import { slugToTonic, tonicToSlug } from "./tonicSlug";

export { tonicToSlug, slugToTonic } from "./tonicSlug";

export interface ScaleSelection {
  tonic: string;
  scaleMode: ScaleModeType;
  playbackMode: ScalePlaybackMode;
}

export const PLAYBACK_QUERY_PARAM = "play";

/** The tonics a scale mode can legally take - one canonical spelling per pitch class. */
export function legalTonicsForScaleMode(scaleMode: ScaleModeType): string[] {
  return KeySignature.getKeyList(classicalModeForScaleMode(scaleMode));
}

export function isLegalTonic(tonic: string, scaleMode: ScaleModeType): boolean {
  return legalTonicsForScaleMode(scaleMode).includes(tonic);
}

const PLAYBACK_MODE_SLUGS: Record<ScalePlaybackMode, string> = {
  [ScalePlaybackMode.SingleNote]: "single",
  [ScalePlaybackMode.Triad]: "triad",
  [ScalePlaybackMode.DronedSingleNote]: "droned",
  [ScalePlaybackMode.Seventh]: "seventh",
};

const SLUG_TO_PLAYBACK_MODE: Record<string, ScalePlaybackMode> = Object.fromEntries(
  Object.entries(PLAYBACK_MODE_SLUGS).map(([mode, slug]) => [slug, mode as ScalePlaybackMode]),
);

export function playbackModeToSlug(mode: ScalePlaybackMode): string {
  return PLAYBACK_MODE_SLUGS[mode];
}

export function slugToPlaybackMode(slug: string): ScalePlaybackMode | undefined {
  return SLUG_TO_PLAYBACK_MODE[slug.toLowerCase()];
}

export interface ReadonlySearchParamsLike {
  get(name: string): string | null;
}

/** Builds the canonical, fully-specified URL for a scale selection - tonic and mode as path
 * segments (for SEO and shareability), playback mode as a query param (a view preference, not
 * something worth its own indexed page). */
export function scaleSelectionPath(
  selection: ScaleSelection,
  options: { demo?: boolean } = {},
): string {
  const tonicSlug = tonicToSlug(selection.tonic);
  const modeSlug = scaleTypeToSlug(selection.scaleMode);
  const query = [
    `${PLAYBACK_QUERY_PARAM}=${playbackModeToSlug(selection.playbackMode)}`,
    ...(options.demo ? [DEMO_QUERY_PARAM] : []),
  ].join("&");
  return `${getBasePath(GlobalMode.Scales)}/${tonicSlug}/${modeSlug}?${query}`;
}

/**
 * Parses a scale selection from route segments and query params. Total: any axis missing or
 * unparseable (an older link, a typo, a tonic spelling that's not legal for that mode) falls back
 * to the corresponding value in `fallback` rather than failing, so callers never need to handle an
 * invalid selection here - route validation (404 on a bad mode or tonic) is the caller's job.
 */
export function scaleSelectionFromRoute(
  tonicSlug: string,
  modeSlug: string,
  searchParams: ReadonlySearchParamsLike | null | undefined,
  fallback: ScaleSelection,
): ScaleSelection {
  const scaleMode = slugToScaleType(modeSlug) ?? fallback.scaleMode;

  const decodedTonic = slugToTonic(tonicSlug);
  const tonic =
    decodedTonic != null && isLegalTonic(decodedTonic, scaleMode) ? decodedTonic : fallback.tonic;

  const playbackSlug = searchParams?.get(PLAYBACK_QUERY_PARAM);
  const playbackMode =
    (playbackSlug != null ? slugToPlaybackMode(playbackSlug) : undefined) ?? fallback.playbackMode;

  return { tonic, scaleMode, playbackMode };
}

/** Whether the route (path segments + query params) already encodes exactly this selection. */
export function routeMatchesScaleSelection(
  tonicSlug: string,
  modeSlug: string,
  searchParams: ReadonlySearchParamsLike | null | undefined,
  selection: ScaleSelection,
): boolean {
  return (
    tonicSlug === tonicToSlug(selection.tonic) &&
    modeSlug === scaleTypeToSlug(selection.scaleMode) &&
    searchParams?.get(PLAYBACK_QUERY_PARAM) === playbackModeToSlug(selection.playbackMode)
  );
}
