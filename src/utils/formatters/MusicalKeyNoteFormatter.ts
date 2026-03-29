import { TWELVE } from "@/types/constants/NoteConstants";
import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";

import { ChromaticIndex, ixChromatic } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { ChromaticNoteResolver } from "@/utils/resolvers/ChromaticNoteResolver";

import { ScaleModeFormatter } from "./ScaleModeFormatter";
import { NoteFormatter } from "./NoteFormatter";

/** Display labels for each chromatic pitch in the context of a key (note names, degrees, or roman). */
export class MusicalKeyNoteFormatter {
  static formatNoteForDisplay(
    musicalKey: MusicalKey,
    chromaticIndex: ChromaticIndex,
    keyTextMode: KeyDisplayMode,
  ): string {
    const scaleDegreeInfo =
      musicalKey.scaleModeInfo.getScaleDegreeInfoFromChromatic(
        chromaticIndex,
        musicalKey.tonicIndex,
      );
    if (keyTextMode === KeyDisplayMode.NoteNames) {
      const noteInfo = ChromaticNoteResolver.resolveAbsoluteNote(
        chromaticIndex,
        musicalKey.getDefaultAccidental(),
      );
      return NoteFormatter.formatForDisplay(noteInfo);
    }
    if (!scaleDegreeInfo) return "";

    return ScaleModeFormatter.formatScaleDegreeForDisplay(
      musicalKey.scaleModeInfo,
      scaleDegreeInfo,
      keyTextMode,
    );
  }

  static formatAllNotesForDisplay(
    musicalKey: MusicalKey,
    keyTextMode: KeyDisplayMode,
  ): string[] {
    return Array.from({ length: TWELVE }, (_, i) =>
      this.formatNoteForDisplay(musicalKey, ixChromatic(i), keyTextMode),
    );
  }
}
