import { NoteGroupingId } from "./NoteGroupingId";
import { SpecialType } from "./enums/SpecialType";
import { IntervalType } from "./enums/IntervalType";
import { ChordType } from "./enums/ChordType";

import { CHORD_OFFSET_PATTERNS } from "./constants/ChordOffsetPatterns";
import { ixOffsetArray } from "./IndexTypes";
import { NoteGrouping } from "./NoteGrouping";
import { ChordDisplayMode, ChordTypeContext } from "./enums/SettingModes";
import { IndexUtils } from "@/utils/IndexUtils";

class NoteGroupingLibrarySingleton {
  public getGroupingById(id: NoteGroupingId): NoteGrouping {
    const found = NoteGroupingLibrarySingleton.library.find((grouping) => grouping.id === id);
    if (!found) {
      throw new Error(`NoteGrouping not found for id: ${id}`);
    }
    return found;
  }

  // Replace the confusing getId method with semantic methods

  getChordTypeName(
    id: NoteGroupingId,
    context: ChordTypeContext,
    displayMode: ChordDisplayMode = ChordDisplayMode.Letters,
  ): string {
    const grouping = this.getGroupingById(id);
    return grouping.getChordTypeName(context, displayMode);
  }

  // Convenience methods for common use cases
  getPresetButtonName(id: NoteGroupingId): string {
    return this.getChordTypeName(id, ChordTypeContext.PresetButton);
  }

  getChordNameSuffix(id: NoteGroupingId, displayMode: ChordDisplayMode): string {
    return this.getChordTypeName(id, ChordTypeContext.ChordName, displayMode);
  }

  getDisplayName(id: NoteGroupingId): string {
    return this.getChordTypeName(id, ChordTypeContext.LongForm);
  }

  getElementId(id: NoteGroupingId): string {
    return this.getChordTypeName(id, ChordTypeContext.ElementId);
  }

  public getAllIds(): NoteGroupingId[] {
    return NoteGroupingLibrarySingleton.library.map((grouping) => grouping.id) as NoteGroupingId[];
  }

  public IntervalOrChordIds(isInterval: boolean): NoteGroupingId[] {
    return NoteGroupingLibrarySingleton.library
      .filter((grouping) => (isInterval ? grouping.numNotes === 2 : grouping.numNotes > 2))
      .sort((a, b) => a.orderId - b.orderId)
      .map((grouping) => grouping.id);
  }

  /** Root-position reverse lookup against library chord entries. */
  public matchChordTypeFromOffsets(offsetsFromRoot: number[]): ChordType {
    for (const grouping of NoteGroupingLibrarySingleton.library) {
      if (!this.isChordGrouping(grouping)) continue;
      if (grouping.numNotes !== offsetsFromRoot.length) continue;
      if (IndexUtils.areIndicesEqual(grouping.offsets, offsetsFromRoot)) {
        return grouping.id as ChordType;
      }
    }
    return ChordType.Unknown;
  }

  private isChordGrouping(grouping: NoteGrouping): boolean {
    return Object.values(ChordType).includes(grouping.id as ChordType);
  }

  /** Root-position reverse lookup against library interval entries (offsets = [0, semitones]). */
  public matchIntervalTypeFromOffset(semitonesFromRoot: number): IntervalType | undefined {
    const found = NoteGroupingLibrarySingleton.library.find(
      (grouping) =>
        grouping.numNotes === 2 &&
        IndexUtils.areIndicesEqual(grouping.offsets, [0, semitonesFromRoot]),
    );
    return found?.id as IntervalType | undefined;
  }

  private static instance: NoteGroupingLibrarySingleton;

  private constructor() {}

  private static library: NoteGrouping[] = [
    new NoteGrouping(SpecialType.None, "Ø", "Ø", "None", 0, []),
    new NoteGrouping(SpecialType.Note, "", "", "Single Note", 1, ixOffsetArray([0])),

    // Intervals
    NoteGrouping.createInterval(IntervalType.Minor2, 1, "m2", "Minor 2nd", 1),
    NoteGrouping.createInterval(IntervalType.Major7, 2, "M7", "Major 7th", 11),
    NoteGrouping.createInterval(IntervalType.Major2, 3, "M2", "Major 2nd", 2),
    NoteGrouping.createInterval(IntervalType.Minor7, 4, "m7", "Minor 7th", 10),
    NoteGrouping.createInterval(IntervalType.Minor3, 5, "m3", "Minor 3rd", 3),
    NoteGrouping.createInterval(IntervalType.Major6, 6, "M6", "Major 6th", 9),
    NoteGrouping.createInterval(IntervalType.Major3, 7, "M3", "Major 3rd", 4),
    NoteGrouping.createInterval(IntervalType.Minor6, 8, "m6", "Minor 6th", 8),
    NoteGrouping.createInterval(IntervalType.Fourth, 9, "P4", "Perfect 4th", 5),
    NoteGrouping.createInterval(IntervalType.Fifth, 10, "P5", "Perfect 5th", 7),
    NoteGrouping.createInterval(IntervalType.Tritone, 11, "TT", "Tritone", 6),
    NoteGrouping.createInterval(IntervalType.Octave, 12, "Oct", "Octave", 12),

    // Triads
    NoteGrouping.createChord(
      ChordType.Major,
      14,
      "Maj",
      "",
      "Major Triad",
      CHORD_OFFSET_PATTERNS.MAJOR,
    ),
    NoteGrouping.createChord(
      ChordType.Minor,
      15,
      "min",
      "m",
      "Minor Triad",
      CHORD_OFFSET_PATTERNS.MINOR,
    ),
    NoteGrouping.createChord(
      ChordType.Diminished,
      16,
      "dim",
      "°",
      "Diminished Triad",
      CHORD_OFFSET_PATTERNS.DIMINISHED,
    ),
    NoteGrouping.createChord(
      ChordType.Augmented,
      17,
      "Aug",
      "+",
      "Augmented Triad",
      CHORD_OFFSET_PATTERNS.AUGMENTED,
    ),
    NoteGrouping.createChord(
      ChordType.Sus4,
      18,
      "sus4",
      "sus",
      "Suspended 4th Chord",
      CHORD_OFFSET_PATTERNS.SUS4,
    ),
    NoteGrouping.createChord(
      ChordType.Sus2,
      19,
      "sus2",
      "sus2",
      "Suspended 2nd Chord",
      CHORD_OFFSET_PATTERNS.SUS2,
    ),

    // Seventh Chords
    NoteGrouping.createChord(
      ChordType.Dominant7,
      20,
      "7",
      "7",
      "Dominant 7th Chord",
      CHORD_OFFSET_PATTERNS.DOMINANT7,
    ),
    NoteGrouping.createChord(
      ChordType.Major7,
      21,
      "Maj7",
      "Δ7",
      "Major 7th Chord",
      CHORD_OFFSET_PATTERNS.MAJOR7,
    ),
    NoteGrouping.createChord(
      ChordType.Minor7,
      22,
      "min7",
      "m7",
      "Minor 7th Chord",
      CHORD_OFFSET_PATTERNS.MINOR7,
    ),
    NoteGrouping.createChord(
      ChordType.HalfDiminished,
      23,
      "m7♭5",
      "ø7",
      "Half Diminished 7th Chord",
      CHORD_OFFSET_PATTERNS.HALF_DIMINISHED7,
    ),
    NoteGrouping.createChord(
      ChordType.MinorMajor7,
      24,
      "mMaj7",
      "mΔ7",
      "Minor Major 7th Chord",
      CHORD_OFFSET_PATTERNS.MINOR_MAJOR7,
    ),

    NoteGrouping.createChord(
      ChordType.Diminished7,
      25,
      "dim7",
      "°7",
      "Diminished 7th Chord",
      CHORD_OFFSET_PATTERNS.DIMINISHED7,
    ),
    NoteGrouping.createChord(
      ChordType.Major6,
      26,
      "6",
      "6",
      "Major 6th Chord",
      CHORD_OFFSET_PATTERNS.MAJOR6,
    ),
    NoteGrouping.createChord(
      ChordType.Minor6,
      27,
      "min6",
      "m6",
      "Minor 6th Chord",
      CHORD_OFFSET_PATTERNS.MINOR6,
    ),
    NoteGrouping.createChord(
      ChordType.AugMajor7,
      28,
      "+Maj7",
      "+Δ7",
      "Augmented Major 7th Chord",
      CHORD_OFFSET_PATTERNS.AUGMENTED_MAJOR7,
    ),

    // Extended Chords
    NoteGrouping.createChord(
      ChordType.Add9,
      29,
      "add9",
      "add9",
      "Add 9th Chord",
      CHORD_OFFSET_PATTERNS.ADD9,
    ),

    //"hidden" chords (not visible in the presets list, but can be detected by the app)
    NoteGrouping.createChord(
      ChordType.Add2,
      29,
      "add2",
      "add2",
      "Add 2nd Chord",
      CHORD_OFFSET_PATTERNS.ADD2,
      false,
      false,
    ),

    NoteGrouping.createChord(
      ChordType.Seven13,
      30,
      "7add13",
      "7add13",
      "Dominant 7th Add 13th Chord",
      CHORD_OFFSET_PATTERNS.SEVEN13,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.SpreadMajor,
      31,
      "maj",
      "",
      "Spread Major Chord",
      CHORD_OFFSET_PATTERNS.SPREAD_MAJOR,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.SpreadMinor,
      32,
      "min",
      "m",
      "Spread Minor Chord",
      CHORD_OFFSET_PATTERNS.SPREAD_MINOR,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.SpreadAugmented,
      33,
      "aug",
      "+",
      "Spread Augmented Chord",
      CHORD_OFFSET_PATTERNS.SPREAD_AUGMENTED,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.SpreadDiminished,
      34,
      "dim",
      "°",
      "Spread Diminished Chord",
      CHORD_OFFSET_PATTERNS.SPREAD_DIMINISHED,
      false,
      false,
    ),

    //Narrow Chords
    NoteGrouping.createChord(
      ChordType.Narrow23,
      35,
      "23",
      "23",
      "Narrow 23 Chord",
      CHORD_OFFSET_PATTERNS.NARROW_23,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.Sus2_4,
      36,
      "sus24",
      "sus24",
      "Sus24 Chord",
      CHORD_OFFSET_PATTERNS.NARROW_24,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.Narrow34,
      37,
      "34",
      "34",
      "Narrow 34 Chord",
      CHORD_OFFSET_PATTERNS.NARROW_34,
      false,
      false,
    ),

    NoteGrouping.createChord(
      ChordType.Sus2sharp4,
      38,
      "sus2♯4",
      "sus2♯4",
      "Sus2(♯4) Chord",
      CHORD_OFFSET_PATTERNS.NARROW_24_SHARP,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.MajFlat5,
      39,
      "♭5",
      "♭5",
      "Major Chord with ♭5",
      CHORD_OFFSET_PATTERNS.MAJ_FLAT5,
      false,
      false,
    ),
    NoteGrouping.createChord(
      ChordType.Narrow_b3_4,
      40,
      "m4",
      "m4",
      "Minor Add 4 Chord",
      CHORD_OFFSET_PATTERNS.NARROW_3_FLAT_4,
      false,
      false,
    ),
    // Detectable but not offered as a preset, like its triad sibling MajFlat5.
    // Keeps inversions: it is a full 4-note chord, unlike the narrow voicings above.
    NoteGrouping.createChord(
      ChordType.Dominant7Flat5,
      41,
      "7♭5",
      "7♭5",
      "Dominant 7th Flat 5 Chord",
      CHORD_OFFSET_PATTERNS.DOMINANT7_FLAT5,
      true,
      false,
    ),
    // No 3rd (sus4) but keeps the major 7th; surfaces as the diatonic ♭II7 in Panthu Varaali.
    NoteGrouping.createChord(
      ChordType.Major7Sus4,
      42,
      "maj7sus4",
      "Δ7sus4",
      "Major 7th Suspended 4th Chord",
      CHORD_OFFSET_PATTERNS.MAJOR7_SUS4,
      true,
      false,
    ),
    // No 3rd (sus2); surfaces as the diatonic ♯IV7 in Panthu Varaali.
    NoteGrouping.createChord(
      ChordType.Dominant7Sus2Flat5,
      43,
      "7sus2♭5",
      "7sus2♭5",
      "Dominant 7th Suspended 2nd Flat 5 Chord",
      CHORD_OFFSET_PATTERNS.DOMINANT7_SUS2_FLAT5,
      true,
      false,
    ),
    // Major 7th with a flat 5 - the major-quality counterpart to HalfDiminished (m7♭5);
    // surfaces as the diatonic V7 in Panthu Varaali.
    NoteGrouping.createChord(
      ChordType.Major7Flat5,
      44,
      "maj7♭5",
      "Δ7♭5",
      "Major 7th Flat 5 Chord",
      CHORD_OFFSET_PATTERNS.MAJOR7_FLAT5,
      true,
      false,
    ),
    // No 3rd (sus2), no 7th (6th instead); surfaces as the diatonic VII7 in Panthu Varaali.
    NoteGrouping.createChord(
      ChordType.Sus2Add6,
      45,
      "6sus2",
      "6sus2",
      "Suspended 2nd Add 6th Chord",
      CHORD_OFFSET_PATTERNS.SUS2_ADD6,
      true,
      false,
    ),
  ];

  public static getInstance(): NoteGroupingLibrarySingleton {
    if (!this.instance) {
      this.instance = new NoteGroupingLibrarySingleton();
    }
    return this.instance;
  }
}

export const NoteGroupingLibrary = NoteGroupingLibrarySingleton.getInstance();
