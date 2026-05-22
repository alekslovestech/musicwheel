import { ScaleModeType } from "@/types/enums/ScaleModeType";

const SCALE_SLUG_MAP: Record<string, ScaleModeType> = {
  ionian: ScaleModeType.Ionian,
  dorian: ScaleModeType.Dorian,
  "ukrainian-dorian": ScaleModeType.UkrainianDorian,
  phrygian: ScaleModeType.Phrygian,
  "phrygian-dominant": ScaleModeType.PhrygianDominant,
  byzantine: ScaleModeType.Byzantine,
  lydian: ScaleModeType.Lydian,
  mixolydian: ScaleModeType.Mixolydian,
  aeolian: ScaleModeType.Aeolian,
  "harmonic-minor": ScaleModeType.HarmonicMinor,
  "hungarian-minor": ScaleModeType.HungarianMinor,
  locrian: ScaleModeType.Locrian,
};

export const slugToScaleType = (slug: string): ScaleModeType | undefined =>
  SCALE_SLUG_MAP[slug.toLowerCase()];

export const scaleTypeToSlug = (mode: ScaleModeType): string =>
  Object.entries(SCALE_SLUG_MAP).find(([, v]) => v === mode)?.[0] ?? "ionian";
