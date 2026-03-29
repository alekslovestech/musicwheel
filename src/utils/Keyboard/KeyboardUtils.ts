import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { InputMode } from "@/types/enums/InputMode";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";

import { ChromaticIndex } from "@/types/ChromaticIndex";
import { ActualIndex, chromaticToActual, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { NoteFormatter } from "@/utils/formatters/NoteFormatter";
import { MusicalKeyNoteFormatter } from "@/utils/formatters/MusicalKeyNoteFormatter";
import { ChromaticNoteResolver } from "@/utils/resolvers/ChromaticNoteResolver";
import { track } from "@/lib/track";

export class KeyboardUtils {
  static StringWithPaddedIndex(prefix: string, index: number): string {
    return `${prefix}${String(index).padStart(2, "0")}`;
  }

  static isSelectedEitherOctave(
    chromaticIndex: ChromaticIndex,
    selectedNoteIndices: NoteIndices
  ): boolean {
    const actualIndex0 = chromaticToActual(chromaticIndex, 0);
    const actualIndex1 = chromaticToActual(chromaticIndex, 1);
    return (
      selectedNoteIndices.includes(actualIndex0) ||
      selectedNoteIndices.includes(actualIndex1)
    );
  }

  static computeNoteTextForScalesMode(
    chromaticIndex: ChromaticIndex,
    selectedMusicalKey: MusicalKey,
    keyDisplayMode: KeyDisplayMode
  ): string {
    const isDiatonic = selectedMusicalKey.scaleModeInfo.isDiatonicNote(
      chromaticIndex,
      selectedMusicalKey.tonicIndex
    );

    return !isDiatonic
      ? ""
      : MusicalKeyNoteFormatter.formatNoteForDisplay(
          selectedMusicalKey,
          chromaticIndex,
          keyDisplayMode
        );
  }

  static computeNoteTextForDefaultMode(chromaticIndex: ChromaticIndex): string {
    if (BlackKeyUtils.isBlackKey(chromaticIndex)) return "";
    const resolvedNote = ChromaticNoteResolver.resolveAbsoluteNote(
      chromaticIndex,
      AccidentalType.Sharp // Use sharp as default
    );
    return NoteFormatter.formatForDisplay(resolvedNote);
  }

  // Unified function: returns adjacent key state (black status and selection status)
  static getAdjacentKeyState(
    chromaticIndex: ChromaticIndex,
    selectedNoteIndices: NoteIndices
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
        prevIsBlack &&
        this.isSelectedEitherOctave(prevChromaticIndex, selectedNoteIndices),
      nextAccidentalSelected:
        nextIsBlack &&
        this.isSelectedEitherOctave(nextChromaticIndex, selectedNoteIndices),
    };
  }

  static buildKeyClasses(
    baseClasses: string[],
    isSelected: boolean,
    isShortKey: boolean,
    isScales: boolean,
    isBassNote: boolean
  ): string {
    const classes = [...baseClasses];
    if (isSelected) classes.push("selected");
    if (isShortKey) classes.push("short");
    if (isScales) classes.push("disabled");
    if (isBassNote) classes.push("root-note");
    return classes.join(" ");
  }

  static getNoteText(
    isLinearKeyboard: boolean,
    chromaticIndex: ChromaticIndex,
    isScales: boolean,
    selectedMusicalKey: MusicalKey
  ): string {
    return isScales && !isLinearKeyboard
      ? KeyboardUtils.computeNoteTextForScalesMode(
          chromaticIndex,
          selectedMusicalKey,
          KeyDisplayMode.ScaleDegree
        )
      : KeyboardUtils.computeNoteTextForDefaultMode(chromaticIndex);
  }

  static createKeyboardClickHandler(
    globalMode: GlobalMode,
    inputMode: InputMode,
    keyboardType: KeyboardUIType,
    onClick: (index: ActualIndex) => void,
    index: ActualIndex
  ) {
    return () => {
      track("keyboard_interacted", {
        global_mode: globalMode,
        input_mode: inputMode,
        keyboard_ui: keyboardType,
      });
      onClick(index);
    };
  }
}
