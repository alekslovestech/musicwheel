import { AccidentalType } from "@/types/enums/AccidentalType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { isMajor, KeyType } from "@/types/enums/KeyType";

import { addChromatic, ChromaticIndex } from "@/types/ChromaticIndex";
import { ScaleModeLibrary } from "@/types/ScaleModes/ScaleModeLibrary";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";
import { ScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";
import { NoteIndices, toNoteIndices } from "@/types/IndexTypes";
import { KeySignature } from "@/types/Keys/KeySignature";

import { NoteConverter } from "@/utils/NoteConverter";
import { IndexUtils } from "@/utils/IndexUtils";

export class MusicalKey {
  public readonly tonicString: string; // Root note (e.g., "C", "A")
  public readonly classicalMode: KeyType; // Major or minor scale
  public readonly scaleMode: ScaleModeType;
  public readonly keySignature: KeySignature;
  public readonly tonicIndex: ChromaticIndex;
  public readonly scaleModeInfo: ScaleModeInfo;

  private constructor(
    tonicAsString: string,
    classicalMode: KeyType,
    greekMode: ScaleModeType
  ) {
    this.tonicString = NoteConverter.sanitizeNoteString(tonicAsString);
    this.classicalMode = classicalMode;
    this.scaleMode = greekMode;
    this.keySignature = new KeySignature(tonicAsString, classicalMode);
    this.tonicIndex = NoteConverter.toChromaticIndex(this.tonicString);
    this.scaleModeInfo = ScaleModeLibrary.getModeInfo(greekMode);
  }

  public get scalePatternLength(): number {
    return this.scaleModeInfo.getScalePatternLength();
  }

  /**
   * Gets the offsets for a given scale degree.
   * @param scaleDegreeIndex The index in the scale pattern (0-6)
   * @param isTriad If true, returns offsets for root, third and fifth (for roman numeral triads)
   *               If false, returns just the root offset (for single note scale degrees)
   */
  public getOffsets(
    scaleDegreeIndex: ScaleDegreeIndex,
    scalePlaybackMode: ScalePlaybackMode
  ): number[] {
    switch (scalePlaybackMode) {
      case ScalePlaybackMode.Triad:
        return this.scaleModeInfo.scalePattern.getOffsets135(scaleDegreeIndex);
      case ScalePlaybackMode.Seventh:
        return this.scaleModeInfo.scalePattern.getOffsets1357(scaleDegreeIndex);
      case ScalePlaybackMode.DronedSingleNote:
        return this.scaleModeInfo.scalePattern.getTonicDroneWithRootOffset(
          scaleDegreeIndex
        );
      default:
        return this.scaleModeInfo.scalePattern.getRootOffset(scaleDegreeIndex);
    }
  }

  public getNoteIndicesForScaleDegree(
    scaleDegreeIndex: ScaleDegreeIndex,
    scalePlaybackMode: ScalePlaybackMode
  ): NoteIndices {
    const offsets = this.getOffsets(scaleDegreeIndex, scalePlaybackMode);
    const noteIndices = offsets.map((offset) => offset + this.tonicIndex);
    return toNoteIndices(IndexUtils.fitChordToAbsoluteRange(noteIndices));
  }

  toString(): string {
    return `${this.tonicString} (${this.classicalMode} | ${this.scaleMode})`;
  }

  static fromClassicalMode(
    tonicAsString: string,
    classicalMode: KeyType
  ): MusicalKey {
    const greekMode = isMajor(classicalMode)
      ? ScaleModeType.Ionian
      : ScaleModeType.Aeolian;
    return new MusicalKey(tonicAsString, classicalMode, greekMode);
  }

  static fromGreekMode(
    tonicAsString: string,
    greekMode: ScaleModeType
  ): MusicalKey {
    const classicalMode = [
      ScaleModeType.Ionian,
      ScaleModeType.Lydian,
      //   ScaleModeType.Mixolydian,
    ].includes(greekMode)
      ? KeyType.Major
      : KeyType.Minor;
    return new MusicalKey(tonicAsString, classicalMode, greekMode);
  }

  getOppositeKey(): MusicalKey {
    const newMode = isMajor(this.classicalMode) ? KeyType.Minor : KeyType.Major;
    const newTonicAsString = this.findKeyWithTonicIndex(
      this.tonicIndex,
      newMode
    );
    return MusicalKey.fromClassicalMode(newTonicAsString, newMode);
  }

  getTransposedKey(amount: number): MusicalKey {
    const newTonicIndex = addChromatic(this.tonicIndex, amount);
    const newTonicAsString = this.findKeyWithTonicIndex(
      newTonicIndex,
      this.classicalMode
    );
    return MusicalKey.fromGreekMode(newTonicAsString, this.scaleMode);
  }

  getCanonicalIonianKey(): MusicalKey {
    const ionianTonicIndex = this.scaleModeInfo.getIonianTonicIndex(
      this.tonicIndex
    );
    const ionianTonicString = this.findKeyWithTonicIndex(
      ionianTonicIndex,
      KeyType.Major
    );
    return MusicalKey.fromGreekMode(ionianTonicString, ScaleModeType.Ionian);
  }

  getDefaultAccidental(): AccidentalType {
    return this.keySignature.getDefaultAccidental();
  }

  private findKeyWithTonicIndex(
    tonicIndex: ChromaticIndex,
    mode: KeyType
  ): string {
    const keyList = KeySignature.getKeyList(mode);
    const tonicAsString = keyList.find(
      (key) => NoteConverter.toChromaticIndex(key) === tonicIndex
    );
    return tonicAsString!;
  }
}

export const DEFAULT_MUSICAL_KEY = MusicalKey.fromClassicalMode(
  "C",
  KeyType.Major
);
