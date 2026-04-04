import { prepareChordProgressionSequence } from "@/lib/sequencePlaybackHelpers";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { DEFAULT_MUSICAL_KEY } from "@/types/Keys/MusicalKey";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";

describe("prepareChordProgressionSequence and progressionEntryIndex alignment", () => {
  it("precomputed step count matches library progression length", () => {
    const type = ChordProgressionType.Blues;
    const prepared = prepareChordProgressionSequence(type, DEFAULT_MUSICAL_KEY);
    const progression = ChordProgressionLibrary.getProgression(type);
    expect(prepared.precomputedProgression.length).toBe(
      progression.progression.length,
    );
  });

  it("formatter emits one token per entry with indices matching step order", () => {
    const type = ChordProgressionType.Blues;
    const progression = ChordProgressionLibrary.getProgression(type);
    const bars = ChordProgressionFormatter.formatForDisplay(progression);
    const indices = bars.flatMap((row) =>
      row.map((t) => t.progressionEntryIndex),
    );
    expect(indices).toEqual(
      progression.progression.map((_, i) => i),
    );
  });
});

describe("ChordProgressionFormatter.formatForDisplay progressionEntryIndex", () => {
  it("assigns indices 0..n-1 for one bar of quarter chords", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V"], "50s");
    const bars = ChordProgressionFormatter.formatForDisplay(p);
    expect(bars).toHaveLength(1);
    expect(bars[0].map((t) => t.progressionEntryIndex)).toEqual([0, 1, 2, 3]);
  });

  it("preserves progressionEntryIndex across bar lines", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const bars = ChordProgressionFormatter.formatForDisplay(p);
    expect(bars).toHaveLength(2);
    expect(bars[0][0].progressionEntryIndex).toBe(0);
    expect(bars[1][0].progressionEntryIndex).toBe(1);
  });
});
