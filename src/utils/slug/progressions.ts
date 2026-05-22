import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

import { createSlugCodec } from "./slugCodec";

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

const progressionSlugCodec = createSlugCodec(PROGRESSION_SLUG_MAP, "perfect-cadence");

export const DEFAULT_PROGRESSION_SLUG = progressionSlugCodec.defaultSlug;
export const slugToProgressionType = progressionSlugCodec.slugToValue;
export const progressionTypeToSlug = (type: ChordProgressionType | null): string =>
  type != null ? progressionSlugCodec.valueToSlug(type) : DEFAULT_PROGRESSION_SLUG;
