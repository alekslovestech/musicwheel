import { ChromaticIndex, addChromatic, subChromatic } from "@/types/ChromaticIndex";

export class BlackKeyUtils {
  static isBlackKey(chromaticIndex: ChromaticIndex): boolean {
    return [1, 3, 6, 8, 10].includes(chromaticIndex);
  }

  static getAdjacentChromaticIndices(chromaticIndex: ChromaticIndex): {
    prevChromaticIndex: ChromaticIndex;
    nextChromaticIndex: ChromaticIndex;
    prevIsBlack: boolean;
    nextIsBlack: boolean;
  } {
    const prevChromaticIndex = subChromatic(chromaticIndex, 1);
    const nextChromaticIndex = addChromatic(chromaticIndex, 1);
    return {
      prevChromaticIndex,
      nextChromaticIndex,
      prevIsBlack: this.isBlackKey(prevChromaticIndex),
      nextIsBlack: this.isBlackKey(nextChromaticIndex),
    };
  }
}
