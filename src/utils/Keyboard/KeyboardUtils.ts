import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";

import { ChromaticIndex } from "@/types/ChromaticIndex";
import { ActualIndex, actualToChromatic, chromaticToActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { NoteFormatter } from "@/utils/formatters/NoteFormatter";
import { MusicalKeyNoteFormatter } from "@/utils/formatters/MusicalKeyNoteFormatter";
import { ChromaticNoteResolver } from "@/utils/resolvers/ChromaticNoteResolver";
export class KeyboardUtils {
  static StringWithPaddedIndex(prefix: string, index: number): string {
    return `${prefix}${String(index).padStart(2, "0")}`;
  }

  private static isSelectedEitherOctave(
    chromaticIndex: ChromaticIndex,
    selectedNoteIndices: NoteIndices,
  ): boolean {
    const actualIndex0 = chromaticToActual(chromaticIndex, 0);
    const actualIndex1 = chromaticToActual(chromaticIndex, 1);
    return selectedNoteIndices.includes(actualIndex0) || selectedNoteIndices.includes(actualIndex1);
  }

  static isKeySelected(
    actualIndex: ActualIndex,
    selectedNoteIndices: NoteIndices,
    keyboardUI: KeyboardUIType,
  ): boolean {
    if (keyboardUI === KeyboardUIType.Linear) {
      return selectedNoteIndices.includes(actualIndex);
    }
    return this.isSelectedEitherOctave(actualToChromatic(actualIndex), selectedNoteIndices);
  }

  private static computeNoteTextForScalesMode(
    chromaticIndex: ChromaticIndex,
    selectedMusicalKey: MusicalKey,
    keyDisplayMode: KeyDisplayMode,
  ): string {
    const isDiatonic = selectedMusicalKey.scaleModeInfo.isDiatonicNote(
      chromaticIndex,
      selectedMusicalKey.tonicIndex,
    );

    return !isDiatonic
      ? ""
      : MusicalKeyNoteFormatter.formatNoteForDisplay(
          selectedMusicalKey,
          chromaticIndex,
          keyDisplayMode,
        );
  }

  private static computeNoteTextForDefaultMode(chromaticIndex: ChromaticIndex): string {
    if (BlackKeyUtils.isBlackKey(chromaticIndex)) return "";
    const resolvedNote = ChromaticNoteResolver.resolveAbsoluteNote(
      chromaticIndex,
      AccidentalType.Sharp, // Use sharp as default
    );
    return NoteFormatter.formatForDisplay(resolvedNote);
  }

  // Unified function: returns adjacent key state (black status and selection status)
  static getAdjacentKeyState(
    chromaticIndex: ChromaticIndex,
    selectedNoteIndices: NoteIndices,
  ): {
    prevAccidentalExists: boolean;
    nextAccidentalExists: boolean;
    prevAccidentalSelected: boolean;
    nextAccidentalSelected: boolean;
  } {
    const isBlack = BlackKeyUtils.isBlackKey(chromaticIndex);
    const { prevChromaticIndex, nextChromaticIndex, prevIsBlack, nextIsBlack } =
      BlackKeyUtils.getAdjacentChromaticIndices(chromaticIndex);

    if (isBlack) {
      return {
        prevAccidentalExists: prevIsBlack,
        nextAccidentalExists: nextIsBlack,
        prevAccidentalSelected: false,
        nextAccidentalSelected: false,
      };
    }

    return {
      prevAccidentalExists: prevIsBlack,
      nextAccidentalExists: nextIsBlack,
      prevAccidentalSelected:
        prevIsBlack && this.isSelectedEitherOctave(prevChromaticIndex, selectedNoteIndices),
      nextAccidentalSelected:
        nextIsBlack && this.isSelectedEitherOctave(nextChromaticIndex, selectedNoteIndices),
    };
  }

  static buildKeyClasses(
    baseClasses: string[],
    isSelected: boolean,
    isShortKey: boolean,
    isScales: boolean,
    isBassNote: boolean,
    isDiatonicInScale = true,
  ): string {
    const classes = [...baseClasses];
    if (isSelected) classes.push("selected");
    if (isShortKey) classes.push("short");
    if (isScales && !isDiatonicInScale) classes.push("disabled");
    if (isBassNote) classes.push("root-note");
    return classes.join(" ");
  }

  private static resolveCircularScaleLabelMode(scalePlaybackMode: ScalePlaybackMode): KeyDisplayMode {
    switch (scalePlaybackMode) {
      case ScalePlaybackMode.Triad:
        return KeyDisplayMode.Roman;
      case ScalePlaybackMode.DronedSingleNote:
        return KeyDisplayMode.ScaleDegree;
      default:
        return KeyDisplayMode.NoteNames;
    }
  }

  static getNoteText(
    keyboardUI: KeyboardUIType,
    chromaticIndex: ChromaticIndex,
    isScales: boolean,
    selectedMusicalKey: MusicalKey,
    scalePlaybackMode?: ScalePlaybackMode,
  ): string {
    return isScales && keyboardUI === KeyboardUIType.Circular
      ? this.computeNoteTextForScalesMode(
          chromaticIndex,
          selectedMusicalKey,
          this.resolveCircularScaleLabelMode(scalePlaybackMode ?? ScalePlaybackMode.SingleNote),
        )
      : this.computeNoteTextForDefaultMode(chromaticIndex);
  }
}
