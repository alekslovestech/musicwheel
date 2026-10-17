import { AccidentalType } from "@/types/enums/AccidentalType";
import type { NoteIndices } from "@/types/IndexTypes";
import { createNoteWithOctave, type NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { NoteConverter } from "@/utils/NoteConverter";

/** The notes and highlighted keys for a StaticStaffFigure, spread straight into it:
 * `<StaticStaffFigure {...C_MAJOR_TRIAD} caption="..." />`. */
export interface StaffFigureData {
  chords: readonly (readonly NoteWithOctave[])[];
  highlightedNoteIndices: NoteIndices;
}

const { None, Natural, Sharp, Flat } = AccidentalType;
const note = createNoteWithOctave;

/** One chord on the staff, with its keys highlighted - worked out from the notes, so the two
 * can't drift apart. */
function chordFigure(...notes: NoteWithOctave[]): StaffFigureData {
  return {
    chords: [notes],
    highlightedNoteIndices: notes.map((n) => NoteConverter.noteWithOctaveToActual(n)),
  };
}

export const C_MAJOR_SCALE: StaffFigureData = {
  chords: [
    ...["C", "D", "E", "F", "G", "A", "B"].map((name) => [note(name, None)]),
    [note("C", None, 1)],
  ],
  highlightedNoteIndices: [],
};

export const C_TO_E = chordFigure(note("C", None), note("E", None));
export const E_TO_G_SHARP = chordFigure(note("E", None), note("G", Sharp));

export const AUGMENTED_4TH = chordFigure(note("C", None), note("F", Sharp));
export const DIMINISHED_5TH = chordFigure(note("C", None), note("G", Flat));

export const C_MAJOR_TRIAD = chordFigure(note("C", None), note("E", None), note("G", None));
export const E_MAJOR_TRIAD = chordFigure(note("E", None), note("G", Sharp), note("B", None));

/** Spelled for a C minor key signature, where the E needs a natural sign to cancel the ♭. */
export const C_MAJOR_TRIAD_IN_C_MINOR = chordFigure(
  note("C", None),
  note("E", Natural),
  note("G", None),
);

/** Spelled for an E major key signature, where the C and G need natural signs to cancel the ♯. */
export const C_MAJOR_TRIAD_IN_E_MAJOR = chordFigure(
  note("C", Natural),
  note("E", None),
  note("G", Natural),
);
