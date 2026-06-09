import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordType } from "@/types/enums/ChordType";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { getDistinctChordTypesFromProgression } from "@/components/ColorLegend/colorLegendSources";
import { expectSetsEqual } from "@/tests/utils/SetTestUtils";

describe("colorLegendSources", () => {
  describe("getDistinctChordTypesFromProgression", () => {
    it("returns distinct triad qualities from a plagal cadence", () => {
      const progression = ChordProgressionLibrary.getProgression(
        ChordProgressionType.Plagal_Cadence,
      );

      expectSetsEqual(getDistinctChordTypesFromProgression(progression), [ChordType.Major]);
    });

    it("returns distinct chord qualities from a ii-V-I progression", () => {
      const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Two_Five_One);

      expectSetsEqual(getDistinctChordTypesFromProgression(progression), [
        ChordType.Minor,
        ChordType.Major,
      ]);
    });

    it("returns distinct chord qualities from a line cliche", () => {
      const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Line_Cliche);
      expectSetsEqual(getDistinctChordTypesFromProgression(progression), [
        ChordType.Minor,
        ChordType.Major,
        ChordType.Augmented,
      ]);
    });

    it("returns distinct chord qualities from Gypsy Woman", () => {
      const progression = ChordProgressionLibrary.getProgression(ChordProgressionType.Gypsy_Woman);
      expectSetsEqual(getDistinctChordTypesFromProgression(progression), [
        ChordType.Diminished7,
        ChordType.Major6,
        ChordType.Major7,
        ChordType.Minor7,
      ]);
    });
  });
});
