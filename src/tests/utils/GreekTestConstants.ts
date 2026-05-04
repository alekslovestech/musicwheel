import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { KeyType } from "@/types/enums/KeyType";
import { MusicalKey } from "@/types/Keys/MusicalKey";

export class GreekTestConstants {
  private static instance: GreekTestConstants;

  readonly C_IONIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
  readonly C_DORIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Dorian);
  readonly C_PHRYGIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Phrygian);
  readonly C_LYDIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Lydian);
  readonly C_MIXOLYDIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Mixolydian);
  readonly C_AEOLIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Aeolian);
  readonly C_LOCRIAN_KEY = MusicalKey.fromGreekMode("C", ScaleModeType.Locrian);
  readonly E_MAJOR = MusicalKey.fromClassicalMode("E", KeyType.Major);
  readonly G_MAJOR = MusicalKey.fromClassicalMode("G", KeyType.Major);

  // Traditional starting positions for each mode
  readonly D_IONIAN_KEY = MusicalKey.fromGreekMode("D", ScaleModeType.Ionian);
  readonly D_DORIAN_KEY = MusicalKey.fromGreekMode("D", ScaleModeType.Dorian);
  readonly E_PHRYGIAN_KEY = MusicalKey.fromGreekMode("E", ScaleModeType.Phrygian);
  readonly F_LYDIAN_KEY = MusicalKey.fromGreekMode("F", ScaleModeType.Lydian);
  readonly G_MIXOLYDIAN_KEY = MusicalKey.fromGreekMode("G", ScaleModeType.Mixolydian);
  readonly A_AEOLIAN_KEY = MusicalKey.fromGreekMode("A", ScaleModeType.Aeolian);
  readonly B_LOCRIAN_KEY = MusicalKey.fromGreekMode("B", ScaleModeType.Locrian);

  private constructor() {}

  static getInstance(): GreekTestConstants {
    if (!GreekTestConstants.instance) {
      GreekTestConstants.instance = new GreekTestConstants();
    }
    return GreekTestConstants.instance;
  }
}
