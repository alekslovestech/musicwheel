import { AccidentalType } from "@/types/enums/AccidentalType";
import { createNoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { NoteConverter } from "@/utils/NoteConverter";
import { VexFlowFormatter, StaffAccidentalCache } from "@/utils/formatters/VexFlowFormatter";

describe("NoteConverter.noteWithOctaveToActual", () => {
  it("returns chromatic index for a natural note in octave 0", () => {
    // E in octave 0 → chromatic index 4, no octave offset → ActualIndex 4
    const note = createNoteWithOctave("E", AccidentalType.None, 0);
    expect(NoteConverter.noteWithOctaveToActual(note)).toBe(4);
  });

  it("returns chromatic index + 12 for a note in octave 1", () => {
    // F# in octave 1 → chromatic index 6 + 12 → ActualIndex 18
    const note = createNoteWithOctave("F", AccidentalType.Sharp, 1);
    expect(NoteConverter.noteWithOctaveToActual(note)).toBe(18);
  });

  it("returns correct ActualIndex for a flat note", () => {
    // Bb in octave 2 → chromatic index 10 + 24 → ActualIndex 34
    const note = createNoteWithOctave("B", AccidentalType.Flat, 1);
    expect(NoteConverter.noteWithOctaveToActual(note)).toBe(22);
  });

  it("handles Natural accidental without throwing (Natural is chromatically same as None)", () => {
    // E♮ in octave 0 → chromatic index 4, same as AccidentalType.None
    const note = createNoteWithOctave("E", AccidentalType.Natural, 0);
    expect(NoteConverter.noteWithOctaveToActual(note)).toBe(4);
  });
});

describe("VexFlowFormatter.noteLengthToVexDuration", () => {
  it("maps LilyPond-style denominators to VexFlow duration strings", () => {
    expect(VexFlowFormatter.noteLengthToVexDuration(1)).toBe("w");
    expect(VexFlowFormatter.noteLengthToVexDuration(2)).toBe("h");
    expect(VexFlowFormatter.noteLengthToVexDuration(4)).toBe("q");
    expect(VexFlowFormatter.noteLengthToVexDuration(8)).toBe("8");
    expect(VexFlowFormatter.noteLengthToVexDuration(16)).toBe("16");
    expect(VexFlowFormatter.noteLengthToVexDuration(32)).toBe("32");
  });
});

describe("StaffAccidentalCache", () => {
  test("draws the first explicit accidental on a staff position", () => {
    const cache = new StaffAccidentalCache();
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(true);
  });

  test("suppresses repeated accidentals on the same staff position", () => {
    const cache = new StaffAccidentalCache();
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(true);
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(false);
  });

  test("does not draw when the note is diatonic to the key signature", () => {
    const cache = new StaffAccidentalCache();
    expect(cache.shouldDrawAccidental("c/4", AccidentalType.None)).toBe(false);
    expect(cache.shouldDrawAccidental("c/4", AccidentalType.None)).toBe(false);
  });

  test("draws again when the alteration changes on the same staff position", () => {
    const cache = new StaffAccidentalCache();
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(true);
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Natural)).toBe(true);
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(true);
  });

  test("tracks different staff positions independently", () => {
    const cache = new StaffAccidentalCache();
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(true);
    expect(cache.shouldDrawAccidental("d/5", AccidentalType.Flat)).toBe(true);
    expect(cache.shouldDrawAccidental("d/4", AccidentalType.Flat)).toBe(false);
  });
});
