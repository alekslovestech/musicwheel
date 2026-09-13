import { ActualIndex, actualIndexToChromaticAndOctave } from "@/types/IndexTypes";
import { WHITE_KEYS_PER_OCTAVE } from "@/types/constants/NoteConstants";

//utils for calculating the linear keyboard geometry
export class LinearKeyboardUtils {
  static getKeyPosition(actualIndex: ActualIndex) {
    const { chromaticIndex, octaveOffset } = actualIndexToChromaticAndOctave(actualIndex);
    const basePosition = LinearKeyboardUtils.whiteKeyPositions[chromaticIndex];
    const octaveOffsetPosition = octaveOffset * 7; // 7 white keys per octave
    return `${((basePosition + octaveOffsetPosition) / 14) * 100}%`;
  }

  /** Position within a fixed one-octave window, C to the C above it inclusive (8 white keys). */
  static getKeyPositionInOneOctave(actualIndex: ActualIndex): string {
    const { chromaticIndex, octaveOffset } = actualIndexToChromaticAndOctave(actualIndex);
    const basePosition =
      LinearKeyboardUtils.whiteKeyPositions[chromaticIndex] + octaveOffset * WHITE_KEYS_PER_OCTAVE;
    return `${(basePosition / (WHITE_KEYS_PER_OCTAVE + 1)) * 100}%`;
  }

  static readonly whiteKeyPositions: number[] = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6];
}
