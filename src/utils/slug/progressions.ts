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
  "the-world-is-not-enough": ChordProgressionType.The_World_Is_Not_Enough,
  "all-i-want-for-christmas": ChordProgressionType.All_I_Want_For_Christmas,
  "careless-whisper": ChordProgressionType.Careless_Whisper,
  michelle: ChordProgressionType.Michelle,
};

const progressionSlugCodec = createSlugCodec(PROGRESSION_SLUG_MAP);

export const slugToProgressionType = progressionSlugCodec.slugToValue;
export const progressionTypeToSlug = progressionSlugCodec.valueToSlug;
