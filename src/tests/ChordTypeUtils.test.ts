import { ChordSetUtils } from "@/utils/ChordSetUtils";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { expectSetsEqual } from "@/tests/utils/SetTestUtils";

describe("ChordTypeUtils.distinctFromProgression", () => {
  it("returns distinct chord types from a plagal cadence", () => {
    const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Plagal_Cadence);
    expectSetsEqual(ChordSetUtils.distinctFromProgression(progression), [ChordType.Major]);
  });

  it("returns distinct chord types from a ii-V-I progression", () => {
    const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Two_Five_One);
    expectSetsEqual(ChordSetUtils.distinctFromProgression(progression), [
      ChordType.Minor,
      ChordType.Major,
    ]);
  });

  it("returns distinct chord types from a line cliche", () => {
    const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Line_Cliche);
    expectSetsEqual(ChordSetUtils.distinctFromProgression(progression), [
      ChordType.Minor,
      ChordType.Major,
      ChordType.Augmented,
    ]);
  });

  it("returns distinct chord types from Gypsy Woman", () => {
    const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Gypsy_Woman);
    expectSetsEqual(ChordSetUtils.distinctFromProgression(progression), [
      ChordType.Diminished7,
      ChordType.Major6,
      ChordType.Major7,
      ChordType.Minor7,
    ]);
  });
});

describe("ChordTypeUtils.triadTypesForKey", () => {
  it("returns diatonic triad types in Ionian", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    expectSetsEqual(ChordSetUtils.triadTypesForKey(key), [
      ChordType.Major,
      ChordType.Minor,
      ChordType.Diminished,
    ]);
  });

  it("returns diatonic triad types in Phrygian dominant", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.PhrygianDominant);
    expectSetsEqual(ChordSetUtils.triadTypesForKey(key), [
      ChordType.Major,
      ChordType.Minor,
      ChordType.Diminished,
      ChordType.Augmented,
    ]);
  });

  it("returns diatonic triad types in Hungarian minor", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.HungarianMinor);
    expectSetsEqual(ChordSetUtils.triadTypesForKey(key), [
      ChordType.Major,
      ChordType.Minor,
      ChordType.MajFlat5,
      ChordType.Augmented,
      ChordType.Sus2sharp4,
    ]);
  });
});

describe("ChordTypeUtils.seventhTypesForKey", () => {
  it("returns diatonic seventh types in Ionian", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    expectSetsEqual(ChordSetUtils.seventhTypesForKey(key), [
      ChordType.Major7,
      ChordType.Minor7,
      ChordType.Dominant7,
      ChordType.HalfDiminished,
    ]);
  });

  it("returns the same set for every rotation of the major scale", () => {
    // The seven diatonic modes share one pool of seventh qualities.
    const aeolian = ChordSetUtils.seventhTypesForKey(
      MusicalKey.fromGreekMode("A", ScaleModeType.Aeolian),
    );
    expectSetsEqual(aeolian, [
      ChordType.Major7,
      ChordType.Minor7,
      ChordType.Dominant7,
      ChordType.HalfDiminished,
    ]);
  });

  it("differs from the triad set for the same key", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    const triads = ChordSetUtils.triadTypesForKey(key);
    const sevenths = ChordSetUtils.seventhTypesForKey(key);

    expect(triads.has(ChordType.Major)).toBe(true);
    expect(sevenths.has(ChordType.Major)).toBe(false);
    expect(sevenths.has(ChordType.Dominant7)).toBe(true);
  });
});
