import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { DEFAULT_MUSICAL_KEY } from "@/types/Keys/MusicalKey";
import { PROGRESSION_REGISTRY } from "@/types/ChordProgressions/progressionRegistry";

import { progressionTypeToSlug, slugToProgressionType } from "./codecs";
import { isLegalTonicForClassicalMode, legalTonicsForClassicalMode } from "./legalTonics";
import { getPath } from "./paths";
import { slugToTonic, tonicToSlug } from "./tonicSlug";

export { tonicToSlug, slugToTonic } from "./tonicSlug";

export interface ProgressionSelection {
  tonic: string;
  progression: ChordProgressionType;
}

/** The progression's own key - what its chords were written against, and its default tonic. */
export function suggestedKeyForProgression(progression: ChordProgressionType) {
  return PROGRESSION_REGISTRY[progression].suggestedMusicalKey ?? DEFAULT_MUSICAL_KEY;
}

/** The tonics a progression can legally take - one canonical spelling per pitch class, in the
 * major or minor family the progression's chords were written in. */
export function legalTonicsForProgression(progression: ChordProgressionType): string[] {
  return legalTonicsForClassicalMode(suggestedKeyForProgression(progression).classicalMode);
}

export function isLegalProgressionTonic(tonic: string, progression: ChordProgressionType): boolean {
  return isLegalTonicForClassicalMode(tonic, suggestedKeyForProgression(progression).classicalMode);
}

export const DEFAULT_PROGRESSION_TYPE: ChordProgressionType = slugToProgressionType(
  progressionTypeToSlug(null),
)!;

export function defaultProgressionSelection(): ProgressionSelection {
  return {
    tonic: suggestedKeyForProgression(DEFAULT_PROGRESSION_TYPE).tonicString,
    progression: DEFAULT_PROGRESSION_TYPE,
  };
}

/** Builds the canonical, fully-specified URL for a progression selection - tonic and progression
 * as path segments, for SEO and shareability. */
export function progressionSelectionPath(
  selection: ProgressionSelection,
  options: { demo?: boolean } = {},
): string {
  const tonicSlug = tonicToSlug(selection.tonic);
  const progressionSlug = progressionTypeToSlug(selection.progression);
  return getPath(GlobalMode.ChordProgressions, `${tonicSlug}/${progressionSlug}`, options.demo);
}

/**
 * Parses a progression selection from route segments. Total: an unparseable progression slug
 * falls back to `fallbackProgression`, and a missing/illegal tonic (an older link, a typo, a
 * spelling that's not legal for the resolved progression's key) falls back to that progression's
 * own suggested tonic - not the caller's prior tonic, since switching progressions is expected to
 * land on that progression's natural key unless the URL says otherwise. Route validation (404 on
 * a bad progression or tonic) is the caller's job.
 */
export function progressionSelectionFromRoute(
  tonicSlug: string,
  progressionSlug: string,
  fallbackProgression: ChordProgressionType,
): ProgressionSelection {
  const progression = slugToProgressionType(progressionSlug) ?? fallbackProgression;

  const decodedTonic = slugToTonic(tonicSlug);
  const tonic =
    decodedTonic != null && isLegalProgressionTonic(decodedTonic, progression)
      ? decodedTonic
      : suggestedKeyForProgression(progression).tonicString;

  return { tonic, progression };
}

/** Whether the route (path segments) already encodes exactly this selection. */
export function routeMatchesProgressionSelection(
  tonicSlug: string,
  progressionSlug: string,
  selection: ProgressionSelection,
): boolean {
  return (
    tonicSlug === tonicToSlug(selection.tonic) &&
    progressionSlug === progressionTypeToSlug(selection.progression)
  );
}
