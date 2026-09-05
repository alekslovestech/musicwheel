import { GlobalMode } from "@/types/enums/GlobalMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { classicalModeForScaleMode } from "@/types/Keys/MusicalKey";

import { scaleTypeToSlug, slugToScaleType } from "./codecs";
import { isLegalTonicForClassicalMode, legalTonicsForClassicalMode } from "./legalTonics";
import { buildPath, DEMO_QUERY_PARAM, getBasePath } from "./paths";
import { slugToValue, valueToSlug } from "./slugCodec";
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
  return legalTonicsForClassicalMode(classicalModeForScaleMode(scaleMode));
}

export function isLegalTonic(tonic: string, scaleMode: ScaleModeType): boolean {
  return isLegalTonicForClassicalMode(tonic, classicalModeForScaleMode(scaleMode));
}

const PLAYBACK_MODE_SLUG_MAP: Record<string, ScalePlaybackMode> = {
  single: ScalePlaybackMode.SingleNote,
  triad: ScalePlaybackMode.Triad,
  droned: ScalePlaybackMode.DronedSingleNote,
  seventh: ScalePlaybackMode.Seventh,
};

export const slugToPlaybackMode = (slug: string) => slugToValue(PLAYBACK_MODE_SLUG_MAP, slug);
export const playbackModeToSlug = (mode: ScalePlaybackMode | null) =>
  valueToSlug(PLAYBACK_MODE_SLUG_MAP, mode);

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
  return buildPath(
    getBasePath(GlobalMode.Scales),
    [tonicSlug, modeSlug],
    [
      `${PLAYBACK_QUERY_PARAM}=${playbackModeToSlug(selection.playbackMode)}`,
      ...(options.demo ? [DEMO_QUERY_PARAM] : []),
    ],
  );
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
