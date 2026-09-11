import { AccidentalType } from "@/types/enums/AccidentalType";
import { ScaleModeGroup, getScaleModeGroup } from "@/types/enums/ScaleModeGroup";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { OtherScaleType } from "@/types/enums/OtherScaleType";
import { isMajor, KeyType } from "@/types/enums/KeyType";

import { addChromatic, ChromaticIndex } from "@/types/ChromaticIndex";
import { SCALE_MODE_REGISTRY } from "@/types/ScaleModes/ScaleModeRegistry";
import { ScaleModeInfo } from "@/types/ScaleModes/ScaleModeInfo";
import { ScaleDegreeIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";
import { OTHER_SCALE_REGISTRY } from "@/types/OtherScales/OtherScaleRegistry";
import { OtherScaleInfo } from "@/types/OtherScales/OtherScaleInfo";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { NoteIndices, toNoteIndices } from "@/types/IndexTypes";
import { KeySignature } from "@/types/Keys/KeySignature";
import { ENHARMONIC_FLAT_MAJOR_TONIC } from "@/types/constants/KeySignatureConstants";

import { NoteConverter } from "@/utils/NoteConverter";
import { IndexUtils } from "@/utils/IndexUtils";
import { StaffSpellingKeyResolver } from "@/utils/resolvers/StaffSpellingKeyResolver";

export class MusicalKey {
  public readonly tonicString: string; // Root note (e.g., "C", "A")
  public readonly classicalMode: KeyType; // Major or minor scale
  public readonly scaleMode: ScaleModeType | null;
  public readonly otherScaleType: OtherScaleType | null;
  public readonly keySignature: KeySignature;
  public readonly tonicIndex: ChromaticIndex;
  /** Null for a non-diatonic key - see {@link otherScaleInfo} instead. Mutually exclusive. */
  public readonly scaleModeInfo: ScaleModeInfo | null;
  /** Null for a diatonic key - see {@link scaleModeInfo} instead. Mutually exclusive. */
  public readonly otherScaleInfo: OtherScaleInfo | null;

  private constructor(
    tonicAsString: string,
    classicalMode: KeyType,
    greekMode: ScaleModeType | null,
    otherScaleType: OtherScaleType | null,
  ) {
    // Respells to a spelling this classicalMode actually uses - e.g. switching a key from major
    // to a minor-family mode without respelling would leave "Db" attached to a Minor key even
    // though minor tonics are spelled "C#" at that pitch class, producing a key nothing else in
    // the app (the tonic picker, the URL router) considers legal.
    this.tonicString = MusicalKey.canonicalTonicString(tonicAsString, classicalMode);
    this.classicalMode = classicalMode;
    this.scaleMode = greekMode;
    this.otherScaleType = otherScaleType;
    this.keySignature = new KeySignature(this.tonicString, classicalMode);
    this.tonicIndex = NoteConverter.toChromaticIndex(this.tonicString);
    this.scaleModeInfo = greekMode ? SCALE_MODE_REGISTRY[greekMode] : null;
    this.otherScaleInfo = otherScaleType ? OTHER_SCALE_REGISTRY[otherScaleType] : null;
  }

  public get scalePatternLength(): number {
    return this.scaleModeInfo
      ? this.scaleModeInfo.getScalePatternLength()
      : this.otherScaleInfo!.pattern.length;
  }

  /** Whether chromaticIndex is one of this key's scale notes - diatonic or not. */
  isDiatonicNote(chromaticIndex: ChromaticIndex): boolean {
    return this.scaleModeInfo
      ? this.scaleModeInfo.isDiatonicNote(chromaticIndex, this.tonicIndex)
      : this.otherScaleInfo!.isInScale(chromaticIndex, this.tonicIndex);
  }

  /** Plain scale-degree info for a non-diatonic key - null for a diatonic one (use scaleModeInfo instead). */
  getOtherScaleDegreeInfo(chromaticIndex: ChromaticIndex): ScaleDegreeInfo | null {
    return this.otherScaleInfo?.getScaleDegreeInfoFromChromatic(chromaticIndex, this.tonicIndex) ?? null;
  }

  /**
   * Gets the offsets for a given scale degree. Triad/Seventh are diatonic-only - a non-diatonic
   * key has no tertian chords to offer (see {@link OtherScaleInfo}); callers must not reach those
   * two modes for one (the UI disables them whenever a non-diatonic key is selected). SingleNote
   * and DronedSingleNote work for either kind, since they're just indexing into the pattern.
   * @param scaleDegreeIndex The index in the scale pattern (0-6)
   * @param scalePlaybackMode The mode of playback (triad, seventh, droned single note, or root)
   */
  getOffsets(scaleDegreeIndex: ScaleDegreeIndex, scalePlaybackMode: ScalePlaybackMode): number[] {
    if (this.otherScaleInfo) {
      const pattern = this.otherScaleInfo.pattern;
      return scalePlaybackMode === ScalePlaybackMode.DronedSingleNote
        ? pattern.getTonicDroneWithRootOffset(scaleDegreeIndex)
        : pattern.getRootOffset(scaleDegreeIndex);
    }

    const scalePattern = this.scaleModeInfo!.scalePattern;
    switch (scalePlaybackMode) {
      case ScalePlaybackMode.Triad:
        return scalePattern.getOffsets135(scaleDegreeIndex);
      case ScalePlaybackMode.Seventh:
        return scalePattern.getOffsets1357(scaleDegreeIndex);
      case ScalePlaybackMode.DronedSingleNote:
        return scalePattern.getTonicDroneWithRootOffset(scaleDegreeIndex);
      default:
        return scalePattern.getRootOffset(scaleDegreeIndex);
    }
  }

  public getNoteIndicesForScaleDegree(
    scaleDegreeIndex: ScaleDegreeIndex,
    scalePlaybackMode: ScalePlaybackMode,
  ): NoteIndices {
    const offsets = this.getOffsets(scaleDegreeIndex, scalePlaybackMode);
    const noteIndices = offsets.map((offset) => offset + this.tonicIndex);
    return toNoteIndices(IndexUtils.fitChordToAbsoluteRange(noteIndices));
  }

  toString(): string {
    return `${this.tonicString} (${this.classicalMode} | ${this.scaleMode})`;
  }

  static fromClassicalMode(tonicAsString: string, classicalMode: KeyType): MusicalKey {
    const greekMode = isMajor(classicalMode) ? ScaleModeType.Ionian : ScaleModeType.Aeolian;
    return new MusicalKey(tonicAsString, classicalMode, greekMode, null);
  }

  static fromGreekMode(tonicAsString: string, greekMode: ScaleModeType): MusicalKey {
    return new MusicalKey(tonicAsString, classicalModeForScaleMode(greekMode), greekMode, null);
  }

  /** A non-diatonic key (whole tone, and future symmetric scales) - no classical mode, no key
   * signature-relative spelling; tonic spelling just uses the Major tonic list. */
  static fromOtherScale(tonicAsString: string, otherScaleType: OtherScaleType): MusicalKey {
    return new MusicalKey(tonicAsString, KeyType.Major, null, otherScaleType);
  }

  getOppositeKey(): MusicalKey {
    const newMode = isMajor(this.classicalMode) ? KeyType.Minor : KeyType.Major;
    const newTonicAsString = MusicalKey.findKeyWithTonicIndex(this.tonicIndex, newMode);
    return MusicalKey.fromClassicalMode(newTonicAsString, newMode);
  }

  getTransposedKey(amount: number): MusicalKey {
    const newTonicIndex = addChromatic(this.tonicIndex, amount);
    const newTonicAsString = MusicalKey.findKeyWithTonicIndex(newTonicIndex, this.classicalMode);
    return this.scaleMode
      ? MusicalKey.fromGreekMode(newTonicAsString, this.scaleMode)
      : MusicalKey.fromOtherScale(newTonicAsString, this.otherScaleType!);
  }

  /** Diatonic keys only - see {@link scaleModeInfo}. */
  getCanonicalIonianKey(): MusicalKey {
    const ionianTonicIndex = this.scaleModeInfo!.getIonianTonicIndex(this.tonicIndex);
    // Respell using this key's own sharp/flat orientation - e.g. Eb Aeolian's relative Ionian is
    // the flat "Gb", not MAJOR_KEY_SIGNATURES's sharp-preferring "F#" for that same pitch class.
    const preferFlat = this.getDefaultAccidental() === AccidentalType.Flat;
    const ionianTonicString = MusicalKey.findKeyWithTonicIndex(
      ionianTonicIndex,
      KeyType.Major,
      preferFlat,
    );
    return MusicalKey.fromGreekMode(ionianTonicString, ScaleModeType.Ionian);
  }

  /**
   * Key used for staff key signature and note spelling. A non-diatonic key (whole tone, ...) has
   * no per-tonic key signature that means anything - conventionally notated with no key
   * signature at all, each altered note carrying its own accidental (which
   * ScaleNoteSpellingResolver already supplies) - so this just returns a plain, signature-free C
   * major key rather than trying to invent one.
   */
  getStaffSpellingKey(): MusicalKey {
    if (!this.scaleMode) return MusicalKey.fromClassicalMode("C", KeyType.Major);
    return getScaleModeGroup(this.scaleMode) === ScaleModeGroup.Greek
      ? this.getCanonicalIonianKey()
      : StaffSpellingKeyResolver.resolveBestFit(this);
  }

  getDefaultAccidental(): AccidentalType {
    return this.keySignature.getDefaultAccidental();
  }

  private static findKeyWithTonicIndex(
    tonicIndex: ChromaticIndex,
    mode: KeyType,
    preferFlat: boolean = false,
  ): string {
    if (
      preferFlat &&
      mode === KeyType.Major &&
      tonicIndex === NoteConverter.toChromaticIndex(ENHARMONIC_FLAT_MAJOR_TONIC)
    ) {
      return ENHARMONIC_FLAT_MAJOR_TONIC;
    }

    const keyList = KeySignature.getKeyList(mode);
    const tonicAsString = keyList.find((key) => NoteConverter.toChromaticIndex(key) === tonicIndex);
    return tonicAsString!;
  }

  /** Whether tonicAsString is a spelling this classicalMode already recognizes as itself - one of
   * the 12 canonical picker/URL tonics, or (major only) the "Gb" enharmonic carve-out that
   * {@link getCanonicalIonianKey} deliberately spells with flats. */
  private static isKnownTonicSpelling(tonicAsString: string, classicalMode: KeyType): boolean {
    return (
      KeySignature.getKeyList(classicalMode).includes(tonicAsString) ||
      (classicalMode === KeyType.Major && tonicAsString === ENHARMONIC_FLAT_MAJOR_TONIC)
    );
  }

  private static canonicalTonicString(tonicAsString: string, classicalMode: KeyType): string {
    const sanitized = NoteConverter.sanitizeNoteString(tonicAsString);
    if (MusicalKey.isKnownTonicSpelling(sanitized, classicalMode)) return sanitized;

    const tonicIndex = NoteConverter.toChromaticIndex(sanitized);
    return MusicalKey.findKeyWithTonicIndex(tonicIndex, classicalMode);
  }
}

export const DEFAULT_MUSICAL_KEY = MusicalKey.fromClassicalMode("C", KeyType.Major);

/** Which classical mode (and therefore which legal tonic spellings) a Greek/other scale mode uses. */
export function classicalModeForScaleMode(scaleMode: ScaleModeType): KeyType {
  return [ScaleModeType.Ionian, ScaleModeType.Lydian].includes(scaleMode)
    ? KeyType.Major
    : KeyType.Minor;
}
