import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

const DEFAULT_PROGRESSION_SLUG = "perfect-cadence";

const PROGRESSION_SLUG_MAP: Record<string, ChordProgressionType> = {
  "perfect-cadence": ChordProgressionType.Perfect_Cadence,
  "plagal-cadence": ChordProgressionType.Plagal_Cadence,
  "line-cliche": ChordProgressionType.Line_Cliche,
  "gypsy-woman": ChordProgressionType.Gypsy_Woman,
  "around-the-world": ChordProgressionType.Around_The_World,
  "let-it-be": ChordProgressionType.LetItBe,
  "let-it-be-intermission": ChordProgressionType.LetItBe_Intermission,
  "with-or-without-you": ChordProgressionType.WithOrWithoutYou,
  something: ChordProgressionType.Something,
  blues: ChordProgressionType.Blues,
  creep: ChordProgressionType.Creep,
};

export const slugToProgressionType = (slug: string): ChordProgressionType | undefined =>
  PROGRESSION_SLUG_MAP[slug.toLowerCase()];

export const progressionTypeToSlug = (type: ChordProgressionType | null): string =>
  type != null
    ? (Object.entries(PROGRESSION_SLUG_MAP).find(([, v]) => v === type)?.[0] ??
      DEFAULT_PROGRESSION_SLUG)
    : DEFAULT_PROGRESSION_SLUG;
