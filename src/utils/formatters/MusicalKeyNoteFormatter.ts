import { TWELVE } from "@/types/constants/NoteConstants";
import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";

import { ChromaticIndex, ixChromatic } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { ChromaticNoteResolver } from "@/utils/resolvers/ChromaticNoteResolver";
import { ScaleNoteSpellingResolver } from "@/utils/resolvers/ScaleNoteSpellingResolver";

import { ScaleModeFormatter } from "./ScaleModeFormatter";
import { ScaleDegreeFormatter } from "./ScaleDegreeFormatter";
import { NoteFormatter } from "./NoteFormatter";

/** Display labels for each chromatic pitch in the context of a key (note names, degrees, or roman). */
export class MusicalKeyNoteFormatter {
  static formatNoteForDisplay(
    musicalKey: MusicalKey,
    chromaticIndex: ChromaticIndex,
    keyTextMode: KeyDisplayMode,
  ): string {
    const scaleDegreeInfo = musicalKey.scaleModeInfo
      ? musicalKey.scaleModeInfo.getScaleDegreeInfoFromChromatic(chromaticIndex, musicalKey.tonicIndex)
      : musicalKey.getOtherScaleDegreeInfo(chromaticIndex);

    if (keyTextMode === KeyDisplayMode.NoteNames) {
      const scaleNoteInfo = ScaleNoteSpellingResolver.resolveNoteInScale(musicalKey, chromaticIndex);
      if (scaleNoteInfo) return NoteFormatter.formatForDisplay(scaleNoteInfo);

      const noteInfo = ChromaticNoteResolver.resolveAbsoluteNote(
        chromaticIndex,
        musicalKey.getDefaultAccidental(),
      );
      return NoteFormatter.formatForDisplay(noteInfo);
    }
    if (!scaleDegreeInfo) return "";

    // A non-diatonic key never resolves to Roman/RomanSeventh here - KeyboardUtils.getNoteText
    // already falls that case back to ScaleDegree before calling in.
    if (!musicalKey.scaleModeInfo) return ScaleDegreeFormatter.formatForDisplay(scaleDegreeInfo);

    return ScaleModeFormatter.formatScaleDegreeForDisplay(
      musicalKey.scaleModeInfo,
      scaleDegreeInfo,
      keyTextMode,
    );
  }

  static formatAllNotesForDisplay(musicalKey: MusicalKey, keyTextMode: KeyDisplayMode): string[] {
    return Array.from({ length: TWELVE }, (_, i) =>
      this.formatNoteForDisplay(musicalKey, ixChromatic(i), keyTextMode),
    );
  }
}
