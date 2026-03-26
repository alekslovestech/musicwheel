import { NoteIndices } from "@/types/IndexTypes";
import { IntervalUtils } from "../utils/IntervalUtils";

describe("IntervalUtils.cyclicIntervals", () => {
  describe("up to intervals (0–2 notes)", () => {
    const testCases = [
      {
        name: "empty array returns empty array",
        input: [] as number[],
        expected: [],
      },
      { name: "single note returns empty array", input: [0], expected: [] },
      {
        name: "two notes returns single interval",
        input: [0, 4],
        expected: [4, 8],
      },
      {
        name: "two notes returns single interval - different notes",
        input: [7, 11],
        expected: [4, 8],
      },
      {
        name: "wraps around octave boundary",
        input: [10, 1],
        expected: [3, 9],
      },
    ];

    test.each(testCases)("$name", ({ input, expected }) => {
      expect(
        IntervalUtils.cyclicIntervalsFromActualIndices(input as NoteIndices),
      ).toEqual(expected);
    });
  });

  describe("triads (3 notes)", () => {
    const testCases = [
      { name: "major triad", input: [0, 4, 7], expected: [3, 5, 4] },
      { name: "major triad inversion", input: [4, 0, 7], expected: [3, 5, 4] },
      {
        name: "major triad inversion 2",
        input: [7, 4, 0],
        expected: [3, 5, 4],
      },
      { name: "major triad spread", input: [0, 7, 16], expected: [3, 5, 4] },
      { name: "minor triad", input: [0, 3, 7], expected: [3, 4, 5] },
      {
        name: "minor triad on octave boundary",
        input: [10, 1, 5],
        expected: [3, 4, 5],
      },
      { name: "minor triad inversion", input: [3, 0, 7], expected: [3, 4, 5] },
      { name: "diminished triad", input: [0, 3, 6], expected: [3, 3, 6] },
      { name: "augmented triad", input: [0, 4, 8], expected: [4, 4, 4] },
      { name: "sus4", input: [0, 5, 7], expected: [2, 5, 5] },
      { name: "sus2", input: [0, 2, 7], expected: [2, 5, 5] },
    ];

    test.each(testCases)("$name", ({ input, expected }) => {
      expect(
        IntervalUtils.cyclicIntervalsFromActualIndices(input as NoteIndices),
      ).toEqual(expected);
    });
  });

  describe("tetrachords (4 notes)", () => {
    const testCases = [
      {
        name: "diminished7",
        input: [0, 3, 6, 9],
        expected: [3, 3, 3, 3, 6, 6],
      },
      { name: "min6", input: [0, 3, 7, 9], expected: [2, 3, 3, 4, 5, 6] },
      {
        name: "min6 inversion",
        input: [9, 0, 3, 7],
        expected: [2, 3, 3, 4, 5, 6],
      },
      {
        name: "min6 from Bb",
        input: [10, 1, 5, 7],
        expected: [2, 3, 3, 4, 5, 6],
      },
      { name: "ø7", input: [0, 3, 6, 10], expected: [2, 3, 3, 4, 5, 6] },
      {
        name: "mMaj7 from C",
        input: [0, 3, 7, 11],
        expected: [1, 3, 4, 4, 4, 7],
      },
      {
        name: "min7 from C",
        input: [0, 3, 7, 10],
        expected: [2, 3, 4, 3, 5, 7],
      },
      {
        name: "7 from C",
        input: [0, 4, 7, 10],
        expected: [2, 4, 3, 3, 6, 7],
      },
      {
        name: "Maj7 from C",
        input: [0, 4, 7, 11],
        expected: [1, 4, 3, 4, 5, 7],
      },
      {
        name: "mMaj7 from C",
        input: [0, 3, 7, 11],
        expected: [1, 3, 4, 4, 4, 7],
      },
      {
        name: "+Maj7 from C",
        input: [0, 4, 8, 11],
        expected: [1, 4, 4, 3, 5, 8],
      },
      {
        name: "dim7 from C",
        input: [0, 3, 6, 9],
        expected: [3, 3, 3, 3, 6, 6],
      },
      {
        name: "ø7 from C",
        input: [0, 3, 6, 10],
        expected: [2, 3, 3, 4, 5, 6],
      },
    ];

    test.each(testCases)("$name", ({ input, expected }) => {
      expect(
        IntervalUtils.cyclicIntervalsFromActualIndices(input as NoteIndices),
      ).toEqual(expected);
    });
  });
});
