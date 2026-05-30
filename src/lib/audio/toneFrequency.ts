import { TWELVE } from "@/types/constants/NoteConstants";
import { ActualIndex } from "@/types/IndexTypes";

/** Base frequency for A4 (440Hz). */
const BASE_FREQUENCY = 440;
/** A4 is at index 69 in MIDI notation. */
const A4_MIDI_INDEX = 69;
/** Index 0 is treated as C4 (MIDI note 60). */
const C4_MIDI_INDEX = 60;

/** Convert wheel note index to playback frequency (Hz). */
export function frequencyFromIndex(index: ActualIndex): number {
  const midiNote = index + C4_MIDI_INDEX;
  return BASE_FREQUENCY * Math.pow(2, (midiNote - A4_MIDI_INDEX) / TWELVE);
}
