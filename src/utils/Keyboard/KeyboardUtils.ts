import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { KeyTier } from "@/types/enums/KeyTier";

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
    const isDiatonic = selectedMusicalKey.isNoteInScale(chromaticIndex);
    if (!isDiatonic) {
      // Only letters mode labels out-of-scale wedges (dimmed by the wheel), so a black wedge's
      // ♯/♭ pair has neighbours to read against. Degree and Roman modes leave them blank.
      return keyDisplayMode === KeyDisplayMode.NoteNames
        ? this.computeNoteTextForDefaultMode(chromaticIndex)
        : "";
    }

    // Note names stay unspelled, as in Harmony mode: the scale's own spelling changes when the
    // scale is transposed and would pull attention from the interval pattern.
    if (keyDisplayMode === KeyDisplayMode.NoteNames) {
      return this.computeNoteTextForDefaultMode(chromaticIndex);
    }

    return MusicalKeyNoteFormatter.formatNoteForDisplay(
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

  /**
   * The handful of derived values every key (circular or linear) needs before it can render:
   * which chromatic pitch it is, whether it's black, whether it's in the current scale, its
   * base classes, its element id, its label text, and its color tier. Identical between the two
   * keyboards except for the UI type, so both PianoKeyCircular and PianoKeyLinear call this
   * instead of re-deriving each value themselves. Colors themselves aren't included - they differ
   * by isSvg and by the bass-note quirk on the circular wheel - but the tier they come from is.
   */
  static getKeyVisualState(
    actualIndex: ActualIndex,
    keyboardUI: KeyboardUIType,
    isScales: boolean,
    selectedMusicalKey: MusicalKey,
    isSelected: boolean,
    isBassNote: boolean,
    scalePlaybackMode?: ScalePlaybackMode,
  ): {
    chromaticIndex: ChromaticIndex;
    isBlack: boolean;
    isDiatonicInScale: boolean;
    allBaseClasses: string;
    id: string;
    noteText: string;
    keyTier: KeyTier;
  } {
    const chromaticIndex = actualToChromatic(actualIndex);
    const isBlack = BlackKeyUtils.isBlackKey(chromaticIndex);
    const isDiatonicInScale = !isScales || selectedMusicalKey.isNoteInScale(chromaticIndex);
    const allBaseClasses = this.buildKeyClasses(
      ["key-base"],
      isSelected,
      isBlack,
      isScales,
      isBassNote,
      isDiatonicInScale,
    );
    const id = this.StringWithPaddedIndex(`${keyboardUI}Key`, actualIndex);
    const noteText = this.getNoteText(
      keyboardUI,
      chromaticIndex,
      isScales,
      selectedMusicalKey,
      scalePlaybackMode,
    );
    const keyTier = this.getKeyTier(isScales, isDiatonicInScale, isSelected);
    return { chromaticIndex, isBlack, isDiatonicInScale, allBaseClasses, id, noteText, keyTier };
  }

  // A selected note is blue in both modes, so a chord looks the same with or without a scale
  // behind it. Scales mode: the rest of the scale is active, and what's outside it recedes.
  static getKeyTier(
    isScales: boolean,
    isDiatonicInScale: boolean,
    isSelected: boolean,
  ): KeyTier {
    if (isSelected) return KeyTier.Spotlight;
    if (!isScales) return KeyTier.Plain;
    if (isDiatonicInScale) return KeyTier.Active;
    return KeyTier.Muted;
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

  private static resolveCircularScaleLabelMode(
    scalePlaybackMode: ScalePlaybackMode,
  ): KeyDisplayMode {
    switch (scalePlaybackMode) {
      case ScalePlaybackMode.Triad:
        return KeyDisplayMode.Roman;
      case ScalePlaybackMode.Seventh:
        return KeyDisplayMode.RomanSeventh;
      case ScalePlaybackMode.DronedSingleNote:
        return KeyDisplayMode.ScaleDegree;
      default:
        return KeyDisplayMode.NoteNames;
    }
  }

  // Roman-numeral wheel labels, i.e. the chordal playback modes. Single source for label styling.
  static usesRomanScaleLabels(scalePlaybackMode: ScalePlaybackMode): boolean {
    const labelMode = this.resolveCircularScaleLabelMode(scalePlaybackMode);
    return labelMode === KeyDisplayMode.Roman || labelMode === KeyDisplayMode.RomanSeventh;
  }

  // Letters (note-name) wheel labels, i.e. the modes where a black wedge's ♯/♭ pair is shown.
  static usesNoteNameScaleLabels(scalePlaybackMode: ScalePlaybackMode): boolean {
    return this.resolveCircularScaleLabelMode(scalePlaybackMode) === KeyDisplayMode.NoteNames;
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
          this.resolveScaleLabelMode(selectedMusicalKey, scalePlaybackMode),
        )
      : this.computeNoteTextForDefaultMode(chromaticIndex);
  }

  // {@link resolveCircularScaleLabelMode}, but a non-diatonic key has no Roman-numeral chords to
  // label with (see {@link OtherScaleInfo}) - falls back to plain scale degree instead.
  private static resolveScaleLabelMode(
    selectedMusicalKey: MusicalKey,
    scalePlaybackMode?: ScalePlaybackMode,
  ): KeyDisplayMode {
    const mode = this.resolveCircularScaleLabelMode(scalePlaybackMode ?? ScalePlaybackMode.SingleNote);
    const isRoman = mode === KeyDisplayMode.Roman || mode === KeyDisplayMode.RomanSeventh;
    return isRoman && selectedMusicalKey.scaleModeInfo === null ? KeyDisplayMode.ScaleDegree : mode;
  }
}
